import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sun from "@/components/Sun";
import FormularioSumate from "@/components/FormularioSumate";

export const metadata = {
  title: "Sumate — Hay Equipo",
  description:
    "Si sentís vocación pública y ganas de formarte, Hay Equipo puede ser tu lugar.",
};

export default function SumatePage() {
  return (
    <main>
      <Header />

      <section className="relative overflow-hidden">
        <Sun
          className="absolute -top-16 -right-32 w-[400px] h-[400px] opacity-[0.05] pointer-events-none"
          color="#F2EDEB"
          strokeWidth={3}
          spin
        />

        <div className="max-w-4xl mx-auto px-6 md:px-10 pt-16 md:pt-24 pb-16 md:pb-20 relative z-10">
          <div className="he-eyebrow text-he-celeste text-xs font-medium tracking-[1.5px] mb-5 uppercase">
            Sumate
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.05] tracking-tight mb-6">
            Si tenés{" "}
            <span className="he-highlight text-he-negro">vocación pública</span>
            , Hay Equipo puede ser tu lugar.
          </h1>
          <p className="text-lg md:text-xl text-he-blanco/75 leading-relaxed max-w-2xl">
            Contanos un poco de vos. Nos ponemos en contacto para conocerte
            mejor y entender si hay un encuentro posible con la red.
          </p>
        </div>
      </section>

      <section className="border-t border-white/10">
        <div className="max-w-2xl mx-auto px-6 md:px-10 py-16 md:py-20">
          <FormularioSumate />
        </div>
      </section>

      <Footer />
    </main>
  );
}
