import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sun from "@/components/Sun";
import FormularioSumate from "@/components/FormularioSumate";

export const metadata = {
  title: "Conocé más — Hay Equipo",
  description:
    "Dejanos tu contacto: te contamos más sobre Hay Equipo o sobre cómo sumarte como miembro.",
};

export default function SumatePage() {
  return (
    <main>
      <Header />

      <section className="relative overflow-hidden">
        <Sun
          className="absolute -top-16 -right-32 w-[400px] h-[400px] opacity-[0.05] pointer-events-none"
          color="#161616"
          strokeWidth={3}
          spin
        />

        <div className="max-w-4xl mx-auto px-6 md:px-10 pt-16 md:pt-24 pb-16 md:pb-20 relative z-10">
          <div className="he-eyebrow text-he-celeste text-xs font-medium tracking-[1.5px] mb-5 uppercase">
            Conocé más
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.05] tracking-tight mb-6">
            Si lo que te contamos{" "}
            <span className="he-highlight text-he-negro">resuena con vos</span>{" "}
            y querés más información, dejanos tu contacto.
          </h1>
          <p className="text-lg md:text-xl text-he-negro/65 leading-relaxed max-w-2xl">
            Tanto si querés entender un poco más qué es Hay Equipo, como si
            pensás que puede ser un buen lugar para vos y querés sumarte como
            miembro, dejanos tu info y nosotros nos contactamos.
          </p>
          <p className="text-base text-he-negro/50 leading-relaxed max-w-2xl mt-4">
            Dejar tus datos acá no te compromete a nada: no es la inscripción al
            proceso de incorporación, es el primer contacto. Si más adelante
            querés sumarte como miembro, tené en cuenta que los miembros pagan
            una cuota mensual para ser parte.
          </p>
        </div>
      </section>

      <section className="border-t border-he-negro/10">
        <div className="max-w-2xl mx-auto px-6 md:px-10 py-16 md:py-20">
          <FormularioSumate />
        </div>
      </section>

      <Footer />
    </main>
  );
}
