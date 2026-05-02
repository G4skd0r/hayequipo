import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Hubo un problema — Hay Equipo",
};

export default function ErrorPage() {
  return (
    <main>
      <Header />

      <section className="min-h-[70vh] flex items-center">
        <div className="max-w-2xl mx-auto px-6 md:px-10 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-medium leading-tight mb-5">
            Hubo un problema con el pago.
          </h1>
          <p className="text-lg text-he-blanco/75 leading-relaxed mb-8">
            El pago no se pudo procesar. Podés intentarlo de nuevo desde el
            inicio, o escribirnos a{" "}
            <a
              href="mailto:hayequipo2030@gmail.com"
              className="text-he-celeste underline"
            >
              hayequipo2030@gmail.com
            </a>{" "}
            si el problema persiste.
          </p>
          <Link
            href="/#donar"
            className="inline-block bg-he-rojo hover:bg-he-rojo-light transition-colors text-white px-7 py-4 rounded text-base font-medium"
          >
            Volver a intentar
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
