import { NextResponse } from 'next/server'
import { fetchMatches } from '@/lib/football-api'

export const revalidate = 60

export async function GET() {
  try {
    const data = await fetchMatches()
    return NextResponse.json(data)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
