import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "rgb(255 255 255 / 0.95)",
        foreground: "#171717",
      },
      fontFamily: {
        sans: ['"Red Hat Text"', "sans-serif"],
      },
      keyframes: {
        "scale-down": {
          "0%": { transform: "scale(1.5)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        "scale-down": "scale-down 0.5s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
