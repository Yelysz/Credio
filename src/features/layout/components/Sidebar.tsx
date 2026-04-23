import React from "react";
import { NavLink } from "react-router-dom";
import type { Role, RolesConfig } from "../../../shared/types/layout.types";

const C = {
  forest900: "#1A3326", forest800: "#22422F", forest700: "#2D5A3D",
  forest600: "#3A6E4A", forest500: "#4A8A5A", forest300: "#7CB98A",
  forest100: "#D6EBD8", forest50: "#EFF7F0",
  cream: "#FAF8F5", sand100: "#F0EDE8", sand200: "#DDD9D2",
  sand400: "#9E9A92", sand600: "#5E5A54", sand800: "#2A2724",
  sand900: "#1A1814", white: "#FFFFFF",
};

const fonts = {
  display: "'Georgia', 'Times New Roman', serif",
  body: "'Trebuchet MS', 'Lucida Sans Unicode', sans-serif",
};

interface SidebarProps {
  role: Role;
  user: { name: string; role: Role };
  collapsed: boolean;
  onToggle: () => void;
  rolesConfig: RolesConfig;
}

export const Sidebar: React.FC<SidebarProps> = ({
  user,
  collapsed,
  onToggle,
  rolesConfig,
}) => {
  const cfg = rolesConfig[user.role] ?? rolesConfig.Client;

  const initials = user.name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const RoleIcon = cfg.icon;

  return (
    <aside style={{ ...aside, width: collapsed ? 72 : 232 }}>
      <div
        onClick={onToggle}
        style={{
          ...logoRow,
          padding: collapsed ? "0" : "0 18px",
          justifyContent: collapsed ? "center" : "flex-start",
          cursor: "pointer",
        }}
      >
        <CredioMark size={34} />
        {!collapsed && (
          <div>
            <div
              style={{
                fontFamily: fonts.display,
                fontSize: 16,
                fontWeight: 700,
                color: C.sand900,
                letterSpacing: "-.3px",
                lineHeight: 1.1,
              }}
            >
              Credio
            </div>
            <div
              style={{
                fontSize: 9,
                color: C.sand400,
                letterSpacing: "1.4px",
                textTransform: "uppercase",
              }}
            >
              Sistema de Gestión
            </div>
          </div>
        )}
      </div>

      {!collapsed && (
        <div style={{ padding: "10px 18px 6px" }}>
          <span style={rolePill}>
            <RoleIcon size={14} strokeWidth={2.2} />
            <span>{cfg.label}</span>
          </span>
        </div>
      )}

      <nav style={{ flex: 1, padding: collapsed ? "8px 0" : "8px 10px", overflowY: "auto" }}>
        {cfg.nav.map((item, idx, arr) => {
          const Icon = item.icon;
          const showSection =
            !collapsed &&
            item.section &&
            (idx === 0 || arr[idx - 1].section !== item.section);

          return (
            <React.Fragment key={item.id}>
              {showSection && <div style={navSection}>{item.section}</div>}

              <NavLink
                to={item.path}
                end={item.path === "/"}
                title={collapsed ? item.label : ""}
                style={({ isActive }) => ({
                  ...navItem,
                  padding: collapsed ? "12px 0" : "10px 12px",
                  justifyContent: collapsed ? "center" : "flex-start",
                  borderRadius: collapsed ? 0 : 10,
                  background: isActive ? C.forest50 : "transparent",
                  color: isActive ? C.forest700 : C.sand600,
                  fontWeight: isActive ? 700 : 500,
                  borderLeft:
                    isActive && !collapsed
                      ? `3px solid ${C.forest600}`
                      : "3px solid transparent",
                })}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    width: collapsed ? "auto" : 18,
                  }}
                >
                  <Icon size={17} strokeWidth={2} />
                </span>

                {!collapsed && item.label}
              </NavLink>
            </React.Fragment>
          );
        })}
      </nav>

      <div
        style={{
          ...userFooter,
          padding: collapsed ? "12px 0" : "12px 14px",
          justifyContent: collapsed ? "center" : "flex-start",
        }}
      >
        <div style={avatarStyle}>{initials || "U"}</div>
        {!collapsed && (
          <div style={{ overflow: "hidden" }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: C.sand900,
                fontFamily: fonts.display,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user.name}
            </div>
            <div style={{ fontSize: 10, color: C.sand400, fontFamily: fonts.body }}>
              {cfg.label}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};


function CredioMark({ size = 34 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.265),
        background: C.forest800,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none">
        <path
          d="M18 6C14 4 8 5 6 10C4.5 14 6 18 10 19.5C7 17 7 13 9 10.5C11 8 15 7.5 18 9C17 7.5 17.5 6.5 18 6Z"
          fill="white"
          opacity="0.9"
        />
        <path
          d="M8 14C9 17 12 19 15 18.5C17 18 19 16 19.5 14C18 16 15 17 13 16C11 15 9.5 13 10 11C9 11.5 8 12.5 8 14Z"
          fill="white"
          opacity="0.55"
        />
      </svg>
    </div>
  );
}

const aside: React.CSSProperties = {
  minHeight: "100vh",
  background: C.white,
  borderRight: `1px solid ${C.sand200}`,
  display: "flex",
  flexDirection: "column",
  transition: "width 0.25s ease",
  flexShrink: 0,
  zIndex: 10,
  fontFamily: fonts.body,
};

const logoRow: React.CSSProperties = {
  height: 58,
  borderBottom: `1px solid ${C.sand200}`,
  display: "flex",
  alignItems: "center",
  gap: 10,
  flexShrink: 0,
};

const rolePill: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  fontSize: 11,
  fontWeight: 700,
  color: C.forest700,
  background: C.forest50,
  padding: "4px 10px",
  borderRadius: 20,
  border: `1px solid ${C.forest100}`,
  letterSpacing: "0.3px",
};

const navSection: React.CSSProperties = {
  fontSize: 9,
  fontWeight: 700,
  color: C.sand400,
  textTransform: "uppercase",
  letterSpacing: "1.2px",
  padding: "10px 12px 4px",
  marginTop: 4,
};

const navItem: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  fontSize: 13,
  marginBottom: 2,
  textDecoration: "none",
  borderLeft: "3px solid transparent",
  transition: "background .12s",
  boxSizing: "border-box",
};

const userFooter: React.CSSProperties = {
  borderTop: `1px solid ${C.sand200}`,
  display: "flex",
  alignItems: "center",
  gap: 9,
};

const avatarStyle: React.CSSProperties = {
  width: 32,
  height: 32,
  borderRadius: "50%",
  background: C.forest700,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 11,
  fontWeight: 700,
  color: C.white,
  flexShrink: 0,
};