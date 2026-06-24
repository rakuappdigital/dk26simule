import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { fetchMatches } from '@/lib/football-api'

const EN_TO_TR: Record<string, string> = {
  'Mexico': 'Meksika', 'South Africa': 'Güney Afrika', 'Korea Republic': 'Güney Kore',
  'South Korea': 'Güney Kore', 'Czechia': 'Çekya', 'Czech Republic': 'Çekya',
  'Canada': 'Kanada', 'Bosnia and Herzegovina': 'Bosna Hersek', 'Qatar': 'Katar',
  'Switzerland': 'İsviçre', 'Brazil': 'Brezilya', 'Morocco': 'Fas', 'Haiti': 'Haiti',
  'Scotland': 'İskoçya', 'United States': 'ABD', 'USA': 'ABD', 'Paraguay': 'Paraguay',
  'Australia': 'Avustralya', 'Turkey': 'Türkiye', 'Türkiye': 'Türkiye',
  'Germany': 'Almanya', 'Curaçao': 'Curaçao', 'Curacao': 'Curaçao',
  "Côte d'Ivoire": 'Fildişi Sahili', "Côte d’Ivoire": 'Fildişi Sahili',
  'Ivory Coast': 'Fildişi Sahili', 'Ecuador': 'Ekvador', 'Netherlands': 'Hollanda',
  'Japan': 'Japonya', 'Sweden': 'İsveç', 'Tunisia': 'Tunus', 'Belgium': 'Belçika',
  'Egypt': 'Mısır', 'Iran': 'İran', 'IR Iran': 'İran', 'New Zealand': 'Yeni Zelanda',
  'Spain': 'İspanya', 'Cape Verde': 'Yeşil Burun', 'Saudi Arabia': 'Suudi Arabistan',
  'Uruguay': 'Uruguay', 'France': 'Fransa', 'Senegal': 'Senegal', 'Iraq': 'Irak',
  'Norway': 'Norveç', 'Argentina': 'Arjantin', 'Algeria': 'Cezayir',
  'Austria': 'Avusturya', 'Jordan': 'Ürdün', 'Portugal': 'Portekiz',
  'DR Congo': 'DR Kongo', 'Congo DR': 'DR Kongo', 'Democratic Republic of Congo': 'DR Kongo',
  'Uzbekistan': 'Özbekistan', 'Colombia': 'Kolombiya', 'England': 'İngiltere',
  'Croatia': 'Hırvatistan', 'Ghana': 'Gana', 'Panama': 'Panama',
}

type ApiMatch = {
  stage: string
  group: string | null
  status: string
  homeTeam: { name: string }
  awayTeam: { name: string }
  score: { fullTime: { home: number | null; away: number | null } }
}

export async function GET() {
  const [template, matchData] = await Promise.all([
    readFile(join(process.cwd(), 'public', 'simulator.html'), 'utf-8'),
    fetchMatches().catch(() => ({ matches: [] })),
  ])

  const matches = ((matchData as { matches?: unknown[] }).matches ?? []) as ApiMatch[]

  const played = matches
    .filter(m =>
      m.stage === 'GROUP_STAGE' &&
      m.status === 'FINISHED' &&
      m.group !== null &&
      m.score.fullTime.home !== null &&
      m.score.fullTime.away !== null
    )
    .map(m => ({
      g: m.group!.replace('GROUP_', ''),
      h: EN_TO_TR[m.homeTeam.name] ?? m.homeTeam.name,
      a: EN_TO_TR[m.awayTeam.name] ?? m.awayTeam.name,
      hg: m.score.fullTime.home!,
      ag: m.score.fullTime.away!,
    }))

  // GROUPS_ORIG'e gerçek skorları enjekte eden satırı bul ve önüne yerleştir
  const inject = `(function(){var __r=${JSON.stringify(played)};for(var i=0;i<__r.length;i++){var m=__r[i],grp=GROUPS_ORIG[m.g];if(!grp)continue;var idx=grp.matches.findIndex(function(mi){return grp.teams[mi.h].name===m.h&&grp.teams[mi.a].name===m.a;});if(idx<0)continue;grp.matches[idx].played=true;grp.matches[idx].hg=m.hg;grp.matches[idx].ag=m.ag;}})();\n`

  const html = template.replace(
    'const state = JSON.parse(JSON.stringify(GROUPS_ORIG));',
    inject + 'const state = JSON.parse(JSON.stringify(GROUPS_ORIG));'
  )

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
    },
  })
}
