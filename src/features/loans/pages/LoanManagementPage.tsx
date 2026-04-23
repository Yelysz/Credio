import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoanAcceptance } from "../../loan-applications/hooks/useLoanAcceptance";
import { useLoanDisbursement } from "../hooks/useLoanDisbursement";
import type { Installment } from "../types/loan.types";
import type { LoanApplicationItem } from "../../loan-applications/types/loanAcceptance.types";

const C = {
  forest900: "#1A3326",
  forest800: "#22422F",
  forest700: "#2D5A3D",
  forest600: "#3A6E4A",
  forest300: "#7CB98A",
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
  goldSoft: "#FBF3E6",
  coral: "#C0524A",
  coralSoft: "#FDF1F0",
  sky: "#3D6E8A",
  white: "#FFFFFF",
};

const fonts = {
  display: "'Georgia', 'Times New Roman', serif",
  body: "'Trebuchet MS', 'Lucida Sans Unicode', sans-serif",
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

const getInstallmentNumber = (row: Installment, index: number) =>
  Number(
    (row as Record<string, unknown>).installmentNumber ??
      (row as Record<string, unknown>).period ??
      index + 1,
  );

const getInstallmentPayment = (row: Installment) =>
  Number(
    (row as Record<string, unknown>).installmentAmount ??
      (row as Record<string, unknown>).payment ??
      0,
  );

const getInstallmentPrincipal = (row: Installment) =>
  Number((row as Record<string, unknown>).principal ?? 0);

const getInstallmentInterest = (row: Installment) =>
  Number((row as Record<string, unknown>).interest ?? 0);

const getInstallmentBalance = (row: Installment) =>
  Number((row as Record<string, unknown>).balance ?? 0);

const getInstallmentStatus = (row: Installment) =>
  String(
    (row as Record<string, unknown>).installmentStatusName ??
      (row as Record<string, unknown>).status ??
      (row as Record<string, unknown>).installmentStatus ??
      "Pendiente",
  );

type ViewFilter = "pending" | "active";
type ActiveTab = "amortization" | "schedule";

export default function LoanManagementPage() {
  const navigate = useNavigate();

  const {
    applications,
    isLoading: isLoadingApplications,
    fetchApproved,
  } = useLoanAcceptance();

  const {
    schedule,
    loan,
    isLoadingSchedule,
    isDisbursing,
    error,
    createLoan,
    disburseLoan,
    fetchSchedule,
    resetLoanFlow,
  } = useLoanDisbursement();

  const [search, setSearch] = useState("");
  const [viewFilter, setViewFilter] = useState<ViewFilter>("pending");
  const [selectedApp, setSelectedApp] = useState<LoanApplicationItem | null>(
    null,
  );
  const [loanCreated, setLoanCreated] = useState(false);
  const [disbursed, setDisbursed] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>("amortization");

  useEffect(() => {
    void fetchApproved();
  }, [fetchApproved]);

  const filteredByStatus = useMemo(() => {
    return applications.filter((app) => {
      const status = String(app.applicationStatusName ?? "").toLowerCase();

      if (viewFilter === "pending") {
        return (
          status.includes("aprobad") ||
          status.includes("approved") ||
          status.includes("aceptad")
        );
      }

      return (
        status.includes("activo") ||
        status.includes("active") ||
        status.includes("creado") ||
        status.includes("desembolsado") ||
        status.includes("disbursed") ||
        status.includes("en mora") ||
        status.includes("pagado")
      );
    });
  }, [applications, viewFilter]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return filteredByStatus;

    return filteredByStatus.filter((item) =>
      [item.applicationCode, item.clientName, item.employeeName, item.id]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [filteredByStatus, search]);

  useEffect(() => {
    resetLoanFlow();
    setSelectedApp(null);
    setLoanCreated(false);
    setDisbursed(false);
    setActiveTab("amortization");
  }, [viewFilter, resetLoanFlow]);

  const handleSelectApplication = (app: LoanApplicationItem) => {
    resetLoanFlow();
    setSelectedApp(app);
    setLoanCreated(false);
    setDisbursed(false);
    setActiveTab("amortization");
  };

  const getDefaultFirstPaymentDate = () => {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    return date.toISOString().split("T")[0];
  };

  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  const handleCreateLoan = async () => {
    if (!selectedApp?.id) return;

    try {
      const createdLoan = await createLoan(
        selectedApp.id,
        getDefaultFirstPaymentDate(),
        "",
      );

      setLoanCreated(true);

      if (createdLoan?.id) {
        await fetchSchedule(createdLoan.id);
        setActiveTab("amortization");
      }
    } catch (err) {
      console.error("Error al crear préstamo:", err);
    }
  };

  const handleDisburseLoan = async () => {
    if (!loan?.id) return;

    try {
      await disburseLoan(loan.id, getTodayDate());
      setDisbursed(true);
      await fetchSchedule(loan.id);
      setActiveTab("schedule");
    } catch (err) {
      console.error("Error al desembolsar:", err);
    }
  };

  const monthlyPayment =
    schedule?.installments && schedule.installments.length > 0
      ? getInstallmentPayment(schedule.installments[0])
      : 0;

  const isActiveLoan = viewFilter === "active";

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

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            type="button"
            onClick={() => navigate("/loan-applications/acceptance")}
            style={backBtn}
          >
            ← Volver a aceptación
          </button>
          <span style={navPill}>Gestión de préstamos</span>
          <span style={navDot} />
        </div>
      </nav>

      <div style={heroStrip}>
        <div>
          <h1 style={heroTitle}>Gestión de préstamos</h1>
          <p style={heroSub}>
            {viewFilter === "pending"
              ? "Selecciona una solicitud aprobada para crear y desembolsar el préstamo"
              : "Selecciona un préstamo activo para ver su tabla de amortización y calendario"}
          </p>
        </div>
      </div>

      <div style={cols}>
        <div style={card}>
          <div style={{ ...cardHead, justifyContent: "space-between" }}>
            <SectionLabel color={C.forest600}>
              {viewFilter === "pending"
                ? "Solicitudes aprobadas"
                : "Préstamos activos"}
            </SectionLabel>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <select
                value={viewFilter}
                onChange={(e) => setViewFilter(e.target.value as ViewFilter)}
                style={selectFilter}
              >
                <option value="pending">Para crear</option>
                <option value="active">Activos</option>
              </select>

              <div style={{ position: "relative" }}>
                <span style={searchIconSt}>⌕</span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar cliente, código..."
                  style={searchInputSt}
                />
              </div>
            </div>
          </div>

          <div
            style={{
              padding: "16px 18px",
              flex: 1,
              overflowY: "auto",
              maxHeight: 580,
            }}
          >
            {isLoadingApplications ? (
              <p style={muted}>Cargando solicitudes…</p>
            ) : filtered.length === 0 ? (
              <p style={muted}>
                {viewFilter === "pending"
                  ? "No hay solicitudes aprobadas disponibles."
                  : "No hay préstamos activos disponibles."}
              </p>
            ) : (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {filtered.map((item) => {
                  const isSelected = selectedApp?.id === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectApplication(item)}
                      style={{
                        ...appRow,
                        border: `1px solid ${isSelected ? C.forest600 : C.sand200}`,
                        background: isSelected ? C.forest50 : C.white,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: 10,
                          marginBottom: 8,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: fonts.display,
                            fontSize: 14,
                            fontWeight: 700,
                            color: isSelected ? C.forest800 : C.sand900,
                          }}
                        >
                          {item.applicationCode || item.id}
                        </span>

                        <span style={statusBadge}>
                          {item.applicationStatusName || "—"}
                        </span>
                      </div>

                      <div
                        style={{
                          fontSize: 12,
                          color: C.sand600,
                          fontFamily: fonts.body,
                          marginBottom: 3,
                        }}
                      >
                        Cliente:{" "}
                        <strong style={{ color: C.sand900 }}>
                          {item.clientName || "Sin nombre"}
                        </strong>
                      </div>

                      <div
                        style={{
                          fontFamily: fonts.display,
                          fontSize: 13,
                          fontWeight: 700,
                          color: C.forest700,
                        }}
                      >
                        {money(item.approvedAmount || item.requestedAmount)}
                      </div>

                      <div
                        style={{
                          fontSize: 11,
                          color: C.sand400,
                          fontFamily: fonts.body,
                          marginTop: 4,
                        }}
                      >
                        {fmtDate(item.createdAt)}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div style={card}>
          <div style={cardHead}>
            <SectionLabel color={C.sky}>
              {selectedApp
                ? `${selectedApp.applicationCode || selectedApp.id}`
                : isActiveLoan
                  ? "Detalle del préstamo"
                  : "Crear préstamo"}
            </SectionLabel>
          </div>

          <div
            style={{
              padding: "18px 20px",
              flex: 1,
              overflowY: "auto",
              maxHeight: 580,
            }}
          >
            {!selectedApp ? (
              <div style={placeholderWrap}>
                <div style={placeholderIcon}>◈</div>
                <span
                  style={{
                    fontSize: 13,
                    color: C.sand400,
                    fontFamily: fonts.body,
                    textAlign: "center",
                    whiteSpace: "pre-line",
                  }}
                >
                  {isActiveLoan
                    ? "Selecciona un préstamo activo\npara ver sus detalles"
                    : "Selecciona una solicitud\npara gestionar el préstamo"}
                </span>
              </div>
            ) : (
              <>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: 10,
                    marginBottom: 18,
                  }}
                >
                  <InfoCell
                    label="Cliente"
                    value={selectedApp.clientName || "—"}
                  />
                  <InfoCell
                    label="Código"
                    value={selectedApp.applicationCode || selectedApp.id}
                  />
                  <InfoCell
                    label="Monto aprobado"
                    value={money(
                      selectedApp.approvedAmount || selectedApp.requestedAmount,
                    )}
                  />
                  <InfoCell
                    label="Plazo"
                    value={`${
                      selectedApp.approvedTerm || selectedApp.requestedTerm || 0
                    } meses`}
                  />
                  <InfoCell
                    label="Tasa"
                    value={`${
                      selectedApp.approvedInterestRate ||
                      selectedApp.requestedInterestRate ||
                      0
                    }%`}
                  />
                  <InfoCell
                    label="Cuota"
                    value={money(monthlyPayment)}
                    highlight
                  />
                </div>

                {!isActiveLoan && (
                  <>
                    <div
                      style={{
                        height: 1,
                        background: C.sand100,
                        margin: "16px 0",
                      }}
                    />

                    {!loanCreated && (
                      <button
                        type="button"
                        onClick={handleCreateLoan}
                        disabled={isDisbursing}
                        style={{
                          ...btnPrimary,
                          opacity: isDisbursing ? 0.5 : 1,
                          cursor: isDisbursing ? "not-allowed" : "pointer",
                        }}
                      >
                        {isDisbursing ? "Procesando…" : "Crear préstamo"}
                      </button>
                    )}

                    {loanCreated && !disbursed && (
                      <>
                        <div style={successBanner}>
                          <span>✓</span>
                          <div>
                            <strong>Préstamo creado exitosamente</strong>
                            <div style={{ fontSize: 12, marginTop: 2 }}>
                              ID: {loan?.id || "—"}
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleDisburseLoan}
                          disabled={isDisbursing}
                          style={{
                            ...btnPrimary,
                            marginTop: 12,
                            opacity: isDisbursing ? 0.5 : 1,
                            cursor: isDisbursing ? "not-allowed" : "pointer",
                          }}
                        >
                          {isDisbursing
                            ? "Desembolsando…"
                            : "Desembolsar préstamo"}
                        </button>
                      </>
                    )}

                    {disbursed && (
                      <div style={successBanner}>
                        <span>✓</span>
                        <div>
                          <strong>Préstamo desembolsado exitosamente</strong>
                          <div style={{ fontSize: 12, marginTop: 2 }}>
                            El calendario de pagos está disponible
                          </div>
                        </div>
                      </div>
                    )}

                    {error && (
                      <div style={errorBanner}>
                        <span>⚠</span>
                        {error}
                      </div>
                    )}
                  </>
                )}

                <div
                  style={{
                    height: 1,
                    background: C.sand100,
                    margin: "16px 0",
                  }}
                />

                <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
                  <button
                    type="button"
                    onClick={() => setActiveTab("amortization")}
                    disabled={!loanCreated && !isActiveLoan}
                    style={{
                      ...tab,
                      ...(activeTab === "amortization" ? activeTabStyle : {}),
                      ...(!loanCreated && !isActiveLoan
                        ? { opacity: 0.5, cursor: "not-allowed" }
                        : {}),
                    }}
                  >
                    Tabla de amortización
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("schedule")}
                    disabled={!loanCreated && !isActiveLoan}
                    style={{
                      ...tab,
                      ...(activeTab === "schedule" ? activeTabStyle : {}),
                      ...(!loanCreated && !isActiveLoan
                        ? { opacity: 0.5, cursor: "not-allowed" }
                        : {}),
                    }}
                  >
                    Calendario de pagos
                  </button>
                </div>

                {activeTab === "amortization" && (
                  <>
                    {isLoadingSchedule ? (
                      <p style={muted}>Cargando tabla de amortización…</p>
                    ) : schedule?.installments &&
                      schedule.installments.length > 0 ? (
                      <AmortizationTable schedule={schedule.installments} />
                    ) : (
                      <p style={muted}>
                        {!loanCreated
                          ? "Primero crea el préstamo para ver la tabla de amortización."
                          : "No hay datos disponibles."}
                      </p>
                    )}
                  </>
                )}

                {activeTab === "schedule" && (
                  <>
                    {isLoadingSchedule ? (
                      <p style={muted}>Cargando calendario…</p>
                    ) : schedule?.installments &&
                      schedule.installments.length > 0 ? (
                      <PaymentScheduleTable schedule={schedule.installments} />
                    ) : (
                      <p style={muted}>
                        {!loanCreated
                          ? "Primero crea el préstamo para ver el calendario de pagos."
                          : "No hay calendario disponible."}
                      </p>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <footer
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          padding: "6px 0 4px",
        }}
      >
        <CredioMark size={20} />
        <span
          style={{ fontFamily: fonts.body, fontSize: 12, color: C.sand400 }}
        >
          Credio · Sistema de Gestión · {new Date().getFullYear()}
        </span>
      </footer>
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
      <svg
        width={size * 0.5}
        height={size * 0.5}
        viewBox="0 0 24 24"
        fill="none"
      >
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

function SectionLabel({
  color,
  children,
}: {
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div
        style={{
          width: 3,
          height: 17,
          background: color,
          borderRadius: 2,
          flexShrink: 0,
        }}
      />
      <h2
        style={{
          fontFamily: fonts.display,
          fontSize: 14,
          fontWeight: 700,
          color: C.sand800,
          margin: 0,
        }}
      >
        {children}
      </h2>
    </div>
  );
}

function InfoCell({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      style={{
        background: highlight ? C.forest50 : C.cream,
        borderRadius: 9,
        padding: "10px 12px",
        border: `1px solid ${highlight ? C.forest100 : C.sand200}`,
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: C.sand400,
          textTransform: "uppercase",
          letterSpacing: "0.7px",
          fontFamily: fonts.body,
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: highlight ? C.forest700 : C.sand900,
          fontFamily: fonts.display,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function AmortizationTable({ schedule }: { schedule: Installment[] }) {
  return (
    <div style={{ overflowX: "auto", maxHeight: 300, overflowY: "auto" }}>
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
            <tr key={`amortization-${idx}`} style={tbodyRow}>
              <td style={td}>{getInstallmentNumber(row, idx)}</td>
              <td
                style={{
                  ...td,
                  textAlign: "right",
                  fontFamily: fonts.display,
                  fontWeight: 700,
                }}
              >
                {money(getInstallmentPayment(row))}
              </td>
              <td style={{ ...td, textAlign: "right" }}>
                {money(getInstallmentPrincipal(row))}
              </td>
              <td style={{ ...td, textAlign: "right" }}>
                {money(getInstallmentInterest(row))}
              </td>
              <td
                style={{
                  ...td,
                  textAlign: "right",
                  color: C.forest700,
                  fontWeight: 700,
                }}
              >
                {money(getInstallmentBalance(row))}
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
    <div style={{ overflowX: "auto", maxHeight: 300, overflowY: "auto" }}>
      <table style={table}>
        <thead>
          <tr style={theadRow}>
            <th style={th}>#</th>
            <th style={th}>Vencimiento</th>
            <th style={{ ...th, textAlign: "right" }}>Monto</th>
            <th style={{ ...th, textAlign: "right" }}>Capital</th>
            <th style={{ ...th, textAlign: "right" }}>Interés</th>
            <th style={{ ...th, textAlign: "right" }}>Saldo</th>
            <th style={th}>Estado</th>
          </tr>
        </thead>
        <tbody>
          {schedule.map((row, idx) => {
            const status = getInstallmentStatus(row);
            const isPaid =
              status === "Pagado" ||
              status === "PAID" ||
              status.toLowerCase() === "paid";

            return (
              <tr key={`schedule-${idx}`} style={tbodyRow}>
                <td style={td}>{getInstallmentNumber(row, idx)}</td>
                <td style={td}>{fmtDate(row.dueDate)}</td>
                <td
                  style={{
                    ...td,
                    textAlign: "right",
                    fontFamily: fonts.display,
                    fontWeight: 700,
                  }}
                >
                  {money(getInstallmentPayment(row))}
                </td>
                <td style={{ ...td, textAlign: "right" }}>
                  {money(getInstallmentPrincipal(row))}
                </td>
                <td style={{ ...td, textAlign: "right" }}>
                  {money(getInstallmentInterest(row))}
                </td>
                <td
                  style={{
                    ...td,
                    textAlign: "right",
                    color: C.forest700,
                    fontWeight: 700,
                  }}
                >
                  {money(getInstallmentBalance(row))}
                </td>
                <td style={td}>
                  <span
                    style={{
                      ...statusBadge,
                      ...(isPaid
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

const navPill: React.CSSProperties = {
  background: C.forest50,
  color: C.forest700,
  fontSize: 11,
  fontWeight: 600,
  padding: "4px 12px",
  borderRadius: 99,
  border: `1px solid ${C.forest100}`,
  fontFamily: fonts.body,
};

const navDot: React.CSSProperties = {
  display: "inline-block",
  width: 8,
  height: 8,
  borderRadius: "50%",
  background: C.forest300,
  boxShadow: `0 0 0 3px ${C.forest100}`,
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

const cols: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1.1fr 1fr",
  gap: 18,
};

const card: React.CSSProperties = {
  background: C.white,
  borderRadius: 14,
  border: `1px solid ${C.sand200}`,
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
};

const cardHead: React.CSSProperties = {
  padding: "16px 20px",
  borderBottom: `1px solid ${C.sand100}`,
  display: "flex",
  alignItems: "center",
  gap: 10,
};

const selectFilter: React.CSSProperties = {
  padding: "7px 12px",
  borderRadius: 8,
  border: `1px solid ${C.sand200}`,
  background: C.white,
  fontFamily: fonts.body,
  fontSize: 12,
  color: C.sand900,
  outline: "none",
  cursor: "pointer",
  fontWeight: 600,
};

const searchIconSt: React.CSSProperties = {
  position: "absolute",
  left: 9,
  top: "50%",
  transform: "translateY(-50%)",
  color: C.sand400,
  fontSize: 14,
  pointerEvents: "none",
};

const searchInputSt: React.CSSProperties = {
  padding: "7px 10px 7px 28px",
  borderRadius: 8,
  border: `1px solid ${C.sand200}`,
  background: C.cream,
  fontFamily: fonts.body,
  fontSize: 12,
  color: C.sand900,
  outline: "none",
  width: 180,
};

const appRow: React.CSSProperties = {
  borderRadius: 11,
  padding: "14px 16px",
  cursor: "pointer",
  textAlign: "left",
  width: "100%",
  fontFamily: fonts.body,
  transition: "border-color .12s, background .12s",
  border: "none",
};

const statusBadge: React.CSSProperties = {
  padding: "3px 9px",
  borderRadius: 99,
  fontSize: 10,
  fontWeight: 700,
  background: C.goldSoft,
  color: C.gold,
  border: "1px solid #f0ddb8",
  fontFamily: fonts.body,
  whiteSpace: "nowrap",
};

const muted: React.CSSProperties = {
  fontSize: 13,
  color: C.sand400,
  fontFamily: fonts.body,
  textAlign: "center",
  padding: "20px 0",
};

const placeholderWrap: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  minHeight: 280,
  gap: 12,
};

const placeholderIcon: React.CSSProperties = {
  width: 48,
  height: 48,
  borderRadius: 12,
  background: C.sand100,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 20,
  color: C.sand400,
};

const btnPrimary: React.CSSProperties = {
  width: "100%",
  padding: "11px",
  borderRadius: 9,
  border: "none",
  background: C.forest700,
  color: C.white,
  fontFamily: fonts.body,
  fontSize: 13,
  fontWeight: 700,
  cursor: "pointer",
};

const successBanner: React.CSSProperties = {
  marginTop: 0,
  background: C.forest50,
  border: `1px solid ${C.forest100}`,
  borderRadius: 10,
  padding: "12px 14px",
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

const tab: React.CSSProperties = {
  padding: "8px 16px",
  borderRadius: "7px 7px 0 0",
  border: "none",
  background: "transparent",
  fontFamily: fonts.body,
  fontSize: 12,
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
  fontSize: 12,
  fontFamily: fonts.body,
};

const theadRow: React.CSSProperties = {
  borderBottom: `2px solid ${C.sand200}`,
  position: "sticky",
  top: 0,
  background: C.white,
};

const th: React.CSSProperties = {
  padding: "10px 12px",
  textAlign: "left",
  fontSize: 10,
  fontWeight: 700,
  color: C.sand600,
  textTransform: "uppercase",
  letterSpacing: "0.6px",
};

const tbodyRow: React.CSSProperties = {
  borderBottom: `1px solid ${C.sand100}`,
};

const td: React.CSSProperties = {
  padding: "12px 12px",
  color: C.sand900,
  fontSize: 12,
};
