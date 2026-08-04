/**
 * POST /api/contacto
 *
 * Body: { nombre, email, edad, localidad, provincia, provinciaNacimiento, mensaje, origen? }
 *
 * "provincia" = provincia de residencia. "provinciaNacimiento" = dónde nació.
 *
 * Flujo:
 *   1. Valida payload.
 *   2. Appendea fila en tab "Contactos" del Google Sheet.
 *
 * No mandamos emails automáticos. La fundación revisa el Sheet manualmente.
 * Si querés notificación cuando entra un contacto nuevo, configurá una alerta
 * directamente en Google Sheets (Herramientas > Reglas de notificación).
 *
 * Anti-spam básico: honeypot + validación de longitud.
 */

import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { appendContacto } from "@/lib/sheets";

export const runtime = "nodejs";

interface Body {
  nombre?: unknown;
  email?: unknown;
  edad?: unknown;
  localidad?: unknown;
  provincia?: unknown;
  provinciaNacimiento?: unknown;
  mensaje?: unknown;
  origen?: unknown;
  // Honeypot: campo oculto que solo bots completan.
  website?: unknown;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Body;

    // Honeypot: si viene algo, es bot. Respondemos 200 silencioso.
    if (typeof body.website === "string" && body.website.length > 0) {
      return NextResponse.json({ ok: true });
    }

    const nombre = typeof body.nombre === "string" ? body.nombre.trim() : "";
    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    // El input manda la edad como string; la normalizamos a entero.
    const edad = Number.parseInt(String(body.edad ?? "").trim(), 10);
    const localidad =
      typeof body.localidad === "string" ? body.localidad.trim() : "";
    const provincia =
      typeof body.provincia === "string" ? body.provincia.trim() : "";
    const provinciaNacimiento =
      typeof body.provinciaNacimiento === "string"
        ? body.provinciaNacimiento.trim()
        : "";
    const mensaje =
      typeof body.mensaje === "string" ? body.mensaje.trim() : "";
    const origen =
      typeof body.origen === "string" ? body.origen.trim() : "web";

    if (!nombre || nombre.length < 2) {
      return NextResponse.json({ error: "Nombre inválido" }, { status: 400 });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }
    if (!Number.isFinite(edad) || edad < 14 || edad > 99) {
      return NextResponse.json({ error: "Edad inválida" }, { status: 400 });
    }
    if (!localidad) {
      return NextResponse.json({ error: "Falta localidad" }, { status: 400 });
    }
    if (!provincia) {
      return NextResponse.json(
        { error: "Falta provincia de residencia" },
        { status: 400 }
      );
    }
    if (!provinciaNacimiento) {
      return NextResponse.json(
        { error: "Falta provincia de nacimiento" },
        { status: 400 }
      );
    }
    if (mensaje.length > 5000) {
      return NextResponse.json(
        { error: "Mensaje demasiado largo" },
        { status: 400 }
      );
    }

    const id = randomUUID();

    await appendContacto({
      id,
      nombre,
      email,
      edad,
      localidad,
      provincia,
      provinciaNacimiento,
      mensaje,
      origen,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contacto] Error:", err);
    return NextResponse.json(
      { error: "No pudimos enviar tu mensaje. Intentá de nuevo." },
      { status: 500 }
    );
  }
}
