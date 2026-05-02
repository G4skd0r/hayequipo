/**
 * Cliente Mercado Pago para Hay Equipo.
 *
 * Usa el flujo de Preapproval (suscripciones) tanto para donaciones únicas como mensuales.
 * Para donaciones únicas, configuramos el preapproval con una sola cuota.
 *
 * Endpoints REST de MP usados:
 *   POST   /preapproval                       → crear suscripción
 *   GET    /preapproval/:id                   → consultar estado
 *   GET    /authorized_payments/:id           → consultar pago de cuota
 *
 * Docs: https://www.mercadopago.com.ar/developers/es/reference/subscriptions/_preapproval/post
 */

import type { Frecuencia, EstadoDonacion } from './sheets';

const MP_API = 'https://api.mercadopago.com';

function getAccessToken(): string {
  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) {
    throw new Error('Falta MP_ACCESS_TOKEN en variables de entorno.');
  }
  return token;
}

function getBackUrl(): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return `${base}/donacion/exito`;
}

// ============================================================
// CREAR PREAPPROVAL
// ============================================================

export interface CrearPreapprovalInput {
  externalReference: string;
  payerEmail: string;
  monto: number;
  frecuencia: Frecuencia;
  motivo: string;
}

export interface PreapprovalResult {
  id: string;
  initPoint: string;
}

export async function crearPreapproval(input: CrearPreapprovalInput): Promise<PreapprovalResult> {
  const { externalReference, payerEmail, monto, frecuencia, motivo } = input;

  // Para donación única, una sola cuota mensual; para mensual, indefinido (sin end_date).
  // La API de MP requiere `frequency` y `frequency_type` para preapproval.
  const autoRecurring: Record<string, unknown> = {
    frequency: 1,
    frequency_type: 'months',
    transaction_amount: monto,
    currency_id: 'ARS',
  };

  if (frecuencia === 'unica') {
    // Para donación única: limitamos a una sola cuota poniendo end_date al mes siguiente
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 7); // ventana corta para que se cobre una vez
    autoRecurring.start_date = startDate.toISOString();
    autoRecurring.end_date = endDate.toISOString();
  }

  const body = {
    reason: motivo,
    external_reference: externalReference,
    payer_email: payerEmail,
    auto_recurring: autoRecurring,
    back_url: getBackUrl(),
    status: 'pending',
  };

  const res = await fetch(`${MP_API}/preapproval`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAccessToken()}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`MP preapproval error ${res.status}: ${text}`);
  }

  const data = await res.json();
  return {
    id: data.id,
    initPoint: data.init_point,
  };
}

// ============================================================
// CONSULTAR PREAPPROVAL (usado por el webhook)
// ============================================================

export interface PreapprovalEstado {
  id: string;
  status: string;
  externalReference: string;
}

export async function obtenerPreapproval(id: string): Promise<PreapprovalEstado | null> {
  const res = await fetch(`${MP_API}/preapproval/${id}`, {
    headers: { Authorization: `Bearer ${getAccessToken()}` },
  });

  if (!res.ok) return null;

  const data = await res.json();
  return {
    id: data.id,
    status: data.status,
    externalReference: data.external_reference,
  };
}

// ============================================================
// CONSULTAR AUTHORIZED PAYMENT (usado por el webhook)
// ============================================================

export interface AuthorizedPaymentEstado {
  id: string;
  status: string;
  preapprovalId: string;
}

export async function obtenerAuthorizedPayment(id: string): Promise<AuthorizedPaymentEstado | null> {
  const res = await fetch(`${MP_API}/authorized_payments/${id}`, {
    headers: { Authorization: `Bearer ${getAccessToken()}` },
  });

  if (!res.ok) return null;

  const data = await res.json();
  return {
    id: data.id,
    status: data.status,
    preapprovalId: data.preapproval_id,
  };
}

// ============================================================
// MAPEO DE ESTADOS MP → ESTADOS INTERNOS
// ============================================================

export function mapearEstadoPreapproval(mpStatus: string): EstadoDonacion {
  switch (mpStatus) {
    case 'authorized':
      return 'authorized';
    case 'paused':
      return 'paused';
    case 'cancelled':
      return 'cancelled';
    case 'pending':
      return 'pending';
    default:
      return 'pending';
  }
}
