import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeccionDonacion from "@/components/SeccionDonacion";
import Sun from "@/components/Sun";
import ManifiestoTeaser from "@/components/ManifiestoTeaser";

export default function HomePage() {
  return (
    <main>
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <Sun
          className="absolute -top-20 -right-36 w-[420px] h-[420px] opacity-[0.06] pointer-events-none"
          color="#161616"
          strokeWidth={3}
          spin
        />

        <div className="max-w-7xl mx-auto px-6 md:px-10 pt-16 md:pt-24 pb-20 md:pb-28 relative z-10">
          <div className="he-eyebrow text-he-celeste text-xs font-medium tracking-[1.5px] mb-5 uppercase">
            Hay Equipo · 2026
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-[64px] font-medium leading-[1.02] tracking-tight max-w-5xl mb-7">
            Para 2030, ocupar{" "}
            <span className="he-highlight text-he-negro">
              1.000 espacios de poder
            </span>{" "}
            liderados por una nueva generación de argentinos.
          </h1>

          <p className="text-lg md:text-xl text-he-negro/65 leading-relaxed max-w-2xl">
            Detectamos, formamos y potenciamos a jóvenes líderes con vocación
            pública para ocupar espacios de transformación real. Somos una red.
            Somos una identidad compartida. Somos el cambio del paradigma de
            poder.{" "}
            <Link
              href="/nosotros"
              className="hidden sm:inline ml-8 text-sm text-he-celeste hover:text-he-celeste/70 underline underline-offset-4 transition"
            >
              Conocer más
            </Link>
          </p>

          {/* Mobile only: botones */}
          <div className="flex flex-col gap-3 mt-8 sm:hidden">
            <Link
              href="#donar"
              className="bg-he-rojo hover:bg-he-rojo-light transition-colors text-white px-7 py-4 rounded text-base font-medium text-center"
            >
              Sumarme a la Red de Apoyo
            </Link>
            <Link
              href="/nosotros"
              className="border border-he-negro/30 hover:bg-he-negro/5 transition text-he-negro px-7 py-4 rounded text-base font-medium text-center"
            >
              Conocer más
            </Link>
            <Link
              href="/sumate"
              className="bg-he-celeste hover:opacity-85 transition text-white px-7 py-4 rounded text-base font-medium text-center"
            >
              Sumarme como miembro
            </Link>
          </div>
        </div>
      </section>

      {/* MANIFIESTO */}
      <ManifiestoTeaser />

      {/* DONACIÓN */}
      <SeccionDonacion />

      <Footer />
    </main>
  );
}
