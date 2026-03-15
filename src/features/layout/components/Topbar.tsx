
import React, { useState } from 'react';

// Reutilizamos tus tokens de diseño para mantener la consistencia
const T = {
  green800: "#2C3A20",
  green700: "#3D5C28",
  gray50: "#F9FAFB",
  gray100: "#F3F4F6",
  gray200: "#E5E7EB",
  gray400: "#9CA3AF",
  gray600: "#4B5563",
  red: "#EF4444",
  white: "#FFFFFF",
};

interface TopbarProps {
  role: 'admin' | 'oficial' | 'cobrador' | 'cliente';
  user: {
    name: string;
    email: string;
  };
  onLogout: () => void;
  rolesConfig: any; // Aquí pasas tu objeto ROLES
}

export const Topbar: React.FC<TopbarProps> = ({ role, user, onLogout, rolesConfig }) => {
  const cfg = rolesConfig[role];
  const initials = user.name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header style={{ 
      height: 58, background: T.white, borderBottom: `1px solid ${T.gray200}`,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 26px", flexShrink: 0, position: "sticky", top: 0, zIndex: 20,
      boxShadow: "0 1px 6px rgba(0,0,0,0.05)", fontFamily: "'DM Sans', sans-serif" 
    }}>
      {/* Saludo dinámico según la hora/rol definido en tus ROLES */}
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: T.green800 }}>
          {cfg.greeting(user.name.split(" ")[0])}
        </div>
        <div style={{ fontSize: 11, color: T.gray400 }}>
          {new Date().toLocaleDateString("es-DO", { 
            weekday: "long", day: "numeric", month: "long", year: "numeric" 
          })}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {/* Botón de Notificaciones con Badge */}
        <button style={{ 
          position: "relative", background: T.gray50, border: `1px solid ${T.gray200}`,
          borderRadius: 9, width: 36, height: 36, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 
        }}>
          🔔
          <span style={{ 
            position: "absolute", top: 5, right: 5, width: 7, height: 7,
            borderRadius: "50%", background: T.red, border: `2px solid ${T.white}` 
          }}/>
        </button>

        {/* Menú de Perfil Dropdown */}
        <div style={{ position: "relative" }}>
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)} 
            style={{ 
              display: "flex", alignItems: "center", gap: 8,
              padding: "4px 12px 4px 4px", background: T.gray50, border: `1px solid ${T.gray200}`,
              borderRadius: 50, cursor: "pointer" 
            }}
          >
            <div style={{ 
              width: 28, height: 28, borderRadius: "50%",
              background: `linear-gradient(135deg, ${cfg.accent}, ${cfg.badge})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 700, color: T.white 
            }}>
              {initials}
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: T.green800 }}>{user.name}</span>
            <span style={{ fontSize: 10, color: T.gray400 }}>▾</span>
          </button>

          {dropdownOpen && (
            <div style={{ 
              position: "absolute", top: "calc(100% + 8px)", right: 0, width: 200,
              background: T.white, borderRadius: 12, border: `1px solid ${T.gray200}`,
              boxShadow: "0 12px 40px rgba(0,0,0,0.12)", overflow: "hidden", zIndex: 100 
            }}>
              {/* Info del usuario dentro del dropdown */}
              <div style={{ padding: "12px 16px", background: T.gray50, borderBottom: `1px solid ${T.gray100}` }}>
                <span style={{ 
                  display: "inline-flex", fontSize: 10, fontWeight: 700, 
                  color: cfg.accent, background: `${cfg.accent}18`, 
                  padding: "2px 8px", borderRadius: 10, textTransform: "uppercase" 
                }}>
                  {cfg.label}
                </span>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.green800, marginTop: 6 }}>{user.name}</div>
                <div style={{ fontSize: 11, color: T.gray400 }}>{user.email}</div>
              </div>
              
              {/* Acciones */}
              <button style={dropdownItemStyle}>Mi Perfil</button>
              <button style={dropdownItemStyle}>Configuración</button>
              <div style={{ height: 1, background: T.gray100 }} />
              <button 
                onClick={onLogout} 
                style={{ ...dropdownItemStyle, color: T.red, fontWeight: 600 }}
              >
                🚪 Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const dropdownItemStyle: React.CSSProperties = {
  width: "100%", padding: "10px 16px", background: "transparent",
  border: "none", textAlign: "left", fontSize: 13, color: T.gray600, 
  cursor: "pointer", fontFamily: "inherit"
};