const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  mode: "jit",
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        ibm: ["IBM Plex Sans", ...fontFamily.mono],
      },
      keyframes: {
        shake: {
          "0%, 100%": { "margin-left": "0rem" },
          "25%": { "margin-left": "0.5rem" },
          "75%": { "margin-left": "-0.5rem" },
        },
      },
      animation: {
        shake: "shake 0.2s ease-in-out 0s 2",
      },
      colors: {
        "gray-925": "#171717",
        "gray-875": "#1A1A1A",
        "gray-825": "#252525",
        "gray-750": "#323232",
        "gray-450": "#8C8C8C",
      },
    },
  },
  variants: {
    extend: {
      opacity: ["disabled"],
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
