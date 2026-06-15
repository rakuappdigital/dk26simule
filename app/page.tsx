import { fetchMatches } from '@/lib/football-api'
import { Match, StandingGroup } from '@/lib/types'
import { formatMatchDate, statusLabel, isLive } from '@/lib/utils'
import { computeStandings, liveTeamIds } from '@/lib/standings'
import GroupTabs from '@/components/GroupTabs'

export const revalidate = 60

export default async function Home() {
  let matches: Match[] = []
  let standings: StandingGroup[] = []
  let liveIds: number[] = []
  let apiError = ''

  try {
    const mData = await fetchMatches()
    matches = mData.matches ?? []
    standings = computeStandings(matches)
    liveIds = [...liveTeamIds(matches)]
  } catch (e) {
    apiError = e instanceof Error ? e.message : 'Veri alınamadı'
  }

  const liveMatches = matches.filter(m => isLive(m.status))

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Page headline */}
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-primary">
          2026 FIFA Dünya Kupası
        </h1>
        <p className="mt-1.5 text-sm text-muted">
          Canlı sonuçlar · Puan durumları · Maç takvimi
        </p>
      </div>

      {/* Error */}
      {apiError && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/8 px-4 py-3 text-sm text-red-400">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" className="shrink-0 opacity-80">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" />
          </svg>
          {apiError}
        </div>
      )}

      {/* Live banner */}
      {liveMatches.length > 0 && (
        <section className="mb-10">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse-dot rounded-full bg-positive" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-positive">
              Şu An Oynanıyor
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {liveMatches.map(m => <LiveCard key={m.id} match={m} />)}
          </div>
        </section>
      )}

      {/* Divider */}
      <div className="mb-8 h-px w-full bg-line/50" />

      {/* Groups */}
      <GroupTabs matches={matches} standings={standings} liveIds={liveIds} />
    </div>
  )
}

function LiveCard({ match: m }: { match: Match }) {
  const { text, cls } = statusLabel(m.status)
  const h = m.score.fullTime.home
  const a = m.score.fullTime.away

  return (
    <div className="rounded-xl border border-positive/20 bg-card p-4 shadow-md shadow-positive/5">
      <div className={`mb-3 flex items-center gap-1.5 text-xs font-bold ${cls}`}>
        <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-positive" />
        {text}
      </div>
      <div className="flex items-center gap-3">
        {/* Home */}
        <div className="flex flex-1 items-center gap-2 overflow-hidden">
          <img src={m.homeTeam.crest} alt="" className="h-7 w-7 object-contain" />
          <span className="truncate text-sm font-semibold text-primary">{m.homeTeam.shortName}</span>
        </div>
        {/* Score */}
        <div className="flex shrink-0 items-center gap-1 font-mono text-xl font-bold">
          <span className={h! > a! ? 'text-primary' : 'text-muted'}>{h ?? '—'}</span>
          <span className="text-line text-base">:</span>
          <span className={a! > h! ? 'text-primary' : 'text-muted'}>{a ?? '—'}</span>
        </div>
        {/* Away */}
        <div className="flex flex-1 items-center justify-end gap-2 overflow-hidden">
          <span className="truncate text-sm font-semibold text-primary">{m.awayTeam.shortName}</span>
          <img src={m.awayTeam.crest} alt="" className="h-7 w-7 object-contain" />
        </div>
      </div>
      <p className="mt-3 text-center text-xs text-muted">{formatMatchDate(m.utcDate)}</p>
    </div>
  )
}
