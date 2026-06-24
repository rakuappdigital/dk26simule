import { Match, StandingGroup, StandingsRow, Team } from './types'

const LIVE = new Set(['IN_PLAY', 'PAUSED', 'HALFTIME', 'EXTRA_TIME', 'PENALTY_SHOOTOUT'])

// FIFA WC2026 kural 1: eşit puanlı takımlar arasında kafa kafaya sıralama
function applyH2HSort(rows: StandingsRow[], groupMatches: Match[]): void {
  let i = 0
  while (i < rows.length) {
    let j = i + 1
    while (j < rows.length && rows[j].points === rows[i].points) j++

    if (j - i > 1) {
      const tied = rows.slice(i, j)
      const tiedIds = new Set(tied.map(r => r.team.id))

      // Kafa kafaya mini-tablo
      const h2h: Record<number, { pts: number; gd: number; gf: number }> = {}
      for (const r of tied) h2h[r.team.id] = { pts: 0, gd: 0, gf: 0 }

      for (const m of groupMatches) {
        if (!tiedIds.has(m.homeTeam.id) || !tiedIds.has(m.awayTeam.id)) continue
        if (m.status !== 'FINISHED' && !LIVE.has(m.status)) continue
        const hg = m.score.fullTime.home, ag = m.score.fullTime.away
        if (hg === null || ag === null) continue

        h2h[m.homeTeam.id].gf += hg
        h2h[m.homeTeam.id].gd += hg - ag
        h2h[m.awayTeam.id].gf += ag
        h2h[m.awayTeam.id].gd += ag - hg
        if (hg > ag)       h2h[m.homeTeam.id].pts += 3
        else if (hg < ag)  h2h[m.awayTeam.id].pts += 3
        else { h2h[m.homeTeam.id].pts += 1; h2h[m.awayTeam.id].pts += 1 }
      }

      // 1a: kafa kafaya puan → 1b: kafa kafaya averaj → 1c: kafa kafaya gol
      // → 2: genel averaj → 3: genel gol
      tied.sort((a, b) => {
        const ha = h2h[a.team.id], hb = h2h[b.team.id]
        return (hb.pts - ha.pts)
            || (hb.gd  - ha.gd)
            || (hb.gf  - ha.gf)
            || (b.goalDifference - a.goalDifference)
            || (b.goalsFor - a.goalsFor)
      })

      for (let k = 0; k < tied.length; k++) rows[i + k] = tied[k]
    }
    i = j
  }
}

export function computeStandings(matches: Match[]): StandingGroup[] {
  const groupTeams: Record<string, Map<number, {
    team: Team
    played: number; won: number; draw: number; lost: number
    goalsFor: number; goalsAgainst: number; points: number
  }>> = {}

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

    if (hg > ag)       { ht.won++;  ht.points += 3; at.lost++ }
    else if (hg === ag) { ht.draw++; ht.points += 1; at.draw++; at.points += 1 }
    else               { at.won++;  at.points += 3; ht.lost++ }
  }

  return Object.entries(groupTeams).map(([group, teamMap]) => {
    const groupMatches = matches.filter(m => m.group === `GROUP_${group}`)

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

    // FIFA kural 1: kafa kafaya sıralama
    applyH2HSort(table, groupMatches)
    table.forEach((row, i) => { row.position = i + 1 })

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
