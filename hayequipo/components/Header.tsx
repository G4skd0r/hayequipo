"use client";

import Link from "next/link";
import { useState } from "react";
import DonacionModal from "./DonacionModal";

export default function Header() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <header className="relative z-20 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10 py-5">
          <Link
            href="/"
            className="text-xl font-medium tracking-tight hover:opacity-80 transition"
          >
            hayequipo<span className="text-he-rojo">.</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm text-he-blanco/70">
            <Link href="/nosotros" className="hover:text-he-blanco transition">
              Nosotros
            </Link>
            <Link href="/sumate" className="hover:text-he-blanco transition">
              Sumate
            </Link>
            <Link href="#donar" className="hover:text-he-blanco transition">
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
