import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeccionDonacion from "@/components/SeccionDonacion";
import Sun from "@/components/Sun";

export const metadata = {
  title: "Nosotros — Hay Equipo",
  description:
    "Somos una generación de jóvenes argentinos con vocación pública y el sueño de transformar el país.",
};

export default function NosotrosPage() {
  return (
    <main>
      <Header />

      {/* HERO INTERIOR */}
      <section className="relative overflow-hidden border-b border-he-negro/10">
        <Sun
          className="absolute -top-10 -right-32 w-[360px] h-[360px] opacity-[0.05] pointer-events-none"
          color="#161616"
          strokeWidth={3}
          spin
        />

        <div className="max-w-5xl mx-auto px-6 md:px-10 pt-16 md:pt-20 pb-16 md:pb-20 relative z-10">
          <div className="he-eyebrow text-he-celeste text-xs font-medium tracking-[1.5px] mb-5 uppercase">
            Nosotros
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.05] tracking-tight max-w-4xl">
            Creemos que la{" "}
            <span className="he-highlight text-he-negro">
              cultura del poder
            </span>{" "}
            en Argentina se puede cambiar.
          </h1>
        </div>
      </section>

      {/* QUIÉNES SOMOS */}
      <section className="border-b border-he-negro/10">
        <div className="max-w-5xl mx-auto px-6 md:px-10 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
            <div>
              <h2 className="text-xs uppercase tracking-[1.5px] text-he-rojo font-medium mb-3">
                &gt;&gt; Quiénes somos
              </h2>
            </div>
            <div className="md:col-span-2 space-y-5 text-lg leading-relaxed text-he-negro/80">
              <p>
                Somos una generación de jóvenes argentinos nacidos en
                democracia, con vocación pública y el sueño de transformar
                nuestro país.
              </p>
              <p>
                Hay Equipo es una Organización de la Sociedad Civil que detecta,
                acompaña y conecta a jóvenes líderes del sector público y
                privado, dotándolos de herramientas de liderazgo, una identidad
                compartida y una red de confianza para ocupar espacios de
                transformación real.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VISIÓN */}
      <section className="border-b border-he-negro/10">
        <div className="max-w-5xl mx-auto px-6 md:px-10 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
            <div>
              <h2 className="text-xs uppercase tracking-[1.5px] text-he-rojo font-medium mb-3">
                &gt;&gt; Nuestra visión
              </h2>
            </div>
            <div className="md:col-span-2 space-y-5 text-lg leading-relaxed text-he-negro/80">
              <p>
                Imaginamos una Argentina donde los espacios de influencia estén
                ocupados por ciudadanos íntegros, con conocimiento profundo del
                país y capacidad de construcción colectiva.
              </p>
              <p>
                Impulsamos un{" "}
                <span className="he-highlight font-medium">
                  nuevo paradigma de poder
                </span>
                : liderazgos constructivos, visión a largo plazo y valores
                compartidos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* QUÉ HACEMOS */}
      <section className="border-b border-he-negro/10">
        <div className="max-w-5xl mx-auto px-6 md:px-10 py-20">
          <h2 className="text-xs uppercase tracking-[1.5px] text-he-rojo font-medium mb-10">
            &gt;&gt; Qué hacemos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-x-16 md:gap-y-14">
            <Eje
              numero="01"
              titulo="Autoconocimiento para la acción"
              desc="Trabajamos con cada líder para que construya su propia estrategia de posicionamiento y desarrollo personal y profesional."
            />
            <Eje
              numero="02"
              titulo="Habilidades para liderar"
              desc="Aportamos herramientas de desarrollo personal, planificación estratégica, metodología, profesionalismo y comunicación."
            />
            <Eje
              numero="03"
              titulo="Conectar para potenciar"
              desc="Enredamos a los líderes entre sí y con actores influyentes de la vida pública. La red es parte de la formación."
            />
            <Eje
              numero="04"
              titulo="Conocer para gestionar"
              desc="Formamos líderes con mirada común sobre el desarrollo del país: agroindustria, energía, economía del conocimiento, turismo, cultura y gestión pública."
            />
          </div>
        </div>
      </section>

      {/* PACTO CULTURAL */}
      <section className="border-b border-he-negro/10">
        <div className="max-w-5xl mx-auto px-6 md:px-10 py-20">
          <h2 className="text-xs uppercase tracking-[1.5px] text-he-rojo font-medium mb-6">
            &gt;&gt; Pacto cultural
          </h2>
          <p className="text-2xl md:text-3xl font-medium leading-snug max-w-3xl">
            Confianza · Honestidad · Pluralismo · Democracia · Fraternidad ·
            Trascendencia · Igualitarismo.
          </p>
        </div>
      </section>

      {/* DONACIÓN */}
      <SeccionDonacion />

      <Footer />
    </main>
  );
}

function Eje({
  numero,
  titulo,
  desc,
}: {
  numero: string;
  titulo: string;
  desc: string;
}) {
  return (
    <div>
      <div className="text-he-celeste text-sm font-medium tracking-widest mb-3">
        {numero}
      </div>
      <h3 className="text-xl md:text-2xl font-medium mb-3 leading-tight">
        {titulo}
      </h3>
      <p className="text-base text-he-negro/65 leading-relaxed">{desc}</p>
    </div>
  );
}
