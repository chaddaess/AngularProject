/** @type {import('tailwindcss').Config} */
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
  plugins: [],
};
