/**
 * POST /api/donaciones/crear
 *
 * Body: { email: string; monto: number; nombre?: string; frecuencia?: 'unica' | 'mensual' }
 *
 * Flujo:
 *   1. Valida payload.
 *   2. Crea un Preapproval en Mercado Pago vía lib/mercadopago.ts.
 *   3. Appendea fila en Sheet con estado 'pending'.
 *   4. Devuelve init_point (URL de checkout de MP).
 *
 * Notas:
 *   - El modal del frontend solo manda email y monto, asumiendo donación mensual.
 *   - Si en el futuro querés soportar donación única, mandá frecuencia='unica' desde el front.
 *   - Si el front no manda nombre, usamos un placeholder. Se puede mejorar pidiéndolo al donante.
 */

import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { crearPreapproval } from '@/lib/mercadopago';
import { appendDonacion, type Frecuencia } from '@/lib/sheets';

export const runtime = 'nodejs';

interface Body {
  nombre?: unknown;
  email?: unknown;
  monto?: unknown;
  frecuencia?: unknown;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Body;

    const nombre = typeof body.nombre === 'string' && body.nombre.trim().length >= 2
      ? body.nombre.trim()
      : 'Donante';
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const monto = typeof body.monto === 'number' ? body.monto : Number(body.monto);
    const frecuencia: Frecuencia = body.frecuencia === 'unica' ? 'unica' : 'mensual';

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
    }
    if (!Number.isFinite(monto) || monto < 1000) {
      return NextResponse.json({ error: 'Monto mínimo: $1.000' }, { status: 400 });
    }

    const id = randomUUID();

    const preapproval = await crearPreapproval({
      externalReference: id,
      payerEmail: email,
      monto,
      frecuencia,
      motivo:
        frecuencia === 'mensual'
          ? 'Donación mensual a la Red de Apoyo de Hay Equipo'
          : 'Donación a Hay Equipo',
    });

    await appendDonacion({
      id,
      nombre,
      email,
      monto,
      frecuencia,
      preapprovalId: preapproval.id,
      estado: 'pending',
    });

    // Devolvemos init_point en snake_case para matchear el contrato del modal del frontend
    return NextResponse.json({
      id,
      init_point: preapproval.initPoint,
    });
  } catch (err) {
    console.error('[donaciones/crear] Error:', err);
    return NextResponse.json(
      { error: 'No se pudo crear la donación. Intentá de nuevo.' },
      { status: 500 }
    );
  }
}
