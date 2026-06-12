/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Lora', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        cream: {
          50:  'var(--cream-50)',
          100: 'var(--cream-100)',
          200: 'var(--cream-200)',
          300: 'var(--cream-300)',
          400: 'var(--cream-400)',
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
