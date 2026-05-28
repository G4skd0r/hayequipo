import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        he: {
          celeste: "#23A1D5",
          "celeste-light": "#68B3D0",
          rojo: "#ED615F",
          "rojo-light": "#E04942",
          amarillo: "#FFBE00",
          negro: "#161616",
          blanco: "#F2EDEB",
        },
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-pangram)", "var(--font-dm-sans)", "sans-serif"],
        anon: ["var(--font-anonymous-pro)", "monospace"],
      },
      animation: {
        "spin-slow": "spin 60s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
