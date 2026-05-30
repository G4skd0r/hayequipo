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
  "var(--font-anonymous-pro), monospace", // final
];

export default function ManifiestoTeaser() {
  const ref = useRef<HTMLDivElement>(null);
  const [fontFamily, setFontFamily] = useState(FONT_CYCLE[0]);
  const [settled, setSettled] = useState(false);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setTriggered(true); },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!triggered || settled) return;
    let count = 0;
    const total = FONT_CYCLE.length - 1;
    const interval = setInterval(() => {
      count++;
      if (count >= total) {
        clearInterval(interval);
        setFontFamily(FONT_CYCLE[FONT_CYCLE.length - 1]);
        setSettled(true);
      } else {
        setFontFamily(FONT_CYCLE[Math.floor(Math.random() * (FONT_CYCLE.length - 1))]);
      }
    }, 110);
    return () => clearInterval(interval);
  }, [triggered, settled]);

  return (
    <section ref={ref} className="py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        <div className="bg-he-negro aspect-video flex flex-col items-center justify-center gap-5">
          <p className="text-he-blanco/35 text-xs font-medium tracking-[2px] uppercase">
            Nuestro manifiesto
          </p>
          <h2
            style={{ fontFamily }}
            className="text-4xl md:text-6xl font-medium text-he-blanco text-center px-8"
          >
            próximamente
          </h2>
        </div>
      </div>
    </section>
  );
}
