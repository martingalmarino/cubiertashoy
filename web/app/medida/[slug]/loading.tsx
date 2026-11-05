export default function MedidaLoading() {
  return (
    <div>
      <div className="flex justify-center pt-3">
        <div className="h-9 w-72 rounded-full skeleton-shimmer" />
      </div>
      <div className="container-site py-8 sm:py-10">
        <div className="h-4 w-48 rounded skeleton-shimmer" />
        <div className="mt-6 h-8 w-36 rounded-full skeleton-shimmer" />
        <div className="mt-4 h-12 w-full max-w-xl rounded-lg skeleton-shimmer" />
        <div className="mt-3 h-5 w-64 rounded skeleton-shimmer" />

        <div className="mt-8 grid gap-4 lg:grid-cols-5">
          <div className="rounded-xl border-2 border-ahorro-600 bg-superficie p-6 lg:col-span-3">
            <div className="h-6 w-full rounded bg-ahorro-600/20 skeleton-shimmer" />
            <div className="mt-4 h-7 w-56 rounded skeleton-shimmer" />
            <div className="mt-5 h-12 w-48 rounded skeleton-shimmer" />
            <div className="mt-6 grid grid-cols-2 gap-2">
              <div className="h-16 rounded-lg skeleton-shimmer" />
              <div className="h-16 rounded-lg skeleton-shimmer" />
            </div>
            <div className="mt-4 h-12 w-40 rounded-full skeleton-shimmer" />
          </div>
          <div className="rounded-xl border border-borde bg-superficie p-6 lg:col-span-2">
            <div className="h-3 w-20 rounded skeleton-shimmer" />
            <div className="mt-4 h-8 w-36 rounded skeleton-shimmer" />
            <div className="mt-4 h-8 w-32 rounded skeleton-shimmer" />
            <div className="mt-4 h-8 w-28 rounded skeleton-shimmer" />
          </div>
        </div>

        <div className="mt-12 h-8 w-48 rounded skeleton-shimmer" />
        <div className="mt-4 h-64 w-full rounded-xl border border-borde skeleton-shimmer" />
      </div>
    </div>
  );
}
