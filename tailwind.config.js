/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        lightgreen: "#C7D7D3",
        white: "#fff",
        lightgray: "rgba(213, 213, 213, 0.76)",
        teal: "#0D564F", //
        teal100: "#257f6d", 
        teal200: "#04675f",
        darkgray: "#9d9d9d",
        darkslategray: {
          100: "#145959",
          200: "#0d564f",
          300: "#134848",
          400: "#074e48",
          500: "rgba(7, 78, 72, 0.12)",
        },
        black: "#000",
        gray: {
          100: "#7a7d85",
          200: "rgba(255, 255, 255, 0.09)",
          300: "rgba(255, 255, 255, 0.64)",
          400: "rgba(218, 218, 218, 0.04)",
        },
        gainsboro: {
          100: "#e4e5e7",
          200: "rgba(217, 217, 217, 0.08)",
        },
        cadetblue: "#799f9c",
        azure: "#eeffff",
        paleturquoise: "#afe2c9",
        darkseagreen: "#77b6a2",
      },
      fontFamily: {
        poppins: "Poppins",
        montserrat: "Montserrat",
        buthick: ["Buthick", "sans-serif"],
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
};
