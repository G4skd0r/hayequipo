/**
 * Cliente Google Sheets para Hay Equipo.
 *
 * Arquitectura: un solo spreadsheet con dos tabs:
 *   - "Donaciones": id | fecha_creacion | nombre | email | monto | frecuencia | preapproval_id | estado | fecha_autorizacion | ultimo_payment_id | notificado
 *   - "Contactos":  id | fecha | nombre | email | localidad | provincia | mensaje | origen
 *
 * Idempotencia:
 *   - Donaciones se identifican por `id` (UUID generado por nosotros al crear el preapproval).
 *   - Antes de appendear chequeamos que no exista. Antes de actualizar, buscamos por preapproval_id.
 *
 * Deuda técnica conocida: Sheets no es transaccional. Si llegan dos webhooks concurrentes
 * para el mismo preapproval, hay riesgo de race condition. Aceptable para el volumen actual.
 * Umbral de migración a Postgres: >50 donaciones/mes o sumar un segundo programa.
 */

import { google, sheets_v4 } from 'googleapis';

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID!;
const TAB_DONACIONES = 'Donaciones';
const TAB_CONTACTOS = 'Contactos';

let cachedClient: sheets_v4.Sheets | null = null;

function getClient(): sheets_v4.Sheets {
  if (cachedClient) return cachedClient;

  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const keyRaw = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

  if (!email || !keyRaw) {
    throw new Error(
      'Faltan credenciales de Google Service Account. Revisar GOOGLE_SERVICE_ACCOUNT_EMAIL y GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.'
    );
  }

  // Las claves privadas en Vercel vienen con \n escapados, hay que normalizarlas.
  const privateKey = keyRaw.replace(/\\n/g, '\n');

  const auth = new google.auth.JWT({
    email,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  cachedClient = google.sheets({ version: 'v4', auth });
  return cachedClient;
}

// ============================================================
// DONACIONES
// ============================================================

export type Frecuencia = 'unica' | 'mensual';
export type EstadoDonacion = 'pending' | 'authorized' | 'paused' | 'cancelled' | 'rejected';

export interface DonacionInput {
  id: string;
  nombre: string;
  email: string;
  monto: number;
  frecuencia: Frecuencia;
  preapprovalId: string;
  estado: EstadoDonacion;
}

export interface DonacionRow extends DonacionInput {
  fechaCreacion: string;
  fechaAutorizacion: string;
  ultimoPaymentId: string;
  notificado: string; // 'si' | '' — controla envío de email de agradecimiento
  rowIndex: number; // 1-based en el sheet
}

export async function appendDonacion(d: DonacionInput): Promise<void> {
  const client = getClient();

  // Chequeo de idempotencia: si ya existe la fila con este id, no insertamos de nuevo.
  const existing = await findDonacionById(d.id);
  if (existing) return;

  await client.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${TAB_DONACIONES}!A:K`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [
        [
          d.id,
          new Date().toISOString(),
          d.nombre,
          d.email,
          d.monto,
          d.frecuencia,
          d.preapprovalId,
          d.estado,
          '', // fecha_autorizacion
          '', // ultimo_payment_id
          '', // notificado
        ],
      ],
    },
  });
}

export async function findDonacionById(id: string): Promise<DonacionRow | null> {
  return findDonacion((row) => row[0] === id);
}

export async function findDonacionByPreapprovalId(preapprovalId: string): Promise<DonacionRow | null> {
  return findDonacion((row) => row[6] === preapprovalId);
}

async function findDonacion(predicate: (row: string[]) => boolean): Promise<DonacionRow | null> {
  const client = getClient();
  const res = await client.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${TAB_DONACIONES}!A2:K`,
  });

  const rows = res.data.values || [];
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    if (predicate(r)) {
      return {
        id: r[0] || '',
        fechaCreacion: r[1] || '',
        nombre: r[2] || '',
        email: r[3] || '',
        monto: Number(r[4] || 0),
        frecuencia: (r[5] as Frecuencia) || 'unica',
        preapprovalId: r[6] || '',
        estado: (r[7] as EstadoDonacion) || 'pending',
        fechaAutorizacion: r[8] || '',
        ultimoPaymentId: r[9] || '',
        notificado: r[10] || '',
        rowIndex: i + 2,
      };
    }
  }
  return null;
}

export interface ActualizacionDonacion {
  estado?: EstadoDonacion;
  fechaAutorizacion?: string;
  ultimoPaymentId?: string;
  notificado?: string;
}

export async function updateDonacion(rowIndex: number, patch: ActualizacionDonacion): Promise<void> {
  const client = getClient();
  const data: sheets_v4.Schema$ValueRange[] = [];

  if (patch.estado !== undefined) {
    data.push({ range: `${TAB_DONACIONES}!H${rowIndex}`, values: [[patch.estado]] });
  }
  if (patch.fechaAutorizacion !== undefined) {
    data.push({ range: `${TAB_DONACIONES}!I${rowIndex}`, values: [[patch.fechaAutorizacion]] });
  }
  if (patch.ultimoPaymentId !== undefined) {
    data.push({ range: `${TAB_DONACIONES}!J${rowIndex}`, values: [[patch.ultimoPaymentId]] });
  }
  if (patch.notificado !== undefined) {
    data.push({ range: `${TAB_DONACIONES}!K${rowIndex}`, values: [[patch.notificado]] });
  }

  if (data.length === 0) return;

  await client.spreadsheets.values.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: { valueInputOption: 'USER_ENTERED', data },
  });
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
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [
        [
          c.id,
          new Date().toISOString(),
          c.nombre,
          c.email,
          c.localidad || '',
          c.provincia || '',
          c.mensaje,
          c.origen || 'web',
        ],
      ],
    },
  });
}
