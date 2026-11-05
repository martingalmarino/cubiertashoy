import Link from "next/link";
import type { ReactNode } from "react";
import { getMedida, getVehicle } from "@/lib/data";

type SeoCopyRichTextProps = {
  text: string;
  className?: string;
};

function routeExists(href: string): boolean {
  if (href.startsWith("/medida/")) {
    const slug = href.slice("/medida/".length).split("/")[0];
    return Boolean(slug && getMedida(slug));
  }
  if (href.startsWith("/auto/")) {
    const slug = href.slice("/auto/".length).split("/")[0];
    return Boolean(slug && getVehicle(slug));
  }
  return false;
}

/** Markdown mínimo: **negrita**, _cursiva_ y [label](/ruta) solo si la ruta existe. */
export function SeoCopyRichText({ text, className }: SeoCopyRichTextProps) {
  const nodes = parseInline(text);
  return <p className={className}>{nodes}</p>;
}

function parseInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const tokenRe = /(\*\*[^*]+\*\*|_[^_]+_|\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = tokenRe.exec(text)) !== null) {
    if (match.index > last) {
      nodes.push(text.slice(last, match.index));
    }
    const token = match[0];
    if (token.startsWith("**")) {
      nodes.push(
        <strong key={key++} className="font-semibold text-tinta-800">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("_") && token.endsWith("_")) {
      nodes.push(
        <em key={key++} className="text-tinta-500">
          {token.slice(1, -1)}
        </em>
      );
    } else {
      const m = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(token);
      if (m) {
        const [, label, href] = m;
        if (href.startsWith("/") && routeExists(href)) {
          nodes.push(
            <Link
              key={key++}
              href={href}
              className="font-medium text-accion-600 underline-offset-2 hover:underline focus-visible:ring-2 focus-visible:ring-accion-600"
            >
              {label}
            </Link>
          );
        } else {
          nodes.push(<span key={key++}>{label}</span>);
        }
      }
    }
    last = match.index + token.length;
  }

  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}
