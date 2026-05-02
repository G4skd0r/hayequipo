/**
 * POST /api/contacto
 *
 * Body: { nombre, email, localidad, provincia, mensaje, origen? }
 *
 * Flujo:
 *   1. Valida payload.
 *   2. Appendea fila en tab "Contactos".
 *   3. Dispara email de confirmación al usuario.
 *   4. Dispara email de notificación interna al CONTACT_INBOX_EMAIL (si está configurado).
 *
 * Anti-spam básico: honeypot opcional + validación de longitud.
 */

import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { appendContacto } from '@/lib/sheets';
import {
  enviarConfirmacionContacto,
  enviarNotificacionInternaContacto,
} from '@/lib/email';

export const runtime = 'nodejs';

interface Body {
  nombre?: unknown;
  email?: unknown;
  localidad?: unknown;
  provincia?: unknown;
  mensaje?: unknown;
  origen?: unknown;
  // Honeypot: campo oculto que solo bots completan.
  website?: unknown;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Body;

    // Honeypot: si viene algo, es bot. Respondemos 200 silencioso.
    if (typeof body.website === 'string' && body.website.length > 0) {
      return NextResponse.json({ ok: true });
    }

    const nombre = typeof body.nombre === 'string' ? body.nombre.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const localidad = typeof body.localidad === 'string' ? body.localidad.trim() : '';
    const provincia = typeof body.provincia === 'string' ? body.provincia.trim() : '';
    const mensaje = typeof body.mensaje === 'string' ? body.mensaje.trim() : '';
    const origen = typeof body.origen === 'string' ? body.origen.trim() : 'web';

    if (!nombre || nombre.length < 2) {
      return NextResponse.json({ error: 'Nombre inválido' }, { status: 400 });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
    }
    if (!localidad) {
      return NextResponse.json({ error: 'Falta localidad' }, { status: 400 });
    }
    if (!provincia) {
      return NextResponse.json({ error: 'Falta provincia' }, { status: 400 });
    }
    if (mensaje.length > 5000) {
      return NextResponse.json({ error: 'Mensaje demasiado largo' }, { status: 400 });
    }

    const id = randomUUID();

    // Guardamos SIEMPRE primero. Si los emails fallan, al menos el dato queda.
    await appendContacto({
      id,
      nombre,
      email,
      localidad,
      provincia,
      mensaje,
      origen,
    });

    // Emails en paralelo. Si alguno falla, no le importa al usuario.
    await Promise.allSettled([
      enviarConfirmacionContacto({ nombre, email }),
      enviarNotificacionInternaContacto({ nombre, email, localidad, provincia, mensaje }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[contacto] Error:', err);
    return NextResponse.json(
      { error: 'No pudimos enviar tu mensaje. Intentá de nuevo.' },
      { status: 500 }
    );
  }
}
