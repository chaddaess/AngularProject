/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss");
module.exports = {
  content: ["./src/**/*/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          hover: '#1D4ED8',
          focus: '#93C5FD',
          red: '#c50000',
        },
        secondary: {
          light: '#F9FAFB',
          DEFAULT: '#D1D5DB',
          dark: '#374151',
          darker: '#1F2937',
        },
        text: {
          dark: '#111827',
          light: '#FFFFFF',
          placeholder: '#9CA3AF',
        },
        background: {
          dark: '#1F2937',
        },
        focusRing: '#2563EB',
        error: '#EF4444',
      },
    },
  },
  plugins: [
    plugin(function ({ addBase, theme }) {
      addBase({
        ':root': {
          '--primary': theme('colors.primary.DEFAULT'),
          '--primary-hover': theme('colors.primary.hover'),
          '--primary-focus': theme('colors.primary.focus'),
          '--primary-red': theme('colors.primary.red'),
          '--secondary-light': theme('colors.secondary.light'),
          '--secondary': theme('colors.secondary.DEFAULT'),
          '--secondary-dark': theme('colors.secondary.dark'),
          '--secondary-darker': theme('colors.secondary.darker'),
          '--text-dark': theme('colors.text.dark'),
          '--text-light': theme('colors.text.light'),
          '--text-placeholder': theme('colors.text.placeholder'),
          '--background-dark': theme('colors.background.dark'),
          '--focus-ring': theme('colors.focusRing'),
          '--error': theme('colors.error'),
        },
      });
    }),
  ],};
