/** @type {import('next').NextConfig} */

// Central de pagos: micuota.hayequipoargentina.org redirige al Apps Script.
// Es 307 (temporal) a proposito: si el script se vuelve a publicar y cambia
// de URL, alcanza con editar esta constante.
const MICUOTA_HOST = 'micuota.hayequipoargentina.org';
const MICUOTA_DESTINO =
  'https://script.google.com/macros/s/AKfycbxyDSu5nEAt2ahRNtDADpN8jJsqvZDhvU03fI-77KnLM4p3cg6nV656b6p9pnoYSGQShQ/exec';

const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: MICUOTA_HOST }],
        destination: MICUOTA_DESTINO,
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
