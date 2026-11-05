export function HoyUnderline({ className }: { className?: string }) {
  return (
    <span className={`relative inline-block ${className ?? ""}`}>
      hoy
      <svg
        className="absolute -bottom-1 left-0 h-2.5 w-full text-ambar-500"
        viewBox="0 0 80 10"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d="M2 7 C22 2, 58 2, 78 7"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
