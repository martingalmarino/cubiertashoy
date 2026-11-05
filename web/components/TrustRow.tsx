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
    <ul className="mx-auto grid max-w-3xl grid-cols-1 gap-4 text-left sm:grid-cols-3">
      {items.map((item) => (
        <li key={item.title} className="flex items-start gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-full border border-borde bg-white text-tinta-700 dark:bg-superficie">
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
