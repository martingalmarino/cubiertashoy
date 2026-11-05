import { Skeleton } from "@/components/ui/skeleton";

export default function MedidaLoading() {
  return (
    <div className="animate-pulse">
      <div className="border-b border-ambar-500/30 bg-ambar-100">
        <div className="container-site py-2.5">
          <Skeleton className="mx-auto h-4 w-72 bg-ambar-500/30" />
        </div>
      </div>
      <div className="container-site py-8 sm:py-10">
        <Skeleton className="h-4 w-48 bg-niebla-100" />
        <Skeleton className="mt-6 h-8 w-36 rounded-full bg-asfalto-950/90" />
        <Skeleton className="mt-4 h-12 w-full max-w-xl bg-niebla-100" />
        <Skeleton className="mt-3 h-5 w-64 bg-niebla-100" />

        <div className="mt-8 grid gap-4 lg:grid-cols-5">
          <div className="rounded-lg border border-niebla-200 border-l-4 border-l-verde-600 bg-white p-6 lg:col-span-3">
            <Skeleton className="h-3 w-28 bg-verde-50" />
            <Skeleton className="mt-3 h-7 w-56 bg-niebla-100" />
            <Skeleton className="mt-5 h-12 w-48 bg-niebla-100" />
            <Skeleton className="mt-6 h-12 w-40 bg-azul-600/20" />
          </div>
          <div className="rounded-lg border border-niebla-200 bg-white p-6 lg:col-span-2">
            <Skeleton className="h-3 w-20 bg-niebla-100" />
            <Skeleton className="mt-4 h-8 w-36 bg-niebla-100" />
            <Skeleton className="mt-4 h-8 w-32 bg-niebla-100" />
            <Skeleton className="mt-4 h-8 w-28 bg-niebla-100" />
          </div>
        </div>

        <Skeleton className="mt-12 h-8 w-48 bg-niebla-100" />
        <Skeleton className="mt-4 h-64 w-full rounded-lg bg-niebla-100" />
      </div>
    </div>
  );
}
