import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        green1: {
          100: "#F4F8F7",
          200: "#E9F0EE",
          300: "#D4E2DD",
          400: "#BED3CC",
          500: "#AFC8BF",
          600: "#3F937C",
          700: "#347866",
          800: "#285E50",
          900: "#1D4339",
          1000: "#102720",
        },
      },
    },
  },
  plugins: [],
};
export default config;
