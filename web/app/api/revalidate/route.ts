import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

function secretFrom(req: NextRequest): string | null {
  const header = req.headers.get("x-revalidate-secret");
  if (header) return header.trim();
  const auth = req.headers.get("authorization");
  if (auth?.toLowerCase().startsWith("bearer ")) {
    return auth.slice(7).trim();
  }
  return null;
}

/**
 * POST /api/revalidate
 * Header: x-revalidate-secret: $REVALIDATE_SECRET
 * (también acepta Authorization: Bearer …)
 */
export async function POST(req: NextRequest) {
  const expected = process.env.REVALIDATE_SECRET;
  if (!expected) {
    return NextResponse.json(
      { ok: false, error: "REVALIDATE_SECRET no configurado" },
      { status: 503 }
    );
  }

  const provided = secretFrom(req);
  if (!provided || provided !== expected) {
    return NextResponse.json({ ok: false, error: "no autorizado" }, { status: 401 });
  }

  // Bust caché de home, medidas y layout (ISR / fetch cache).
  revalidatePath("/", "layout");
  revalidatePath("/medida/[slug]", "page");

  return NextResponse.json({
    ok: true,
    revalidated: true,
    at: new Date().toISOString(),
  });
}
