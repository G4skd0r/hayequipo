import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeccionDonacion from "@/components/SeccionDonacion";
import Sun from "@/components/Sun";

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
            Para 2030,{" "}
            <span className="he-highlight text-he-negro">
              1.000 espacios de poder
            </span>{" "}
            liderados por una nueva generación de argentinos.
          </h1>

          <p className="text-lg md:text-xl text-he-negro/65 leading-relaxed max-w-2xl mb-9">
            Detectamos, formamos y potenciamos a jóvenes líderes con vocación
            pública para ocupar espacios de transformación real. Somos una red.
            Somos una identidad compartida. Somos el cambio del paradigma de
            poder.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
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
          </div>
        </div>
      </section>

      {/* STATS / 4 EJES BREVE */}
      <section className="border-t border-he-negro/10">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6">
            <Pilar
              titulo="Autoconocimiento"
              desc="Estrategia de posicionamiento personal de cada líder."
            />
            <Pilar
              titulo="Habilidades"
              desc="Desarrollo personal, planificación estratégica y comunicación."
            />
            <Pilar
              titulo="Vinculación"
              desc="Red de confianza entre pares y acceso a tomadores de decisión."
            />
            <Pilar
              titulo="Agenda de país"
              desc="Formación y acceso directo a sectores estratégicos."
            />
          </div>
        </div>
      </section>

      {/* DONACIÓN */}
      <SeccionDonacion />

      <Footer />
    </main>
  );
}

function Pilar({ titulo, desc }: { titulo: string; desc: string }) {
  return (
    <div>
      <div className="text-he-rojo text-xs font-medium tracking-[1.5px] uppercase mb-3">
        &gt;&gt;
      </div>
      <h3 className="text-lg font-medium mb-2">{titulo}</h3>
      <p className="text-sm text-he-negro/60 leading-relaxed">{desc}</p>
    </div>
  );
}
