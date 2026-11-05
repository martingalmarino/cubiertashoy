import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Favicon: cápsula ámbar "hoy". */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F5A524",
          borderRadius: 8,
          fontSize: 12,
          fontWeight: 700,
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          color: "#0B0F14",
          letterSpacing: "-0.02em",
        }}
      >
        hoy
      </div>
    ),
    { ...size }
  );
}
