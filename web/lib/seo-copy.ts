export type SeoCopyFaq = { q: string; a: string };

export type SeoCopySection = {
  title: string;
  body: string;
};

export type SeoCopyEntry = {
  slug: string;
  path: string;
  title: string;
  metaDescription: string;
  h1: string;
  lead: string;
  secciones: SeoCopySection[];
  faqs: SeoCopyFaq[];
};

export type SeoCopyVars = {
  precio_min?: string | null;
  precio_mediana?: string | null;
  n_tiendas?: string | null;
  n_ofertas?: string | null;
  fecha_actualizacion?: string | null;
};

const PLACEHOLDER_RE = /\{([a-z_]+)\}/g;

/** Reemplaza placeholders; si falta un dato, saca la frase/segmento que lo contiene. */
export function resolveTemplate(
  template: string,
  vars: SeoCopyVars
): string {
  if (!template) return "";

  let text = template;

  // 1) Sustituir valores disponibles
  text = text.replace(PLACEHOLDER_RE, (full, key: string) => {
    const v = vars[key as keyof SeoCopyVars];
    return v != null && v !== "" ? v : full;
  });

  // 2) Sacá paréntesis / corchetes que aún tengan placeholders
  text = text.replace(/\([^)]*\{[a-z_]+\}[^)]*\)/g, "");
  text = text.replace(/\[[^\]]*\{[a-z_]+\}[^\]]*\]/g, "");

  // 3) Títulos con pipes: dropear segmentos incompletos
  if (text.includes("|") && /\{[a-z_]+\}/.test(text)) {
    text = text
      .split("|")
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !/\{[a-z_]+\}/.test(s))
      .join(" | ");
  }

  // 4) Oraciones con placeholder pendiente
  if (/\{[a-z_]+\}/.test(text)) {
    const parts = text.split(/(?<=[.!?…])\s+/);
    text = parts
      .filter((p) => p.trim().length > 0 && !/\{[a-z_]+\}/.test(p))
      .join(" ");
  }

  // 5) Cláusulas residuales (em dash / guión largo) con placeholder
  if (/\{[a-z_]+\}/.test(text)) {
    text = text
      .split(/\s+[—–-]\s+/)
      .filter((p) => !/\{[a-z_]+\}/.test(p))
      .join(" — ");
  }

  // 6) Último recurso: borrar tokens {x}
  text = text.replace(PLACEHOLDER_RE, "");

  return text
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/\(\s*\)/g, "")
    .replace(/\s+\|/g, " |")
    .replace(/\|\s+/g, "| ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function resolveFaqs(
  faqs: SeoCopyFaq[],
  vars: SeoCopyVars
): SeoCopyFaq[] {
  return faqs
    .map((f) => ({
      q: resolveTemplate(f.q, vars),
      a: resolveTemplate(f.a, vars),
    }))
    .filter((f) => f.q.length > 0 && f.a.length > 0);
}

export function resolveSeoCopy(
  entry: SeoCopyEntry,
  vars: SeoCopyVars
): SeoCopyEntry {
  return {
    ...entry,
    title: resolveTemplate(entry.title, vars),
    metaDescription: resolveTemplate(entry.metaDescription, vars),
    h1: resolveTemplate(entry.h1, vars),
    lead: resolveTemplate(entry.lead, vars),
    secciones: entry.secciones
      .map((s) => ({
        title: resolveTemplate(s.title, vars),
        body: resolveTemplate(s.body, vars),
      }))
      .filter((s) => s.title.length > 0 && s.body.length > 0),
    faqs: resolveFaqs(entry.faqs, vars),
  };
}

export function faqPageJsonLd(faqs: SeoCopyFaq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };
}
