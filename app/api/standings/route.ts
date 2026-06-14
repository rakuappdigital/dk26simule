import { NextResponse } from 'next/server'
import { fetchStandings } from '@/lib/football-api'

export const revalidate = 120

export async function GET() {
  try {
    const data = await fetchStandings()
    return NextResponse.json(data)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
