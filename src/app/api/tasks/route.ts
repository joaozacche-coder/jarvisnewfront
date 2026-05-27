import { NextRequest, NextResponse } from "next/server";

const BACKEND = "https://jarvisia-production.up.railway.app";

export async function GET() {
  try {
    const res = await fetch(`${BACKEND}/tasks?user_id=JoaoZacche`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ tasks: [] }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await fetch(`${BACKEND}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, user_id: "JoaoZacche" }),
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}
