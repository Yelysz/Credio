import React from 'react';

// Tokens de color consistentes con tu diseño
const T = {
  green800: "#2C3A20",
  green400: "#7AAF52",
  gray100: "#F3F4F6",
  gray200: "#E5E7EB",
  gray400: "#9CA3AF",
  gray600: "#4B5563",
  white: "#FFFFFF",
  red: "#DC2626",
};

interface DashboardProps {
  cfg: any; // Configuración del rol actual
  stats: {
    carteraTotal: string;
    liquidez: string;
    mora: string;
    activos: number;
  };
}

export const DashboardPage: React.FC<DashboardProps> = ({ cfg, stats }) => {
  return (
    <div style={{ animation: "fadeIn 0.5s ease-in-out" }}>
      {/* Título de la Sección con fuente Lora */}
      <h2 style={{ 
        fontFamily: "'Lora', serif", fontSize: 22, fontWeight: 700, 
        color: T.green800, marginBottom: 20 
      }}>
        Dashboard de Liquidez
      </h2>

      {/* Grid de Tarjetas de Estado */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", 
        gap: 14, marginBottom: 24 
      }}>
        <StatCard label="Cartera Total" val={stats.carteraTotal} sub="+12.5% vs mes anterior" color={cfg.accent} icon="💰" />
        <StatCard label="Liquidez Disponible" val={stats.liquidez} sub="Para nuevos desembolsos" color="#059669" icon="📈" />
        <StatCard label="Mora Total" val={stats.mora} sub="6.5% de la cartera" color={T.red} icon="⚠️" />
        <StatCard label="Préstamos Activos" val={stats.activos.toString()} sub="15 vencen esta semana" color="#7C3AED" icon="👥" />
      </div>

      {/* Fila de Gráficos y Análisis */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 16, marginBottom: 20 }}>
        
        {/* Contenedor de Flujo de Caja (Simulado con CSS) */}
        <div style={panelStyle}>
          <div style={panelTitleStyle}>Flujo de Caja (Últimos 7 meses)</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 140, padding: "10px 0" }}>
            {["Jul", "Ago", "Sep", "Oct", "Nov", "Dic", "Ene"].map((m, i) => (
              <div key={m} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                <div style={{ 
                  width: "100%", 
                  height: 40 + (i * 15), 
                  background: `linear-gradient(to top, ${cfg.accent}, ${T.green400})`, 
                  borderRadius: "4px 4px 0 0" 
                }} />
                <span style={{ fontSize: 10, color: T.gray400 }}>{m}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Gráfico de Estado de Cartera (Donut circular SVG) */}
        <div style={panelStyle}>
          <div style={panelTitleStyle}>Estado de Cartera</div>
          <div style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="45" fill="none" stroke={T.gray100} strokeWidth="15" />
              <circle cx="60" cy="60" r="45" fill="none" stroke="#059669" strokeWidth="15" 
                strokeDasharray="282.7" strokeDashoffset="70" strokeLinecap="round" transform="rotate(-90 60 60)" />
            </svg>
          </div>
          <div style={{ fontSize: 13, color: T.gray600 }}>
            <LegendItem color="#059669" label="Al Día" value="65%" />
            <LegendItem color={T.red} label="Vencidos" value="20%" />
            <LegendItem color="#D97706" label="Por Vencer" value="15%" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Estilos de componentes internos
const panelStyle: React.CSSProperties = {
  background: T.white, borderRadius: 14, padding: "22px 24px", 
  border: `1px solid ${T.gray200}`, boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
};

const panelTitleStyle: React.CSSProperties = {
  fontSize: 15, fontWeight: 700, color: T.green800, marginBottom: 18
};

const LegendItem = ({ color, label, value }: any) => (
  <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${T.gray100}` }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
      <span>{label}</span>
    </div>
    <span style={{ fontWeight: 700 }}>{value}</span>
  </div>
);

// StatCard Component
function StatCard({ label, val, sub, color, icon }: any) {
  return (
    <div style={panelStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ fontSize: 12, color: T.gray400, fontWeight: 500 }}>{label}</span>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</div>
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, color, marginBottom: 4 }}>{val}</div>
      <div style={{ fontSize: 11, color: sub.includes("+") ? "#059669" : T.gray400 }}>{sub}</div>
    </div>
  );
}