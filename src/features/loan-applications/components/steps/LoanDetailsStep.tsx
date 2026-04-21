import type {
  LoanApplicationFormData,
  PaymentFrequency,
} from "../../types/loanApplication.types";
import { card, cardHead, footerNav, btnBack, btnNext } from "./ClientSelectionStep";

const C = {
  forest600: "#3A6E4A", sand100: "#F0EDE8", sand200: "#DDD9D2",
  sand400: "#9E9A92", sand600: "#5E5A54", sand800: "#2A2724", sand900: "#1A1814",
  cream: "#FAF8F5", sky: "#3D6E8A", white: "#FFFFFF",
};

const fonts = {
  display: "'Georgia', 'Times New Roman', serif",
  body:    "'Trebuchet MS', 'Lucida Sans Unicode', sans-serif",
};

interface Props {
  form: LoanApplicationFormData;
  frequencies: PaymentFrequency[];
  onChange: <K extends keyof LoanApplicationFormData>(field: K, value: LoanApplicationFormData[K]) => void;
  onBack: () => void;
  onNext: () => void;
  loadingSimulation?: boolean;
}

export const LoanDetailsStep = ({
  form, frequencies, onChange, onBack, onNext, loadingSimulation = false,
}: Props) => (
  <div style={card}>

    <div style={cardHead}>
      <div style={{ width: 3, height: 17, background: C.sky, borderRadius: 2, flexShrink: 0 }} />
      <h2 style={{ fontFamily: fonts.display, fontSize: 15, fontWeight: 700, color: C.sand800, margin: 0 }}>
        Detalles del préstamo
      </h2>
    </div>

    <div style={{ padding: 22, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>

      <Field label="Monto solicitado *">
        <input
          type="number" min="1" value={form.requestedAmount}
          onChange={e => onChange("requestedAmount", e.target.value === "" ? "" : Number(e.target.value))}
          placeholder="Ej. 50,000" style={inputSt}
        />
      </Field>

      <Field label="Plazo (períodos) *">
        <input
          type="number" min="1" value={form.requestTerm}
          onChange={e => onChange("requestTerm", e.target.value === "" ? "" : Number(e.target.value))}
          placeholder="Ej. 12" style={inputSt}
        />
      </Field>

      <Field label="Frecuencia de pago *">
        <select
          value={form.paymentFrequencyId}
          onChange={e => onChange("paymentFrequencyId", e.target.value)}
          style={inputSt}
        >
          {frequencies.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
        </select>
      </Field>

      <Field label="Tasa de interés (% anual) *">
        <input
          type="number" min="1" value={form.requestedInterestRate}
          onChange={e => onChange("requestedInterestRate", e.target.value === "" ? "" : Number(e.target.value))}
          placeholder="Ej. 18" style={inputSt}
        />
      </Field>

      <div style={{ gridColumn: "span 2" }}>
        <Field label="Propósito del préstamo *">
          <textarea
            rows={4} value={form.purpose} placeholder="Describe el uso del préstamo…"
            onChange={e => onChange("purpose", e.target.value)}
            style={{ ...inputSt, resize: "vertical", minHeight: 90 }}
          />
        </Field>
      </div>

      <Field label="Ingreso mensual *">
        <input
          type="number" min="0" value={form.monthlyIncome}
          onChange={e => onChange("monthlyIncome", e.target.value === "" ? "" : Number(e.target.value))}
          placeholder="Ej. 25,000" style={inputSt}
        />
      </Field>

      <Field label="Gastos mensuales *">
        <input
          type="number" min="0" value={form.monthlyExpenses}
          onChange={e => onChange("monthlyExpenses", e.target.value === "" ? "" : Number(e.target.value))}
          placeholder="Ej. 12,000" style={inputSt}
        />
      </Field>
    </div>

    <div style={footerNav}>
      <button type="button" onClick={onBack} style={btnBack}>‹ Anterior</button>
      <button
        type="button" onClick={onNext} disabled={loadingSimulation}
        style={loadingSimulation ? { ...btnNext, opacity: 0.6 } : btnNext}
      >
        {loadingSimulation ? "Simulando…" : "Siguiente ›"}
      </button>
    </div>
  </div>
);

// ─── FIELD WRAPPER ────────────────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={{
        fontSize: 11, fontWeight: 700, color: C.sand600,
        textTransform: "uppercase", letterSpacing: "0.7px", fontFamily: fonts.body,
      }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputSt: React.CSSProperties = {
  padding: "9px 12px", borderRadius: 9, border: `1px solid ${C.sand200}`,
  background: C.cream, fontFamily: fonts.body, fontSize: 13,
  color: C.sand900, outline: "none", width: "100%",
};