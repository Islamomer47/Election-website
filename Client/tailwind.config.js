const flowbite = require("flowbite-react/tailwind");
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", flowbite.content()],
  theme: {
    extend: {
      fontFamily: {
        amiri: ["Amiri", "serif"],
        kalam: ["Kalam", "cursive"],
        sriracha: ["Sriracha", "cursive"],
      },
    },
  },
  plugins: [flowbite.plugin()],
};
