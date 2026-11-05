import { ImageResponse } from "next/og";
import { getMedida, getOfertas } from "@/lib/data";
import { formatARS } from "@/lib/format";

export const alt = "Precio de cubiertas por medida";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function MedidaOpenGraphImage({ params }: Props) {
  const { slug } = await params;
  const medida = getMedida(slug);
  const label = medida?.label ?? slug;
  const ofertas = await getOfertas(slug);
  const desde = ofertas[0]?.precioEfectivo;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0B0F14",
          padding: 64,
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: "#FAFAF7",
              letterSpacing: "-0.02em",
            }}
          >
            cubiertas
          </span>
          <span
            style={{
              background: "#F5A524",
              color: "#0B0F14",
              borderRadius: 999,
              padding: "4px 14px",
              fontSize: 22,
              fontWeight: 700,
              fontFamily: "ui-monospace, Menlo, monospace",
            }}
          >
            hoy
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontFamily: "ui-monospace, Menlo, monospace",
              fontSize: 72,
              fontWeight: 700,
              color: "#FAFAF7",
              letterSpacing: "-0.02em",
            }}
          >
            {label}
          </div>
          <div style={{ fontSize: 28, color: "#8A96A3" }}>
            Precio de cubiertas {label} hoy
          </div>
          {desde != null ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ fontSize: 20, color: "#8A96A3" }}>desde</div>
              <div
                style={{
                  fontFamily: "ui-monospace, Menlo, monospace",
                  fontSize: 56,
                  fontWeight: 700,
                  color: "#F5A524",
                }}
              >
                {formatARS(desde)}
              </div>
              <div style={{ fontSize: 20, color: "#8A96A3" }}>por unidad</div>
            </div>
          ) : (
            <div style={{ fontSize: 28, color: "#8A96A3" }}>
              Compará ofertas por tienda
            </div>
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}
