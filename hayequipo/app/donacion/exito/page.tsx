import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "¡Gracias! — Hay Equipo",
};

export default function ExitoPage() {
  return (
    <main>
      <Header />

      <section className="min-h-[70vh] flex items-center">
        <div className="max-w-2xl mx-auto px-6 md:px-10 py-20 text-center">
          <div className="text-6xl mb-6">💙</div>
          <h1 className="text-4xl md:text-5xl font-medium leading-tight mb-5">
            <span className="he-highlight text-he-negro">¡Gracias!</span>
          </h1>
          <p className="text-lg md:text-xl text-he-blanco/80 leading-relaxed mb-8">
            Tu aporte hace posible que Hay Equipo siga existiendo y pueda
            cambiar la cultura de poder de Argentina. En unos minutos vas a
            recibir la confirmación por email.
          </p>
          <Link
            href="/"
            className="inline-block border border-white/30 hover:bg-white/5 transition text-he-blanco px-7 py-4 rounded text-base font-medium"
          >
            Volver al inicio
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
