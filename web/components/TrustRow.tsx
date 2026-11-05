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
    <ul className="mx-auto grid max-w-3xl grid-cols-3 gap-2 text-center sm:gap-4 sm:text-left">
      {items.map((item) => (
        <li
          key={item.title}
          className="flex flex-col items-center gap-2 sm:flex-row sm:items-start sm:gap-3"
        >
          <span className="grid size-9 shrink-0 place-items-center rounded-full border border-borde bg-white text-tinta-700 sm:size-11">
            <item.icon className="size-4 sm:size-5" aria-hidden strokeWidth={1.75} />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-tinta-900 sm:text-sm">
              {item.title}
            </p>
            <p className="text-xs text-tinta-500 sm:text-sm">{item.body}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}