"use client";

import { useMemo, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import type { Vehicle } from "@/lib/types";

type AutoVersionPickerProps = {
  vehicle: Vehicle;
};

export function AutoVersionPicker({ vehicle }: AutoVersionPickerProps) {
  const router = useRouter();
  const params = useSearchParams();
  const [, startTransition] = useTransition();

  const versions = useMemo(() => {
    const set = new Set<string>();
    for (const s of vehicle.sizes) {
      if (s.version) set.add(s.version);
    }
    return [...set];
  }, [vehicle.sizes]);

  const years = useMemo(() => {
    const set = new Set<number>();
    for (const s of vehicle.sizes) {
      const from = s.anioDesde ?? 2005;
      const to = s.anioHasta ?? new Date().getFullYear();
      for (let y = from; y <= to; y++) set.add(y);
    }
    return [...set].sort((a, b) => b - a);
  }, [vehicle.sizes]);

  const version = params.get("version") ?? "";
  const anio = params.get("anio") ?? "";

  function update(next: { version?: string; anio?: string }) {
    const sp = new URLSearchParams(params.toString());
    const v = next.version !== undefined ? next.version : version;
    const a = next.anio !== undefined ? next.anio : anio;
    if (v) sp.set("version", v);
    else sp.delete("version");
    if (a) sp.set("anio", a);
    else sp.delete("anio");
    const qs = sp.toString();
    startTransition(() => {
      router.replace(
        qs ? `/auto/${vehicle.slug}?${qs}` : `/auto/${vehicle.slug}`,
        { scroll: false }
      );
    });
  }

  if (versions.length === 0 && years.length === 0) return null;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
      {versions.length > 0 ? (
        <div>
          <p className="mb-2 text-sm font-medium text-tinta-500">
            Elegí tu versión
          </p>
          <div
            role="group"
            aria-label="Versión"
            className="flex flex-wrap gap-2"
          >
            {versions.map((v) => (
              <button
                key={v}
                type="button"
                aria-pressed={version === v}
                onClick={() => update({ version: version === v ? "" : v })}
                className={cn(
                  "inline-flex min-h-11 items-center rounded-full px-4 text-sm font-medium transition-colors",
                  "focus-visible:ring-2 focus-visible:ring-accion-600 focus-visible:ring-offset-2",
                  version === v
                    ? "bg-tinta-900 text-white"
                    : "bg-superficie text-tinta-700 ring-1 ring-borde hover:bg-fondo"
                )}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {years.length > 0 ? (
        <div className="min-w-[140px]">
          <label
            htmlFor="auto-anio"
            className="mb-2 block text-sm font-medium text-tinta-500"
          >
            Año
          </label>
          <select
            id="auto-anio"
            value={anio}
            onChange={(e) => update({ anio: e.target.value })}
            className={cn(
              "min-h-11 w-full rounded-xl border border-borde bg-superficie px-3 text-sm text-tinta-900",
              "focus-visible:border-accion-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accion-600/20"
            )}
          >
            <option value="">Cualquiera</option>
            {years.map((y) => (
              <option key={y} value={String(y)}>
                {y}
              </option>
            ))}
          </select>
        </div>
      ) : null}
    </div>
  );
}
