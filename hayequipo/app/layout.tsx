import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hay Equipo — Una nueva generación de líderes para Argentina",
  description:
    "Detectamos, formamos y potenciamos a jóvenes líderes con vocación pública para ocupar espacios de transformación real en Argentina.",
  openGraph: {
    title: "Hay Equipo",
    description:
      "Para 2050, 300 espacios de poder liderados por una nueva generación de líderes argentinos.",
    type: "website",
    locale: "es_AR",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={dmSans.variable}>
      <body className="bg-he-negro text-he-blanco">{children}</body>
    </html>
  );
}
