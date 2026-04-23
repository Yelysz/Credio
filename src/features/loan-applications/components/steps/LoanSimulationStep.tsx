import type { SimulationInstallment } from "../../types/loanApplication.types";
import { formatCurrency } from "../../utils/loanApplicationFormatters";
import { card, cardHead, footerNav, btnNext, btnBack } from "./styles";

// ─── BRAND TOKENS ─────────────────────────────────────────────────────────────
const C = {
  forest700: "#2D5A3D", forest600: "#3A6E4A",
  forest100: "#D6EBD8", forest50:  "#EFF7F0",
  cream:     "#FAF8F5", sand100:   "#F0EDE8", sand200:   "#DDD9D2",
  sand400:   "#9E9A92", sand600:   "#5E5A54", sand800:   "#2A2724", sand900: "#1A1814",
  gold:      "#C9933A", sky:       "#3D6E8A",
};

const fonts = {
  display: "'Georgia', 'Times New Roman', serif",
  body:    "'Trebuchet MS', 'Lucida Sans Unicode', sans-serif",
};

interface Props {
  installmentAmount: number;
  totalAmount: number;
  totalInterest: number;
  totalToPay: number;
  schedule: SimulationInstallment[];
  onBack: () => void;
  onNext: () => void;
}

export const LoanSimulationStep = ({
  installmentAmount,
  totalAmount,
  totalInterest,
  totalToPay,
  schedule,
  onBack,
  onNext,
}: Props) => (
  <div style={card}>

    {/* Header */}
    <div style={{ ...cardHead, justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 3, height: 17, background: C.gold, borderRadius: 2, flexShrink: 0 }} />
        <h2 style={{ fontFamily: fonts.display, fontSize: 15, fontWeight: 700, color: C.sand800, margin: 0 }}>
          Simulación de amortización
        </h2>
      </div>
      <span style={cuotaPill}>
        Cuota estimada: {formatCurrency(installmentAmount)}
      </span>
    </div>

    {/* Summary stats */}
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, padding: "20px 22px", borderBottom: `1px solid ${C.sand100}` }}>
      <StatCard label="Monto total"     value={formatCurrency(totalAmount)}   accentColor={C.forest600} />
      <StatCard label="Total intereses" value={formatCurrency(totalInterest)} accentColor={C.gold}      />
      <StatCard label="Total a pagar"   value={formatCurrency(totalToPay)}    accentColor={C.sky}       />
    </div>

    {/* Amortization table */}
    <div style={{ maxHeight: 380, overflowY: "auto", borderBottom: `1px solid ${C.sand100}` }}>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 520 }}>
        <thead>
          <tr style={{ background: C.sand100, position: "sticky", top: 0, zIndex: 1 }}>
            {["Período", "Cuota", "Capital", "Interés", "Saldo"].map(h => (
              <th key={h} style={th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {schedule.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ padding: "40px", textAlign: "center", color: C.sand400, fontFamily: fonts.body, fontSize: 13 }}>
                No hay datos de simulación para mostrar.
              </td>
            </tr>
          ) : (
            schedule.map((row, i) => (
              <tr key={row.installmentNumber} style={{ borderBottom: `1px solid ${C.sand100}`, background: i % 2 === 0 ? "#fff" : C.cream }}>
                <td style={{ ...td_, fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: C.sand400 }}>
                  {String(row.installmentNumber).padStart(2, "0")}
                </td>
                <td style={{ ...td_, fontFamily: fonts.display, fontWeight: 700, color: C.sand900, fontSize: 13 }}>
                  {formatCurrency(row.dueAmount)}
                </td>
                <td style={{ ...td_, color: C.forest700, fontWeight: 600 }}>
                  {formatCurrency(row.principalAmount)}
                </td>
                <td style={{ ...td_, color: C.gold, fontWeight: 600 }}>
                  {formatCurrency(row.interestAmount)}
                </td>
                <td style={{ ...td_, color: C.sand800, fontWeight: 600 }}>
                  {formatCurrency(row.remainingBalance)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>

    {/* Navigation */}
    <div style={footerNav}>
      <button type="button" onClick={onBack} style={btnBack}>‹ Anterior</button>
      <button type="button" onClick={onNext} style={btnNext}>Siguiente ›</button>
    </div>
  </div>
);

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

function StatCard({ label, value, accentColor }: { label: string; value: string; accentColor: string }) {
  return (
    <div style={{
      background: C.cream, borderRadius: 10, padding: "14px 16px",
      border: `1px solid ${C.sand200}`, position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: accentColor, borderRadius: "10px 10px 0 0" }} />
      <div style={{ fontSize: 10, fontWeight: 700, color: C.sand400, textTransform: "uppercase", letterSpacing: "0.8px", fontFamily: fonts.body, marginTop: 2 }}>
        {label}
      </div>
      <div style={{ fontFamily: fonts.display, fontSize: 20, fontWeight: 800, color: C.sand900, marginTop: 6 }}>
        {value}
      </div>
    </div>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const cuotaPill: React.CSSProperties = {
  background: C.forest50, border: `1px solid ${C.forest100}`,
  color: C.forest700, fontSize: 12, fontWeight: 700,
  padding: "4px 12px", borderRadius: 99, fontFamily: fonts.body,
  flexShrink: 0,
};
const th: React.CSSProperties = {
  textAlign: "left", padding: "10px 14px",
  fontSize: 10, fontWeight: 700, color: C.sand600,
  textTransform: "uppercase", letterSpacing: "0.8px", fontFamily: fonts.body,
};
const td_: React.CSSProperties = {
  padding: "12px 14px", fontSize: 12, color: C.sand600,
};