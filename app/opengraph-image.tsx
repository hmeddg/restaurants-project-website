import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const alt = `${siteConfig.name} — Good food. Beautiful moments.`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Satori renders without the app's CSS, so it needs the brand colours inline.
const colors = {
  deep: "#050c09",
  archMid: "#132d23",
  gold: "#d2b16d",
  ivory: "#f4efe3",
  mist: "#aeb9b0",
};

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: `radial-gradient(circle at 50% 75%, ${colors.archMid} 0%, ${colors.deep} 70%)`,
        color: colors.ivory,
      }}
    >
      <div style={{ fontSize: 24, letterSpacing: 8, color: colors.gold }}>
        A CELEBRATION OF TASTE
      </div>
      <div style={{ marginTop: 28, fontSize: 96 }}>Good food.</div>
      <div style={{ fontSize: 96, fontStyle: "italic", color: colors.gold }}>
        Beautiful moments.
      </div>
      <div style={{ marginTop: 40, fontSize: 36, color: colors.mist }}>
        {siteConfig.name}
      </div>
    </div>,
    size,
  );
}
