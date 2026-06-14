import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg:       'rgb(var(--c-bg) / <alpha-value>)',
        card:     'rgb(var(--c-card) / <alpha-value>)',
        raised:   'rgb(var(--c-raised) / <alpha-value>)',
        line:     'rgb(var(--c-line) / <alpha-value>)',
        primary:  'rgb(var(--c-text) / <alpha-value>)',
        muted:    'rgb(var(--c-muted) / <alpha-value>)',
        accent:   'rgb(var(--c-accent) / <alpha-value>)',
        gold:     'rgb(var(--c-gold) / <alpha-value>)',
        positive: 'rgb(var(--c-positive) / <alpha-value>)',
        shine:    'rgb(var(--c-shine) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'pulse-dot': { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.3' } },
      },
      animation: {
        'pulse-dot': 'pulse-dot 1.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
export default config
