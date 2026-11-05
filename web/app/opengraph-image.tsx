import { ImageResponse } from "next/og";

export const alt = "cubiertas hoy — compará precios de cubiertas por medida";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
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
              fontSize: 40,
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
              padding: "6px 16px",
              fontSize: 28,
              fontWeight: 700,
              fontFamily: "ui-monospace, Menlo, monospace",
            }}
          >
            hoy
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: "#FAFAF7",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              maxWidth: 900,
            }}
          >
            El mejor precio de tu cubierta, hoy.
          </div>
          <div style={{ fontSize: 28, color: "#8A96A3" }}>
            Compará tiendas de todo el país por medida exacta.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontFamily: "ui-monospace, Menlo, monospace",
            fontSize: 36,
            fontWeight: 700,
            color: "#F5A524",
            letterSpacing: "0.02em",
          }}
        >
          175/65 R14
        </div>
      </div>
    ),
    { ...size }
  );
}
