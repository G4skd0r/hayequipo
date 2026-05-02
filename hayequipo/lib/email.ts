/**
 * Cliente de email para Hay Equipo (Resend).
 *
 * Tres flujos:
 *   1. enviarAgradecimientoDonacion: al confirmarse el primer pago (único o primera cuota mensual).
 *   2. enviarConfirmacionContacto: al donante tras enviar el FormularioSumate.
 *   3. enviarNotificacionInternaContacto: al inbox interno de la fundación.
 *
 * Diseño: HTML inline con paleta negro dominante + acento amarillo, consistente con el front.
 * No usamos librería de templates (MJML, React Email, etc.) para mantener el bundle liviano.
 */

import { Resend } from 'resend';

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Hay Equipo <onboarding@resend.dev>';
const CONTACT_INBOX = process.env.CONTACT_INBOX_EMAIL || '';

let cachedResend: Resend | null = null;

function getResend(): Resend {
  if (cachedResend) return cachedResend;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('Falta RESEND_API_KEY en variables de entorno.');
  }
  cachedResend = new Resend(apiKey);
  return cachedResend;
}

// ============================================================
// TEMPLATES
// ============================================================

const COLOR_FONDO = '#0a0a0a';
const COLOR_TEXTO = '#f5f5f5';
const COLOR_AMARILLO = '#facc15';
const COLOR_GRIS_SUAVE = '#a3a3a3';

