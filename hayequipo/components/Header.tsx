"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import DonacionModal from "./DonacionModal";

export default function Header() {
  const [modalOpen, setModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const donarRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        setScrolled(window.scrollY > 8);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <a
        href="#contenido"
        className="he-skip bg-he-negro text-he-blanco px-4 py-2 rounded text-sm font-medium"
      >
        Saltar al contenido
      </a>

      <header
        className="he-header sticky top-0 z-30"
        data-scrolled={scrolled}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10 py-5">
          <Link
            href="/"
            className="he-press inline-flex hover:opacity-70"
            aria-label="Hay Equipo — inicio"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="Hay Equipo" height={28} className="h-7 w-auto" />
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm text-he-negro/60">
            <Link href="/nosotros" className="he-navlink hover:text-he-negro">
              Nosotros
            </Link>
            <Link href="/sumate" className="he-navlink hover:text-he-negro">
              Conocé más
            </Link>
            <Link href="/#donar" className="he-navlink hover:text-he-negro">
              Apoyar
            </Link>
          </nav>

          <button
            ref={donarRef}
            onClick={() => setModalOpen(true)}
            className="he-press bg-he-rojo hover:bg-he-rojo-light text-white px-5 py-2 rounded text-sm font-medium"
          >
            Donar
          </button>
        </div>
      </header>

      <DonacionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        returnFocusTo={donarRef}
      />
    </>
  );
}
