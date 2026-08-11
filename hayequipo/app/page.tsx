import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeccionDonacion from "@/components/SeccionDonacion";
import Sun from "@/components/Sun";
import ManifiestoTeaser from "@/components/ManifiestoTeaser";

/** El escalonado es corto a propósito: más de ~80ms entre elementos y la
 *  página se siente lenta en vez de viva. */
const delay = (ms: number) => ({ "--he-delay": `${ms}ms` }) as React.CSSProperties;

export default function HomePage() {
  return (
    <main>
      <Header />

      {/* HERO */}
      <section id="contenido" className="relative overflow-hidden">
        <Sun
          className="absolute -top-20 -right-36 w-[420px] h-[420px] opacity-[0.06] pointer-events-none"
          color="#161616"
          strokeWidth={3}
          spin
        />

        <div className="max-w-7xl mx-auto px-6 md:px-10 pt-16 md:pt-24 pb-20 md:pb-28 relative z-10">
          <div
            className="he-reveal he-eyebrow text-he-celeste text-xs font-medium tracking-[1.5px] mb-5 uppercase"
            style={delay(0)}
          >
            Hay Equipo · 2026
          </div>

          <h1
            className="he-reveal he-display text-4xl md:text-6xl lg:text-[64px] font-medium max-w-5xl mb-7"
            style={delay(60)}
          >
            Una nueva generación ocupando{" "}
            <span className="he-highlight text-he-negro">
              espacios de poder
            </span>{" "}
            para transformar Argentina.
          </h1>

          <p
            className="he-reveal he-body text-lg md:text-xl text-he-negro/65 leading-relaxed max-w-2xl"
            style={delay(120)}
          >
            Detectamos, formamos y potenciamos a jóvenes líderes con vocación
            pública para ocupar espacios de transformación real. Somos una red.
            Somos una identidad compartida. Somos el cambio del paradigma de
            poder.{" "}
            <Link
              href="/nosotros"
              className="hidden sm:inline ml-8 text-sm text-he-celeste hover:text-he-celeste/70 underline underline-offset-4 decoration-he-celeste/40 hover:decoration-he-celeste transition-colors duration-150"
            >
              Quiénes somos
            </Link>
          </p>

          {/* Mobile only: botones */}
          <div
            className="he-reveal flex flex-col gap-3 mt-8 sm:hidden"
            style={delay(180)}
          >
            <Link
              href="#donar"
              className="he-press bg-he-rojo hover:bg-he-rojo-light text-white px-7 py-4 rounded text-base font-medium text-center"
            >
              Sumarme a la Red de Apoyo
            </Link>
            <Link
              href="/nosotros"
              className="he-press border border-he-negro/30 hover:bg-he-negro/5 text-he-negro px-7 py-4 rounded text-base font-medium text-center"
            >
              Quiénes somos
            </Link>
            <Link
              href="/sumate"
              className="he-press bg-he-celeste hover:opacity-85 text-white px-7 py-4 rounded text-base font-medium text-center"
            >
              Quiero saber más
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
