# Hay Equipo — Web

Sitio institucional y plataforma de donaciones de Fundación Hay Equipo.

**Stack:** Next.js 14 (App Router) · Tailwind CSS · Mercado Pago (Preapproval) · Google Sheets como DB · Resend para emails · Vercel.

---

## Lo que incluye

✅ **Páginas:** Home, Nosotros, Sumate, Donación Éxito, Donación Error
✅ **Componentes:** Sun, Header, Footer, SeccionDonacion, DonacionModal, FormularioSumate
✅ **APIs reales:**
- `POST /api/donaciones/crear` → crea preapproval en MP + fila en Sheet
- `POST /api/donaciones/webhook` → recibe eventos `preapproval` y `authorized_payment`
- `POST /api/contacto` → guarda en Sheet + dispara emails

✅ **Libs:**
- `lib/mercadopago.ts` → cliente MP (Preapproval)
- `lib/sheets.ts` → cliente Google Sheets
- `lib/email.ts` → cliente Resend con templates HTML

⚠️ **Pendiente / cosas a tener en cuenta:**
- Los SVG del sol y del resaltado amarillo son placeholders. Cuando recuperes los originales, reemplazá el contenido del componente `Sun.tsx` y la clase `.he-highlight` en `globals.css`.
- El modal de donación pide solo email. Si querés capturar nombre del donante, sumá un input al `DonacionModal.tsx` y mandalo en el body al fetch.

---

## Estructura

```
app/
  globals.css                  → estilos + paleta + clases utilitarias
  layout.tsx                   → root con DM Sans y metadata
  page.tsx                     → Home
  nosotros/page.tsx            → Página Nosotros
  sumate/page.tsx              → Página Sumate (con formulario)
  donacion/exito/page.tsx      → Confirmación post-pago
  donacion/error/page.tsx      → Página de error
  api/
    donaciones/crear/route.ts
    donaciones/webhook/route.ts
    contacto/route.ts
components/
  Sun.tsx                      → SVG sol garabateado
  Header.tsx                   → header sticky con CTA
  Footer.tsx                   → footer institucional
  SeccionDonacion.tsx          → bloque amarillo de Red de Apoyo
  DonacionModal.tsx            → modal de donación → MP
  FormularioSumate.tsx         → form de contacto
lib/
  mercadopago.ts               → cliente MP (Preapproval)
  sheets.ts                    → cliente Google Sheets
  email.ts                     → cliente Resend + templates
```

---

## Setup local

### 1. Instalar dependencias

```bash
npm install
```

### 2. Crear Google Service Account

Este es el paso donde más gente se traba. Seguilo exacto:

