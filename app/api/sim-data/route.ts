import { NextResponse } from 'next/server'
import { fetchMatches } from '@/lib/football-api'

const GROUP_TEAMS: Record<string, string[]> = {
  A: ['Meksika', 'Güney Afrika', 'Güney Kore', 'Çekya'],
  B: ['Kanada', 'Bosna Hersek', 'Katar', 'İsviçre'],
  C: ['Brezilya', 'Fas', 'Haiti', 'İskoçya'],
  D: ['ABD', 'Paraguay', 'Avustralya', 'Türkiye'],
  E: ['Almanya', 'Curaçao', 'Fildişi Sahili', 'Ekvador'],
  F: ['Hollanda', 'Japonya', 'İsveç', 'Tunus'],
  G: ['Belçika', 'Mısır', 'İran', 'Yeni Zelanda'],
  H: ['İspanya', 'Yeşil Burun', 'Suudi Arabistan', 'Uruguay'],
  I: ['Fransa', 'Senegal', 'Irak', 'Norveç'],
  J: ['Arjantin', 'Cezayir', 'Avusturya', 'Ürdün'],
  K: ['Portekiz', 'DR Kongo', 'Özbekistan', 'Kolombiya'],
  L: ['İngiltere', 'Hırvatistan', 'Gana', 'Panama'],
}

const EN_TO_TR: Record<string, string> = {
  Mexico: 'Meksika',
  'South Africa': 'Güney Afrika',
  'Korea Republic': 'Güney Kore',
  'South Korea': 'Güney Kore',
  Czechia: 'Çekya',
  'Czech Republic': 'Çekya',
  Canada: 'Kanada',
  'Bosnia and Herzegovina': 'Bosna Hersek',
  Qatar: 'Katar',
  Switzerland: 'İsviçre',
  Brazil: 'Brezilya',
  Morocco: 'Fas',
  Haiti: 'Haiti',
  Scotland: 'İskoçya',
  'United States': 'ABD',
  USA: 'ABD',
  Paraguay: 'Paraguay',
  Australia: 'Avustralya',
  Turkey: 'Türkiye',
  Germany: 'Almanya',
  "Curaçao": 'Curaçao',
  Curacao: 'Curaçao',
  "Côte d'Ivoire": 'Fildişi Sahili',
  'Ivory Coast': 'Fildişi Sahili',
  Ecuador: 'Ekvador',
  Netherlands: 'Hollanda',
  Japan: 'Japonya',
  Sweden: 'İsveç',
  Tunisia: 'Tunus',
  Belgium: 'Belçika',
  Egypt: 'Mısır',
  Iran: 'İran',
  'IR Iran': 'İran',
  'New Zealand': 'Yeni Zelanda',
  Spain: 'İspanya',
  'Cape Verde': 'Yeşil Burun',
  'Saudi Arabia': 'Suudi Arabistan',
  Uruguay: 'Uruguay',
  France: 'Fransa',
  Senegal: 'Senegal',
  Iraq: 'Irak',
  Norway: 'Norveç',
  Argentina: 'Arjantin',
  Algeria: 'Cezayir',
  Austria: 'Avusturya',
  Jordan: 'Ürdün',
  Portugal: 'Portekiz',
  'DR Congo': 'DR Kongo',
  'Congo DR': 'DR Kongo',
  'Democratic Republic of Congo': 'DR Kongo',
  Uzbekistan: 'Özbekistan',
  Colombia: 'Kolombiya',
  England: 'İngiltere',
  Croatia: 'Hırvatistan',
  Ghana: 'Gana',
  Panama: 'Panama',
}

export const revalidate = 60

type ApiMatch = {
  stage: string
  group: string | null
  status: string
  homeTeam: { name: string }
  awayTeam: { name: string }
  score: { fullTime: { home: number | null; away: number | null } }
}

function teamIdx(g: string, apiName: string): number {
  const norm = apiName.replace(/'/g, "'")
  const tr = EN_TO_TR[norm] ?? EN_TO_TR[apiName] ?? apiName
  const teams = GROUP_TEAMS[g] ?? []
  const idx = teams.indexOf(tr)
  if (idx !== -1) return idx
  const lo = tr.toLowerCase()
  return teams.findIndex(n => n.toLowerCase() === lo)
}

export async function GET() {
  try {
    const data = await fetchMatches()
    const matches = ((data as { matches?: unknown[] }).matches ?? []) as ApiMatch[]

    const played = matches
      .filter(m =>
        m.stage === 'GROUP_STAGE' &&
        m.status === 'FINISHED' &&
        m.group !== null &&
        m.score.fullTime.home !== null &&
        m.score.fullTime.away !== null
      )
      .flatMap(m => {
        const g = m.group!.replace('GROUP_', '')
        const h = teamIdx(g, m.homeTeam.name)
        const a = teamIdx(g, m.awayTeam.name)
        if (h === -1 || a === -1) return []
        return [{ g, h, a, hg: m.score.fullTime.home!, ag: m.score.fullTime.away! }]
      })

    return NextResponse.json({ played })
  } catch (err: unknown) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
