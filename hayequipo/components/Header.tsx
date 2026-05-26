"use client";

import Link from "next/link";
import { useState } from "react";
import DonacionModal from "./DonacionModal";

export default function Header() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <header className="relative z-20 border-b border-he-negro/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10 py-5">
          <Link
            href="/"
            className="hover:opacity-70 transition"
            aria-label="Hay Equipo — inicio"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="Hay Equipo" height={28} className="h-7 w-auto" />
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm text-he-negro/60">
            <Link href="/nosotros" className="hover:text-he-negro transition">
              Nosotros
            </Link>
            <Link href="/sumate" className="hover:text-he-negro transition">
              Sumate
            </Link>
            <Link href="/#donar" className="hover:text-he-negro transition">
              Apoyar
            </Link>
          </nav>

          <button
            onClick={() => setModalOpen(true)}
            className="bg-he-rojo hover:bg-he-rojo-light transition-colors text-white px-5 py-2 rounded text-sm font-medium"
          >
            Donar
          </button>
        </div>
      </header>

      <DonacionModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
