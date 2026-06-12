/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Lora', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        cream: {
          50:  '#FDFAF6',
          100: '#F7F3EE',
          200: '#EFE8DF',
          300: '#E4DAD0',
          400: '#D4C8BC',
        },
        atlas: {
          dark:  '#2C3548',
          navy:  '#1E2535',
          warm:  '#78716C',
          muted: '#A8A29E',
          light: '#F0EBE3',
        },
      },
    },
  },
  plugins: [],
}
