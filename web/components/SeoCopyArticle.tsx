import { SeoCopyRichText } from "@/components/SeoCopyRichText";
import type { SeoCopyEntry } from "@/lib/seo-copy";

type SeoCopyArticleProps = {
  copy: SeoCopyEntry;
};

/** Bloque editorial SEO debajo de la tabla/ofertas. */
export function SeoCopyArticle({ copy }: SeoCopyArticleProps) {
  if (!copy.lead && copy.secciones.length === 0) return null;

  return (
    <article className="my-10 max-w-3xl space-y-8">
      {copy.lead ? (
        <SeoCopyRichText
          text={copy.lead}
          className="text-base leading-relaxed text-tinta-700"
        />
      ) : null}

      {copy.secciones.map((s) => (
        <section key={s.title} aria-labelledby={`seo-${slugify(s.title)}`}>
          <h2
            id={`seo-${slugify(s.title)}`}
            className="text-xl font-semibold tracking-[-0.02em] text-tinta-900 md:text-2xl"
          >
            {s.title}
          </h2>
          <SeoCopyRichText
            text={s.body}
            className="mt-2 text-base leading-relaxed text-tinta-700"
          />
        </section>
      ))}
    </article>
  );
}

function slugify(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
