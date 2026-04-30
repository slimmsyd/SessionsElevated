import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

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
          background: "#1f2624",
          color: "#e2e4e1",
          fontSize: 44,
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontStyle: "italic",
          fontWeight: 400,
          letterSpacing: "-0.02em",
          paddingBottom: 4,
        }}
      >
        §
      </div>
    ),
    { ...size },
  );
}
