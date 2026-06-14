'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

interface ThemeCtxValue {
  theme: Theme
  toggle: () => void
}

const Ctx = createContext<ThemeCtxValue>({ theme: 'dark', toggle: () => {} })

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    const stored = (localStorage.getItem('dk26-theme') as Theme) ?? 'dark'
    setTheme(stored)
    document.documentElement.setAttribute('data-theme', stored)
  }, [])

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('dk26-theme', next)
    document.documentElement.setAttribute('data-theme', next)
  }

  return <Ctx.Provider value={{ theme, toggle }}>{children}</Ctx.Provider>
}

export const useTheme = () => useContext(Ctx)
