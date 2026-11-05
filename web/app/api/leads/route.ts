import { NextResponse } from "next/server";
import {
  createLead,
  rateLimitOk,
  validateLeadInput,
} from "@/lib/leads";

function clientIp(req: Request): string | null {
  const xf = req.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0]?.trim() || null;
  return req.headers.get("x-real-ip");
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = validateLeadInput(body);
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const ip = clientIp(req);
  const rlKey = ip ?? parsed.whatsapp;
  if (!rateLimitOk(`lead:${rlKey}`, 5, 60_000)) {
    return NextResponse.json(
      { error: "Demasiados pedidos. Probá en un minuto." },
      { status: 429 }
    );
  }

  // Honeypot: responder OK sin persistir ruido
  if (parsed.company) {
    return NextResponse.json({ ok: true, estado: "ok" });
  }

  try {
    const result = await createLead({ ...parsed, ip });
    return NextResponse.json({
      ok: true,
      id: result.id,
      estado: result.estado,
      gomeriaNombre: result.gomeriaNombre,
    });
  } catch (err) {
    console.error("[api/leads]", err);
    return NextResponse.json(
      { error: "No pudimos guardar el pedido. Probá más tarde." },
      { status: 500 }
    );
  }
}
