import { Match, StandingGroup, StandingsRow, Team } from './types'

const LIVE = new Set(['IN_PLAY', 'PAUSED', 'HALFTIME', 'EXTRA_TIME', 'PENALTY_SHOOTOUT'])

export function computeStandings(matches: Match[]): StandingGroup[] {
  const groupTeams: Record<string, Map<number, {
    team: Team
    played: number; won: number; draw: number; lost: number
    goalsFor: number; goalsAgainst: number; points: number
  }>> = {}

  // Register all teams per group (including from unplayed matches so 0-played teams appear)
  for (const m of matches) {
    if (m.stage !== 'GROUP_STAGE' || !m.group) continue
    const g = m.group.replace('GROUP_', '')
    if (!groupTeams[g]) groupTeams[g] = new Map()
    for (const t of [m.homeTeam, m.awayTeam]) {
      if (!groupTeams[g].has(t.id)) {
        groupTeams[g].set(t.id, { team: t, played: 0, won: 0, draw: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 })
      }
    }
  }

  // Compute stats from finished + live matches
  for (const m of matches) {
    if (m.stage !== 'GROUP_STAGE' || !m.group) continue
    if (m.status !== 'FINISHED' && !LIVE.has(m.status)) continue
    const hg = m.score.fullTime.home
    const ag = m.score.fullTime.away
    if (hg === null || ag === null) continue

    const g = m.group.replace('GROUP_', '')
    const ht = groupTeams[g]?.get(m.homeTeam.id)
    const at = groupTeams[g]?.get(m.awayTeam.id)
    if (!ht || !at) continue

    ht.played++; ht.goalsFor += hg; ht.goalsAgainst += ag
    at.played++; at.goalsFor += ag; at.goalsAgainst += hg

    if (hg > ag)      { ht.won++;  ht.points += 3; at.lost++ }
    else if (hg === ag) { ht.draw++; ht.points += 1; at.draw++; at.points += 1 }
    else              { at.won++;  at.points += 3; ht.lost++ }
  }

  return Object.entries(groupTeams).map(([group, teamMap]) => {
    const table: StandingsRow[] = [...teamMap.values()]
      .sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points
        const bGD = b.goalsFor - b.goalsAgainst
        const aGD = a.goalsFor - a.goalsAgainst
        if (bGD !== aGD) return bGD - aGD
        return b.goalsFor - a.goalsFor
      })
      .map((t, i) => ({
        position: i + 1,
        team: t.team,
        playedGames: t.played,
        won: t.won,
        draw: t.draw,
        lost: t.lost,
        goalsFor: t.goalsFor,
        goalsAgainst: t.goalsAgainst,
        goalDifference: t.goalsFor - t.goalsAgainst,
        points: t.points,
        form: null,
      }))
    return { stage: 'GROUP_STAGE', type: 'TOTAL', group, table }
  })
}

export function liveTeamIds(matches: Match[]): Set<number> {
  const ids = new Set<number>()
  for (const m of matches) {
    if (LIVE.has(m.status)) {
      ids.add(m.homeTeam.id)
      ids.add(m.awayTeam.id)
    }
  }
  return ids
}
