import { API_BASE } from '@/lib/config'
import { NextRequest, NextResponse } from "next/server";

const BACKEND = "https://jarvisia-production.up.railway.app";

export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get("name") || "";
  try {
    const res = await fetch(
      `${BACKEND}/context?name=${encodeURIComponent(name)}&user_id=JoaoZacche`
    );
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ has_context: false }, { status: 500 });
  }
}