1. Andá a [console.cloud.google.com](https://console.cloud.google.com/) y creá un proyecto (o usá uno existente).
2. Habilitá la **Google Sheets API** en "APIs & Services > Library".
3. En "IAM & Admin > Service Accounts", creá una nueva service account.
4. Una vez creada, entrá → pestaña "Keys" → "Add Key" → "JSON". Se descarga un archivo.
5. Abrí el JSON. Copiá:
   - `client_email` → `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `private_key` → `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` (entero, con los `\n` literales)

### 3. Crear el Spreadsheet

Creá un Google Sheet con **dos tabs**:

**Tab "Donaciones"** — fila 1 como header:

| id | fecha_creacion | nombre | email | monto | frecuencia | preapproval_id | estado | fecha_autorizacion | ultimo_payment_id | notificado |

**Tab "Contactos"** — fila 1 como header:

| id | fecha | nombre | email | localidad | provincia | mensaje | origen |

Compartí el Sheet con el email de la service account como **Editor**. Copiá el ID del sheet (está en la URL, entre `/d/` y `/edit`).

### 4. Configurar Mercado Pago

1. En [mercadopago.com.ar/developers](https://www.mercadopago.com.ar/developers), creá una aplicación.
2. Copiá el **Access Token** → `MP_ACCESS_TOKEN`.
3. En el panel de la app, sección "Webhooks":
   - URL: `https://TU-DOMINIO/api/donaciones/webhook`
   - Eventos: marcá **"Suscripciones — Preapproval"** y **"Suscripciones — Authorized payment"**.
   - Copiá el **secret** que te muestra → `MP_WEBHOOK_SECRET`.

### 5. Configurar Resend

1. Crear cuenta en [resend.com](https://resend.com), generar API key → `RESEND_API_KEY`.
2. Para dev podés usar `onboarding@resend.dev` como remitente (ya viene funcionando).
3. Para producción, verificar el dominio propio (ej: hayequipo.org) agregando los DNS records que pide Resend. Una vez verificado, cambiar `RESEND_FROM_EMAIL` a `Hay Equipo <hola@hayequipo.org>`.

### 6. Armar `.env.local`

```bash
cp .env.local.example .env.local
```

Completá los valores en `.env.local`.

### 7. Correr en dev

```bash
npm run dev
```

Abrí http://localhost:3000

---

## Deploy en Vercel

1. Subí el código a un repo de GitHub.
2. En Vercel, "New Project" → importá el repo.
3. En "Settings > Environment Variables", cargá TODAS las variables del `.env.local.example` con sus valores de producción.
4. **Importante:** al pegar `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` en Vercel, conservá los `\n` como caracteres literales (no como saltos de línea reales). El código los normaliza con `.replace(/\\n/g, '\n')`.
5. Una vez deployado, actualizá la URL del webhook en MP con el dominio de producción.

---

## Checklist post-deploy

- [ ] Hacer una donación de prueba ($1.000) y verificar:
  - [ ] Aparece fila en tab "Donaciones" con estado `pending` al iniciar.
  - [ ] Tras pagar, pasa a `authorized` y llega email de agradecimiento.
  - [ ] `ultimo_payment_id` y `notificado=si` quedan cargados.
- [ ] Completar formulario de Sumate y verificar:
  - [ ] Aparece en tab "Contactos" con localidad y provincia.
  - [ ] Llega email de confirmación al donante.
  - [ ] Llega email interno a `CONTACT_INBOX_EMAIL`.
- [ ] Revisar logs de Vercel para confirmar que no hay warnings de firma inválida.

---

## Decisiones de arquitectura

**Sheets como DB.** Elegido por simplicidad operativa: la fundación puede revisar y auditar donaciones sin tocar herramientas técnicas. Limitaciones:

- No es transaccional. Si MP dispara dos webhooks concurrentes, hay riesgo de race condition.
- Cada append son ~400-800ms. A volumen actual es aceptable.
- **Umbral de migración:** cuando se supere ~50 donaciones/mes o se sume un segundo programa, migrar a Postgres (Neon/Supabase).

**Email solo en el primer `authorized_payment`.** No mandamos email cada mes cuando MP cobre la cuota recurrente. Controlado por la columna `notificado` del Sheet.

**Validación de firma de webhook.** Usamos `x-signature` con HMAC-SHA256. En dev, si `MP_WEBHOOK_SECRET` no está configurado, salteamos la validación.

---

## Troubleshooting

**"Faltan credenciales de Google Service Account"**
→ Revisá `GOOGLE_SERVICE_ACCOUNT_EMAIL` y `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`. La private key debe incluir los `\n`.

**"The caller does not have permission" al hacer append**
→ No compartiste el Sheet con el email de la service account. Compartilo como Editor.

**Webhook devuelve 401 "Firma inválida"**
→ El secret en `MP_WEBHOOK_SECRET` no coincide con el del panel de MP.

**Emails no llegan**
→ Revisá `RESEND_API_KEY` y que `RESEND_FROM_EMAIL` use un dominio verificado (o `onboarding@resend.dev` para dev).

**"No se pudo crear la donación"**
→ Logs de Vercel. Suele ser `MP_ACCESS_TOKEN` inválido o expirado.
