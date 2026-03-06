import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          base: '#121212',
          surface: '#1F1F1F',
          elevated: '#252525',
        },
        border: {
          subtle: '#2A2A2A',
          default: '#333333',
        },
        text: {
          primary: '#E6E6E6',
          secondary: '#B8B8B8',
          muted: '#707070',
        },
        accent: {
          DEFAULT: '#1F5F5B',
          light: '#2A7A75',
          dim: 'rgba(31, 95, 91, 0.15)',
          glow: 'rgba(31, 95, 91, 0.25)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        '2xs': '0.65rem',
        xs: '0.75rem',
      },
      borderRadius: {
        card: '12px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.4)',
        glow: '0 0 20px rgba(31, 95, 91, 0.2)',
      },
    },
  },
  plugins: [],
}

export default config
