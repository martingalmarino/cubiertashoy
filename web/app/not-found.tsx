import Link from "next/link";
import { MedidaSearch } from "@/components/MedidaSearch";
import { FlatTire } from "@/components/visual/FlatTire";
import { getMedidas } from "@/lib/data";

export default function NotFound() {
  const medidas = getMedidas();

  return (
    <div className="container-site flex flex-1 flex-col items-center py-16 text-center md:py-24">
      <FlatTire className="h-24 w-auto text-tinta-400" />
      <p className="mt-4 font-mono text-sm font-medium tabular-nums text-tinta-500">
        404
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-[-0.02em] text-tinta-900 sm:text-4xl">
        No encontramos esa medida
      </h1>
      <p className="mt-3 max-w-md text-tinta-500">
        Puede que el enlace esté mal o que todavía no la tengamos. Buscá por
        ancho, perfil y rodado.
      </p>

      <div className="mt-10 w-full max-w-2xl text-left">
        <MedidaSearch medidas={medidas} />
      </div>

      <Link
        href="/"
        className="mt-8 inline-flex min-h-11 items-center justify-center rounded-full border border-borde bg-superficie px-5 text-sm font-medium text-tinta-900 shadow-card transition-colors hover:bg-fondo focus-visible:ring-2 focus-visible:ring-accion-600 focus-visible:ring-offset-2"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
