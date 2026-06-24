import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'
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

type ApiMatch = {
  stage: string
  group: string | null
  status: string
  homeTeam: { name: string }
  awayTeam: { name: string }
  score: { fullTime: { home: number | null; away: number | null } }
}

function teamIdx(g: string, apiName: string): number {
  // normalize smart apostrophe → straight apostrophe
  const norm = apiName.replace(/’/g, "'")
  const tr = EN_TO_TR[norm] ?? EN_TO_TR[apiName] ?? apiName
  const teams = GROUP_TEAMS[g] ?? []
  const idx = teams.indexOf(tr)
  if (idx !== -1) return idx
  const lo = tr.toLowerCase()
  return teams.findIndex(n => n.toLowerCase() === lo)
}

export async function GET() {
  const [template, matchData] = await Promise.all([
    readFile(join(process.cwd(), 'public', 'simulator.html'), 'utf-8'),
    fetchMatches().catch(() => ({ matches: [] })),
  ])

  const matches = ((matchData as { matches?: unknown[] }).matches ?? []) as ApiMatch[]

  type SimMatch = { g: string; h: number; a: number; hg: number; ag: number }
  const played: SimMatch[] = []

  for (const m of matches) {
    if (m.stage !== 'GROUP_STAGE' || !m.group) continue
    if (m.status !== 'FINISHED') continue
    const hg = m.score.fullTime.home
    const ag = m.score.fullTime.away
    if (hg === null || ag === null) continue

    const g = m.group.replace('GROUP_', '')
    const h = teamIdx(g, m.homeTeam.name)
    const a = teamIdx(g, m.awayTeam.name)
    if (h === -1 || a === -1) {
      console.warn(`[sim-html] eslesmedi: ${m.homeTeam.name}/${m.awayTeam.name} Grup ${g}`)
      continue
    }
    played.push({ g, h, a, hg, ag })
  }

  // integer indekslerle eslesen enjeksiyon — string karsilastirmasi yok
  const inject =
    '(function(){' +
    'var __r=' + JSON.stringify(played) + ';' +
    'for(var i=0;i<__r.length;i++){' +
    'var m=__r[i],grp=GROUPS_ORIG[m.g];' +
    'if(!grp)continue;' +
    'var idx=-1;' +
    'for(var j=0;j<grp.matches.length;j++){' +
    'if(grp.matches[j].h===m.h&&grp.matches[j].a===m.a){idx=j;break;}' +
    '}' +
    'if(idx<0)continue;' +
    'grp.matches[idx].played=true;grp.matches[idx].hg=m.hg;grp.matches[idx].ag=m.ag;' +
    '}' +
    '})();\n'

  const MARKER = 'const state = JSON.parse(JSON.stringify(GROUPS_ORIG));'
  const html = template.includes(MARKER)
    ? template.replace(MARKER, inject + MARKER)
    : template

  if (!template.includes(MARKER)) {
    console.error('[sim-html] injection noktasi bulunamadi')
  }

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
    },
  })
}
