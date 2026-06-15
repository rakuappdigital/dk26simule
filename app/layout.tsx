import type { Metadata } from 'next'
import Link from 'next/link'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/ThemeProvider'
import { ThemeToggle } from '@/components/ThemeToggle'
import NavLinks from '@/components/NavLinks'
import './globals.css'

export const metadata: Metadata = {
  title: 'DK26 Simüle — 2026 FIFA Dünya Kupası',
  description: '2026 FIFA Dünya Kupası canlı sonuçları, puan durumları ve simülatörü. Hangi takım şampiyon olur?',
  keywords: ['dünya kupası 2026', 'FIFA WC2026', 'simülatör', 'tahmin', 'puan durumu'],
  openGraph: {
    title: 'DK26 Simüle — 2026 Dünya Kupası Simülatörü',
    description: 'Grupları, elemeleri ve şampiyonu kendin simüle et.',
    siteName: 'DK26 Simüle by RakuApp',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" data-theme="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        {/* Prevent theme flash before React hydrates */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('dk26-theme')||'dark';document.documentElement.setAttribute('data-theme',t)})()`,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          {/* ── Navigation ─────────────────────────────────── */}
          <header className="sticky top-0 z-50 border-b border-line/60 bg-bg/90 backdrop-blur-md">
            <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2.5 shrink-0">
                <TrophySVG className="h-7 w-auto text-gold" />
                <span className="text-sm font-bold tracking-tight text-primary">
                  DK<span className="text-accent">26</span>
                  <span className="ml-1 font-semibold text-muted">Simüle</span>
                </span>
              </Link>

              {/* Center nav */}
              <div className="flex-1 flex justify-center">
                <NavLinks />
              </div>

              {/* Right controls */}
              <div className="flex items-center gap-2 shrink-0">
                <ThemeToggle />
              </div>
            </div>
          </header>

          {/* ── Page content ───────────────────────────────── */}
          <main>{children}</main>

          <Analytics />

          {/* ── Footer ─────────────────────────────────────── */}
          <footer className="mt-24 border-t border-line/50 py-12">
            <div className="mx-auto max-w-6xl px-6">
              <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
                {/* Branding */}
                <div className="flex items-center gap-3">
                  <TrophySVG className="h-6 w-auto text-gold opacity-60" />
                  <div>
                    <p className="text-sm font-bold text-primary">DK26 Simüle</p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
                      <img
                        src="/raku-logo.png"
                        alt="RakuApp"
                        className="h-3.5 w-auto raku-logo opacity-50"
                      />
                      RakuApp tarafından yapıldı
                    </p>
                  </div>
                </div>

                {/* Other apps */}
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
                    Diğer Uygulamalarımız
                  </p>
                  <div className="flex flex-col gap-2">
                    {[
                      { href: 'https://elemento-tr.vercel.app', label: 'Elemento', desc: 'Elementlerle Oyna' },
                      { href: 'https://paginapasaj.vercel.app', label: 'Pagina Pasaj', desc: 'Günlük kitap pasajı aparatınız' },
                      { href: 'https://biroluruz.vercel.app', label: '#biroluruz', desc: 'Gerçek zamanlı Dünya Kupası tahmin oyunu' },
                    ].map(app => (
                      <a
                        key={app.href}
                        href={app.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-baseline gap-2"
                      >
                        <span className="text-sm font-semibold text-primary group-hover:text-accent transition-colors">{app.label}</span>
                        <span className="text-xs text-muted">{app.desc}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  )
}

/* ── Custom SVG Components ───────────────────────────────── */

function TrophySVG({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 30 38"
      fill="none"
      className={className}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Top rim */}
      <rect x="4.5" y="1" width="21" height="4" rx="2" fill="currentColor" />
      {/* Cup body */}
      <path
        d="M5 5 L5 22 Q5 30 15 31.5 Q25 30 25 22 L25 5 Z"
        fill="currentColor"
        fillOpacity="0.92"
      />
      {/* Globe overlay on cup */}
      <circle cx="15" cy="18" r="6.5" stroke="rgba(0,0,0,0.18)" strokeWidth="0.9" fill="none" />
      <ellipse cx="15" cy="18" rx="3.8" ry="6.5" stroke="rgba(0,0,0,0.18)" strokeWidth="0.9" fill="none" />
      <line x1="8.5" y1="18" x2="21.5" y2="18" stroke="rgba(0,0,0,0.18)" strokeWidth="0.9" />
      {/* Left handle */}
      <path
        d="M5 8 C2.2 8 0.5 10.2 0.5 13.5 C0.5 16.8 2.2 19 5 19"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
      {/* Right handle */}
      <path
        d="M25 8 C27.8 8 29.5 10.2 29.5 13.5 C29.5 16.8 27.8 19 25 19"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
      {/* Stem */}
      <rect x="12" y="31.5" width="6" height="4" rx="1" fill="currentColor" />
      {/* Base */}
      <rect x="7" y="35.5" width="16" height="3" rx="1.5" fill="currentColor" fillOpacity="0.85" />
    </svg>
  )
}

function RakuDot() {
  return (
    <svg width="6" height="6" viewBox="0 0 6 6" aria-hidden="true">
      <circle cx="3" cy="3" r="3" fill="rgb(var(--c-accent))" />
    </svg>
  )
}
