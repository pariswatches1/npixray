import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary blue — professional, clean
        gold: {
          DEFAULT: "#2F5EA8",
          50: "#EEF3FB",
          100: "#D6E2F5",
          200: "#ADC5EB",
          300: "#7FA4DC",
          400: "#4F82CC",
          500: "#2F5EA8",
          600: "#264D8C",
          700: "#1E3D70",
          800: "#162D54",
          900: "#0E1D38",
        },
        // Teal accent — for highlights and charts
        teal: {
          DEFAULT: "#22C1A1",
          50: "#ECFDF7",
          100: "#D1FAE5",
          200: "#A7F3D0",
          300: "#6EE7B7",
          400: "#34D399",
          500: "#22C1A1",
          600: "#1A9A80",
          700: "#137360",
          800: "#0D4D40",
          900: "#062620",
        },
        // Light surfaces — replaces old dark scale
        dark: {
          DEFAULT: "#F4F7FB",
          50: "#D8E0ED",
          100: "#E0E6F0",
          200: "#E9EEF6",
          300: "#EEF2F8",
          400: "#F4F7FB",
          500: "#F8FAFB",
          600: "#FAFBFD",
          700: "#FCFDFE",
          800: "#FEFEFE",
          900: "#FFFFFF",
        },
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
