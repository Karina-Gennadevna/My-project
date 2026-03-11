/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        base:     '#080A0C',
        surface:  '#0F1215',
        elevated: '#161B20',
        overlay:  '#1C2229',
        accent: {
          DEFAULT: '#F97316',
          hover:   '#EA6C0A',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      keyframes: {
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'draw-polygon': {
          '0%':   { opacity: '0', transform: 'scale(0.2)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-up':      'fade-up 0.6s cubic-bezier(0.16,1,0.3,1) forwards',
        'draw-polygon': 'draw-polygon 0.9s cubic-bezier(0.16,1,0.3,1) forwards',
      },
    },
  },
  plugins: [],
};
