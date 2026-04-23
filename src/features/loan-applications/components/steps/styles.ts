import type { CSSProperties } from "react";

// ─── BRAND TOKENS ─────────────────────────────────────────────────────────────
export const C = {
  forest900: "#1A3326", forest800: "#22422F", forest700: "#2D5A3D",
  forest600: "#3A6E4A", forest100: "#D6EBD8", forest50:  "#EFF7F0",
  cream:     "#FAF8F5", sand100:   "#F0EDE8", sand200:   "#DDD9D2",
  sand400:   "#9E9A92", sand600:   "#5E5A54", sand800:   "#2A2724",
  sand900:   "#1A1814",
  gold:      "#C9933A", goldSoft:  "#FBF3E6",
  coral:     "#C0524A", coralSoft: "#FDF1F0",
  sky:       "#3D6E8A", skySoft:   "#E8F1F7",
  white:     "#FFFFFF",
};

export const fonts = {
  display: "'Georgia', 'Times New Roman', serif",
  body:    "'Trebuchet MS', 'Lucida Sans Unicode', sans-serif",
};

// ─── SHARED STYLES ────────────────────────────────────────────────────────────
export const card: CSSProperties = {
  background: "#FFFFFF", borderRadius: 14, border: "1px solid #DDD9D2", overflow: "hidden",
};

export const cardHead: CSSProperties = {
  padding: "18px 22px", borderBottom: "1px solid #F0EDE8",
  display: "flex", alignItems: "center", gap: 8,
};

export const footerNav: CSSProperties = {
  display: "flex", justifyContent: "space-between", alignItems: "center",
  padding: "18px 22px", borderTop: "1px solid #F0EDE8",
};

export const btnBack: CSSProperties = {
  padding: "9px 20px", borderRadius: 9, border: "1px solid #DDD9D2",
  background: "#FFFFFF", color: "#2A2724",
  fontFamily: "'Trebuchet MS','Lucida Sans Unicode',sans-serif",
  fontSize: 13, fontWeight: 600, cursor: "pointer",
};

export const btnNext: CSSProperties = {
  padding: "9px 22px", borderRadius: 9, border: "none",
  background: "#2D5A3D", color: "#FFFFFF",
  fontFamily: "'Trebuchet MS','Lucida Sans Unicode',sans-serif",
  fontSize: 13, fontWeight: 700, cursor: "pointer",
};