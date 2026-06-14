import { fetchMatches, fetchStandings } from '@/lib/football-api'
import { Match, StandingGroup } from '@/lib/types'
import { formatMatchDate, statusLabel, isLive } from '@/lib/utils'
import GroupTabs from '@/components/GroupTabs'

export const revalidate = 60

export default async function Home() {
  let matches: Match[] = []
  let standings: StandingGroup[] = []
  let error = ''

  try {
    const [mData, sData] = await Promise.all([fetchMatches(), fetchStandings()])
    matches = mData.matches ?? []
    standings = sData.standings ?? []
  } catch (e) {
    error = e instanceof Error ? e.message : 'Veri alınamadı'
  }

  const liveMatches = matches.filter(m => isLive(m.status))

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">2026 FIFA Dünya Kupası</h1>
        <p className="mt-1 text-sm text-muted">Canlı sonuçlar · Puan durumları · Maç takvimi</p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          ⚠️ {error}
        </div>
      )}

      {/* Live matches banner */}
      {liveMatches.length > 0 && (
        <section className="mb-8">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-400"></span>
            <h2 className="text-sm font-bold uppercase tracking-wider text-green-400">Şu An Oynanıyor</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {liveMatches.map(m => (
              <LiveMatchCard key={m.id} match={m} />
            ))}
          </div>
        </section>
      )}

      {/* Group tabs section */}
      <GroupTabs matches={matches} standings={standings} />
    </div>
  )
}

function LiveMatchCard({ match: m }: { match: Match }) {
  const { text, cls } = statusLabel(m.status)
  return (
    <div className="rounded-xl border border-green-500/20 bg-card p-4 shadow-lg shadow-green-500/5">
      <div className={`mb-2 text-xs font-semibold ${cls}`}>{text}</div>
      <div className="flex items-center gap-3">
        <div className="flex flex-1 items-center gap-2 truncate">
          <img src={m.homeTeam.crest} alt="" className="h-6 w-6 object-contain" />
          <span className="truncate text-sm font-semibold">{m.homeTeam.shortName}</span>
        </div>
        <div className="flex items-center gap-1 text-lg font-bold text-white">
          <span>{m.score.fullTime.home ?? '—'}</span>
          <span className="text-muted">:</span>
          <span>{m.score.fullTime.away ?? '—'}</span>
        </div>
        <div className="flex flex-1 items-center justify-end gap-2 truncate">
          <span className="truncate text-sm font-semibold">{m.awayTeam.shortName}</span>
          <img src={m.awayTeam.crest} alt="" className="h-6 w-6 object-contain" />
        </div>
      </div>
      <div className="mt-2 text-xs text-muted text-center">{formatMatchDate(m.utcDate)}</div>
    </div>
  )
}
