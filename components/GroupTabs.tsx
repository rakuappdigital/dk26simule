'use client'

import { useState } from 'react'
import { Match, StandingGroup, StandingsRow } from '@/lib/types'
import { formatMatchDate, statusLabel } from '@/lib/utils'

const GROUP_KEYS = ['A','B','C','D','E','F','G','H','I','J','K','L']

interface Props {
  matches: Match[]
  standings: StandingGroup[]
}

export default function GroupTabs({ matches, standings }: Props) {
  const [active, setActive] = useState('A')

  const standingMap: Record<string, StandingsRow[]> = {}
  standings.forEach(s => {
    if (s.group) {
      const key = s.group.replace('GROUP_', '')
      standingMap[key] = s.table
    }
  })

  const groupMatches = matches.filter(
    m => m.stage === 'GROUP_STAGE' && m.group === `GROUP_${active}`
  )

  const finished   = groupMatches.filter(m => m.status === 'FINISHED')
  const upcoming   = groupMatches.filter(m => m.status !== 'FINISHED')
  const rows       = standingMap[active] ?? []

  return (
    <div>
      {/* Group tab buttons */}
      <div className="mb-6 flex flex-wrap gap-1.5">
        {GROUP_KEYS.map(g => (
          <button
            key={g}
            onClick={() => setActive(g)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-all ${
              active === g
                ? 'bg-accent text-white shadow-md shadow-accent/20'
                : 'border border-border bg-card text-muted hover:border-accent/40 hover:text-white'
            }`}
          >
            Grup {g}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Standings */}
        <div>
          <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted">Puan Durumu</h2>
          {rows.length > 0 ? (
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-white/[.02] text-xs text-muted">
                    <th className="py-2 pl-4 text-left font-semibold">#</th>
                    <th className="py-2 text-left font-semibold">Takım</th>
                    <th className="py-2 text-center font-semibold">O</th>
                    <th className="py-2 text-center font-semibold">G</th>
                    <th className="py-2 text-center font-semibold">B</th>
                    <th className="py-2 text-center font-semibold">M</th>
                    <th className="py-2 text-center font-semibold">Av</th>
                    <th className="py-2 pr-4 text-center font-semibold text-gold">P</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={row.team.id} className="border-b border-white/[.03] last:border-0 hover:bg-white/[.02] transition-colors">
                      <td className="py-2.5 pl-4 text-sm">
                        <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${
                          i < 2 ? 'bg-accent text-white' : i === 2 ? 'bg-gold text-black' : 'bg-border text-muted'
                        }`}>{row.position}</span>
                      </td>
                      <td className="py-2.5">
                        <div className="flex items-center gap-2">
                          <img src={row.team.crest} alt="" className="h-5 w-5 object-contain" />
                          <span className="text-sm font-medium">{row.team.shortName}</span>
                        </div>
                      </td>
                      <td className="py-2.5 text-center text-sm text-muted">{row.playedGames}</td>
                      <td className="py-2.5 text-center text-sm text-muted">{row.won}</td>
                      <td className="py-2.5 text-center text-sm text-muted">{row.draw}</td>
                      <td className="py-2.5 text-center text-sm text-muted">{row.lost}</td>
                      <td className="py-2.5 text-center text-sm text-muted">
                        {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                      </td>
                      <td className="py-2.5 pr-4 text-center font-bold text-gold">{row.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="border-t border-border px-4 py-2 text-xs text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-accent"></span>İlk 2 → Eleme turuna geçer
                </span>
                <span className="ml-4 inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-gold"></span>3. sıra → Play-off şansı
                </span>
              </div>
            </div>
          ) : (
            <EmptyCard message="Puan durumu henüz yok" />
          )}
        </div>

        {/* Matches */}
        <div>
          {/* Upcoming */}
          {upcoming.length > 0 && (
            <div className="mb-6">
              <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted">Yaklaşan Maçlar</h2>
              <div className="flex flex-col gap-2">
                {upcoming.map(m => <MatchRow key={m.id} match={m} />)}
              </div>
            </div>
          )}

          {/* Finished */}
          {finished.length > 0 && (
            <div>
              <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted">Biten Maçlar</h2>
              <div className="flex flex-col gap-2">
                {finished.slice().reverse().map(m => <MatchRow key={m.id} match={m} />)}
              </div>
            </div>
          )}

          {groupMatches.length === 0 && (
            <EmptyCard message="Bu grup için maç verisi henüz yok" />
          )}
        </div>
      </div>
    </div>
  )
}

function MatchRow({ match: m }: { match: Match }) {
  const { text, cls } = statusLabel(m.status)
  const isFinished = m.status === 'FINISHED'
  const hScore = m.score.fullTime.home
  const aScore = m.score.fullTime.away
  const hasScore = hScore !== null && aScore !== null

  return (
    <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
      isFinished ? 'border-border bg-card/60' : 'border-border bg-card hover:border-accent/30'
    }`}>
      {/* Date / status */}
      <div className="w-20 flex-shrink-0 text-xs text-center">
        {isFinished
          ? <span className="text-muted">{formatMatchDate(m.utcDate).split(',')[0]}</span>
          : <span className={cls}>{text === 'Planlandı' ? formatMatchDate(m.utcDate) : text}</span>
        }
      </div>

      {/* Home */}
      <div className="flex flex-1 items-center justify-end gap-2 truncate">
        <span className="truncate text-sm font-semibold">{m.homeTeam.shortName}</span>
        <img src={m.homeTeam.crest} alt="" className="h-6 w-6 flex-shrink-0 object-contain" />
      </div>

      {/* Score */}
      <div className="flex w-16 flex-shrink-0 items-center justify-center gap-1 text-base font-bold">
        {hasScore ? (
          <>
            <span className={hScore! > aScore! ? 'text-white' : 'text-muted'}>{hScore}</span>
            <span className="text-border">:</span>
            <span className={aScore! > hScore! ? 'text-white' : 'text-muted'}>{aScore}</span>
          </>
        ) : (
          <span className="text-muted text-xs">{formatMatchDate(m.utcDate).split(',').pop()?.trim()}</span>
        )}
      </div>

      {/* Away */}
      <div className="flex flex-1 items-center gap-2 truncate">
        <img src={m.awayTeam.crest} alt="" className="h-6 w-6 flex-shrink-0 object-contain" />
        <span className="truncate text-sm font-semibold">{m.awayTeam.shortName}</span>
      </div>

      {/* Matchday */}
      <div className="w-6 flex-shrink-0 text-center text-xs text-muted">{m.matchday}</div>
    </div>
  )
}

function EmptyCard({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-border bg-card px-6 py-8 text-center text-sm text-muted">
      {message}
    </div>
  )
}
