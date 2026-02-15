import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: "#E8A824",
          50: "#FDF8E8",
          100: "#FAEFC5",
          200: "#F5DF8B",
          300: "#F0CF51",
          400: "#E8A824",
          500: "#D49A1F",
          600: "#B07E19",
          700: "#8C6313",
          800: "#68490E",
          900: "#443008",
        },
        dark: {
          DEFAULT: "#0c0b09",
          50: "#2a2820",
          100: "#222018",
          200: "#1a1912",
          300: "#15140e",
          400: "#11100c",
          500: "#0c0b09",
          600: "#0a0906",
          700: "#070604",
          800: "#040402",
          900: "#020201",
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
