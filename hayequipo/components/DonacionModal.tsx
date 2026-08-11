"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface DonacionModalProps {
  open: boolean;
  onClose: () => void;
  /** Adónde devolver el foco al cerrar (el botón que lo abrió). */
  returnFocusTo?: React.RefObject<HTMLElement>;
}

/** Distancia mínima para dar por descartada la hoja. */
const DISMISS_DISTANCE = 110;
/** Un flick alcanza aunque no se haya arrastrado tanto (px por ms). */
const DISMISS_VELOCITY = 0.11;

/** Cuanto más se pasa del borde, menos acompaña. Las cosas frenan antes de parar. */
function rubberband(overshoot: number, dimension: number, constant = 0.55) {
  return (
    (overshoot * dimension * constant) /
    (dimension + constant * Math.abs(overshoot))
  );
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
export default function DonacionModal({
  open,
  onClose,
  returnFocusTo,
}: DonacionModalProps) {
  // `mounted` mantiene el nodo vivo durante la salida; `visible` maneja el estado
  // visual. Sin esto el modal desaparece de golpe y la salida no existe.
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);
  const [dragging, setDragging] = useState(false);

  const sheetRef = useRef<HTMLDivElement | null>(null);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const drag = useRef<{
    id: number;
    startY: number;
    offset: number;
    history: { y: number; t: number }[];
  } | null>(null);

  /* ── Montaje / desmontaje con salida ───────────────────────────────── */
  useEffect(() => {
    clearTimeout(exitTimer.current);

    if (open) {
      setMounted(true);
      // Si se reabre antes de terminar la salida, el nodo todavía vive con el
      // transform del arrastre puesto. Se limpia o la hoja queda fuera de cuadro.
      if (sheetRef.current) sheetRef.current.style.transform = "";
      // Dos frames: el nodo tiene que existir con data-state="closed" para que
      // el navegador tenga desde dónde animar.
      let cancelled = false;
      let frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => {
          if (!cancelled) setVisible(true);
        });
      });
      return () => {
        cancelled = true;
        cancelAnimationFrame(frame);
      };
    }

    setVisible(false);
    exitTimer.current = setTimeout(() => setMounted(false), 440);
  }, [open]);

  useEffect(() => () => clearTimeout(exitTimer.current), []);

  /* ── Scroll del body ───────────────────────────────────────────────── */
  useEffect(() => {
    if (!mounted) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mounted]);

  /* ── Teclado: Escape y foco atrapado ───────────────────────────────── */
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      const root = sheetRef.current;
      if (!root) return;
      const focusables = root.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  /* ── Foco: entra al diálogo, vuelve al trigger ─────────────────────── */
  useEffect(() => {
    if (!open || !mounted) return;
    const id = requestAnimationFrame(() => sheetRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [open, mounted]);

  useEffect(() => {
    if (open || !returnFocusTo) return;
    returnFocusTo.current?.focus();
  }, [open, returnFocusTo]);

  /* ── Arrastre para descartar (mobile) ──────────────────────────────── */
  const applyOffset = (offset: number) => {
    const el = sheetRef.current;
    if (el) el.style.transform = `translateY(${offset}px)`;
  };

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    // Solo hoja: en desktop el modal está centrado y no se arrastra.
    if (!window.matchMedia("(max-width: 767px)").matches) return;
    // Multi-touch: una vez empezado el arrastre, los dedos nuevos se ignoran.
    if (drag.current) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    // Capturar el puntero sobre un control le rompe el click: los controles
    // no arrastran la hoja.
    if (
      (e.target as HTMLElement).closest("button, a, input, select, textarea")
    ) {
      return;
    }

    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = {
      id: e.pointerId,
      startY: e.clientY,
      offset: 0,
      history: [{ y: e.clientY, t: performance.now() }],
    };
    setDragging(true);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;

    const raw = e.clientY - d.startY;
    const height = sheetRef.current?.offsetHeight ?? 400;
    // Hacia abajo sigue al dedo 1:1; hacia arriba resiste en vez de frenar seco.
    d.offset = raw >= 0 ? raw : -rubberband(-raw, height);

    d.history.push({ y: e.clientY, t: performance.now() });
    if (d.history.length > 6) d.history.shift();

    applyOffset(d.offset);
  }, []);

  const endDrag = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const d = drag.current;
      if (!d || d.id !== e.pointerId) return;
      drag.current = null;
      setDragging(false);

      const first = d.history[0];
      const last = d.history[d.history.length - 1];
      const elapsed = Math.max(last.t - first.t, 1);
      const velocity = (last.y - first.y) / elapsed;

      const el = sheetRef.current;
      if (d.offset > DISMISS_DISTANCE || velocity > DISMISS_VELOCITY) {
        // Sigue de largo desde donde quedó el dedo, sin costura entre el
        // arrastre y la animación.
        if (el) el.style.transform = "translateY(100%)";
        onClose();
      } else {
        // Vuelve a su lugar: la transición arranca del valor actual.
        if (el) el.style.transform = "";
      }
    },
    [onClose],
  );

  if (!mounted) return null;

  const state = visible ? "open" : "closed";

  return (
    <div
      className="he-backdrop fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4"
      data-state={state}
      onClick={onClose}
    >
      <div
        ref={sheetRef}
        className="he-sheet touch-none md:touch-auto bg-he-blanco text-he-negro w-full md:max-w-lg rounded-t-2xl md:rounded-2xl overflow-hidden shadow-[0_24px_64px_-24px_rgba(0,0,0,0.5)] outline-none"
        data-state={state}
        data-dragging={dragging}
        onClick={(e) => e.stopPropagation()}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        role="dialog"
        aria-modal="true"
        aria-labelledby="proximamente-title"
        tabIndex={-1}
      >
        {/* Agarradera: en mobile la hoja se arrastra, y eso hay que mostrarlo */}
        <div className="md:hidden pt-3 pb-1 flex justify-center touch-none">
          <div className="h-1 w-10 rounded-full bg-he-negro/20" />
        </div>

        <div className="relative p-8 md:p-10 pt-5 md:pt-10">
          <button
            onClick={onClose}
            className="he-press absolute top-4 right-4 p-1 -m-1 text-he-negro/60 hover:text-he-negro"
            aria-label="Cerrar"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>

          <div className="text-xs uppercase tracking-widest text-he-negro/55 font-medium mb-4">
            Próximamente
          </div>

          <h2
            id="proximamente-title"
            className="he-h3 text-2xl md:text-3xl font-medium mb-4 pr-8"
          >
            La <span className="he-highlight">Red de Apoyo</span> abre pronto.
          </h2>

          <p className="he-body text-base text-he-negro/70 leading-relaxed mb-6">
            Estamos terminando de poner a punto todo para que puedas sumarte y
            apoyar a Hay Equipo. En las próximas semanas vas a poder hacerlo desde
            acá.
          </p>

          <p className="he-body text-base text-he-negro/70 leading-relaxed mb-8">
            Mientras tanto, si querés ser parte del proyecto de otra forma,{" "}
            <a
              href="/sumate"
              className="text-he-negro font-semibold underline underline-offset-2 hover:opacity-70 transition-opacity"
            >
              dejanos tus datos
            </a>{" "}
            y te contactamos.
          </p>

          <button
            onClick={onClose}
            className="he-press w-full bg-he-negro hover:bg-he-negro/90 text-he-blanco py-4 rounded text-base font-medium"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
