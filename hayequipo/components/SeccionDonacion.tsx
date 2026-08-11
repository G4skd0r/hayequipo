"use client";

import { useRef, useState } from "react";
import DonacionModal from "./DonacionModal";

export default function SeccionDonacion() {
  const [modalOpen, setModalOpen] = useState(false);
  // El foco vuelve al control que abrió el modal, no al principio del documento.
  const triggerRef = useRef<HTMLElement | null>(null);

  const abrir = (e: React.MouseEvent<HTMLElement>) => {
    triggerRef.current = e.currentTarget;
    setModalOpen(true);
  };

  return (
    <>
      <section id="donar" className="bg-he-blanco text-he-negro relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-20 md:py-28">

          <h2 className="he-h2 text-4xl md:text-5xl font-medium mb-5 flex items-center gap-3">
            Ayudanos a transformar Argentina{" "}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/bandera-ar.svg"
              alt=""
              width={40}
              height={40}
              className="inline-block w-10 h-10 align-middle shrink-0"
            />
          </h2>

          <p className="he-body text-base md:text-lg text-he-negro/70 leading-relaxed max-w-2xl mb-14">
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
                frase="Para que sigamos construyendo desde abajo."
                bg="bg-he-rojo"
                textColor="text-white"
                onClick={abrir}
              />
              <TierPersona
                monto="$ 20.000"
                frase="Para que las ideas lleguen más lejos."
                bg="bg-he-amarillo"
                textColor="text-he-negro"
                onClick={abrir}
              />
              <TierPersona
                monto="TU MONTO IDEAL"
                frase="Para que formemos más personas."
                bg="bg-he-celeste"
                textColor="text-white"
                onClick={abrir}
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
              <p className="he-body text-lg md:text-xl font-medium leading-snug max-w-xl">
                Si representás una empresa o institución y querés ser parte,
                hablemos y encontramos el formato ideal.
              </p>
            </div>
            <button
              onClick={abrir}
              className="he-press bg-he-negro hover:bg-he-negro/85 text-he-blanco px-8 py-4 rounded text-base font-medium whitespace-nowrap flex-shrink-0"
            >
              Charlemos
            </button>
          </div>

        </div>
      </section>

      <DonacionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        returnFocusTo={triggerRef}
      />
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
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  esLibre?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-start text-left group w-full"
    >
      <div
        className={`${bg} ${textColor} he-lift w-full flex flex-col items-center justify-center text-center h-32 px-5 rounded-lg mb-4 tracking-widest text-xl font-bold`}
      >
        {monto}
        {!esLibre && <span className="text-xs font-normal tracking-wide block mt-1 opacity-75">POR MES</span>}
      </div>
      <p className="he-body text-base text-he-negro/75 leading-snug px-1">{frase}</p>
    </button>
  );
}
