/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#101B33',
          light: '#1B2A4A',
          dark: '#0B1324',
        },
        gold: {
          DEFAULT: '#F5C84C',
          hover: '#E5B83C',
          light: '#FEF9E7',
        },
        mist: '#F3F5F8',
        slate: {
          500: '#64748B',
        },
        border: '#E2E8F0',
        success: {
          DEFAULT: '#16A36A',
          light: '#E8F7F0',
        },
        warning: {
          DEFAULT: '#D99A16',
          light: '#FEF8EA',
        },
        danger: {
          DEFAULT: '#E45B65',
          light: '#FDEDEE',
        },
      },
      boxShadow: {
        soft: '0 12px 35px rgba(16, 27, 51, 0.06)',
        subtle: '0 2px 8px rgba(16, 27, 51, 0.04)',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '20px',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
