/**
 * POST /api/donaciones/webhook
 *
 * Webhook de Mercado Pago. Recibe eventos de dos tipos:
 *   - type=preapproval: cambios en el estado de la suscripción (authorized, paused, cancelled).
 *   - type=authorized_payment: cobros efectivamente realizados (primero y sucesivos).
 *
 * Diseño:
 *   - Validamos firma x-signature (HMAC-SHA256) con MP_WEBHOOK_SECRET.
 *   - Siempre consultamos la API de MP por el recurso (nunca confiamos solo en el body).
 *   - Idempotencia: la columna `notificado` del Sheet evita enviar el email de agradecimiento
 *     más de una vez. Según decisión del usuario: solo el PRIMER authorized_payment dispara email.
 *   - Respondemos 200 rápido a MP (o reintenta hasta 4 veces).
 *
 * Seguridad: MP firma con `id` del recurso + `request-id`. Validamos ambos.
 */

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import {
  obtenerPreapproval,
  obtenerAuthorizedPayment,
  mapearEstadoPreapproval,
} from '@/lib/mercadopago';
import {
  findDonacionByPreapprovalId,
  updateDonacion,
  type EstadoDonacion,
} from '@/lib/sheets';
import { enviarAgradecimientoDonacion } from '@/lib/email';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  // MP reintenta si no respondemos 200 rápido. Si algo falla internamente, logueamos
  // y devolvemos 200 igual (salvo que sea firma inválida → 401) para no loopear forever.

  try {
    const rawBody = await req.text();
    const headers = req.headers;

    // ============================================================
    // 1. Validación de firma
    // ============================================================
    const firmaOk = validarFirmaMP(req, headers);
    if (!firmaOk) {
      console.warn('[webhook] Firma inválida');
      return NextResponse.json({ error: 'Firma inválida' }, { status: 401 });
    }

    // ============================================================
    // 2. Parse del body
    // ============================================================
    let body: { type?: string; action?: string; data?: { id?: string } };
    try {
      body = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: 'Body inválido' }, { status: 400 });
    }

    const tipo = body.type || '';
    const recursoId = body.data?.id;

    if (!recursoId) {
      // Evento sin ID: respondemos 200 para que MP no reintente.
      return NextResponse.json({ received: true });
    }

    // ============================================================
    // 3. Rutear por tipo
    // ============================================================
    if (tipo === 'preapproval' || tipo === 'subscription_preapproval') {
      await procesarPreapproval(recursoId);
    } else if (tipo === 'authorized_payment' || tipo === 'subscription_authorized_payment') {
      await procesarAuthorizedPayment(recursoId);
    } else {
      console.log(`[webhook] Tipo ignorado: ${tipo}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('[webhook] Error procesando:', err);
    // Devolvemos 200 para que MP no reintente indefinidamente por errores nuestros.
    // Los errores graves quedan en logs para revisar.
    return NextResponse.json({ received: true, warning: 'error interno' });
  }
}

// ============================================================
// Validación de firma de MP
// ============================================================

function validarFirmaMP(req: NextRequest, headers: Headers): boolean {
  const secret = process.env.MP_WEBHOOK_SECRET;
  if (!secret) {
    console.warn('[webhook] MP_WEBHOOK_SECRET no configurado, skip validación (solo dev)');
    return process.env.NODE_ENV !== 'production';
  }

  const xSignature = headers.get('x-signature');
  const xRequestId = headers.get('x-request-id');
  if (!xSignature || !xRequestId) return false;

  // x-signature viene como: "ts=1234567890,v1=abc123..."
  const parts = xSignature.split(',').reduce<Record<string, string>>((acc, p) => {
    const [k, v] = p.split('=');
    if (k && v) acc[k.trim()] = v.trim();
    return acc;
  }, {});

  const ts = parts['ts'];
  const v1 = parts['v1'];
  if (!ts || !v1) return false;

  // El `data.id` viene por query string (?data.id.=...) o del body.
  const url = new URL(req.url);
  const dataId = url.searchParams.get('data.id') || url.searchParams.get('id') || '';

  // Manifest según docs de MP: `id:${dataId};request-id:${xRequestId};ts:${ts};`
  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
  const expected = crypto.createHmac('sha256', secret).update(manifest).digest('hex');

  // Comparación timing-safe
  const a = Buffer.from(expected);
  const b = Buffer.from(v1);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

// ============================================================
// Procesadores
// ============================================================

async function procesarPreapproval(preapprovalId: string): Promise<void> {
  const preapproval = await obtenerPreapproval(preapprovalId);
  if (!preapproval) {
    console.warn(`[webhook] Preapproval ${preapprovalId} no encontrado en MP`);
    return;
  }

  const donacion = await findDonacionByPreapprovalId(preapprovalId);
  if (!donacion) {
    console.warn(`[webhook] Preapproval ${preapprovalId} sin fila correspondiente en Sheet`);
    return;
  }

  const nuevoEstado: EstadoDonacion = mapearEstadoPreapproval(preapproval.status);

  const patch: Parameters<typeof updateDonacion>[1] = {
    estado: nuevoEstado,
  };

  if (nuevoEstado === 'authorized' && !donacion.fechaAutorizacion) {
    patch.fechaAutorizacion = new Date().toISOString();
  }

  await updateDonacion(donacion.rowIndex, patch);
  // NOTA: no disparamos email acá. El email de agradecimiento se dispara con el
  // primer authorized_payment, que es cuando MP efectivamente cobró.
}

async function procesarAuthorizedPayment(paymentId: string): Promise<void> {
  const payment = await obtenerAuthorizedPayment(paymentId);
  if (!payment) {
    console.warn(`[webhook] Authorized payment ${paymentId} no encontrado en MP`);
    return;
  }

  if (payment.status !== 'approved' && payment.status !== 'authorized') {
    // Solo nos interesan los pagos efectivamente acreditados.
    return;
  }

  const donacion = await findDonacionByPreapprovalId(payment.preapprovalId);
  if (!donacion) {
    console.warn(`[webhook] Payment ${paymentId} sin donación asociada (preapproval ${payment.preapprovalId})`);
    return;
  }

  // Actualizamos siempre el último payment id
  await updateDonacion(donacion.rowIndex, {
    ultimoPaymentId: paymentId,
    estado: 'authorized',
    fechaAutorizacion: donacion.fechaAutorizacion || new Date().toISOString(),
  });

  // Idempotencia del email: si ya notificamos, no lo mandamos de nuevo.
  // Según decisión del usuario: solo el PRIMER authorized_payment dispara email.
  if (donacion.notificado === 'si') {
    return;
  }

  try {
    await enviarAgradecimientoDonacion({
      nombre: donacion.nombre,
      email: donacion.email,
      monto: donacion.monto,
      frecuencia: donacion.frecuencia,
    });
    await updateDonacion(donacion.rowIndex, { notificado: 'si' });
  } catch (err) {
    // Si falla el email, NO marcamos notificado. Así MP reintenta y lo mandamos en el próximo evento.
    console.error('[webhook] Error enviando email de agradecimiento:', err);
  }
}
