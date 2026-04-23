import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoanAcceptance } from "../hooks/useLoanAcceptance";

// ─── BRAND TOKENS ─────────────────────────────────────────────────────────────
const C = {
  forest900: "#1A3326", forest800: "#22422F", forest700: "#2D5A3D",
  forest600: "#3A6E4A", forest300: "#7CB98A",
  forest100: "#D6EBD8", forest50:  "#EFF7F0",
  cream:     "#FAF8F5", sand100:   "#F0EDE8", sand200:   "#DDD9D2",
  sand400:   "#9E9A92", sand600:   "#5E5A54", sand800:   "#2A2724", sand900: "#1A1814",
  gold:      "#C9933A", goldSoft:  "#FBF3E6",
  coral:     "#C0524A", coralSoft: "#FDF1F0",
  sky:       "#3D6E8A", white: "#FFFFFF",
};

const fonts = {
  display: "'Georgia', 'Times New Roman', serif",
  body:    "'Trebuchet MS', 'Lucida Sans Unicode', sans-serif",
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const money = (v?: number | null) =>
  new Intl.NumberFormat("es-DO", { style: "currency", currency: "DOP", maximumFractionDigits: 2 }).format(Number(v ?? 0));

const fmtDate = (v?: string) => {
  if (!v) return "—";
  const d = new Date(v);
  return isNaN(d.getTime()) ? v : d.toLocaleDateString("es-DO", { day: "2-digit", month: "short", year: "numeric" });
};

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function LoanAcceptancePage() {
  const navigate = useNavigate();
  const {
    applications, selectedApplication,
    isLoading, isDetailLoading, isApproving, error,
    fetchDetail, approve,
  } = useLoanAcceptance();

  const [search,               setSearch]               = useState("");
  const [approvedAmount,       setApprovedAmount]       = useState("");
  const [approvedTerm,         setApprovedTerm]         = useState("");
  const [approvedInterestRate, setApprovedInterestRate] = useState("");
  const [comments,             setComments]             = useState("");
  const [accepted,             setAccepted]             = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return applications;
    return applications.filter(item =>
      [item.applicationCode, item.clientName, item.employeeName, item.applicationStatusName, item.id]
        .filter(Boolean).join(" ").toLowerCase().includes(q)
    );
  }, [applications, search]);

  useEffect(() => {
    if (!selectedApplication) return;
    setApprovedAmount(String(selectedApplication.approvedAmount ?? selectedApplication.requestedAmount ?? ""));
    setApprovedTerm(String(selectedApplication.approvedTerm ?? selectedApplication.requestedTerm ?? ""));
    setApprovedInterestRate(String(selectedApplication.approvedInterestRate ?? selectedApplication.requestedInterestRate ?? ""));
    setComments("");
    setAccepted(false);
  }, [selectedApplication]);

  const handleAccept = async () => {
    if (!selectedApplication?.id) return;
    const amount = Number(approvedAmount);
    const term   = Number(approvedTerm);
    const rate   = Number(approvedInterestRate);
    if (!amount || amount <= 0) return alert("Debes indicar un monto aprobado válido.");
    if (!term   || term   <= 0) return alert("Debes indicar un plazo aprobado válido.");
    if (!rate   || rate   <= 0) return alert("Debes indicar una tasa aprobada válida.");
    try {
      await approve(selectedApplication.id, {
        approvedAmount: amount, approvedTerm: term,
        approvedInterestRate: rate, comments: comments.trim() || undefined,
      });
      setAccepted(true);
    } catch {
      alert("No se pudo aceptar la solicitud.");
    }
  };

  const goToSimulation = () => {
    if (!selectedApplication) return;
    navigate("/loan-applications/simulation", {
      state: {
        application: {
          ...selectedApplication,
          approvedAmount:       Number(approvedAmount),
          approvedTerm:         Number(approvedTerm),
          approvedInterestRate: Number(approvedInterestRate),
        },
      },
    });
  };

  return (
    <div style={page}>

      {/* NAV */}
      <nav style={nav}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <CredioMark size={34} />
          <div>
            <div style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 16, color: C.sand900, letterSpacing: "-.3px", lineHeight: "1.1" }}>Credio</div>
            <div style={{ fontSize: 9, color: C.sand400, letterSpacing: "1.4px", textTransform: "uppercase", fontFamily: fonts.body }}>Sistema de Gestión</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={navPill}>Aceptación de solicitudes</span>
          <span style={navDot} />
        </div>
      </nav>

      {/* HERO */}
      <div style={heroStrip}>
        <div>
          <h1 style={heroTitle}>Aceptación de solicitud</h1>
          <p style={heroSub}>Selecciona una solicitud y define las condiciones aprobadas</p>
        </div>
      </div>

      {/* TWO-COLUMN LAYOUT */}
      <div style={cols}>

        {/* LEFT — Application list */}
        <div style={card}>
          <div style={{ ...cardHead, justifyContent: "space-between" }}>
            <SectionLabel color={C.forest600}>Solicitudes pendientes</SectionLabel>
            <div style={{ position: "relative" }}>
              <span style={searchIconSt}>⌕</span>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar cliente, código..."
                style={searchInputSt}
              />
            </div>
          </div>

          <div style={{ padding: "16px 18px", flex: 1, overflowY: "auto", maxHeight: 580 }}>
            {isLoading ? (
              <p style={muted}>Cargando solicitudes…</p>
            ) : filtered.length === 0 ? (
              <p style={muted}>No hay solicitudes disponibles.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {filtered.map(item => {
                  const isActive = selectedApplication?.id === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => void fetchDetail(item.id)}
                      style={{
                        ...appRow,
                        border: `1px solid ${isActive ? C.forest600 : C.sand200}`,
                        background: isActive ? C.forest50 : C.white,
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
                        <span style={{ fontFamily: fonts.display, fontSize: 14, fontWeight: 700, color: isActive ? C.forest800 : C.sand900 }}>
                          {item.applicationCode || item.id}
                        </span>
                        <span style={statusBadge}>{item.applicationStatusName || "Sin estado"}</span>
                      </div>
                      <div style={{ fontSize: 12, color: C.sand600, fontFamily: fonts.body, marginBottom: 3 }}>
                        Cliente: <strong style={{ color: C.sand900 }}>{item.clientName || "Sin nombre"}</strong>
                      </div>
                      <div style={{ fontFamily: fonts.display, fontSize: 13, fontWeight: 700, color: C.forest700 }}>
                        {money(item.requestedAmount)}
                      </div>
                      <div style={{ fontSize: 11, color: C.sand400, fontFamily: fonts.body, marginTop: 4 }}>
                        {fmtDate(item.createdAt)}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — Detail / approval form */}
        <div style={card}>
          <div style={cardHead}>
            <SectionLabel color={C.sky}>
              {selectedApplication ? `Condiciones — ${selectedApplication.applicationCode || selectedApplication.id}` : "Detalle"}
            </SectionLabel>
          </div>

          <div style={{ padding: "18px 20px", flex: 1, overflowY: "auto", maxHeight: 580 }}>
            {!selectedApplication ? (
              <div style={placeholderWrap}>
                <div style={placeholderIcon}>◈</div>
                <span style={{ fontSize: 13, color: C.sand400, fontFamily: fonts.body, textAlign: "center" }}>
                  Selecciona una solicitud<br />para ver su detalle
                </span>
              </div>
            ) : isDetailLoading ? (
              <p style={muted}>Cargando detalle…</p>
            ) : (
              <>
                {/* Info grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
                  <InfoCell label="Código"           value={selectedApplication.applicationCode || selectedApplication.id} />
                  <InfoCell label="Cliente"          value={selectedApplication.clientName || "—"} />
                  <InfoCell label="Estado"           value={selectedApplication.applicationStatusName || "—"} />
                  <InfoCell label="Frecuencia"       value={selectedApplication.paymentFrequency || "—"} />
                  <InfoCell label="Monto solicitado" value={money(selectedApplication.requestedAmount)} />
                  <InfoCell label="Plazo solicitado" value={String(selectedApplication.requestedTerm ?? "—")} />
                  <InfoCell label="Tasa solicitada"
                    value={selectedApplication.requestedInterestRate != null ? `${selectedApplication.requestedInterestRate}%` : "—"} />
                  <InfoCell label="Fecha"            value={fmtDate(selectedApplication.createdAt)} />
                </div>

                <div style={{ height: 1, background: C.sand100, margin: "16px 0" }} />

                {/* Approval fields */}
                <Field label="Monto aprobado">
                  <input type="number" value={approvedAmount} onChange={e => setApprovedAmount(e.target.value)} style={inputSt} />
                </Field>
                <Field label="Plazo aprobado">
                  <input type="number" value={approvedTerm} onChange={e => setApprovedTerm(e.target.value)} style={inputSt} />
                </Field>
                <Field label="Tasa aprobada">
                  <input type="number" step="0.01" value={approvedInterestRate} onChange={e => setApprovedInterestRate(e.target.value)} style={inputSt} />
                </Field>
                <Field label="Comentarios">
                  <textarea
                    value={comments} onChange={e => setComments(e.target.value)}
                    placeholder="Notas u observaciones..."
                    style={{ ...inputSt, minHeight: 80, resize: "vertical" }}
                  />
                </Field>

                {/* Actions */}
                <button
                  type="button"
                  onClick={() => void handleAccept()}
                  disabled={isApproving || accepted}
                  style={{
                    ...btnAccept,
                    background: accepted ? C.forest600 : C.forest700,
                    opacity: isApproving ? 0.6 : 1,
                    cursor: isApproving || accepted ? "default" : "pointer",
                  }}
                >
                  {isApproving ? "Aceptando…" : accepted ? "Solicitud aceptada ✓" : "Aceptar solicitud"}
                </button>

                <button
                  type="button"
                  onClick={goToSimulation}
                  disabled={!accepted}
                  style={!accepted ? { ...btnSim, opacity: 0.4, cursor: "not-allowed", background: C.sand100, color: C.sand400, borderColor: C.sand200 } : btnSim}
                >
                  Ir a simulación del préstamo
                </button>

                {error && (
                  <div style={{ marginTop: 12, background: C.coralSoft, border: "1px solid #f7c8c5", borderRadius: 9, padding: "11px 14px", fontSize: 12, color: C.coral, fontFamily: fonts.body, display: "flex", gap: 7 }}>
                    <span>⚠</span>{error}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "6px 0 4px" }}>
        <CredioMark size={20} />
        <span style={{ fontFamily: fonts.body, fontSize: 12, color: C.sand400 }}>
          Credio · Sistema de Gestión · {new Date().getFullYear()}
        </span>
      </footer>
    </div>
  );
}

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

function CredioMark({ size = 34 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size, borderRadius: Math.round(size * 0.265), background: C.forest800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none">
        <path d="M18 6C14 4 8 5 6 10C4.5 14 6 18 10 19.5C7 17 7 13 9 10.5C11 8 15 7.5 18 9C17 7.5 17.5 6.5 18 6Z" fill="white" opacity="0.9" />
        <path d="M8 14C9 17 12 19 15 18.5C17 18 19 16 19.5 14C18 16 15 17 13 16C11 15 9.5 13 10 11C9 11.5 8 12.5 8 14Z" fill="white" opacity="0.55" />
      </svg>
    </div>
  );
}

function SectionLabel({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ width: 3, height: 17, background: color, borderRadius: 2, flexShrink: 0 }} />
      <h2 style={{ fontFamily: fonts.display, fontSize: 14, fontWeight: 700, color: C.sand800, margin: 0 }}>{children}</h2>
    </div>
  );
}

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: C.cream, borderRadius: 9, padding: "10px 12px", border: `1px solid ${C.sand200}` }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: C.sand400, textTransform: "uppercase", letterSpacing: "0.7px", fontFamily: fonts.body, marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: C.sand900, fontFamily: fonts.display }}>{value}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 13 }}>
      <label style={{ fontSize: 11, fontWeight: 700, color: C.sand600, textTransform: "uppercase", letterSpacing: "0.7px", fontFamily: fonts.body }}>
        {label}
      </label>
      {children}
    </div>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const page: React.CSSProperties = {
  display: "grid", gap: 18, padding: "clamp(16px, 3vw, 28px)",
  background: C.cream, minHeight: "100vh", fontFamily: fonts.body,
};
const nav: React.CSSProperties = {
  display: "flex", justifyContent: "space-between", alignItems: "center",
  background: C.white, borderRadius: 12, padding: "12px 18px", border: `1px solid ${C.sand200}`,
};
const navPill: React.CSSProperties = {
  background: C.forest50, color: C.forest700, fontSize: 11, fontWeight: 600,
  padding: "4px 12px", borderRadius: 99, border: `1px solid ${C.forest100}`, fontFamily: fonts.body,
};
const navDot: React.CSSProperties = {
  display: "inline-block", width: 8, height: 8, borderRadius: "50%",
  background: C.forest300, boxShadow: `0 0 0 3px ${C.forest100}`,
} as React.CSSProperties;
const heroStrip: React.CSSProperties = {
  background: C.forest900, borderRadius: 14, padding: "22px 28px",
};
const heroTitle: React.CSSProperties = {
  fontFamily: fonts.display, fontSize: "clamp(20px, 4vw, 26px)", fontWeight: 700,
  color: C.white, margin: 0, letterSpacing: "-.3px",
};
const heroSub: React.CSSProperties = {
  fontFamily: fonts.body, fontSize: 12, color: C.forest300, marginTop: 4, marginBottom: 0,
};
const cols: React.CSSProperties = { display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 18 };
const card: React.CSSProperties = {
  background: C.white, borderRadius: 14, border: `1px solid ${C.sand200}`,
  overflow: "hidden", display: "flex", flexDirection: "column",
};
const cardHead: React.CSSProperties = {
  padding: "16px 20px", borderBottom: `1px solid ${C.sand100}`,
  display: "flex", alignItems: "center", gap: 10,
};
const searchIconSt: React.CSSProperties = {
  position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)",
  color: C.sand400, fontSize: 14, pointerEvents: "none",
};
const searchInputSt: React.CSSProperties = {
  padding: "7px 10px 7px 28px", borderRadius: 8, border: `1px solid ${C.sand200}`,
  background: C.cream, fontFamily: fonts.body, fontSize: 12, color: C.sand900, outline: "none",
  width: 200,
};
const appRow: React.CSSProperties = {
  borderRadius: 11, padding: "14px 16px", cursor: "pointer",
  textAlign: "left", width: "100%", fontFamily: fonts.body,
  transition: "border-color .12s, background .12s",
};
const statusBadge: React.CSSProperties = {
  padding: "3px 9px", borderRadius: 99, fontSize: 10, fontWeight: 700,
  background: C.goldSoft, color: C.gold, border: "1px solid #f0ddb8",
  fontFamily: fonts.body, whiteSpace: "nowrap",
};
const muted: React.CSSProperties = { fontSize: 13, color: C.sand400, fontFamily: fonts.body };
const placeholderWrap: React.CSSProperties = {
  display: "flex", flexDirection: "column", alignItems: "center",
  justifyContent: "center", height: "100%", minHeight: 280, gap: 12,
};
const placeholderIcon: React.CSSProperties = {
  width: 48, height: 48, borderRadius: 12, background: C.sand100,
  display: "flex", alignItems: "center", justifyContent: "center",
  fontSize: 20, color: C.sand400,
};
const inputSt: React.CSSProperties = {
  padding: "9px 12px", borderRadius: 9, border: `1px solid ${C.sand200}`,
  background: C.cream, fontFamily: fonts.body, fontSize: 13, color: C.sand900, outline: "none",
  width: "100%",
};
const btnAccept: React.CSSProperties = {
  width: "100%", padding: "11px", borderRadius: 9, border: "none",
  background: C.forest700, color: C.white,
  fontFamily: fonts.body, fontSize: 13, fontWeight: 700, marginBottom: 8,
};
const btnSim: React.CSSProperties = {
  width: "100%", padding: "11px", borderRadius: 9,
  border: `1px solid ${C.forest100}`, background: C.forest50, color: C.forest700,
  fontFamily: fonts.body, fontSize: 13, fontWeight: 700, cursor: "pointer",
};