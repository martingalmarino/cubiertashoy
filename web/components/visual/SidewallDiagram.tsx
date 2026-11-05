type SidewallDiagramProps = {
  ancho: number | "";
  perfil: number | "";
  rodado: number | "";
};

/** Diagrama del flanco señalando ancho / perfil / rodado. */
export function SidewallDiagram({
  ancho,
  perfil,
  rodado,
}: SidewallDiagramProps) {
  const a = ancho === "" ? "175" : String(ancho);
  const p = perfil === "" ? "65" : String(perfil);
  const r = rodado === "" ? "14" : String(rodado);

  return (
    <svg
      viewBox="0 0 280 160"
      className="mx-auto h-auto w-full max-w-xs text-papel"
      role="img"
      aria-label={`Diagrama del flanco: ${a}/${p} R${r}`}
    >
      <path
        d="M24 140 C48 36, 232 36, 256 140"
        fill="none"
        stroke="#3A4552"
        strokeWidth="22"
        strokeLinecap="round"
      />
      <path
        d="M40 140 C60 56, 220 56, 240 140"
        fill="none"
        stroke="#1C232C"
        strokeWidth="12"
        strokeLinecap="round"
      />

      {/* Ancho */}
      <line x1="70" y1="88" x2="70" y2="48" stroke="#F5A524" strokeWidth="1.5" />
      <text x="70" y="40" textAnchor="middle" fill="#F5A524" fontSize="10" fontFamily="ui-monospace, monospace">
        Ancho
      </text>
      <text x="70" y="100" textAnchor="middle" fill="#FAFAF7" fontSize="13" fontWeight="700" fontFamily="ui-monospace, monospace">
        {a}
      </text>

      {/* Perfil */}
      <line x1="140" y1="72" x2="140" y2="36" stroke="#F5A524" strokeWidth="1.5" />
      <text x="140" y="28" textAnchor="middle" fill="#F5A524" fontSize="10" fontFamily="ui-monospace, monospace">
        Perfil
      </text>
      <text x="140" y="88" textAnchor="middle" fill="#FAFAF7" fontSize="13" fontWeight="700" fontFamily="ui-monospace, monospace">
        {p}
      </text>

      {/* Rodado */}
      <line x1="210" y1="88" x2="210" y2="48" stroke="#F5A524" strokeWidth="1.5" />
      <text x="210" y="40" textAnchor="middle" fill="#F5A524" fontSize="10" fontFamily="ui-monospace, monospace">
        Rodado
      </text>
      <text x="210" y="100" textAnchor="middle" fill="#FAFAF7" fontSize="13" fontWeight="700" fontFamily="ui-monospace, monospace">
        R{r}
      </text>
    </svg>
  );
}
