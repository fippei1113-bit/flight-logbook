/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  // Safelist all dynamic Tailwind classes used by the color-scheme picker.
  // (Tailwind's JIT scanner can't see classes built from variables like `bg-${color}-500`.)
  safelist: [
    {
      pattern:
        /^(bg|text|border)-(amber|emerald|rose|teal|indigo|slate|sky|violet|fuchsia|pink|orange|cyan|lime|yellow|red|blue|green|zinc)-(300|400|500)(\/[0-9]+)?$/,
    },
    {
      pattern:
        /^bg-(amber|emerald|rose|teal|indigo|slate|sky|violet|fuchsia|pink|orange|cyan|lime|yellow|red|blue|green|zinc)-500\/(10|20|25)$/,
    },
    {
      pattern:
        /^border-(amber|emerald|rose|teal|indigo|slate|sky|violet|fuchsia|pink|orange|cyan|lime|yellow|red|blue|green|zinc)-500\/40$/,
    },
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Times New Roman"', 'serif'],
        sans: ['Inter', '"Hiragino Sans"', '"Yu Gothic UI"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
