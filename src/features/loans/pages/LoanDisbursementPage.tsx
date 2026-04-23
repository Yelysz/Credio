import { useEffect, useState, type CSSProperties } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLoanDisbursement } from "../hooks/useLoanDisbursement";
import { C, fonts } from "../../loan-applications/components/steps/styles";
import type { Installment } from "../types/loan.types";

type LoanApplicationState = {
  id?: string;
  applicationCode?: string;
  clientName?: string;
  approvedAmount?: number | null;
  approvedInterestRate?: number | null;
  approvedTerm?: number | null;
  paymentFrequency?: string | null;
};

type LocationState = {
  application?: LoanApplicationState;
};

const money = (v?: number | null) =>
  new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: "DOP",
    maximumFractionDigits: 2,
  }).format(Number(v ?? 0));

const fmtDate = (v?: string) => {
  if (!v) return "—";
  const d = new Date(v);
  return Number.isNaN(d.getTime())
    ? v
    : d.toLocaleDateString("es-DO", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
};

const getRowNumber = (row: Installment, index: number) =>
  Number(
    (row as Record<string, unknown>).installmentNumber ??
      (row as Record<string, unknown>).period ??
      index + 1
  );

const getRowPayment = (row: Installment) =>
  Number(
    (row as Record<string, unknown>).installmentAmount ??
      (row as Record<string, unknown>).payment ??
      0
  );

const getRowPrincipal = (row: Installment) =>
  Number((row as Record<string, unknown>).principal ?? 0);

const getRowInterest = (row: Installment) =>
  Number((row as Record<string, unknown>).interest ?? 0);

const getRowBalance = (row: Installment) =>
  Number((row as Record<string, unknown>).balance ?? 0);

const getRowStatus = (row: Installment) =>
  String(
    (row as Record<string, unknown>).installmentStatusName ?? "Pendiente"
  );

export default function LoanDisbursementPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { application } = (location.state as LocationState) ?? {};

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
    if (!application?.id) {
      navigate("/loan-applications/acceptance");
      return;
    }

    void fetchPreview(application.id);
  }, [application?.id, fetchPreview, navigate]);

  const handleCreateAndDisburse = async () => {
    if (!application?.id) return;

    try {
      const createdLoan = await createLoan(application.id);

      if (!createdLoan?.id) {
        throw new Error("No se pudo obtener el id del préstamo creado.");
      }

      await disburseLoan(createdLoan.id);
      setDisbursed(true);
      await fetchSchedule(createdLoan.id);
      setActiveTab("schedule");
    } catch (err) {
      console.error("Error en desembolso:", err);
    }
  };

  if (!application) return null;

  const monthlyPayment =
    preview && preview.length > 0 ? getRowPayment(preview[0]) : 0;

  return (
    <div style={page}>
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

        <button
          type="button"
          onClick={() => navigate("/loan-applications/acceptance")}
          style={backBtn}
        >
          ← Volver
        </button>
      </nav>

      <div style={heroStrip}>
        <div>
          <h1 style={heroTitle}>Desembolso de préstamo</h1>
          <p style={heroSub}>
            {application.clientName ?? "Cliente"} ·{" "}
            {application.applicationCode ?? "Sin código"}
          </p>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: 14,
        }}
      >
        <SummaryCard
          label="Monto aprobado"
          value={money(application.approvedAmount)}
          color={C.forest600}
        />
        <SummaryCard
          label="Plazo"
          value={`${application.approvedTerm ?? 0} meses`}
          color={C.sky}
        />
        <SummaryCard
          label="Tasa"
          value={`${application.approvedInterestRate ?? 0}%`}
          color={C.gold}
        />
        <SummaryCard
          label="Cuota"
          value={money(monthlyPayment)}
          color={C.forest700}
          highlight
        />
      </div>

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
                      El préstamo
                      {loan?.id ? ` ${loan.id}` : ""} ha sido creado y
                      desembolsado. Puedes ver el calendario de pagos.
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
            <tr key={`preview-${idx}`} style={tbodyRow}>
              <td style={td}>{getRowNumber(row, idx)}</td>
              <td style={{ ...td, textAlign: "right", fontFamily: fonts.display, fontWeight: 700 }}>
                {money(getRowPayment(row))}
              </td>
              <td style={{ ...td, textAlign: "right" }}>{money(getRowPrincipal(row))}</td>
              <td style={{ ...td, textAlign: "right" }}>{money(getRowInterest(row))}</td>
              <td style={{ ...td, textAlign: "right", color: C.forest700, fontWeight: 700 }}>
                {money(getRowBalance(row))}
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
          {schedule.map((row, idx) => {
            const status = getRowStatus(row);

            return (
              <tr key={`schedule-${idx}`} style={tbodyRow}>
                <td style={td}>{getRowNumber(row, idx)}</td>
                <td style={td}>{fmtDate(row.dueDate)}</td>
                <td style={{ ...td, textAlign: "right", fontFamily: fonts.display, fontWeight: 700 }}>
                  {money(getRowPayment(row))}
                </td>
                <td style={{ ...td, textAlign: "right" }}>{money(getRowPrincipal(row))}</td>
                <td style={{ ...td, textAlign: "right" }}>{money(getRowInterest(row))}</td>
                <td style={{ ...td, textAlign: "right", color: C.forest700, fontWeight: 700 }}>
                  {money(getRowBalance(row))}
                </td>
                <td style={td}>
                  <span
                    style={{
                      ...statusBadge,
                      ...(status.toLowerCase() === "pagado"
                        ? {
                            background: C.forest50,
                            color: C.forest700,
                            borderColor: C.forest100,
                          }
                        : {}),
                    }}
                  >
                    {status}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const page: CSSProperties = {
  display: "grid",
  gap: 18,
  padding: "clamp(16px, 3vw, 28px)",
  background: C.cream,
  minHeight: "100vh",
  fontFamily: fonts.body,
};

const nav: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: C.white,
  borderRadius: 12,
  padding: "12px 18px",
  border: `1px solid ${C.sand200}`,
};

const backBtn: CSSProperties = {
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

const heroStrip: CSSProperties = {
  background: (C as Record<string, string>).forest900 ?? C.forest800,
  borderRadius: 14,
  padding: "22px 28px",
};

const heroTitle: CSSProperties = {
  fontFamily: fonts.display,
  fontSize: "clamp(20px, 4vw, 26px)",
  fontWeight: 700,
  color: C.white,
  margin: 0,
  letterSpacing: "-.3px",
};

const heroSub: CSSProperties = {
  fontFamily: fonts.body,
  fontSize: 12,
  color: (C as Record<string, string>).forest300 ?? C.forest100,
  marginTop: 4,
  marginBottom: 0,
};

const card: CSSProperties = {
  background: C.white,
  borderRadius: 14,
  border: `1px solid ${C.sand200}`,
  overflow: "hidden",
};

const cardHead: CSSProperties = {
  padding: "18px 22px",
  borderBottom: `1px solid ${C.sand100}`,
};

const tab: CSSProperties = {
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

const activeTabStyle: CSSProperties = {
  background: C.cream,
  color: C.sand900,
  fontWeight: 700,
};

const table: CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: 13,
  fontFamily: fonts.body,
};

const theadRow: CSSProperties = {
  borderBottom: `2px solid ${C.sand200}`,
};

const th: CSSProperties = {
  padding: "12px 14px",
  textAlign: "left",
  fontSize: 11,
  fontWeight: 700,
  color: C.sand600,
  textTransform: "uppercase",
  letterSpacing: "0.7px",
};

const tbodyRow: CSSProperties = {
  borderBottom: `1px solid ${C.sand100}`,
};

const td: CSSProperties = {
  padding: "14px 14px",
  color: C.sand900,
};

const statusBadge: CSSProperties = {
  padding: "4px 10px",
  borderRadius: 99,
  fontSize: 10,
  fontWeight: 700,
  background: (C as Record<string, string>).goldSoft ?? "#FFF4D6",
  color: C.gold,
  border: "1px solid #f0ddb8",
  display: "inline-block",
};

const btnDisburse: CSSProperties = {
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

const successBanner: CSSProperties = {
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

const errorBanner: CSSProperties = {
  marginTop: 12,
  background: (C as Record<string, string>).coralSoft ?? "#FFF1F0",
  border: "1px solid #f7c8c5",
  borderRadius: 9,
  padding: "11px 14px",
  fontSize: 12,
  color: C.coral,
  fontFamily: fonts.body,
  display: "flex",
  gap: 7,
};

const muted: CSSProperties = {
  fontSize: 13,
  color: C.sand400,
  fontFamily: fonts.body,
  textAlign: "center",
  padding: "40px 0",
};