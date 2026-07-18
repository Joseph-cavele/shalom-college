import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0a1a3c",
          50: "#eef2f9",
          700: "#0e2450",
          800: "#0b1c40",
          900: "#081633",
          light: "#13306a",
        },
        brand: {
          green: "#35b233",
          "green-dark": "#2b9329",
          blue: "#1f9fd8",
          gold: "#f5a623",
        },
      },
      fontFamily: {
        sans: ["Segoe UI", "system-ui", "-apple-system", "Roboto", "Arial", "sans-serif"],
      },
      boxShadow: {
        card: "0 6px 24px rgba(10, 26, 60, 0.08)",
        lg2: "0 18px 50px rgba(10, 26, 60, 0.18)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease both",
        "fade-in": "fade-in 0.6s ease both",
        "scale-in": "scale-in 0.45s ease both",
        float: "float 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
