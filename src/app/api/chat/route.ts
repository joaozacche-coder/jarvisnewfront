import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { message } = await req.json()
  const res = await fetch('https://jarvisia-production.up.railway.app/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, user_id: 'JoaoZacche' })
  })
  const data = await res.json()
  return NextResponse.json(data)
}
