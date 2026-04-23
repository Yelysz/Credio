import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLoanAcceptance } from "../hooks/useLoanAcceptance";

// ─── BRAND TOKENS ─────────────────────────────────────────────────────────────
const C = {
  forest900: "#1A3326", forest800: "#22422F", forest700: "#2D5A3D",
  forest600: "#3A6E4A", forest300: "#7CB98A",
  forest100: "#D6EBD8", forest50:  "#EFF7F0",
  cream:     "#FAF8F5", sand100:   "#F0EDE8", sand200:   "#DDD9D2",
  sand400:   "#9E9A92", sand600:   "#5E5A54", sand800:   "#2A2724", sand900: "#1A1814",
  gold:      "#C9933A", coral: "#C0524A", coralSoft: "#FDF1F0",
  sky:       "#3D6E8A", white: "#FFFFFF",
};

const fonts = {
  display: "'Georgia', 'Times New Roman', serif",
  body:    "'Trebuchet MS', 'Lucida Sans Unicode', sans-serif",
};

const money = (v?: number | null) =>
  new Intl.NumberFormat("es-DO", { style: "currency", currency: "DOP", maximumFractionDigits: 2 }).format(Number(v ?? 0));

const fmtDate = (v?: string | null) => {
  if (!v) return "—";
  const d = new Date(v);
  return isNaN(d.getTime()) ? v : d.toLocaleDateString("es-DO", { day: "2-digit", month: "short", year: "numeric" });
};

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function LoanSimulationPage() {
  const location = useLocation();
  const navigate  = useNavigate();
  const application = location.state?.application;

  const { simulation, isSimulating, error, setSelectedApplication, simulate } = useLoanAcceptance();

  useEffect(() => { if (application) setSelectedApplication(application); }, [application, setSelectedApplication]);
  useEffect(() => { if (application) void simulate(); },                    [application, simulate]);

  // ── Empty state ─────────────────────────────────────────────────────────────
  if (!application) {
    return (
      <div style={page}>
        <Nav />
        <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.sand200}`, padding: "48px 32px", textAlign: "center" }}>
          <div style={{ fontSize: 32, color: C.sand400, marginBottom: 12 }}>◈</div>
          <p style={{ fontFamily: fonts.body, fontSize: 14, color: C.sand400, marginBottom: 16 }}>
            No llegó ninguna solicitud aprobada.
          </p>
          <button
            type="button"
            onClick={() => navigate("/loan-applications/acceptance")}
            style={{ ...btnPrimary, padding: "10px 22px" }}
          >
            ‹ Volver a aceptación
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={page}>
      <Nav />

      {/* HERO */}
      <div style={heroStrip}>
        <div>
          <h1 style={heroTitle}>Simulación del préstamo</h1>
          <p style={heroSub}>Calendario de pagos con las condiciones aceptadas</p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/loan-applications/acceptance")}
          style={btnHeroBack}
        >
          ‹ Volver
        </button>
      </div>

      {/* SUMMARY STATS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        <StatCard label="Cliente"        value={application.clientName || "—"}                    accent={C.forest600} />
        <StatCard label="Monto aprobado" value={money(application.approvedAmount)}                accent={C.sky}       />
        <StatCard label="Plazo"          value={`${application.approvedTerm ?? "—"} períodos`}    accent={C.gold}      />
        <StatCard label="Tasa anual"     value={`${application.approvedInterestRate ?? "—"}%`}    accent={C.coral}     />
      </div>

      {/* SIMULATION TABLE */}
      <div style={card}>
        <div style={cardHead}>
          <div style={{ width: 3, height: 17, background: C.gold, borderRadius: 2, flexShrink: 0 }} />
          <h2 style={{ fontFamily: fonts.display, fontSize: 14, fontWeight: 700, color: C.sand800, margin: 0 }}>
            Tabla de amortización
          </h2>
        </div>

        {isSimulating && (
          <div style={stateMsg}>Generando simulación…</div>
        )}

        {!isSimulating && error && (
          <div style={{ margin: "16px 20px", background: C.coralSoft, border: "1px solid #f7c8c5", borderRadius: 9, padding: "12px 16px", fontSize: 13, color: C.coral, fontFamily: fonts.body }}>
            {error}
          </div>
        )}

        {!isSimulating && !error && !simulation?.installments?.length && (
          <div style={stateMsg}>No se recibieron cuotas de simulación.</div>
        )}

        {!isSimulating && !error && !!simulation?.installments?.length && (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 560 }}>
              <thead>
                <tr style={{ background: C.sand100 }}>
                  {["#", "Vencimiento", "Cuota", "Capital", "Interés", "Balance"].map(h => (
                    <th key={h} style={th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {simulation.installments.map((item, i) => (
                  <tr
                    key={`${item.installmentNumber ?? i}-${item.dueDate ?? i}`}
                    style={{ borderBottom: `1px solid ${C.sand100}`, background: i % 2 === 0 ? C.white : C.cream }}
                  >
                    <td style={{ ...td_, fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: C.sand400 }}>
                      {String(item.installmentNumber ?? i + 1).padStart(2, "0")}
                    </td>
                    <td style={{ ...td_, fontSize: 11, color: C.sand400 }}>
                      {fmtDate(item.dueDate)}
                    </td>
                    <td style={{ ...td_, fontFamily: fonts.display, fontWeight: 700, fontSize: 14, color: C.sand900 }}>
                      {money(item.installmentAmount)}
                    </td>
                    <td style={{ ...td_, color: C.forest700, fontWeight: 600 }}>
                      {money(item.principal)}
                    </td>
                    <td style={{ ...td_, color: C.gold, fontWeight: 600 }}>
                      {money(item.interest)}
                    </td>
                    <td style={{ ...td_, color: C.sand800, fontWeight: 600 }}>
                      {money(item.balance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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

function Nav() {
  const navigate = useNavigate();
  return (
    <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: C.white, borderRadius: 12, padding: "12px 18px", border: `1px solid ${C.sand200}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <CredioMark size={34} />
        <div>
          <div style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 16, color: C.sand900, letterSpacing: "-.3px", lineHeight: "1.1" }}>Credio</div>
          <div style={{ fontSize: 9, color: C.sand400, letterSpacing: "1.4px", textTransform: "uppercase", fontFamily: fonts.body }}>Sistema de Gestión</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.sand400, fontFamily: fonts.body }}>
        <span style={{ color: C.forest600, fontWeight: 600, cursor: "pointer" }} onClick={() => navigate("/loan-applications")}>Préstamos</span>
        <span>›</span>
        <span style={{ color: C.forest600, fontWeight: 600, cursor: "pointer" }} onClick={() => navigate("/loan-applications/acceptance")}>Aceptación</span>
        <span>›</span>
        <span style={{ color: C.sand600 }}>Simulación</span>
      </div>
    </nav>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div style={{ background: C.white, borderRadius: 12, padding: "16px 18px", border: `1px solid ${C.sand200}`, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: accent, borderRadius: "12px 12px 0 0" }} />
      <div style={{ fontSize: 10, fontWeight: 700, color: C.sand400, textTransform: "uppercase", letterSpacing: "0.8px", fontFamily: fonts.body, marginTop: 2 }}>{label}</div>
      <div style={{ fontFamily: fonts.display, fontSize: 17, fontWeight: 800, color: C.sand900, marginTop: 6 }}>{value}</div>
    </div>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const page: React.CSSProperties = {
  display: "grid", gap: 18, padding: "clamp(16px, 3vw, 28px)",
  background: C.cream, minHeight: "100vh", fontFamily: fonts.body,
};
const heroStrip: React.CSSProperties = {
  background: C.forest900, borderRadius: 14, padding: "22px 28px",
  display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16,
};
const heroTitle: React.CSSProperties = {
  fontFamily: fonts.display, fontSize: "clamp(20px, 4vw, 26px)", fontWeight: 700,
  color: C.white, margin: 0, letterSpacing: "-.3px",
};
const heroSub: React.CSSProperties = {
  fontFamily: fonts.body, fontSize: 12, color: C.forest300, marginTop: 4, marginBottom: 0,
};
const btnHeroBack: React.CSSProperties = {
  padding: "9px 16px", borderRadius: 9, border: "1px solid rgba(255,255,255,.2)",
  background: "rgba(255,255,255,.08)", color: "rgba(255,255,255,.8)",
  fontFamily: fonts.body, fontSize: 13, fontWeight: 600, cursor: "pointer", flexShrink: 0,
};
const btnPrimary: React.CSSProperties = {
  borderRadius: 9, border: "none", background: C.forest700, color: C.white,
  fontFamily: fonts.body, fontSize: 13, fontWeight: 700, cursor: "pointer",
};
const card: React.CSSProperties = {
  background: C.white, borderRadius: 14, border: `1px solid ${C.sand200}`, overflow: "hidden",
};
const cardHead: React.CSSProperties = {
  padding: "16px 22px", borderBottom: `1px solid ${C.sand100}`,
  display: "flex", alignItems: "center", gap: 8,
};
const stateMsg: React.CSSProperties = {
  padding: "40px", textAlign: "center", color: C.sand400, fontFamily: fonts.body, fontSize: 13,
};
const th: React.CSSProperties = {
  textAlign: "left", padding: "10px 16px", fontSize: 10, fontWeight: 700,
  color: C.sand600, textTransform: "uppercase", letterSpacing: "0.8px", fontFamily: fonts.body,
};
const td_: React.CSSProperties = { padding: "13px 16px", fontSize: 12, color: C.sand600 };