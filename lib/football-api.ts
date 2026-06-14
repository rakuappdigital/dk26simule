const BASE = 'https://api.football-data.org/v4'
const KEY  = process.env.FOOTBALL_DATA_API_KEY!

async function apiFetch(path: string, revalidate = 120) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'X-Auth-Token': KEY },
    next: { revalidate },
  })
  if (!res.ok) throw new Error(`Football API ${res.status}: ${path}`)
  return res.json()
}

export const fetchMatches   = () => apiFetch('/competitions/WC/matches', 60)
export const fetchStandings = () => apiFetch('/competitions/WC/standings', 120)
