import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-24">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="text-xl font-medium tracking-tight mb-3">
              hayequipo<span className="text-he-rojo">.</span>
            </div>
            <p className="text-sm text-he-blanco/60 max-w-xs leading-relaxed">
              Detectamos, formamos y potenciamos a jóvenes líderes con vocación
              pública para transformar Argentina.
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest text-he-blanco/40 mb-4">
              Navegación
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/nosotros"
                  className="text-he-blanco/80 hover:text-he-blanco transition"
                >
                  Nosotros
                </Link>
              </li>
              <li>
                <Link
                  href="/sumate"
                  className="text-he-blanco/80 hover:text-he-blanco transition"
                >
                  Sumate
                </Link>
              </li>
              <li>
                <Link
                  href="/#donar"
                  className="text-he-blanco/80 hover:text-he-blanco transition"
                >
                  Red de Apoyo
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest text-he-blanco/40 mb-4">
              Contacto
            </h4>
            <a
              href="mailto:hayequipo2030@gmail.com"
              className="text-sm text-he-blanco/80 hover:text-he-blanco transition block"
            >
              hayequipo2030@gmail.com
            </a>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/5 text-xs text-he-blanco/40">
          © {new Date().getFullYear()} Fundación Hay Equipo. Todos los derechos
          reservados.
        </div>
      </div>
    </footer>
  );
}
