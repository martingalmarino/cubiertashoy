import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B0F14",
          gap: 12,
        }}
      >
        <div
          style={{
            fontSize: 36,
            fontWeight: 700,
            color: "#FAFAF7",
            fontFamily: "ui-sans-serif, system-ui, sans-serif",
            letterSpacing: "-0.02em",
          }}
        >
          cubiertas
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#F5A524",
            borderRadius: 999,
            padding: "8px 20px",
            fontSize: 28,
            fontWeight: 700,
            fontFamily: "ui-monospace, Menlo, monospace",
            color: "#0B0F14",
          }}
        >
          hoy
        </div>
      </div>
    ),
    { ...size }
  );
}
