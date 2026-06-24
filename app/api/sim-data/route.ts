import { NextResponse } from 'next/server'
import { fetchMatches } from '@/lib/football-api'

export const revalidate = 60

// football-data.org İngilizce → simülatörde kullanılan Türkçe isimler
const EN_TO_TR: Record<string, string> = {
  'Mexico': 'Meksika',
  'South Africa': 'Güney Afrika',
  'Korea Republic': 'Güney Kore',
  'South Korea': 'Güney Kore',
  'Czechia': 'Çekya',
  'Czech Republic': 'Çekya',
  'Canada': 'Kanada',
  'Bosnia and Herzegovina': 'Bosna Hersek',
  'Qatar': 'Katar',
  'Switzerland': 'İsviçre',
  'Brazil': 'Brezilya',
  'Morocco': 'Fas',
  'Haiti': 'Haiti',
  'Scotland': 'İskoçya',
  'United States': 'ABD',
  'USA': 'ABD',
  'Paraguay': 'Paraguay',
  'Australia': 'Avustralya',
  'Turkey': 'Türkiye',
  'Türkiye': 'Türkiye',
  'Germany': 'Almanya',
  'Curaçao': 'Curaçao',
  'Curacao': 'Curaçao',
  "Côte d'Ivoire": 'Fildişi Sahili',
  "Côte d’Ivoire": 'Fildişi Sahili',
  'Ivory Coast': 'Fildişi Sahili',
  'Ecuador': 'Ekvador',
  'Netherlands': 'Hollanda',
  'Japan': 'Japonya',
  'Sweden': 'İsveç',
  'Tunisia': 'Tunus',
  'Belgium': 'Belçika',
  'Egypt': 'Mısır',
  'Iran': 'İran',
  'IR Iran': 'İran',
  'New Zealand': 'Yeni Zelanda',
  'Spain': 'İspanya',
  'Cape Verde': 'Yeşil Burun',
  'Saudi Arabia': 'Suudi Arabistan',
  'Uruguay': 'Uruguay',
  'France': 'Fransa',
  'Senegal': 'Senegal',
  'Iraq': 'Irak',
  'Norway': 'Norveç',
  'Argentina': 'Arjantin',
  'Algeria': 'Cezayir',
  'Austria': 'Avusturya',
  'Jordan': 'Ürdün',
  'Portugal': 'Portekiz',
  'DR Congo': 'DR Kongo',
  'Congo DR': 'DR Kongo',
  'Democratic Republic of Congo': 'DR Kongo',
  'Uzbekistan': 'Özbekistan',
  'Colombia': 'Kolombiya',
  'England': 'İngiltere',
  'Croatia': 'Hırvatistan',
  'Ghana': 'Gana',
  'Panama': 'Panama',
}

function tr(name: string): string {
  return EN_TO_TR[name] ?? name
}

export async function GET() {
  try {
    const data = await fetchMatches()
    const matches = (data.matches ?? []) as Array<{
      stage: string
      group: string | null
      matchday: number
      status: string
      homeTeam: { name: string }
      awayTeam: { name: string }
      score: { fullTime: { home: number | null; away: number | null } }
    }>

    const played = matches
      .filter(m =>
        m.stage === 'GROUP_STAGE' &&
        m.status === 'FINISHED' &&
        m.score.fullTime.home !== null &&
        m.score.fullTime.away !== null &&
        m.group
      )
      .map(m => ({
        group: m.group!.replace('GROUP_', ''),
        matchday: m.matchday,
        home: tr(m.homeTeam.name),
        away: tr(m.awayTeam.name),
        hg: m.score.fullTime.home!,
        ag: m.score.fullTime.away!,
      }))

    return NextResponse.json({ played })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
