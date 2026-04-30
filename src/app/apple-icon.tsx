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
          alignItems: "center",
          justifyContent: "center",
          background: "#1f2624",
          color: "#e2e4e1",
          fontSize: 132,
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontStyle: "italic",
          fontWeight: 400,
          letterSpacing: "-0.02em",
          paddingBottom: 14,
        }}
      >
        §
      </div>
    ),
    { ...size },
  );
}
