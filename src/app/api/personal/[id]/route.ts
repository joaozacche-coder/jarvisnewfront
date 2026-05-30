import { NextResponse } from 'next/server'
const BASE = 'https://jarvisia-production.up.railway.app'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const res = await fetch(`${BASE}/personal/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  return NextResponse.json(data)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const res = await fetch(`${BASE}/personal/${id}`, { method: 'DELETE' })
  const data = await res.json()
  return NextResponse.json(data)
}
