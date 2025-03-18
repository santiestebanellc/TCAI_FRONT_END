/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{html,ts}",
    ],
    theme: {
      extend: {
        fontFamily: {
          montserrat: ["var(--font-montserrat)"],
          "work-sans": ["var(--font-work-sans)"],
        },
      },
    },
    plugins: [],
  };