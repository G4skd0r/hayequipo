"use client";

import { useState } from "react";
import DonacionModal from "./DonacionModal";
import Sun from "./Sun";

export default function SeccionDonacion() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section
        id="donar"
        className="bg-he-blanco text-he-negro relative overflow-hidden"
      >
        <Sun
          className="absolute -bottom-40 -left-28 w-[380px] h-[380px] opacity-[0.04] pointer-events-none"
          color="#161616"
          strokeWidth={4}
          spin
        />

        <div className="max-w-6xl mx-auto px-6 md:px-10 py-20 md:py-28 relative z-10">
          <h2 className="text-4xl md:text-5xl font-medium leading-[1.05] tracking-tight mb-5 flex items-center gap-3 flex-wrap">
            Sumate a la Red de Apoyo
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="#23A1D5"
              aria-hidden="true"
              className="flex-shrink-0"
            >
              <path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 11c0 5.5-7 10-7 10z" />
            </svg>
          </h2>

          <p className="text-base md:text-lg text-he-negro/70 leading-relaxed max-w-2xl mb-12">
            Hacer política de otra manera tiene un costo real: producir
            contenido, organizar encuentros, sostener una comunidad. Todo eso
            es posible con el apoyo de los que creen en el proyecto.{" "}
            <span className="he-highlight font-medium">
              Si podés y querés, elegí el nivel que más te cierre y sumate.
            </span>
          </p>

          <div className="h-px bg-he-negro/15 mb-12" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
            <Tier
              monto="$5.000"
              frase="Para que no falte el café de las reuniones."
            />
            <Tier
              monto="$10.000"
              frase="Para que las ideas lleguen más lejos."
            />
            <Tier
              monto="$20.000"
              frase="Para que formemos más líderes."
            />
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <button
              onClick={() => setModalOpen(true)}
              className="bg-he-rojo hover:bg-he-rojo-light transition-colors text-white px-8 py-4 rounded text-base font-medium w-full md:w-auto"
            >
              Quiero aportar mensualmente
            </button>
            <p className="text-sm text-he-negro/60">
              Aporte mensual vía Mercado Pago. Cancelás cuando quieras.
            </p>
          </div>
        </div>
      </section>

      <DonacionModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}

function Tier({ monto, frase }: { monto: string; frase: string }) {
  return (
    <div className="flex flex-col items-start">
      <div className="bg-he-negro text-he-blanco w-full text-center py-6 px-5 rounded-lg mb-5 tracking-widest text-sm font-medium">
        {monto} POR MES
      </div>
      <p className="text-lg md:text-xl font-medium leading-snug">
        <span className="he-highlight">{frase}</span>
      </p>
    </div>
  );
}
