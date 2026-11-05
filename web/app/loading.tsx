import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="border-b border-ambar-500/30 bg-ambar-100">
        <div className="container-site py-2.5">
          <Skeleton className="mx-auto h-4 w-72 bg-ambar-500/30" />
        </div>
      </div>
      <section className="bg-asfalto-950 py-12 sm:py-16">
        <div className="container-site">
          <Skeleton className="mx-auto h-12 w-full max-w-xl bg-asfalto-800" />
          <Skeleton className="mx-auto mt-4 h-5 w-80 bg-asfalto-800" />
          <div className="mx-auto mt-8 max-w-2xl rounded-xl border border-niebla-200/20 bg-white p-6">
            <Skeleton className="h-11 w-64 bg-niebla-100" />
            <div className="mt-5 flex gap-2">
              <Skeleton className="h-12 flex-1 bg-niebla-100" />
              <Skeleton className="h-12 flex-1 bg-niebla-100" />
              <Skeleton className="h-12 w-20 bg-niebla-100" />
            </div>
            <Skeleton className="mt-4 h-12 w-full bg-azul-600/20" />
          </div>
        </div>
      </section>
      <div className="container-site py-12">
        <Skeleton className="h-8 w-56 bg-niebla-100" />
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-lg bg-niebla-100" />
          ))}
        </div>
      </div>
    </div>
  );
}
