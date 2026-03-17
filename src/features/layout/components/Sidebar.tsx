import React from 'react';
import type { Role, RolesConfig } from "../../../shared/types/layout.types";

const T = {
  green800: "#2C3A20",
  green700: "#3D5C28",
  green600: "#4E7A30",
  green500: "#5B7E3F",
  green400: "#7AAF52",
  green100: "#EFF3EB",
  gray200: "#E5E7EB",
  gray400: "#9CA3AF",
  gray600: "#4B5563",
  white: "#FFFFFF",
};

interface SidebarProps {
  role: Role;
  user: {
  name: string;
  role: Role;
};
  activeNav: string;
  onNav: (id: string) => void;
  collapsed: boolean;
  onToggle: () => void;
  rolesConfig: RolesConfig;
}

export const Sidebar: React.FC<SidebarProps> = ({
  user,
  activeNav,
  onNav,
  collapsed,
  onToggle,
  rolesConfig,
}) => {
  const cfg = rolesConfig[user.role];
  const initials = user.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <aside
      style={{
        width: collapsed ? 72 : 232,
        minHeight: "100vh",
        background: T.white,
        borderRight: `1px solid ${T.gray200}`,
        display: "flex",
        flexDirection: "column",
        transition: "width 0.25s ease",
        flexShrink: 0,
        zIndex: 10,
      }}
    >
      <div
        style={{
          padding: collapsed ? "16px 0" : "16px 18px",
          borderBottom: `1px solid ${T.gray200}`,
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "flex-start",
          minHeight: 64,
        }}
      >
        <LogoMark size={32} showText={!collapsed} onClick={onToggle} />
      </div>

      {!collapsed && (
        <div style={{ padding: "12px 18px 8px" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 3,
              fontSize: 11,
              fontWeight: 700,
              color: cfg.accent,
              background: cfg.light,
              padding: "3px 10px",
              borderRadius: 20,
              letterSpacing: "0.3px",
            }}
          >
            {cfg.icon} {cfg.label}
          </span>
        </div>
      )}

      <nav
        style={{
          flex: 1,
          padding: collapsed ? "12px 0" : "8px 10px",
          overflowY: "auto",
        }}
      >
        {cfg.nav.map((item) => {
          const active = item.id === activeNav;

          return (
            <button
              key={item.id}
              onClick={() => onNav(item.id)}
              title={collapsed ? item.label : ""}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: collapsed ? "12px 0" : "9px 12px",
                justifyContent: collapsed ? "center" : "flex-start",
                borderRadius: collapsed ? 0 : 9,
                background: active ? cfg.light : "transparent",
                color: active ? cfg.accent : T.gray600,
                border: "none",
                cursor: "pointer",
                fontSize: 13.5,
                fontWeight: active ? 600 : 400,
                marginBottom: 2,
                borderLeft:
                  active && !collapsed
                    ? `3px solid ${cfg.accent}`
                    : "3px solid transparent",
              }}
            >
              <span style={{ fontSize: 15, flexShrink: 0 }}>{item.icon}</span>
              {!collapsed && item.label}
            </button>
          );
        })}
      </nav>

      <div
        style={{
          padding: collapsed ? "12px 0" : "12px 14px",
          borderTop: `1px solid ${T.gray200}`,
          display: "flex",
          alignItems: "center",
          gap: 9,
          justifyContent: collapsed ? "center" : "flex-start",
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            flexShrink: 0,
            background: `linear-gradient(135deg, ${cfg.accent}, ${cfg.badge})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 700,
            color: T.white,
          }}
        >
          {initials}
        </div>

        {!collapsed && (
          <div style={{ overflow: "hidden" }}>
            <div
              style={{
                fontSize: 12.5,
                fontWeight: 600,
                color: T.green800,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user.name}
            </div>
            <div style={{ fontSize: 11, color: T.gray400 }}>{cfg.label}</div>
          </div>
        )}
      </div>
    </aside>
  );
};

interface LogoMarkProps {
  size?: number;
  showText?: boolean;
  onClick?: () => void;
}

function LogoMark({ size = 34, showText = false, onClick }: LogoMarkProps) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        cursor: "pointer",
        userSelect: "none",
        transition: "opacity 0.2s ease",
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          borderRadius: Math.round(size * 0.265),
          background: "linear-gradient(135deg, #4E7A30, #7AAF52)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 3px 10px rgba(78,122,48,0.3)",
          flexShrink: 0,
        }}
      >
        <svg width={size * 0.52} height={size * 0.52} viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="7" stroke="white" strokeWidth="1.8" opacity="0.5" />
          <path
            d="M12.5 7C12.5 7 9.5 6 8 7.5C6.5 9 6.5 11 8 12.5C9.5 14 12.5 13 12.5 13"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />
          <line
            x1="10"
            y1="5"
            x2="10"
            y2="15"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="2.5 2"
          />
        </svg>
      </div>

      {showText && (
        <div>
          <div
            style={{
              fontFamily: "'Lora', Georgia, serif",
              fontSize: 18,
              fontWeight: 700,
              color: T.green700,
              lineHeight: 1,
            }}
          >
            Credio
          </div>
          <div
            style={{
              fontSize: 9,
              color: T.green400,
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            Sistema de Gestión
          </div>
        </div>
      )}
    </div>
  );
}