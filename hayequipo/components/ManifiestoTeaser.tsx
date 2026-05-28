"use client";

import { useEffect, useRef, useState } from "react";

const FONT_CYCLE = [
  "'Times New Roman', Georgia, serif",
  "'Courier New', Courier, monospace",
  "Impact, 'Arial Black', sans-serif",
  "Georgia, serif",
  "'Courier New', monospace",
  "Palatino, 'Palatino Linotype', serif",
  "'Courier New', monospace",
  "Georgia, 'Times New Roman', serif",
  "Impact, fantasy",
  "var(--font-dm-sans), system-ui, sans-serif", // final
];

export default function ManifiestoTeaser() {
  const ref = useRef<HTMLDivElement>(null);
  const [fontFamily, setFontFamily] = useState(FONT_CYCLE[0]);
  const [settled, setSettled] = useState(false);
  const [triggered, setTriggered] = useState(false);

  // Trigger animation when section enters viewport
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

  // Font cycling animation
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
        const randomIndex = Math.floor(Math.random() * (FONT_CYCLE.length - 1));
        setFontFamily(FONT_CYCLE[randomIndex]);
      }
    }, 110);
    return () => clearInterval(interval);
  }, [triggered, settled]);

  return (
    <section ref={ref} className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="relative max-w-3xl mx-auto">
          {/* Celeste outer frame */}
          <div className="absolute inset-0 bg-he-celeste rotate-[-2deg] rounded-sm" />
          {/* Inner white panel */}
          <div className="relative bg-he-blanco rotate-[1.5deg] mx-7 my-7 py-24 md:py-32 flex flex-col items-center justify-center gap-4 rounded-sm">
            <h2
              style={{ fontFamily }}
              className="text-3xl md:text-4xl font-medium text-he-negro text-center px-8"
            >
              Nuestro manifiesto
            </h2>
            <p className="font-anon text-sm text-he-negro/45 tracking-wide">
              próximamente
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
