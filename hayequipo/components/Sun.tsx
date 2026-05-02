"use client";

interface SunProps {
  className?: string;
  color?: string;
  strokeWidth?: number;
  spin?: boolean;
}

export default function Sun({
  className = "",
  color = "#F2EDEB",
  strokeWidth = 3,
  spin = false,
}: SunProps) {
  return (
    <svg
      viewBox="0 0 1080 1080"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${spin ? "animate-spin-slow" : ""}`}
      aria-hidden="true"
    >
      <circle
        cx="540"
        cy="540"
        r="200"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
      />
      <g stroke={color} strokeWidth={strokeWidth} strokeLinecap="round">
        <line x1="540" y1="180" x2="540" y2="280" />
        <line x1="540" y1="800" x2="540" y2="900" />
        <line x1="180" y1="540" x2="280" y2="540" />
        <line x1="800" y1="540" x2="900" y2="540" />
        <line x1="280" y1="280" x2="360" y2="360" />
        <line x1="720" y1="720" x2="800" y2="800" />
        <line x1="800" y1="280" x2="720" y2="360" />
        <line x1="360" y1="720" x2="280" y2="800" />
        <line x1="420" y1="200" x2="460" y2="290" />
        <line x1="620" y1="790" x2="660" y2="880" />
        <line x1="200" y1="620" x2="290" y2="660" />
        <line x1="790" y1="420" x2="880" y2="460" />
      </g>
    </svg>
  );
}
