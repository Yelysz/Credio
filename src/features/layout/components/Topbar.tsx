import React, { useState } from "react";
import type { Role, RolesConfig } from "../../../shared/types/layout.types";

// ─── BRAND TOKENS ─────────────────────────────────────────────────────────────
const C = {
  forest900: "#1A3326", forest800: "#22422F", forest700: "#2D5A3D",
  forest600: "#3A6E4A", forest100: "#D6EBD8", forest50:  "#EFF7F0",
  cream:     "#FAF8F5", sand100:   "#F0EDE8", sand200:   "#DDD9D2",
  sand400:   "#9E9A92", sand600:   "#5E5A54", sand800:   "#2A2724",
  sand900:   "#1A1814", coral:     "#C0524A", white:     "#FFFFFF",
};

const fonts = {
  display: "'Georgia', 'Times New Roman', serif",
  body:    "'Trebuchet MS', 'Lucida Sans Unicode', sans-serif",
};

interface TopbarProps {
  role: Role;
  user: { name: string; email: string };
  onLogout: () => void;
  rolesConfig: RolesConfig;
}

export const Topbar: React.FC<TopbarProps> = ({ role, user, onLogout, rolesConfig }) => {
  const cfg = rolesConfig[role];
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const initials = user.name
    .split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();

  const today = new Date().toLocaleDateString("es-DO", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <header style={header}>

      {/* Left: greeting */}
      <div>
        <div style={greetingStyle}>
          {cfg.greeting(user.name.split(" ")[0])}
        </div>
        <div style={dateStyle}>{today}</div>
      </div>

      {/* Right: bell + user */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>

        {/* Bell */}
        <button style={bellBtn} title="Notificaciones" aria-label="Notificaciones">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke={C.sand600} strokeWidth="1.8" strokeLinecap="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span style={bellDot} />
        </button>

        {/* User pill + dropdown */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setDropdownOpen(o => !o)}
            style={userBtn}
            aria-expanded={dropdownOpen}
          >
            <div style={{ ...avatarStyle, background: C.forest700 }}>{initials}</div>
            <span style={userNameStyle}>{user.name}</span>
            <span style={{ fontSize: 9, color: C.sand400, marginLeft: 2 }}>▾</span>
          </button>

          {dropdownOpen && (
            <div style={dropdown}>
              <div style={ddHead}>
                <span style={ddRolePill}>{cfg.label}</span>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.sand900, marginTop: 5, fontFamily: fonts.display }}>
                  {user.name}
                </div>
                <div style={{ fontSize: 11, color: C.sand400, fontFamily: fonts.body }}>{user.email}</div>
              </div>
              <button style={ddItem}>Mi Perfil</button>
              <button style={ddItem}>Configuración</button>
              <div style={{ height: 1, background: C.sand100 }} />
              <button onClick={onLogout} style={{ ...ddItem, color: C.coral, fontWeight: 700 }}>
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

// ─── STYLES ───────────────────────────────────────────────────────────────────
const header: React.CSSProperties = {
  height: 58, background: C.white, borderBottom: `1px solid ${C.sand200}`,
  display: "flex", alignItems: "center", justifyContent: "space-between",
  padding: "0 24px", flexShrink: 0, position: "sticky", top: 0, zIndex: 20,
  fontFamily: fonts.body,
};
const greetingStyle: React.CSSProperties = {
  fontFamily: fonts.display, fontSize: 14, fontWeight: 700, color: C.sand900, lineHeight: 1.2,
};
const dateStyle: React.CSSProperties = { fontSize: 11, color: C.sand400, marginTop: 2 };
const bellBtn: React.CSSProperties = {
  position: "relative", width: 34, height: 34, borderRadius: 9,
  border: `1px solid ${C.sand200}`, background: C.sand100,
  display: "flex", alignItems: "center", justifyContent: "center",
  cursor: "pointer", flexShrink: 0,
};
const bellDot: React.CSSProperties = {
  position: "absolute", top: 7, right: 7, width: 7, height: 7,
  borderRadius: "50%", background: C.coral, border: `2px solid ${C.white}`,
};
const userBtn: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 8,
  padding: "4px 12px 4px 4px", background: C.sand100,
  border: `1px solid ${C.sand200}`, borderRadius: 50, cursor: "pointer",
};
const avatarStyle: React.CSSProperties = {
  width: 28, height: 28, borderRadius: "50%",
  display: "flex", alignItems: "center", justifyContent: "center",
  fontSize: 11, fontWeight: 700, color: C.white, flexShrink: 0,
};
const userNameStyle: React.CSSProperties = {
  fontFamily: fonts.display, fontSize: 12, fontWeight: 700, color: C.sand900,
};
const dropdown: React.CSSProperties = {
  position: "absolute", top: "calc(100% + 8px)", right: 0,
  width: 210, background: C.white, borderRadius: 12,
  border: `1px solid ${C.sand200}`,
  boxShadow: "0 8px 30px rgba(26,24,20,.10)",
  overflow: "hidden", zIndex: 100,
};
const ddHead: React.CSSProperties = {
  padding: "12px 16px", background: C.sand100, borderBottom: `1px solid ${C.sand200}`,
};
const ddRolePill: React.CSSProperties = {
  display: "inline-flex", fontSize: 10, fontWeight: 700,
  color: C.forest700, background: C.forest50, border: `1px solid ${C.forest100}`,
  padding: "2px 8px", borderRadius: 10, fontFamily: fonts.body,
};
const ddItem: React.CSSProperties = {
  width: "100%", padding: "10px 16px", background: "transparent",
  border: "none", textAlign: "left", fontSize: 13, color: C.sand600,
  cursor: "pointer", fontFamily: fonts.body, display: "block",
};