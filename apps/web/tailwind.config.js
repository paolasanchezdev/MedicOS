/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/core/**/*.{js,ts,jsx,tsx}",
    "./src/panels/**/*.{js,ts,jsx,tsx}",
    "./src/modules/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        medicos: {
          lightBg: '#EAF7FB',    // Tu color #EAF7FB
          softBlue: '#BFEAF2',   // Tu color #BFEAF2
          cyan: '#63C9D6',       // Tu color #63C9D6
          teal: '#1E7F8C',       // Tu color #1E7F8C
          darkBlue: '#20343A',   // Tu color #20343A
        }
      }
    },
  },
  plugins: [],
}