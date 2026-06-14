import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  title: 'DK26 Simüle — 2026 FIFA Dünya Kupası',
  description: '2026 FIFA Dünya Kupası canlı sonuçları, puan durumları ve simülatörü. Hangi takım şampiyon olur? Şimdi simüle et!',
  keywords: ['dünya kupası 2026', 'FIFA WC2026', 'simülatör', 'tahmin', 'grup puan durumu'],
  openGraph: {
    title: 'DK26 Simüle — 2026 FIFA Dünya Kupası Simülatörü',
    description: 'Dünya Kupası 2026 gruplarını, elemeleri ve şampiyonu simüle et.',
    siteName: 'DK26 Simüle by RakuApp',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <nav className="sticky top-0 z-50 border-b border-border bg-bg/95 backdrop-blur-sm">
          <div className="mx-auto flex max-w-6xl items-center gap-1 px-4 py-0">
            {/* Logo */}
            <Link href="/" className="mr-4 flex items-center gap-2 py-3">
              <span className="text-xl">🏆</span>
              <span className="font-bold text-white text-sm tracking-tight">DK<span className="text-accent">26</span> Simüle</span>
            </Link>

            {/* Nav links */}
            <NavLink href="/">📊 Canlı & Gruplar</NavLink>
            <NavLink href="/simule">🎲 Simülatör</NavLink>

            <div className="ml-auto flex items-center gap-2">
              <a
                href="https://rakuapp.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-card border border-border px-3 py-1 text-xs font-semibold text-muted hover:text-white hover:border-accent/50 transition-all"
              >
                by RakuApp
              </a>
            </div>
          </div>
        </nav>
        <main>{children}</main>
        <footer className="mt-20 border-t border-border py-10 text-center text-xs text-muted">
          <div className="mx-auto max-w-4xl px-4">
            <div className="mb-4 flex flex-wrap items-center justify-center gap-4">
              <a href="https://rakuapp.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">RakuApp</a>
              <span>·</span>
              <a href="https://biroluruz.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">#biroluruz Tahmin Oyunu</a>
              <span>·</span>
              <a href="https://kafi-nu.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Kafi Coffee</a>
            </div>
            <p className="opacity-60">© 2026 DK26 Simüle — <span className="text-accent font-semibold">RakuApp</span> tarafından yapıldı</p>
            <p className="mt-1 opacity-40">Veriler football-data.org API'sinden alınmaktadır · Simüle edilen sonuçlar gerçeği yansıtmaz</p>
          </div>
        </footer>
      </body>
    </html>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-card hover:text-white"
    >
      {children}
    </Link>
  )
}
