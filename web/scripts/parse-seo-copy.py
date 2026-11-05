#!/usr/bin/env python3
"""Parsea content/copy-*.md → web/content/{medidas,autos}.ts"""
from pathlib import Path
import re
import json

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "web" / "content"


def parse_file(path: Path, prefix: str):
    text = path.read_text()
    parts = re.split(r"^## `(/[^`]+)`[^\n]*\n", text, flags=re.M)
    entries = {}
    for i in range(1, len(parts), 2):
        path_str = parts[i]
        body = parts[i + 1]
        slug = path_str.split("/")[-1]
        assert path_str.startswith(prefix), (path_str, prefix)

        def field(label: str) -> str:
            m = re.search(rf"\*\*{re.escape(label)}:\*\*\s*(.+)", body)
            return m.group(1).strip() if m else ""

        section_map = {}
        sec_parts = re.split(r"^### (.+)$", body, flags=re.M)
        ordered = []
        faqs = []
        for j in range(1, len(sec_parts), 2):
            name = sec_parts[j].strip()
            content = sec_parts[j + 1].strip()
            if name == "JSON-LD FAQPage":
                continue
            if name == "FAQs":
                faq_chunks = re.split(r"\*\*(.+?)\*\*\s*\n", content)
                for k in range(1, len(faq_chunks), 2):
                    q = faq_chunks[k].strip()
                    a = faq_chunks[k + 1].strip()
                    if a:
                        faqs.append({"q": q, "a": a})
            elif name == "Lead":
                section_map["Lead"] = content
            else:
                ordered.append({"title": name, "body": content})

        entries[slug] = {
            "slug": slug,
            "path": path_str,
            "title": field("Title"),
            "metaDescription": field("Meta"),
            "h1": field("H1"),
            "lead": section_map.get("Lead", ""),
            "secciones": ordered,
            "faqs": faqs,
        }
    return entries


def emit_ts(varname: str, type_name: str, entries: dict, out_path: Path):
    def ts_string(s: str) -> str:
        return json.dumps(s, ensure_ascii=False)

    lines = [
        "/** Generado desde content/copy-*.md — regenerar: python3 web/scripts/parse-seo-copy.py */",
        "import type { SeoCopyEntry } from '@/lib/seo-copy';",
        "",
        f"export const {varname}: Record<string, SeoCopyEntry> = {{",
    ]
    for slug, e in entries.items():
        lines.append(f"  {ts_string(slug)}: {{")
        for key in ("slug", "path", "title", "metaDescription", "h1", "lead"):
            lines.append(f"    {key}: {ts_string(e[key])},")
        lines.append("    secciones: [")
        for s in e["secciones"]:
            lines.append("      {")
            lines.append(f"        title: {ts_string(s['title'])},")
            lines.append(f"        body: {ts_string(s['body'])},")
            lines.append("      },")
        lines.append("    ],")
        lines.append("    faqs: [")
        for f in e["faqs"]:
            lines.append("      {")
            lines.append(f"        q: {ts_string(f['q'])},")
            lines.append(f"        a: {ts_string(f['a'])},")
            lines.append("      },")
        lines.append("    ],")
        lines.append("  },")
    lines.append("};")
    lines.append("")
    lines.append(
        f"export function get{type_name}Copy(slug: string): SeoCopyEntry | null {{"
    )
    lines.append(f"  return {varname}[slug] ?? null;")
    lines.append("}")
    lines.append("")
    out_path.write_text("\n".join(lines))
    print("wrote", out_path, len(entries))


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for name in ("copy-medidas.md", "copy-autos.md"):
        (OUT / name).write_text((ROOT / "content" / name).read_text())
    medidas = parse_file(ROOT / "content" / "copy-medidas.md", "/medida/")
    autos = parse_file(ROOT / "content" / "copy-autos.md", "/auto/")
    assert len(medidas) == 24, len(medidas)
    assert len(autos) == 17, len(autos)
    emit_ts("MEDIDAS_COPY", "Medida", medidas, OUT / "medidas.ts")
    emit_ts("AUTOS_COPY", "Auto", autos, OUT / "autos.ts")


if __name__ == "__main__":
    main()
