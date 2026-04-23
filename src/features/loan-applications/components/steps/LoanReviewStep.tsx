import type { LoanApplicationFormData } from "../../types/loanApplication.types";
import { formatCurrency } from "../../utils/loanApplicationFormatters";
import { card, cardHead, footerNav, btnBack } from "./styles";
import { useNavigate } from 'react-router-dom';


const C = {
  forest800: "#22422F",
  forest700: "#2D5A3D",
  forest600: "#3A6E4A",
  forest100: "#D6EBD8",
  forest50: "#EFF7F0",
  cream: "#FAF8F5",
  sand100: "#F0EDE8",
  sand200: "#DDD9D2",
  sand400: "#9E9A92",
  sand600: "#5E5A54",
  sand800: "#2A2724",
  sand900: "#1A1814",
  gold: "#C9933A",
  sky: "#3D6E8A",
  coral: "#C0524A",
  white: "#FFFFFF",
};

const fonts = {
  display: "'Georgia', 'Times New Roman', serif",
  body: "'Trebuchet MS', 'Lucida Sans Unicode', sans-serif",
};

interface Props {
  form: LoanApplicationFormData;
  installmentAmount: number;
  availableIncome: number;
  onBack: () => void;
  onSubmit: () => void | Promise<void>;
  submitting?: boolean;
}

export const LoanReviewStep = ({
  form,
  installmentAmount,
  availableIncome,
  onBack,
  onSubmit,
  submitting = false,
}: Props) => {

   const navigate = useNavigate();
   const handleSubmit = async () => {
    if (submitting) return;
    try {
      await onSubmit();
      navigate('/'); 
    } catch (error) {
      console.error('Error:', error);
    }
  };
  return (
    <div style={card}>
      <div style={cardHead}>
        <div
          style={{
            width: 3,
            height: 17,
            background: C.gold,
            borderRadius: 2,
            flexShrink: 0,
          }}
        />
        <h2
          style={{
            fontFamily: fonts.display,
            fontSize: 15,
            fontWeight: 700,
            color: C.sand800,
            margin: 0,
          }}
        >
          Resumen de la solicitud
        </h2>
      </div>

      <div style={{ padding: 22, display: "grid", gap: 22 }}>
        <div>
          <SubSection color={C.forest600} label="Cliente seleccionado" />
          <div
            style={{
              background: C.forest50,
              borderRadius: 10,
              padding: "14px 18px",
              border: `1px solid ${C.forest100}`,
            }}
          >
            <div
              style={{
                fontFamily: fonts.display,
                fontSize: 16,
                fontWeight: 700,
                color: C.forest800,
              }}
            >
              {form.clientName}
            </div>
            <div
              style={{
                fontSize: 12,
                color: C.sand400,
                fontFamily: fonts.body,
                marginTop: 3,
              }}
            >
              {form.clientDocument}
            </div>
          </div>
        </div>

        <div>
          <SubSection color={C.sky} label="Condiciones del préstamo" />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            <ReviewStat
              label="Monto"
              value={formatCurrency(Number(form.requestedAmount || 0))}
            />
            <ReviewStat
              label="Plazo"
              value={`${form.requestTerm} períodos`}
            />
            <ReviewStat
              label="Tasa anual"
              value={`${form.requestedInterestRate}%`}
            />
            <ReviewStat
              label="Cuota estimada"
              value={formatCurrency(installmentAmount)}
              accent
            />
          </div>
        </div>

        <div>
          <SubSection color={C.gold} label="Capacidad de pago" />
          <div
            style={{
              background: C.cream,
              borderRadius: 10,
              padding: "4px 16px",
              border: `1px solid ${C.sand200}`,
            }}
          >
            <CapRow
              label="Ingreso mensual"
              value={formatCurrency(Number(form.monthlyIncome || 0))}
            />
            <CapRow
              label="Gastos mensuales"
              value={formatCurrency(Number(form.monthlyExpenses || 0))}
            />
            <CapRow
              label="Disponible"
              value={formatCurrency(availableIncome)}
              highlight
              positive={availableIncome >= 0}
              last
            />
          </div>
        </div>
      </div>

      <div style={footerNav}>
        <button type="button" onClick={onBack} style={btnBack} disabled={submitting}>
          ‹ Anterior
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          style={{
            padding: "9px 22px",
            borderRadius: 9,
            border: "none",
            background: C.forest700,
            color: C.white,
            fontFamily: fonts.body,
            fontSize: 13,
            fontWeight: 700,
            cursor: submitting ? "not-allowed" : "pointer",
            opacity: submitting ? 0.6 : 1,
          }}
        >
          {submitting ? "Enviando…" : "Enviar solicitud ✓"}
        </button>
      </div>
    </div>
  );
};

function SubSection({ color, label }: { color: string; label: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 7,
        marginBottom: 12,
      }}
    >
      <div
        style={{
          width: 3,
          height: 15,
          borderRadius: 2,
          background: color,
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontFamily: fonts.display,
          fontSize: 14,
          fontWeight: 700,
          color: C.sand800,
        }}
      >
        {label}
      </span>
    </div>
  );
}

function ReviewStat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      style={{
        background: C.cream,
        borderRadius: 10,
        padding: "14px 16px",
        border: `1px solid ${accent ? C.forest100 : C.sand200}`,
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: C.sand400,
          textTransform: "uppercase",
          letterSpacing: "0.6px",
          fontFamily: fonts.body,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: fonts.display,
          fontSize: 20,
          fontWeight: 800,
          color: accent ? C.forest700 : C.sand900,
          marginTop: 5,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function CapRow({
  label,
  value,
  highlight,
  positive,
  last,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  positive?: boolean;
  last?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "11px 0",
        borderBottom: last ? "none" : `1px solid ${C.sand100}`,
      }}
    >
      <span
        style={{
          fontSize: 13,
          color: highlight ? C.sand900 : C.sand600,
          fontFamily: fonts.body,
          fontWeight: highlight ? 700 : 400,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: fonts.display,
          fontWeight: 700,
          fontSize: highlight ? 16 : 14,
          color: highlight ? (positive ? C.forest600 : C.coral) : C.sand900,
        }}
      >
        {value}
      </span>
    </div>
  );
}