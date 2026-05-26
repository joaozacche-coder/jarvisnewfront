import { AccessToken } from 'livekit-server-sdk'
import { NextResponse } from 'next/server'

export async function GET() {
  const at = new AccessToken(
    process.env.LIVEKIT_API_KEY!,
    process.env.LIVEKIT_API_SECRET!,
    { identity: 'user-joao', ttl: '1h' }
  )
  at.addGrant({ roomJoin: true, room: 'jarvis-room' })
  return NextResponse.json({
    token: await at.toJwt(),
    url: process.env.LIVEKIT_URL
  })
}
