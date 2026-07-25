/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        jungle: {
          DEFAULT: '#12463D',
          light: '#1D6B5A',
          dark: '#0B2E28',
        },
        sunset: {
          DEFAULT: '#E2632B',
          light: '#F08752',
          dark: '#B84A1C',
        },
        sand: {
          DEFAULT: '#F1E7D3',
          dark: '#E4D4B5',
        },
        cream: '#FAF7F1',
        ink: '#1C2521',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Manrope"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};