function shellHtml(contenido: string, preheader: string): string {
  return `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Hay Equipo</title>
  </head>
  <body style="margin:0; padding:0; background:${COLOR_FONDO}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
    <span style="display:none; visibility:hidden; opacity:0; color:transparent; height:0; width:0;">${preheader}</span>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLOR_FONDO};">
      <tr>
        <td align="center" style="padding: 48px 24px;">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px; width:100%;">
            <tr>
              <td style="padding-bottom: 32px;">
                <span style="color:${COLOR_AMARILLO}; font-weight:700; font-size:14px; letter-spacing:0.15em; text-transform:uppercase;">Hay Equipo</span>
              </td>
            </tr>
            <tr>
              <td style="color:${COLOR_TEXTO}; font-size:16px; line-height:1.6;">
                ${contenido}
              </td>
            </tr>
            <tr>
              <td style="padding-top:48px; border-top:1px solid #262626; margin-top:32px;">
                <p style="color:${COLOR_GRIS_SUAVE}; font-size:12px; line-height:1.5; margin:24px 0 0;">
                  Fundación Hay Equipo · Formación cívica y liderazgo<br />
                  Este mensaje fue enviado automáticamente. Si tenés dudas, respondé a este correo.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function highlight(texto: string): string {
  return `<span style="background:${COLOR_AMARILLO}; color:${COLOR_FONDO}; padding:2px 6px; font-weight:600;">${texto}</span>`;
}

// ============================================================
// ENVÍOS
// ============================================================

export interface AgradecimientoDonacionInput {
  nombre: string;
  email: string;
  monto: number;
  frecuencia: 'unica' | 'mensual';
}

export async function enviarAgradecimientoDonacion(input: AgradecimientoDonacionInput): Promise<void> {
  const { nombre, email, monto, frecuencia } = input;
  const resend = getResend();

  const montoFmt = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(monto);

  const esRecurrente = frecuencia === 'mensual';

  const contenido = `
    <h1 style="color:${COLOR_TEXTO}; font-size:28px; font-weight:700; line-height:1.2; margin:0 0 24px;">
      Gracias, ${nombre}.
    </h1>
    <p style="margin:0 0 20px;">
      Recibimos tu aporte de ${highlight(montoFmt)}${esRecurrente ? ' mensuales' : ''} a la Red de Apoyo de Hay Equipo.
    </p>
    <p style="margin:0 0 20px;">
      Con donaciones como la tuya sostenemos los programas de formación cívica y liderazgo que forman a la próxima generación de dirigentes en Argentina.
    </p>
    ${
      esRecurrente
        ? `<p style="margin:0 0 20px; color:${COLOR_GRIS_SUAVE}; font-size:14px;">
             Tu donación se renueva automáticamente cada mes. Podés pausarla o cancelarla cuando quieras desde tu cuenta de Mercado Pago.
           </p>`
        : ''
    }
    <p style="margin:32px 0 0;">
      — El equipo de Hay Equipo
    </p>
  `;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: esRecurrente
      ? `Gracias por sumarte a la Red de Apoyo`
      : `Gracias por tu donación a Hay Equipo`,
    html: shellHtml(contenido, `Recibimos tu aporte de ${montoFmt}. Gracias por sumarte.`),
  });
}

export interface ConfirmacionContactoInput {
  nombre: string;
  email: string;
}

export async function enviarConfirmacionContacto(input: ConfirmacionContactoInput): Promise<void> {
  const { nombre, email } = input;
  const resend = getResend();

  const contenido = `
    <h1 style="color:${COLOR_TEXTO}; font-size:28px; font-weight:700; line-height:1.2; margin:0 0 24px;">
      Gracias por sumarte, ${nombre}.
    </h1>
    <p style="margin:0 0 20px;">
      Recibimos tu mensaje. En los próximos días alguien del equipo se va a contactar con vos para conversar y ver por dónde podés sumarte.
    </p>
    <p style="margin:0 0 20px;">
      Mientras tanto, te invitamos a conocer más sobre lo que hacemos y a seguirnos en redes.
    </p>
    <p style="margin:32px 0 0;">
      — El equipo de Hay Equipo
    </p>
  `;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'Recibimos tu mensaje — Hay Equipo',
    html: shellHtml(contenido, 'Gracias por sumarte. Pronto nos contactamos.'),
  });
}

export interface NotificacionInternaInput {
  nombre: string;
  email: string;
  localidad?: string;
  provincia?: string;
  mensaje: string;
}

export async function enviarNotificacionInternaContacto(input: NotificacionInternaInput): Promise<void> {
  if (!CONTACT_INBOX) {
    // Si no hay inbox interno configurado, no reventamos el flujo. Solo warning.
    console.warn('[email] CONTACT_INBOX_EMAIL no configurado, skip notificación interna.');
    return;
  }

  const { nombre, email, localidad, provincia, mensaje } = input;
  const ubicacion = [localidad, provincia].filter(Boolean).join(', ');
  const resend = getResend();

  const contenido = `
    <h1 style="color:${COLOR_TEXTO}; font-size:22px; font-weight:700; line-height:1.3; margin:0 0 24px;">
      Nuevo contacto desde la web
    </h1>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;">
      <tr>
        <td style="padding:8px 0; color:${COLOR_GRIS_SUAVE}; font-size:13px; text-transform:uppercase; letter-spacing:0.08em;">Nombre</td>
      </tr>
      <tr><td style="padding:0 0 16px; color:${COLOR_TEXTO};">${nombre}</td></tr>
      <tr>
        <td style="padding:8px 0; color:${COLOR_GRIS_SUAVE}; font-size:13px; text-transform:uppercase; letter-spacing:0.08em;">Email</td>
      </tr>
      <tr><td style="padding:0 0 16px; color:${COLOR_TEXTO};"><a href="mailto:${email}" style="color:${COLOR_AMARILLO}; text-decoration:none;">${email}</a></td></tr>
      ${
        ubicacion
          ? `<tr><td style="padding:8px 0; color:${COLOR_GRIS_SUAVE}; font-size:13px; text-transform:uppercase; letter-spacing:0.08em;">Ubicación</td></tr>
             <tr><td style="padding:0 0 16px; color:${COLOR_TEXTO};">${escapeHtml(ubicacion)}</td></tr>`
          : ''
      }
      <tr>
        <td style="padding:8px 0; color:${COLOR_GRIS_SUAVE}; font-size:13px; text-transform:uppercase; letter-spacing:0.08em;">Mensaje</td>
      </tr>
      <tr><td style="padding:0 0 16px; color:${COLOR_TEXTO}; white-space:pre-wrap;">${escapeHtml(mensaje)}</td></tr>
    </table>
  `;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: CONTACT_INBOX,
    replyTo: email,
    subject: `Nuevo contacto: ${nombre}`,
    html: shellHtml(contenido, `Nuevo contacto de ${nombre}`),
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
