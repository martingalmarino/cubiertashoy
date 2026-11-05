import { createHash } from "crypto";
import { neon } from "@neondatabase/serverless";

export type LeadInput = {
  nombre: string;
  whatsapp: string;
  localidad: string;
  medidaSlug: string;
  medidaLabel: string;
  cantidad: 2 | 4;
  consentimiento: boolean;
  sourcePath?: string;
  /** Honeypot: si viene lleno → spam. */
  company?: string;
  ip?: string | null;
};

export type LeadResult = {
  id: number;
  estado: "enviado" | "sin_cobertura" | "spam";
  gomeriaNombre: string | null;
};

function databaseUrl(): string | null {
  return (
    process.env.DATABASE_URL ??
    process.env.DATABASE_POSTGRES_URL ??
    process.env.DATABASE_URL_UNPOOLED ??
    null
  );
}

export function hashIp(ip: string | null | undefined): string | null {
  if (!ip) return null;
  const salt = process.env.LEAD_IP_SALT ?? "cubiertashoy-leads";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}

function normalizeWhatsapp(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("54")) return digits;
  if (digits.startsWith("0")) return `54${digits.slice(1)}`;
  if (digits.length === 10) return `54${digits}`;
  return digits;
}

export function validateLeadInput(body: unknown): LeadInput | { error: string } {
  if (!body || typeof body !== "object") {
    return { error: "Pedido inválido" };
  }
  const b = body as Record<string, unknown>;
  const nombre = String(b.nombre ?? "").trim();
  const whatsapp = String(b.whatsapp ?? "").trim();
  const localidad = String(b.localidad ?? "").trim();
  const medidaSlug = String(b.medidaSlug ?? "").trim().toLowerCase();
  const medidaLabel = String(b.medidaLabel ?? "").trim();
  const cantidad = Number(b.cantidad);
  const consentimiento = b.consentimiento === true;
  const company = String(b.company ?? "").trim();
  const sourcePath = String(b.sourcePath ?? "").trim() || undefined;

  if (nombre.length < 2 || nombre.length > 80) {
    return { error: "Ingresá tu nombre" };
  }
  const wa = normalizeWhatsapp(whatsapp);
  if (wa.length < 10 || wa.length > 15) {
    return { error: "WhatsApp inválido" };
  }
  if (!localidad || localidad.length > 80) {
    return { error: "Elegí una localidad" };
  }
  if (!medidaSlug || !medidaLabel) {
    return { error: "Falta la medida" };
  }
  if (cantidad !== 2 && cantidad !== 4) {
    return { error: "Elegí 2 o 4 cubiertas" };
  }
  if (!consentimiento) {
    return { error: "Necesitamos tu consentimiento para contactarte" };
  }

  return {
    nombre,
    whatsapp: wa,
    localidad,
    medidaSlug,
    medidaLabel,
    cantidad,
    consentimiento,
    sourcePath,
    company: company || undefined,
  };
}

type GomeriaRow = {
  id: number;
  nombre: string;
  whatsapp: string;
  email: string | null;
  plan: string;
};

type SqlTag = (
  strings: TemplateStringsArray,
  ...values: unknown[]
) => Promise<unknown>;

async function pickGomeria(
  sql: SqlTag,
  localidad: string
): Promise<GomeriaRow | null> {
  const rows = (await sql`
    SELECT id, nombre, whatsapp, email, plan
    FROM gomerias
    WHERE activo = TRUE AND localidad = ${localidad}
    ORDER BY
      CASE plan WHEN 'pro' THEN 0 WHEN 'basico' THEN 1 ELSE 2 END,
      id ASC
    LIMIT 5
  `) as GomeriaRow[];
  if (!rows.length) return null;
  // Round-robin simple por cantidad de leads recientes
  const scored = await Promise.all(
    rows.map(async (g) => {
      const [c] = (await sql`
        SELECT COUNT(*)::int AS n
        FROM leads
        WHERE gomeria_id = ${g.id}
          AND created_at > NOW() - INTERVAL '7 days'
      `) as { n: number }[];
      return { g, n: c?.n ?? 0 };
    })
  );
  scored.sort((a, b) => a.n - b.n);
  return scored[0]!.g;
}

async function notifyLead(payload: {
  leadId: number;
  input: LeadInput;
  gomeria: GomeriaRow | null;
  estado: string;
}): Promise<void> {
  const webhook = process.env.LEAD_WEBHOOK;
  if (webhook) {
    try {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "lead_enviado",
          ...payload,
          at: new Date().toISOString(),
        }),
      });
    } catch (err) {
      console.error("[leads] webhook falló", err);
    }
  }

  const resendKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFY_EMAIL;
  if (!resendKey || !to) return;

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(resendKey);
    const from = process.env.RESEND_FROM ?? "CubiertasHoy <onboarding@resend.dev>";
    const gomeriaLine = payload.gomeria
      ? `Gomería: ${payload.gomeria.nombre} (WA ${payload.gomeria.whatsapp})`
      : "Sin gomería activa en esa localidad";
    await resend.emails.send({
      from,
      to: [to],
      subject: `Lead ${payload.input.medidaLabel} · ${payload.input.localidad}`,
      text: [
        `Lead #${payload.leadId} (${payload.estado})`,
        `Nombre: ${payload.input.nombre}`,
        `WhatsApp: ${payload.input.whatsapp}`,
        `Localidad: ${payload.input.localidad}`,
        `Medida: ${payload.input.medidaLabel} (${payload.input.medidaSlug})`,
        `Cantidad: ${payload.input.cantidad}`,
        gomeriaLine,
        `Origen: ${payload.input.sourcePath ?? "—"}`,
      ].join("\n"),
    });
  } catch (err) {
    console.error("[leads] Resend falló", err);
  }
}

/** Rate limit en memoria del proceso (MVP). */
const hits = new Map<string, number[]>();

export function rateLimitOk(key: string, limit = 5, windowMs = 60_000): boolean {
  const now = Date.now();
  const prev = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (prev.length >= limit) {
    hits.set(key, prev);
    return false;
  }
  prev.push(now);
  hits.set(key, prev);
  return true;
}

export async function createLead(
  raw: LeadInput & { ip?: string | null }
): Promise<LeadResult> {
  if (raw.company) {
    return { id: 0, estado: "spam", gomeriaNombre: null };
  }

  const url = databaseUrl();
  if (!url) {
    throw new Error("DATABASE_URL no configurada");
  }

  const sql = neon(url);
  const ipHash = hashIp(raw.ip);
  const gomeria = await pickGomeria(sql, raw.localidad);
  const estado = gomeria ? "enviado" : "sin_cobertura";

  const [row] = (await sql`
    INSERT INTO leads (
      nombre, whatsapp, localidad, medida_slug, medida_label,
      cantidad, consentimiento, gomeria_id, estado, source_path, ip_hash
    ) VALUES (
      ${raw.nombre},
      ${raw.whatsapp},
      ${raw.localidad},
      ${raw.medidaSlug},
      ${raw.medidaLabel},
      ${raw.cantidad},
      ${raw.consentimiento},
      ${gomeria?.id ?? null},
      ${estado}::lead_estado,
      ${raw.sourcePath ?? null},
      ${ipHash}
    )
    RETURNING id
  `) as { id: number }[];

  const id = row!.id;
  await notifyLead({ leadId: id, input: raw, gomeria, estado });

  return {
    id,
    estado,
    gomeriaNombre: gomeria?.nombre ?? null,
  };
}
