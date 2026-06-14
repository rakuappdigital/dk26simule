'use client'

import { useTheme } from './ThemeProvider'

export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button
      onClick={toggle}
      aria-label="Temayı değiştir"
      className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-muted transition-all hover:border-accent/40 hover:text-primary"
    >
      {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="10" cy="10" r="4"/>
      <line x1="10" y1="1.5" x2="10" y2="3.5"/>
      <line x1="10" y1="16.5" x2="10" y2="18.5"/>
      <line x1="1.5" y1="10" x2="3.5" y2="10"/>
      <line x1="16.5" y1="10" x2="18.5" y2="10"/>
      <line x1="4.1" y1="4.1" x2="5.5" y2="5.5"/>
      <line x1="14.5" y1="14.5" x2="15.9" y2="15.9"/>
      <line x1="4.1" y1="15.9" x2="5.5" y2="14.5"/>
      <line x1="14.5" y1="5.5" x2="15.9" y2="4.1"/>
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M17.5 12.5A7.5 7.5 0 0 1 7.5 2.5a7.5 7.5 0 1 0 10 10z"/>
    </svg>
  )
}
