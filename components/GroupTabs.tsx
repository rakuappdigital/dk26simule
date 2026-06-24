'use client'

import { useState } from 'react'
import { Match, StandingGroup, StandingsRow } from '@/lib/types'
import { formatMatchDate, statusLabel } from '@/lib/utils'

const GROUPS = ['A','B','C','D','E','F','G','H','I','J','K','L']

interface Props {
  matches: Match[]
  standings: StandingGroup[]
  liveIds: number[]
}

export default function GroupTabs({ matches, standings, liveIds }: Props) {
  const [active, setActive] = useState('A')
  const liveSet = new Set(liveIds)

  const standingMap: Record<string, StandingsRow[]> = {}
  standings.forEach(s => {
    standingMap[s.group] = s.table
  })

  const groupMatches = matches.filter(
    m => m.stage === 'GROUP_STAGE' && m.group === `GROUP_${active}`
  )
  const finished = groupMatches.filter(m => m.status === 'FINISHED').slice().reverse()
  const upcoming = groupMatches.filter(m => m.status !== 'FINISHED')
  const rows = standingMap[active] ?? []
  const statuses = qualStatuses(rows)

  return (
    <div>
      {/* Group selector */}
      <div className="mb-6 flex flex-wrap gap-1.5">
        {GROUPS.map(g => (
          <button
            key={g}
            onClick={() => setActive(g)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-all ${
              active === g
                ? 'bg-accent text-white shadow-sm'
                : 'border border-line bg-card text-muted hover:border-accent/40 hover:text-primary'
            }`}
          >
            Grup {g}
          </button>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        {/* Standings */}
        <section>
          <SectionLabel>Puan Durumu</SectionLabel>
          {rows.length > 0 ? (
            <div className="overflow-hidden rounded-xl border border-line bg-card shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-line bg-raised/60">
                    <th className="py-2.5 pl-4 text-left text-xs font-semibold uppercase tracking-wider text-muted">#</th>
                    <th className="py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-muted">Takım</th>
                    {['O','G','B','M','Av','P'].map(h => (
                      <th key={h} className={`py-2.5 text-center text-xs font-semibold uppercase tracking-wider ${h === 'P' ? 'pr-4 text-gold' : 'text-muted'}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/50">
                  {rows.map((row, i) => (
                    <tr key={row.team.id} className="group transition-colors hover:bg-raised/40">
                      <td className="py-3 pl-4">
                        <div className="flex items-center gap-1">
                          <PosBadge pos={i + 1} />
                          <QualDot status={statuses[i]} />
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={row.team.crest}
                            alt={row.team.shortName}
                            className="h-5 w-5 object-contain"
                          />
                          <span className="text-sm font-medium text-primary">{row.team.shortName}</span>
                          {liveSet.has(row.team.id) && (
                            <span className="flex items-center gap-1 rounded-full bg-positive/15 px-1.5 py-0.5 text-[10px] font-bold text-positive">
                              <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-positive" />
                              CANLI
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 text-center text-sm text-muted">{row.playedGames}</td>
                      <td className="py-3 text-center text-sm text-muted">{row.won}</td>
                      <td className="py-3 text-center text-sm text-muted">{row.draw}</td>
                      <td className="py-3 text-center text-sm text-muted">{row.lost}</td>
                      <td className="py-3 text-center text-sm text-muted">
                        {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                      </td>
                      <td className="py-3 pr-4 text-center text-sm font-bold text-gold">{row.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Legend */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-line/50 px-4 py-2.5">
                <Legend color="bg-positive" label="İlk 2 → Son 32'ye geçer" />
                <Legend color="bg-gold" label="3. sıra → Havuza girer (en iyi 8)" />
                {statuses.some(s => s !== 'pending') && (
                  <span className="w-full text-[10px] text-muted leading-relaxed">
                    <span className="font-bold text-positive">✓</span> Kesin geçti &nbsp;·&nbsp;
                    <span className="font-bold text-gold">⚖</span> Havuza girdi &nbsp;·&nbsp;
                    <span className="font-bold text-red-400">✕</span> Kesin elendi
                  </span>
                )}
              </div>
            </div>
          ) : (
            <EmptyState text="Puan durumu henüz yok" />
          )}
        </section>

        {/* Match schedule */}
        <section>
          {upcoming.length > 0 && (
            <div className="mb-6">
              <SectionLabel>Yaklaşan Maçlar</SectionLabel>
              <MatchList matches={upcoming} />
            </div>
          )}
          {finished.length > 0 && (
            <div>
              <SectionLabel>Biten Maçlar</SectionLabel>
              <MatchList matches={finished} />
            </div>
          )}
          {groupMatches.length === 0 && (
            <EmptyState text="Bu grup için maç verisi henüz yok" />
          )}
        </section>
      </div>
    </div>
  )
}

/* ── Sub-components ──────────────────────────────────────── */

function PosBadge({ pos }: { pos: number }) {
  const cls =
    pos <= 2
      ? 'bg-positive/15 text-positive ring-1 ring-positive/30'
      : pos === 3
      ? 'bg-gold/15 text-gold ring-1 ring-gold/30'
      : 'bg-raised text-muted'
  return (
    <span
      className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${cls}`}
    >
      {pos}
    </span>
  )
}

type QualStatus = 'qualified' | 'third' | 'eliminated' | 'pending'

function qualStatuses(rows: StandingsRow[]): QualStatus[] {
  const groupDone = rows.length > 0 && rows.every(r => r.playedGames >= 3)
  return rows.map((row, i) => {
    const maxPts = row.points + 3 * (3 - row.playedGames)
    const others = rows.filter((_, j) => j !== i)

    // Kesin elendi: 2+ takım zaten benim ulaşabileceğim maksimumun üzerinde
    if (others.filter(o => o.points > maxPts).length >= 2) return 'eliminated'

    // Kesin geçti: en fazla 1 takım benim mevcut puanımı geçebilir
    if (others.filter(o => (o.points + 3 * (3 - o.playedGames)) > row.points).length <= 1)
      return 'qualified'

    // Grup bittiyse 3. sıra = havuza girdi
    if (groupDone && i === 2) return 'third'

    return 'pending'
  })
}

function QualDot({ status }: { status: QualStatus }) {
  if (status === 'qualified')
    return (
      <span title="Son 32'ye kesin geçti" className="text-[10px] font-bold text-positive leading-none">
        ✓
      </span>
    )
  if (status === 'third')
    return (
      <span title="3. sıra havuzuna girdi — en iyi 8'den biri olursa ilerler" className="text-[10px] font-bold text-gold leading-none">
        ⚖
      </span>
    )
  if (status === 'eliminated')
    return (
      <span title="Kesin elendi — matematiksel olarak ilk 2'ye giremez" className="text-[10px] font-bold text-red-400 leading-none">
        ✕
      </span>
    )
  return null
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-xs text-muted">
      <span className={`h-2 w-2 rounded-full ${color} opacity-70`} />
      {label}
    </span>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
      {children}
    </p>
  )
}

function MatchList({ matches }: { matches: Match[] }) {
  return (
    <div className="flex flex-col gap-2">
      {matches.map(m => <MatchRow key={m.id} match={m} />)}
    </div>
  )
}

function MatchRow({ match: m }: { match: Match }) {
  const { text, cls } = statusLabel(m.status)
  const done = m.status === 'FINISHED'
  const h = m.score.fullTime.home
  const a = m.score.fullTime.away
  const hasScore = h !== null && a !== null

  return (
    <div
      className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
        done
          ? 'border-line/60 bg-card/50'
          : 'border-line bg-card hover:border-accent/30'
      }`}
    >
      {/* Time / status */}
      <div className="w-[72px] shrink-0 text-center">
        {done ? (
          <span className="text-xs text-muted">{formatMatchDate(m.utcDate).split(',')[0]}</span>
        ) : (
          <span className={`text-xs font-semibold ${cls}`}>
            {text === 'Planlandı' ? formatMatchDate(m.utcDate) : text}
          </span>
        )}
      </div>

      {/* Home team */}
      <div className="flex flex-1 items-center justify-end gap-2 overflow-hidden">
        <span className="truncate text-sm font-semibold text-primary">{m.homeTeam.shortName}</span>
        <img src={m.homeTeam.crest} alt="" className="h-6 w-6 shrink-0 object-contain" />
      </div>

      {/* Score */}
      <div className="flex w-14 shrink-0 items-center justify-center gap-1 font-mono text-base font-bold">
        {hasScore ? (
          <>
            <span className={h! > a! ? 'text-primary' : 'text-muted'}>{h}</span>
            <span className="text-line">:</span>
            <span className={a! > h! ? 'text-primary' : 'text-muted'}>{a}</span>
          </>
        ) : (
          <span className="text-xs text-muted font-sans font-normal">
            {formatMatchDate(m.utcDate).split(',').pop()?.trim()}
          </span>
        )}
      </div>

      {/* Away team */}
      <div className="flex flex-1 items-center gap-2 overflow-hidden">
        <img src={m.awayTeam.crest} alt="" className="h-6 w-6 shrink-0 object-contain" />
        <span className="truncate text-sm font-semibold text-primary">{m.awayTeam.shortName}</span>
      </div>

      {/* Matchday */}
      <span className="w-5 shrink-0 text-center text-xs text-muted">{m.matchday}</span>
    </div>
  )
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-line bg-card px-6 py-10 text-center text-sm text-muted">
      {text}
    </div>
  )
}
