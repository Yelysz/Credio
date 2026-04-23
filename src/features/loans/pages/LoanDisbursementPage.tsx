import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLoanDisbursement } from "../hooks/useLoanDisbursement";
import { C, fonts } from "../../loan-applications/components/steps/styles";
import type { Installment } from "../types/loan.types";

const money = (v?: number | null) =>
  new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: "DOP",
    maximumFractionDigits: 2,
  }).format(Number(v ?? 0));

const fmtDate = (v?: string) => {
  if (!v) return "—";
  const d = new Date(v);
  return isNaN(d.getTime())
    ? v
    : d.toLocaleDateString("es-DO", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
};

export default function LoanDisbursementPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const application = location.state?.application;

  const {
    preview,
    schedule,
    loan,
    isLoadingPreview,
    isLoadingSchedule,
    isDisbursing,
    error,
    fetchPreview,
    createLoan,
    disburseLoan,
    fetchSchedule,
  } = useLoanDisbursement();

  const [disbursed, setDisbursed] = useState(false);
  const [activeTab, setActiveTab] = useState<"preview" | "schedule">("preview");

  useEffect(() => {
    if (!application) {
      navigate("/loan-applications/acceptance");
      return;
    }

    void fetchPreview(
      application.approvedAmount,
      application.approvedInterestRate,
      application.approvedTerm,
      application.paymentFrequency || "MONTHLY"
    );
  }, [application]);

  const handleCreateAndDisburse = async () => {
    if (!application?.id) return;
    try {
      const createdLoan = await createLoan(application.id);
      await disburseLoan(createdLoan.id);
      setDisbursed(true);
      await fetchSchedule(createdLoan.id);
      setActiveTab("schedule");
    } catch (err) {
      console.error("Error en desembolso:", err);
    }
  };

  if (!application) {
    return null;
  }

  const monthlyPayment = preview?.[0]?.payment || 0;

  return (
    <div style={page}>
      {/* NAV */}
      <nav style={nav}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <CredioMark size={34} />
          <div>
            <div
              style={{
                fontFamily: fonts.display,
                fontWeight: 700,
                fontSize: 16,
                color: C.sand900,
                letterSpacing: "-.3px",
                lineHeight: "1.1",
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
                fontFamily: fonts.body,
              }}
            >
              Sistema de Gestión
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            type="button"
            onClick={() => navigate("/loan-applications/acceptance")}
            style={backBtn}
          >
            ← Volver
          </button>
        </div>
      </nav>

      {/* HERO */}
      <div style={heroStrip}>
        <div>
          <h1 style={heroTitle}>Desembolso de préstamo</h1>
          <p style={heroSub}>
            {application.clientName} · {application.applicationCode}
          </p>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
        <SummaryCard
          label="Monto aprobado"
          value={money(application.approvedAmount)}
          color={C.forest600}
        />
        <SummaryCard
          label="Plazo"
          value={`${application.approvedTerm} meses`}
          color={C.sky}
        />
        <SummaryCard
          label="Tasa"
          value={`${application.approvedInterestRate}%`}
          color={C.gold}
        />
        <SummaryCard
          label="Cuota"
          value={money(monthlyPayment)}
          color={C.forest700}
          highlight
        />
      </div>

      {/* TABS */}
      <div style={card}>
        <div style={{ ...cardHead, borderBottom: "none", paddingBottom: 0 }}>
          <div style={{ display: "flex", gap: 4 }}>
            <button
              type="button"
              onClick={() => setActiveTab("preview")}
              style={{
                ...tab,
                ...(activeTab === "preview" ? activeTabStyle : {}),
              }}
            >
              Tabla de amortización
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("schedule")}
              disabled={!disbursed}
              style={{
                ...tab,
                ...(activeTab === "schedule" ? activeTabStyle : {}),
                ...(disbursed ? {} : { opacity: 0.5, cursor: "not-allowed" }),
              }}
            >
              Calendario de pagos
            </button>
          </div>
        </div>

        <div style={{ padding: "20px 22px" }}>
          {activeTab === "preview" && (
            <>
              {isLoadingPreview ? (
                <p style={muted}>Cargando tabla de amortización…</p>
              ) : preview && preview.length > 0 ? (
                <AmortizationTable schedule={preview} />
              ) : (
                <p style={muted}>No hay datos disponibles</p>
              )}

              {!disbursed && preview && preview.length > 0 && (
                <button
                  type="button"
                  onClick={handleCreateAndDisburse}
                  disabled={isDisbursing}
                  style={{
                    ...btnDisburse,
                    opacity: isDisbursing ? 0.6 : 1,
                    cursor: isDisbursing ? "not-allowed" : "pointer",
                  }}
                >
                  {isDisbursing ? "Desembolsando…" : "Desembolsar préstamo"}
                </button>
              )}

              {disbursed && (
                <div style={successBanner}>
                  <span>✓</span>
                  <div>
                    <strong>Préstamo desembolsado exitosamente</strong>
                    <div style={{ fontSize: 12, marginTop: 2 }}>
                      El préstamo ha sido creado y desembolsado. Puedes ver el calendario de pagos.
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === "schedule" && (
            <>
              {isLoadingSchedule ? (
                <p style={muted}>Cargando calendario…</p>
              ) : schedule?.installments && schedule.installments.length > 0 ? (
                <PaymentScheduleTable schedule={schedule.installments} />
              ) : (
                <p style={muted}>No hay calendario disponible</p>
              )}
            </>
          )}

          {error && (
            <div style={errorBanner}>
              <span>⚠</span>
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

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

function SummaryCard({
  label,
  value,
  color,
  highlight,
}: {
  label: string;
  value: string;
  color: string;
  highlight?: boolean;
}) {
  return (
    <div
      style={{
        background: highlight ? C.forest50 : C.cream,
        borderRadius: 11,
        padding: "16px 18px",
        border: `1px solid ${highlight ? C.forest100 : C.sand200}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <div style={{ width: 3, height: 14, background: color, borderRadius: 2 }} />
        <span
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
        </span>
      </div>
      <div
        style={{
          fontFamily: fonts.display,
          fontSize: 22,
          fontWeight: 800,
          color: highlight ? C.forest700 : C.sand900,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function AmortizationTable({ schedule }: { schedule: Installment[] }) {
  return (
    <div style={{ overflowX: "auto", marginBottom: 20 }}>
      <table style={table}>
        <thead>
          <tr style={theadRow}>
            <th style={th}>Período</th>
            <th style={{ ...th, textAlign: "right" }}>Cuota</th>
            <th style={{ ...th, textAlign: "right" }}>Capital</th>
            <th style={{ ...th, textAlign: "right" }}>Interés</th>
            <th style={{ ...th, textAlign: "right" }}>Saldo</th>
          </tr>
        </thead>
        <tbody>
          {schedule.map((row, idx) => (
            <tr key={idx} style={tbodyRow}>
              <td style={td}>{row.period}</td>
              <td
                style={{
                  ...td,
                  textAlign: "right",
                  fontFamily: fonts.display,
                  fontWeight: 700,
                }}
              >
                {money(row.payment)}
              </td>
              <td style={{ ...td, textAlign: "right" }}>{money(row.principal)}</td>
              <td style={{ ...td, textAlign: "right" }}>{money(row.interest)}</td>
              <td
                style={{
                  ...td,
                  textAlign: "right",
                  color: C.forest700,
                  fontWeight: 700,
                }}
              >
                {money(row.balance)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PaymentScheduleTable({ schedule }: { schedule: Installment[] }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={table}>
        <thead>
          <tr style={theadRow}>
            <th style={th}>#</th>
            <th style={th}>Fecha vencimiento</th>
            <th style={{ ...th, textAlign: "right" }}>Monto</th>
            <th style={{ ...th, textAlign: "right" }}>Capital</th>
            <th style={{ ...th, textAlign: "right" }}>Interés</th>
            <th style={{ ...th, textAlign: "right" }}>Saldo</th>
            <th style={th}>Estado</th>
          </tr>
        </thead>
        <tbody>
          {schedule.map((row) => (
            <tr key={row.id} style={tbodyRow}>
              <td style={td}>{row.period}</td>
              <td style={td}>{fmtDate(row.dueDate)}</td>
              <td
                style={{
                  ...td,
                  textAlign: "right",
                  fontFamily: fonts.display,
                  fontWeight: 700,
                }}
              >
                {money(row.payment)}
              </td>
              <td style={{ ...td, textAlign: "right" }}>{money(row.principal)}</td>
              <td style={{ ...td, textAlign: "right" }}>{money(row.interest)}</td>
              <td
                style={{
                  ...td,
                  textAlign: "right",
                  color: C.forest700,
                  fontWeight: 700,
                }}
              >
                {money(row.balance)}
              </td>
              <td style={td}>
                <span
                  style={{
                    ...statusBadge,
                    ...(row.installmentStatusName === "Pagado"
                      ? {
                          background: C.forest50,
                          color: C.forest700,
                          borderColor: C.forest100,
                        }
                      : {}),
                  }}
                >
                  {row.installmentStatusName || "Pendiente"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── STYLES ─────────────────────────────────────────────────────────────────
const page: React.CSSProperties = {
  display: "grid",
  gap: 18,
  padding: "clamp(16px, 3vw, 28px)",
  background: C.cream,
  minHeight: "100vh",
  fontFamily: fonts.body,
};

const nav: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: C.white,
  borderRadius: 12,
  padding: "12px 18px",
  border: `1px solid ${C.sand200}`,
};

const backBtn: React.CSSProperties = {
  padding: "7px 16px",
  borderRadius: 8,
  border: `1px solid ${C.sand200}`,
  background: C.white,
  color: C.sand800,
  fontFamily: fonts.body,
  fontSize: 12,
  fontWeight: 600,
  cursor: "pointer",
};

const heroStrip: React.CSSProperties = {
  background: C.forest900,
  borderRadius: 14,
  padding: "22px 28px",
};

const heroTitle: React.CSSProperties = {
  fontFamily: fonts.display,
  fontSize: "clamp(20px, 4vw, 26px)",
  fontWeight: 700,
  color: C.white,
  margin: 0,
  letterSpacing: "-.3px",
};

const heroSub: React.CSSProperties = {
  fontFamily: fonts.body,
  fontSize: 12,
  color: C.forest300,
  marginTop: 4,
  marginBottom: 0,
};

const card: React.CSSProperties = {
  background: C.white,
  borderRadius: 14,
  border: `1px solid ${C.sand200}`,
  overflow: "hidden",
};

const cardHead: React.CSSProperties = {
  padding: "18px 22px",
  borderBottom: `1px solid ${C.sand100}`,
};

const tab: React.CSSProperties = {
  padding: "10px 18px",
  borderRadius: "8px 8px 0 0",
  border: "none",
  background: "transparent",
  fontFamily: fonts.body,
  fontSize: 13,
  fontWeight: 600,
  color: C.sand600,
  cursor: "pointer",
  transition: "all .15s",
};

const activeTabStyle: React.CSSProperties = {
  background: C.cream,
  color: C.sand900,
  fontWeight: 700,
};

const table: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: 13,
  fontFamily: fonts.body,
};

const theadRow: React.CSSProperties = {
  borderBottom: `2px solid ${C.sand200}`,
};

const th: React.CSSProperties = {
  padding: "12px 14px",
  textAlign: "left",
  fontSize: 11,
  fontWeight: 700,
  color: C.sand600,
  textTransform: "uppercase",
  letterSpacing: "0.7px",
};

const tbodyRow: React.CSSProperties = {
  borderBottom: `1px solid ${C.sand100}`,
};

const td: React.CSSProperties = {
  padding: "14px 14px",
  color: C.sand900,
};

const statusBadge: React.CSSProperties = {
  padding: "4px 10px",
  borderRadius: 99,
  fontSize: 10,
  fontWeight: 700,
  background: C.goldSoft,
  color: C.gold,
  border: "1px solid #f0ddb8",
  display: "inline-block",
};

const btnDisburse: React.CSSProperties = {
  width: "100%",
  padding: "13px",
  borderRadius: 10,
  border: "none",
  background: C.forest700,
  color: C.white,
  fontFamily: fonts.body,
  fontSize: 14,
  fontWeight: 700,
  marginTop: 16,
  cursor: "pointer",
};

const successBanner: React.CSSProperties = {
  marginTop: 16,
  background: C.forest50,
  border: `1px solid ${C.forest100}`,
  borderRadius: 10,
  padding: "14px 16px",
  fontSize: 13,
  color: C.forest800,
  fontFamily: fonts.body,
  display: "flex",
  gap: 10,
  alignItems: "flex-start",
};

const errorBanner: React.CSSProperties = {
  marginTop: 12,
  background: C.coralSoft,
  border: "1px solid #f7c8c5",
  borderRadius: 9,
  padding: "11px 14px",
  fontSize: 12,
  color: C.coral,
  fontFamily: fonts.body,
  display: "flex",
  gap: 7,
};

const muted: React.CSSProperties = {
  fontSize: 13,
  color: C.sand400,
  fontFamily: fonts.body,
  textAlign: "center",
  padding: "40px 0",
};