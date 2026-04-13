import React from "react";
import { useDashboard } from "../hooks/useDashboard";

const T = {
  green800: "#2C3A20",
  green400: "#7AAF52",
  gray100: "#F3F4F6",
  gray200: "#E5E7EB",
  gray300: "#D1D5DB",
  gray400: "#9CA3AF",
  gray600: "#4B5563",
  white: "#FFFFFF",
  red: "#DC2626",
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: "DOP",
    maximumFractionDigits: 0,
  }).format(value);

const formatDate = (value?: string) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("es-DO").format(date);
};

export default function DashboardPage() {
  const { data, isLoading, error, refetch } = useDashboard();

  if (isLoading) {
    return (
      <div>
        <h2 style={titleStyle}>Dashboard</h2>
        <div style={panelStyle}>Cargando dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2 style={titleStyle}>Dashboard</h2>
        <div style={panelStyle}>
          <p style={{ color: T.red, marginBottom: 12 }}>{error}</p>
          <button onClick={refetch} style={buttonStyle}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ animation: "fadeIn 0.3s ease-in-out" }}>
      <h2 style={titleStyle}>Dashboard</h2>

      <div style={cardsGridStyle}>
        <StatCard
  label="Cartera Total"
  val={formatCurrency(Number(data.totalPortfolio ?? 0))}
  sub="Resumen general de cartera"
  color="#2F6B2F"
  icon="💰"
/>

<StatCard
  label="Liquidez Disponible"
  val={formatCurrency(Number(data.availableLiquidity ?? 0))}
  sub="Disponible para desembolsos"
  color="#059669"
  icon="📈"
/>

<StatCard
  label="Mora Total"
  val={formatCurrency(Number(data.totalDelinquency ?? 0))}
  sub="Monto total en mora"
  color="#DC2626"
  icon="⚠️"
/>

<StatCard
  label="Préstamos Activos"
  val={String(data.activeLoans ?? 0)}
  sub="Cantidad actual de préstamos"
  color="#7C3AED"
  icon="👥"
/>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
        <div style={panelStyle}>
          <div style={panelTitleStyle}>Cuotas próximas a vencer</div>

          {data.upcomingInstallments.length === 0 ? (
            <div style={{ color: T.gray400 }}>
              No hay cuotas próximas a vencer.
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Cliente</th>
                    <th style={thStyle}>Préstamo</th>
                    <th style={thStyle}>Cuota</th>
                    <th style={thStyle}>Fecha vencimiento</th>
                    <th style={thStyle}>Monto</th>
                    <th style={thStyle}>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {data.upcomingInstallments.map(
  (
    item: {
      client: string;
      loan: number | string;
      installment: string;
      dueDate: string;
      amount: number;
      status: string;
    },
    index: number
  ) => (
    <tr key={`${item.loan}-${index}`}>
      <td style={tdStyle}>{item.client}</td>
      <td style={tdStyle}>{item.loan}</td>
      <td style={tdStyle}>{item.installment}</td>
      <td style={tdStyle}>{formatDate(item.dueDate)}</td>
      <td style={tdStyle}>{formatCurrency(item.amount)}</td>
      <td style={tdStyle}>{item.status}</td>
    </tr>
  )
)}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  val: string;
  sub: string;
  color: string;
  icon: React.ReactNode;
}

function StatCard({ label, val, sub, color, icon }: StatCardProps) {
  return (
    <div style={panelStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ fontSize: 12, color: T.gray400, fontWeight: 500 }}>
          {label}
        </span>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: `${color}18`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </div>
      </div>

      <div style={{ fontSize: 26, fontWeight: 700, color, marginBottom: 4 }}>
        {val}
      </div>

      <div style={{ fontSize: 11, color: T.gray400 }}>{sub}</div>
    </div>
  );
}

const titleStyle: React.CSSProperties = {
  fontFamily: "'Lora', serif",
  fontSize: 22,
  fontWeight: 700,
  color: T.green800,
  marginBottom: 20,
};

const cardsGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: 14,
  marginBottom: 24,
};

const panelStyle: React.CSSProperties = {
  background: T.white,
  borderRadius: 14,
  padding: "22px 24px",
  border: `1px solid ${T.gray200}`,
  boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
};

const panelTitleStyle: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 700,
  color: T.green800,
  marginBottom: 18,
};

const buttonStyle: React.CSSProperties = {
  background: "#2F6B2F",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  padding: "10px 16px",
  cursor: "pointer",
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
};

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "12px",
  borderBottom: `1px solid ${T.gray200}`,
  fontSize: 12,
  color: T.gray600,
};

const tdStyle: React.CSSProperties = {
  padding: "12px",
  borderBottom: `1px solid ${T.gray100}`,
  fontSize: 13,
  color: T.green800,
};