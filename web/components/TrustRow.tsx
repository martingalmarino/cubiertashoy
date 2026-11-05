import { RefreshCw, Store, TrendingDown } from "lucide-react";

type TrustRowProps = {
  tiendas: number;
};

export function TrustRow({ tiendas }: TrustRowProps) {
  const items = [
    {
      icon: Store,
      title: `+${tiendas} tiendas`,
      body: "precios actualizados",
    },
    {
      icon: RefreshCw,
      title: "Monitoreo diario",
      body: "cada 24 h",
    },
    {
      icon: TrendingDown,
      title: "Historial 90 días",
      body: "descuento real",
    },
  ] as const;

  return (
    <ul className="grid gap-4 sm:grid-cols-3">
      {items.map((item) => (
        <li key={item.title} className="flex items-start gap-3">
          <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-borde bg-superficie text-accion-600 shadow-card">
            <item.icon className="size-5" aria-hidden strokeWidth={1.75} />
          </span>
          <div>
            <p className="text-sm font-semibold text-tinta-900">{item.title}</p>
            <p className="text-sm text-tinta-500">{item.body}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
