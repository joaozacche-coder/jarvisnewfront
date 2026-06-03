import { NextRequest, NextResponse } from "next/server";

const BACKEND = "https://jarvisia-production.up.railway.app";

export async function GET() {
  try {
    const res = await fetch(`${BACKEND}/reminders?user_id=JoaoZacche`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ reminders: [] }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await fetch(`${BACKEND}/reminders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, user_id: "JoaoZacche" }),
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to create reminder" }, { status: 500 });
  }
}
