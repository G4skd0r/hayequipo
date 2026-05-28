"use client";

import { useState } from "react";
import DonacionModal from "./DonacionModal";

export default function SeccionDonacion() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section id="donar" className="bg-he-blanco text-he-negro relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-20 md:py-28">

          <h2 className="text-4xl md:text-5xl font-medium leading-[1.05] tracking-tight mb-5 flex items-center gap-3">
            Ayudanos a transformar Argentina{" "}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f1e6-1f1f7.svg"
              alt="🇦🇷"
              className="inline-block w-10 h-10 align-middle"
            />
          </h2>

          <p className="text-base md:text-lg text-he-negro/70 leading-relaxed max-w-2xl mb-14">
            Hacerlo tiene un costo real: producir contenido, organizar
            encuentros, sostener una comunidad. Todo eso es posible con el
            apoyo de los que creen en el proyecto.{" "}
            <span className="he-highlight font-medium">
              Elegí el nivel que más te cierre y sumate.
            </span>
          </p>

          {/* Persona */}
          <div className="mb-14">
            <p className="he-eyebrow text-he-celeste text-sm font-semibold tracking-[1.5px] uppercase mb-8">
              Quiero apoyar siendo una persona
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <TierPersona
                monto="$ 7.500"
                frase="Para que no falte el café en las reuniones."
                bg="bg-he-rojo"
                textColor="text-white"
                onClick={() => setModalOpen(true)}
              />
              <TierPersona
                monto="$ 20.000"
                frase="Para que las ideas lleguen más lejos."
                bg="bg-he-amarillo"
                textColor="text-he-negro"
                onClick={() => setModalOpen(true)}
              />
              <TierPersona
                monto="TU MONTO IDEAL"
                frase="Para que formemos más personas."
                bg="bg-he-celeste"
                textColor="text-white"
                onClick={() => setModalOpen(true)}
                esLibre
              />
            </div>
          </div>

          <div className="h-px bg-he-negro/10 mb-14" />

          {/* Organización */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div>
              <p className="he-eyebrow text-he-celeste text-sm font-semibold tracking-[1.5px] uppercase mb-3">
                Quiero apoyar siendo una organización
              </p>
              <p className="text-lg md:text-xl font-medium leading-snug max-w-xl">
                Si representás una empresa o institución y querés ser parte,
                hablemos y encontramos el formato ideal.
              </p>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="bg-he-negro hover:bg-he-negro/85 transition-colors text-he-blanco px-8 py-4 rounded text-base font-medium whitespace-nowrap flex-shrink-0"
            >
              Charlemos
            </button>
          </div>

        </div>
      </section>

      <DonacionModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}

function TierPersona({
  monto,
  frase,
  bg,
  textColor,
  onClick,
  esLibre = false,
}: {
  monto: string;
  frase: string;
  bg: string;
  textColor: string;
  onClick: () => void;
  esLibre?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-start text-left group w-full"
    >
      <div
        className={`${bg} ${textColor} w-full flex flex-col items-center justify-center text-center h-32 px-5 rounded-lg mb-4 tracking-widest text-xl font-bold transition-opacity group-hover:opacity-85`}
      >
        {monto}
        {!esLibre && <span className="text-xs font-normal tracking-wide block mt-1 opacity-75">POR MES</span>}
      </div>
      <p className="text-base text-he-negro/75 leading-snug px-1">{frase}</p>
    </button>
  );
}
