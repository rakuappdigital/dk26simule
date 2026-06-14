'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/', label: 'Canlı & Gruplar', icon: ChartBarsIcon },
  { href: '/simule', label: 'Simülatör', icon: DiceIcon },
]

export default function NavLinks() {
  const path = usePathname()
  return (
    <nav className="flex items-center gap-0.5">
      {NAV.map(({ href, label, icon: Icon }) => {
        const active = path === href
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
              active
                ? 'bg-accent/10 text-accent'
                : 'text-muted hover:bg-shine/5 hover:text-primary'
            }`}
          >
            <Icon active={active} />
            <span>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

function ChartBarsIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="currentColor" aria-hidden="true">
      <rect x="1" y="9" width="4" height="8" rx="1.2" opacity={active ? 1 : 0.7}/>
      <rect x="7" y="5" width="4" height="12" rx="1.2"/>
      <rect x="13" y="1" width="4" height="16" rx="1.2"/>
    </svg>
  )
}

function DiceIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="16" height="16" rx="3.5" stroke="currentColor" strokeWidth="1.6" opacity={active ? 1 : 0.85}/>
      <circle cx="6" cy="6" r="1.2" fill="currentColor"/>
      <circle cx="12" cy="6" r="1.2" fill="currentColor"/>
      <circle cx="9" cy="9" r="1.2" fill="currentColor"/>
      <circle cx="6" cy="12" r="1.2" fill="currentColor"/>
      <circle cx="12" cy="12" r="1.2" fill="currentColor"/>
    </svg>
  )
}
