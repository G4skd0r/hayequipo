"use client";

import { useState, useEffect } from "react";

interface DonacionModalProps {
  open: boolean;
  onClose: () => void;
}

const MONTOS_PRESET = [5000, 10000, 20000];
const MONTO_MINIMO = 1000;

export default function DonacionModal({ open, onClose }: DonacionModalProps) {
  const [email, setEmail] = useState("");
  const [montoSeleccionado, setMontoSeleccionado] = useState<number>(10000);
  const [montoCustom, setMontoCustom] = useState("");
  const [usandoCustom, setUsandoCustom] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const getMontoFinal = (): number => {
    if (usandoCustom) {
      const n = parseInt(montoCustom.replace(/\D/g, ""), 10);
      return isNaN(n) ? 0 : n;
    }
    return montoSeleccionado;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const monto = getMontoFinal();

    if (!email || !email.includes("@")) {
      setError("Por favor ingresá un email válido.");
      return;
    }

    if (monto < MONTO_MINIMO) {
      setError(`El monto mínimo es $${MONTO_MINIMO.toLocaleString("es-AR")}.`);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/donaciones/crear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, monto }),
      });

      const data = await res.json();

      if (!res.ok || !data.init_point) {
        throw new Error(data.error || "Error al crear la suscripción.");
      }

      window.location.href = data.init_point;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error inesperado.";
      setError(msg);
      setLoading(false);
    }
  };

  const formatMonto = (n: number) =>
    n.toLocaleString("es-AR", { minimumFractionDigits: 0 });

  return (
    <div
      className="fixed inset-0 z-50 he-modal-backdrop bg-black/60 flex items-end md:items-center justify-center p-0 md:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="donacion-title"
    >
      <div
        className="bg-he-blanco text-he-negro w-full md:max-w-lg rounded-t-2xl md:rounded-2xl overflow-hidden max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative p-6 md:p-8">
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

          <h2
            id="donacion-title"
            className="text-2xl md:text-3xl font-medium leading-tight mb-2 pr-8"
          >
            Sumate a la{" "}
            <span className="he-highlight">Red de Apoyo</span>
          </h2>

          <p className="text-sm text-he-negro/70 leading-relaxed mb-6">
            Tu aporte mensual ayuda a que Hay Equipo siga formando a la nueva
            generación de líderes que Argentina necesita.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-xs uppercase tracking-widest text-he-negro/60 mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full px-4 py-3 bg-white border border-he-negro/20 rounded focus:border-he-celeste focus:outline-none text-base"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-he-negro/60 mb-3">
                Monto mensual
              </label>

              <div className="grid grid-cols-3 gap-2 mb-3">
                {MONTOS_PRESET.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      setMontoSeleccionado(m);
                      setUsandoCustom(false);
                    }}
                    className={`py-3 px-3 rounded border text-sm font-medium transition-all ${
                      !usandoCustom && montoSeleccionado === m
                        ? "bg-he-negro text-he-blanco border-he-negro"
                        : "bg-white text-he-negro border-he-negro/20 hover:border-he-negro/40"
                    }`}
                  >
                    ${formatMonto(m)}
                  </button>
                ))}
              </div>

              <input
                type="text"
                inputMode="numeric"
                value={montoCustom}
                onChange={(e) => {
                  setMontoCustom(e.target.value.replace(/\D/g, ""));
                  setUsandoCustom(true);
                }}
                onFocus={() => setUsandoCustom(true)}
                placeholder="Otro monto (mínimo $1.000)"
                className={`w-full px-4 py-3 bg-white border rounded focus:outline-none text-base ${
                  usandoCustom
                    ? "border-he-celeste"
                    : "border-he-negro/20 focus:border-he-celeste"
                }`}
              />
            </div>

            {error && (
              <div className="text-sm text-he-rojo bg-he-rojo/10 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-he-rojo hover:bg-he-rojo-light disabled:opacity-60 disabled:cursor-not-allowed text-white py-4 rounded text-base font-medium transition-colors"
            >
              {loading ? "Procesando..." : "Quiero aportar mensualmente"}
            </button>

            <p className="text-xs text-he-negro/50 text-center leading-relaxed">
              El pago se procesa a través de Mercado Pago. Podés cancelar tu
              aporte en cualquier momento.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
