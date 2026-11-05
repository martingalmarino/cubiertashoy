/** Patrón SVG de chevrons (banda de rodadura). */
export function TreadPattern({ id = "tread-chevrons" }: { id?: string }) {
  return (
    <pattern
      id={id}
      width="24"
      height="24"
      patternUnits="userSpaceOnUse"
      patternTransform="rotate(-18)"
    >
      <path
        d="M0 12 L6 6 L12 12 L18 6 L24 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M0 20 L6 14 L12 20 L18 14 L24 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.55"
      />
    </pattern>
  );
}
