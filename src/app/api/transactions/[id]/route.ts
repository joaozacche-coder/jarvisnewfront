import { NextRequest, NextResponse } from "next/server";

const BACKEND = "https://jarvisia-production.up.railway.app";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const res = await fetch(`${BACKEND}/transactions/${id}?user_id=JoaoZacche`, {
      method: "DELETE",
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
