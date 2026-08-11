"use client";

import { useEffect, useRef, useState } from "react";

const FONT_CYCLE = [
  "'Times New Roman', Georgia, serif",
  "'Courier New', Courier, monospace",
  "Impact, 'Arial Black', sans-serif",
  "Georgia, serif",
  "Palatino, 'Palatino Linotype', serif",
  "'Courier New', monospace",
  "Georgia, 'Times New Roman', serif",
  "Impact, fantasy",
];

const FINAL_FONT = "var(--font-anonymous-pro), monospace";
const TICK = 110;

export default function ManifiestoTeaser() {
  const ref = useRef<HTMLDivElement>(null);
  const [fontFamily, setFontFamily] = useState(FONT_CYCLE[0]);
  const [settled, setSettled] = useState(false);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Con movimiento reducido no hay ruleta: se muestra la tipografía final.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setFontFamily(FINAL_FONT);
      setSettled(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setTriggered(true);
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!triggered || settled) return;

    // Recorrido fijo, no aleatorio: dos veces la misma tipografía seguidas se
    // lee como que la animación se colgó.
    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i >= FONT_CYCLE.length) {
        clearInterval(interval);
        setFontFamily(FINAL_FONT);
        setSettled(true);
      } else {
        setFontFamily(FONT_CYCLE[i]);
      }
    }, TICK);

    return () => clearInterval(interval);
  }, [triggered, settled]);

  return (
    <section ref={ref} className="py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        <div className="bg-he-negro aspect-video flex flex-col items-center justify-center gap-5 rounded-sm">
          <p className="text-he-blanco/35 text-xs font-medium tracking-[2px] uppercase">
            Nuestro manifiesto
          </p>
          <h2
            style={{ fontFamily }}
            data-cycling={triggered && !settled}
            /* El blur funde una tipografía con la siguiente: sin él se ven dos
               palabras distintas superponiéndose. Al asentarse, se limpia. */
            className="he-h2 text-4xl md:text-6xl font-medium text-he-blanco text-center px-8
                       transition-[filter,opacity] duration-[260ms] ease-out
                       data-[cycling=true]:blur-[1.5px] data-[cycling=true]:opacity-80"
          >
            próximamente
          </h2>
        </div>
      </div>
    </section>
  );
}
