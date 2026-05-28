import { NextResponse } from "next/server";

const BACKEND = "https://jarvisia-production.up.railway.app";

export async function GET() {
  try {
    const res = await fetch(`${BACKEND}/clients?user_id=JoaoZacche`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ clients: [] }, { status: 500 });
  }
}
