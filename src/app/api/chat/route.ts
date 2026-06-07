import { API_BASE } from '@/lib/config'

export async function POST(req: Request) {
  const { message, tone, history } = await req.json()
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      user_id: 'JoaoZacche',
      ...(tone ? { tone } : {}),
      ...(history?.length ? { history } : {}),
    })
  })
  return new Response(res.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    }
  })
}
