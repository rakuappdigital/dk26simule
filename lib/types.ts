export interface Team {
  id: number
  name: string
  shortName: string
  tla: string
  crest: string
}

export interface Score {
  winner: string | null
  duration: string
  fullTime: { home: number | null; away: number | null }
  halfTime: { home: number | null; away: number | null }
}

export interface Match {
  id: number
  utcDate: string
  status: 'SCHEDULED' | 'TIMED' | 'IN_PLAY' | 'PAUSED' | 'HALFTIME' | 'FINISHED' | 'POSTPONED' | 'SUSPENDED' | 'CANCELLED' | 'EXTRA_TIME' | 'PENALTY_SHOOTOUT'
  matchday: number
  stage: string
  group: string | null
  homeTeam: Team
  awayTeam: Team
  score: Score
}

export interface StandingsRow {
  position: number
  team: Team
  playedGames: number
  won: number
  draw: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
  form: string | null
}

export interface StandingGroup {
  stage: string
  type: string
  group: string
  table: StandingsRow[]
}
