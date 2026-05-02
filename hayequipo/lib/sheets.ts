/**
 * Cliente Google Sheets para Hay Equipo.
 *
 * Por ahora solo manejamos el tab "Contactos" del formulario de Sumate.
 * Cuando se active Mercado Pago, agregamos las funciones de donaciones.
 *
 * Tab "Contactos": id | fecha | nombre | email | localidad | provincia | mensaje | origen
 */

import { google, sheets_v4 } from "googleapis";

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID!;
const TAB_CONTACTOS = "Contactos";

let cachedClient: sheets_v4.Sheets | null = null;

function getClient(): sheets_v4.Sheets {
  if (cachedClient) return cachedClient;

  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const keyRaw = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

  if (!email || !keyRaw) {
    throw new Error(
      "Faltan credenciales de Google Service Account. Revisar GOOGLE_SERVICE_ACCOUNT_EMAIL y GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY."
    );
  }

  // Las claves privadas en Vercel vienen con \n escapados, hay que normalizarlas.
  const privateKey = keyRaw.replace(/\\n/g, "\n");

  const auth = new google.auth.JWT({
    email,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  cachedClient = google.sheets({ version: "v4", auth });
  return cachedClient;
}

// ============================================================
// CONTACTOS
// ============================================================

export interface ContactoInput {
  id: string;
  nombre: string;
  email: string;
  localidad?: string;
  provincia?: string;
  mensaje: string;
  origen?: string;
}

export async function appendContacto(c: ContactoInput): Promise<void> {
  const client = getClient();

  await client.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${TAB_CONTACTOS}!A:H`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [
        [
          c.id,
          new Date().toISOString(),
          c.nombre,
          c.email,
          c.localidad || "",
          c.provincia || "",
          c.mensaje,
          c.origen || "web",
        ],
      ],
    },
  });
}
