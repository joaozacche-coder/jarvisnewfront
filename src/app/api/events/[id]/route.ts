import { NextRequest, NextResponse } from "next/server";

const BACKEND = "https://jarvisia-production.up.railway.app";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await req.json();
    const res = await fetch(`${BACKEND}/events/${id}?user_id=JoaoZacche`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const res = await fetch(`${BACKEND}/events/${id}?user_id=JoaoZacche`, {
      method: "DELETE",
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
