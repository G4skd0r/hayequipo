# Hay Equipo — Web

Sitio institucional de Fundación Hay Equipo.

**Stack:** Next.js 14 · Tailwind CSS · Google Sheets · Vercel.

---

## Estado actual

✅ **Páginas:** Home, Nosotros, Sumate
✅ **Formulario de contacto** funcional, guarda en Google Sheets
🟡 **Donaciones:** botón "Próximamente". Cuando la fundación esté lista, se reactiva con Mercado Pago.

---

## Variables de entorno (3 valores únicos)

```
NEXT_PUBLIC_SITE_URL              → URL del sitio
GOOGLE_SHEETS_ID                  → ID del spreadsheet
GOOGLE_SERVICE_ACCOUNT_EMAIL      → email de la service account
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY → clave privada
```

---

## Setup paso a paso

### 1. Crear Google Service Account

1. [console.cloud.google.com](https://console.cloud.google.com/) → crear proyecto.
2. APIs & Services → Library → habilitar **Google Sheets API**.
3. IAM & Admin → Service Accounts → crear nueva.
4. Click en la cuenta → Keys → Add Key → JSON. Bajás un archivo.
5. Del JSON copiás:
   - `client_email` → `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `private_key` → `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`

### 2. Crear el Google Sheet

Creá un spreadsheet con un tab llamado **"Contactos"** y esta fila 1 como header:

| id | fecha | nombre | email | localidad | provincia | mensaje | origen |

Compartí el Sheet con el email de la service account como **Editor**. Copiá el ID del sheet (en la URL, entre `/d/` y `/edit`).

### 3. Cargar variables en Vercel

En Vercel → Settings → Environment Variables, cargá las 4 variables.

**Importante:** al pegar `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`, conservá los `\n` como caracteres literales. El código los normaliza con `.replace(/\\n/g, '\n')`.

### 4. Deploy

Cada vez que hagas push a la rama `main` de GitHub, Vercel deploya automáticamente.

---

## Cuando llegue el momento de activar donaciones

El código de Mercado Pago está documentado en versiones anteriores del proyecto. Para reactivar:

1. Restaurar `lib/mercadopago.ts`, `app/api/donaciones/`, `app/donacion/exito/`, `app/donacion/error/`.
2. Reemplazar `components/DonacionModal.tsx` por la versión con form de email + monto.
3. Cambiar el botón "Próximamente" en `SeccionDonacion.tsx` por el original.
4. Sumar variables `MP_ACCESS_TOKEN` y `MP_WEBHOOK_SECRET` en Vercel.
5. En MP Developers → Webhooks, configurar URL `https://TU-DOMINIO/api/donaciones/webhook` para eventos `preapproval` y `authorized_payment`.
6. Sumar columnas para "Donaciones" en el Sheet.

---

## Cómo revisar contactos nuevos

Entrás al Google Sheet, tab "Contactos". Cada fila es una persona que llenó el formulario de Sumate.

**Tip:** en Google Sheets, Herramientas → Reglas de notificación → activá "Cuando se hagan cambios" para recibir un email cuando aparezca un contacto nuevo.

---

## Troubleshooting

**"Faltan credenciales de Google Service Account"**
→ Revisá `GOOGLE_SERVICE_ACCOUNT_EMAIL` y `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`. La private key debe incluir los `\n`.

**"The caller does not have permission"**
→ No compartiste el Sheet con la service account. Compartilo como Editor.

**El formulario devuelve error 500**
→ Revisá logs de Vercel. Suele ser problema de variables de entorno.
