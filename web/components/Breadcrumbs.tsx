import Link from "next/link";
import { cn } from "@/lib/utils";

export type Crumb = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: Crumb[];
  className?: string;
};

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav aria-label="Migas de pan" className={cn("text-sm", className)}>
      <ol className="flex flex-wrap items-center gap-1.5 text-tinta-500">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li
              key={`${item.label}-${i}`}
              className="inline-flex items-center gap-1.5"
            >
              {i > 0 && (
                <span aria-hidden className="text-tinta-400">
                  ›
                </span>
              )}
              {item.href && !last ? (
                <Link
                  href={item.href}
                  className="inline-flex min-h-11 items-center transition-colors hover:text-tinta-900"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(last && "font-medium text-tinta-900")}
                  aria-current={last ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
