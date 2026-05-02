"use client";

import { useEffect } from "react";

interface DonacionModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Modal "Próximamente". Ocupa el lugar del modal de donación real
 * mientras Mercado Pago no esté configurado.
 *
 * Cuando llegue el momento de activar pagos:
 *   1. Restaurar el DonacionModal original (form de email + monto + fetch a /api/donaciones/crear).
 *   2. Cargar las variables MP_ACCESS_TOKEN y MP_WEBHOOK_SECRET en Vercel.
 *   3. Configurar webhook en Mercado Pago.
 */
export default function DonacionModal({ open, onClose }: DonacionModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 he-modal-backdrop bg-black/60 flex items-end md:items-center justify-center p-0 md:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="proximamente-title"
    >
      <div
        className="bg-he-blanco text-he-negro w-full md:max-w-lg rounded-t-2xl md:rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative p-8 md:p-10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-he-negro/60 hover:text-he-negro transition"
            aria-label="Cerrar"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>

          <div className="text-xs uppercase tracking-widest text-he-rojo font-medium mb-4">
            Próximamente
          </div>

          <h2
            id="proximamente-title"
            className="text-2xl md:text-3xl font-medium leading-tight mb-4 pr-8"
          >
            La <span className="he-highlight">Red de Apoyo</span> abre pronto.
          </h2>

          <p className="text-base text-he-negro/70 leading-relaxed mb-6">
            Estamos terminando de poner a punto todo para que puedas sumarte y
            apoyar a Hay Equipo. En las próximas semanas vas a poder hacerlo desde
            acá.
          </p>

          <p className="text-base text-he-negro/70 leading-relaxed mb-8">
            Mientras tanto, si querés ser parte del proyecto de otra forma,{" "}
            <a
              href="/sumate"
              className="text-he-rojo hover:underline font-medium"
            >
              dejanos tus datos
            </a>{" "}
            y te contactamos.
          </p>

          <button
            onClick={onClose}
            className="w-full bg-he-negro hover:bg-he-negro/90 text-he-blanco py-4 rounded text-base font-medium transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
