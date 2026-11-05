export default function Loading() {
  return (
    <div>
      <div className="flex justify-center pt-3">
        <div className="h-9 w-72 rounded-full skeleton-shimmer" />
      </div>
      <section className="grad-suave py-16 md:py-24">
        <div className="container-site">
          <div className="mx-auto h-12 w-full max-w-xl rounded-lg skeleton-shimmer" />
          <div className="mx-auto mt-4 h-5 w-80 rounded skeleton-shimmer" />
          <div className="mx-auto mt-10 h-16 max-w-3xl rounded-full border border-borde bg-superficie skeleton-shimmer" />
          <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-14 rounded-xl skeleton-shimmer" />
            ))}
          </div>
        </div>
      </section>
      <div className="container-site py-10">
        <div className="h-28 rounded-xl skeleton-shimmer" />
        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-36 rounded-lg border border-borde skeleton-shimmer" />
          ))}
        </div>
      </div>
    </div>
  );
}
