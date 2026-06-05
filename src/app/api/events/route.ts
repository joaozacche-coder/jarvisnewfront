import { API_BASE } from '@/lib/config'
import { NextRequest, NextResponse } from "next/server";

const BACKEND = "https://jarvisia-production.up.railway.app";

export async function GET() {
  try {
    const res = await fetch(`${BACKEND}/events?user_id=JoaoZacche&limit=200`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ events: [] }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await fetch(`${BACKEND}/events?user_id=JoaoZacche`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
