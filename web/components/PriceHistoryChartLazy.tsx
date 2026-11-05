"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import type { HistorialPunto } from "@/lib/types";

const Chart = dynamic(
  () =>
    import("@/components/PriceHistoryChart").then((m) => m.PriceHistoryChart),
  {
    ssr: false,
    loading: () => (
      <section aria-labelledby="historial-heading">
        <h2
          id="historial-heading"
          className="mb-4 font-display text-xl font-semibold tracking-[-0.02em] text-asfalto-950"
        >
          Historial de precios
        </h2>
        <Skeleton className="h-64 w-full rounded-lg bg-niebla-100" />
      </section>
    ),
  }
);

type Props = {
  historial: HistorialPunto[];
  medidaLabel: string;
};

export function PriceHistoryChartLazy(props: Props) {
  return <Chart {...props} />;
}
