import { API_BASE } from '@/lib/config'
import { NextResponse } from 'next/server'
const BASE = 'https://jarvisia-production.up.railway.app'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const tab = searchParams.get('tab') || 'notes'
  const res = await fetch(`${BASE}/personal?tab=${tab}`, { cache: 'no-store' })
  const data = await res.json()
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const body = await req.json()
  const res = await fetch(`${BASE}/personal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  return NextResponse.json(data)
}
