import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        vision: {
          bg: "#0F1535", // Fondo principal oscuro
          card: "rgba(17, 28, 68, 0.7)", // Fondo base de tarjetas
          blue: "#0075FF", // Acento principal
          purple: "#7756FC", // Acento secundario
          teal: "#01B574", // Éxito
          red: "#EE5D50", // Error
          gray: {
            400: "#A0AEC0",
            500: "#718096",
          },
        },
      },
      backgroundImage: {
        "vision-main": "linear-gradient(225deg, #0F1535 0%, #060B26 100%)",
        "vision-glass":
          "linear-gradient(127.09deg, rgba(6, 11, 40, 0.94) 19.41%, rgba(10, 14, 35, 0.49) 76.65%)",
        "vision-active":
          "linear-gradient(127.09deg, rgba(6, 11, 40, 0.94) 19.41%, rgba(10, 14, 35, 0.69) 76.65%)",
        "vision-brand": "linear-gradient(135deg, #0075FF 0%, #7756FC 100%)",
      },
      boxShadow: {
        "vision-glass": "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },
    },
  },
  plugins: [],
};

export default config;
