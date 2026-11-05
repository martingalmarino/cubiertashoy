import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { getMedidas } from "@/lib/data";

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
 *
 * Body opcional: { "slugs": ["175-65-r14", ...] } — si viene vacío, revalida todas.
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

  let slugs: string[] = getMedidas().map((m) => m.slug);
  try {
    const body = (await req.json().catch(() => null)) as {
      slugs?: string[];
    } | null;
    if (body?.slugs?.length) {
      slugs = body.slugs;
    }
  } catch {
    // body vacío u opaco → todas las medidas
  }

  revalidatePath("/", "layout");
  revalidateTag("ofertas", "max");
  revalidateTag("historial", "max");

  const paths: string[] = ["/"];
  for (const slug of slugs) {
    const path = `/medida/${slug}`;
    revalidatePath(path);
    revalidateTag(`medida:${slug}`, "max");
    paths.push(path);
  }

  return NextResponse.json({
    ok: true,
    revalidated: true,
    paths,
    at: new Date().toISOString(),
  });
}
