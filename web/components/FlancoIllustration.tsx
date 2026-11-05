type FlancoIllustrationProps = {
  medida?: string;
  className?: string;
};

/** Ilustración simple de un flanco con la medida resaltada. */
export function FlancoIllustration({
  medida = "175/65 R14",
  className,
}: FlancoIllustrationProps) {
  return (
    <figure className={className}>
      <svg
        viewBox="0 0 320 140"
        role="img"
        aria-label={`Flanco de cubierta con la medida ${medida}`}
        className="mx-auto h-auto w-full max-w-sm"
      >
        <rect width="320" height="140" rx="16" fill="#0B0F14" />
        {/* Textura sutil */}
        <defs>
          <pattern
            id="tread"
            width="10"
            height="10"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(-45)"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="10"
              stroke="#FFFFFF"
              strokeOpacity="0.06"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="320" height="140" rx="16" fill="url(#tread)" />

        {/* Arco del flanco */}
        <path
          d="M28 118 C60 28, 260 28, 292 118"
          fill="none"
          stroke="#3A4552"
          strokeWidth="18"
          strokeLinecap="round"
        />
        <path
          d="M44 118 C72 48, 248 48, 276 118"
          fill="none"
          stroke="#1C232C"
          strokeWidth="10"
          strokeLinecap="round"
        />

        {/* Medida en relieve */}
        <text
          x="160"
          y="78"
          textAnchor="middle"
          fill="#FAFAF7"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          fontSize="22"
          fontWeight="700"
          letterSpacing="1"
        >
          {medida}
        </text>
        <text
          x="160"
          y="100"
          textAnchor="middle"
          fill="#F5A524"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          fontSize="11"
          fontWeight="600"
        >
          Tu medida va acá
        </text>
      </svg>
      <figcaption className="mt-3 text-center text-sm text-asfalto-600">
        ¿Dónde está tu medida?
      </figcaption>
    </figure>
  );
}
