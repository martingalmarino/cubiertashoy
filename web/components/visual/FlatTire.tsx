/** Cubierta “pinchada” para estados vacíos. */
export function FlatTire({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 120"
      className={className}
      aria-hidden
      focusable="false"
    >
      <ellipse
        cx="80"
        cy="62"
        rx="52"
        ry="42"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeDasharray="6 5"
        className="text-borde-fuerte"
      />
      <ellipse
        cx="80"
        cy="62"
        rx="22"
        ry="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-tinta-400"
      />
      <path
        d="M48 88 Q80 102 112 88"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        className="text-tinta-500"
      />
    </svg>
  );
}
