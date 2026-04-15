import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEmployees } from "../hooks/useEmployees";

// ─── BRAND TOKENS (consistent with DashboardPage) ────────────────────────────
const C = {
  forest900: "#1A3326", forest800: "#22422F", forest700: "#2D5A3D",
  forest600: "#3A6E4A", forest500: "#4A8A5A", forest300: "#7CB98A",
  forest100: "#D6EBD8", forest50:  "#EFF7F0",
  cream:     "#FAF8F5", sand100:   "#F0EDE8", sand200:   "#DDD9D2",
  sand400:   "#9E9A92", sand600:   "#5E5A54", sand800:   "#2A2724",
  sand900:   "#1A1814",
  gold:      "#C9933A", goldSoft:  "#FBF3E6",
  coral:     "#C0524A", coralSoft: "#FDF1F0",
  sky:       "#3D6E8A", skySoft:   "#E8F1F7",
  white:     "#FFFFFF",
};

const fonts = {
  display: "'Georgia', 'Times New Roman', serif",
  body:    "'Trebuchet MS', 'Lucida Sans Unicode', sans-serif",
};

// ─── INTERFACES ──────────────────────────────────────────────────────────────
interface Employee {
  id: string | number;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  employeeCode?: string | number;
  code?: string | number;
  documentNumber?: string;
  documentType?: string;
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const getInitials = (name: string) =>
  name.split(" ").slice(0, 2).map(w => w[0]?.toUpperCase() ?? "").join("");

const AVATAR_PALETTES = [
  { bg: C.forest50,  color: C.forest700 },
  { bg: C.skySoft,   color: C.sky       },
  { bg: C.goldSoft,  color: C.gold      },
  { bg: C.coralSoft, color: C.coral     },
];

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function EmployeesPage() {
  const navigate  = useNavigate();
  const [searchInput, setSearchInput] = useState("");

  const { employees = [], isLoading, error, setParams, params, refetch } = useEmployees();

  const filteredEmployees = useMemo(() => {
    const safe = Array.isArray(employees) ? employees : [];
    if (!searchInput.trim()) return safe;
    const q = searchInput.trim().toLowerCase();
    return safe.filter((e: Employee) => {
      const name  = [e.firstName, e.lastName, e.name].filter(Boolean).join(" ").toLowerCase();
      const email = (e.email ?? "").toLowerCase();
      const code  = String(e.employeeCode ?? e.code ?? "").toLowerCase();
      return name.includes(q) || email.includes(q) || code.includes(q);
    });
  }, [employees, searchInput]);

  const currentPage = params?.pageNumber ?? 1;
  const pageSize    = params?.pageSize   ?? 10;

  const handleSearch = () =>
    setParams({ ...params, pageNumber: 1, search: searchInput.trim() || undefined });

  return (
    <div style={page}>

      {/* NAV */}
      <nav style={nav}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <CredioMark size={36} />
          <div>
            <div style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 17, color: C.sand900, letterSpacing: "-0.3px", lineHeight: "1.1" }}>Credio</div>
            <div style={{ fontFamily: fonts.body, fontSize: 9, color: C.sand400, letterSpacing: "1.4px", textTransform: "uppercase" }}>Sistema de Gestión</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={navPill}>Gestión de Personal</div>
          <div style={navDot} />
        </div>
      </nav>

      {/* HERO */}
      <div style={heroStrip}>
        <div>
          <h1 style={heroTitle}>Gestión de Personal</h1>
          <p style={heroSub}>Administra accesos y perfiles de los colaboradores de Credio</p>
        </div>
        <button onClick={() => navigate("/employees/new")} style={btnNew}>
          <div style={btnNewIcon}>+</div>
          Nuevo empleado
        </button>
      </div>

      {/* STATS ROW */}
      <div style={statsGrid}>
        <MiniStat label="Total colaboradores" value={String(employees.length || 0)} sub="Registros activos" accent={C.forest600} />
        <MiniStat label="Con acceso al sistema" value="—" sub="Cuentas habilitadas" accent={C.sky} />
        <MiniStat label="Pendientes" value="—" sub="Sin credenciales" accent={C.gold} />
      </div>

      {/* MAIN CARD */}
      <div style={card}>

        {/* Card header */}
        <div style={cardHeader}>
          <SectionLabel>Directorio de empleados</SectionLabel>
        </div>

        {/* Search bar */}
        <div style={searchRow}>
          <div style={{ flex: 1, position: "relative" }}>
            <span style={searchIcon}>⌕</span>
            <input
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
              placeholder="Buscar por nombre, correo o código..."
              style={searchInput_}
            />
          </div>
          <button onClick={handleSearch} style={btnSearch}>Buscar</button>
          <button onClick={refetch} style={btnRefresh} title="Refrescar">↺</button>
        </div>

        {/* States */}
        {isLoading && (
          <div style={stateMsg}>
            <span style={{ color: C.sand400 }}>Sincronizando base de datos…</span>
          </div>
        )}
        {error && (
          <div style={stateMsg}>
            <span style={{ color: C.coral }}>{error}</span>
          </div>
        )}

        {!isLoading && !error && filteredEmployees.length === 0 && (
          <div style={stateMsg}>
            <span style={{ color: C.sand400 }}>No se encontraron resultados.</span>
          </div>
        )}

        {!isLoading && !error && filteredEmployees.length > 0 && (
          <>
            <div style={{ overflowX: "auto" }}>
              <table style={tbl}>
                <thead>
                  <tr style={{ background: C.sand100 }}>
                    <th style={th}>Código</th>
                    <th style={th}>Colaborador</th>
                    <th style={th}>Correo electrónico</th>
                    <th style={th}>Documento</th>
                    <th style={th}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((emp: Employee, i: number) => {
                    const fullName = emp.name?.trim() ||
                      `${emp.firstName ?? ""} ${emp.lastName ?? ""}`.trim() || "Sin nombre";
                    const pal = AVATAR_PALETTES[i % AVATAR_PALETTES.length];
                    return (
                      <tr key={emp.id} style={tr_}>
                        <td style={tdCode}>
                          <span style={codeBadge}>#{emp.employeeCode ?? emp.code ?? "—"}</span>
                        </td>
                        <td style={td_}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ ...avatar, background: pal.bg, color: pal.color }}>
                              {getInitials(fullName)}
                            </div>
                            <span style={{ fontWeight: 700, color: C.sand900, fontSize: 13 }}>{fullName}</span>
                          </div>
                        </td>
                        <td style={td_}>
                          <span style={{ color: C.sand400, fontSize: 12 }}>{emp.email ?? "—"}</span>
                        </td>
                        <td style={td_}>
                          <span style={{ color: C.sand800, fontSize: 12, fontWeight: 600 }}>
                            {emp.documentNumber ?? "—"}
                          </span>
                          {emp.documentType && (
                            <span style={{ display: "block", color: C.sand400, fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginTop: 1 }}>
                              {emp.documentType}
                            </span>
                          )}
                        </td>
                        <td style={td_}>
                          <button onClick={() => navigate(`/employees/${emp.id}`)} style={btnVer}>
                            Ver Perfil
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div style={pagination}>
              <span style={{ fontSize: 12, color: C.sand400, fontFamily: fonts.body }}>
                Mostrando página <strong style={{ color: C.sand800 }}>{currentPage}</strong>
              </span>
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  onClick={() => setParams({ ...params, pageNumber: currentPage - 1 })}
                  disabled={currentPage <= 1}
                  style={currentPage <= 1 ? btnPagDisabled : btnPag}
                >
                  Anterior
                </button>
                <button
                  onClick={() => setParams({ ...params, pageNumber: currentPage + 1 })}
                  disabled={filteredEmployees.length < pageSize}
                  style={filteredEmployees.length < pageSize ? btnPagDisabled : btnPag}
                >
                  Siguiente
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* FOOTER */}
      <footer style={footer}>
        <CredioMark size={20} />
        <span style={{ fontFamily: fonts.body, fontSize: 12, color: C.sand400 }}>
          Credio · Sistema de Gestión · {new Date().getFullYear()}
        </span>
      </footer>
    </div>
  );
}

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

function CredioMark({ size = 36 }: { size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.28,
      background: C.forest800,
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>
      <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none">
        <path d="M18 6C14 4 8 5 6 10C4.5 14 6 18 10 19.5C7 17 7 13 9 10.5C11 8 15 7.5 18 9C17 7.5 17.5 6.5 18 6Z" fill="white" opacity="0.9" />
        <path d="M8 14C9 17 12 19 15 18.5C17 18 19 16 19.5 14C18 16 15 17 13 16C11 15 9.5 13 10 11C9 11.5 8 12.5 8 14Z" fill="white" opacity="0.55" />
      </svg>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ width: 3, height: 17, background: C.forest600, borderRadius: 2 }} />
      <h2 style={{ fontFamily: fonts.display, fontSize: 14, fontWeight: 700, color: C.sand800, margin: 0 }}>
        {children}
      </h2>
    </div>
  );
}

function MiniStat({ label, value, sub, accent }: { label: string; value: string; sub: string; accent: string }) {
  return (
    <div style={{ background: C.white, borderRadius: 12, padding: "16px 18px", border: `1px solid ${C.sand200}`, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: accent, borderRadius: "12px 12px 0 0" }} />
      <div style={{ fontFamily: fonts.body, fontSize: 10, fontWeight: 600, color: C.sand400, textTransform: "uppercase", letterSpacing: "1px", marginTop: 4 }}>{label}</div>
      <div style={{ fontFamily: fonts.display, fontSize: 24, fontWeight: 800, color: C.sand900, margin: "6px 0 4px" }}>{value}</div>
      <div style={{ fontSize: 11, color: C.sand400, fontFamily: fonts.body }}>{sub}</div>
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
  width: 8, height: 8, borderRadius: "50%", background: C.forest500, boxShadow: `0 0 0 3px ${C.forest100}`,
};
const heroStrip: React.CSSProperties = {
  background: C.forest900, borderRadius: 14, padding: "24px 28px",
  display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16,
};
const heroTitle: React.CSSProperties = {
  fontFamily: fonts.display, fontSize: "clamp(20px, 4vw, 26px)", fontWeight: 700,
  color: C.white, margin: 0, letterSpacing: "-0.4px",
};
const heroSub: React.CSSProperties = {
  fontFamily: fonts.body, fontSize: 12, color: C.forest300, marginTop: 5, marginBottom: 0,
};
const btnNew: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 7, background: C.white, color: C.forest800,
  border: "none", borderRadius: 10, padding: "10px 18px",
  fontFamily: fonts.body, fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
};
const btnNewIcon: React.CSSProperties = {
  width: 20, height: 20, borderRadius: 6, background: C.forest600, color: C.white,
  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, lineHeight: "1",
};
const statsGrid: React.CSSProperties = {
  display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12,
};
const card: React.CSSProperties = {
  background: C.white, borderRadius: 14, border: `1px solid ${C.sand200}`, overflow: "hidden",
};
const cardHeader: React.CSSProperties = { padding: "18px 20px 0" };
const searchRow: React.CSSProperties = {
  display: "flex", gap: 10, padding: "14px 20px", borderBottom: `1px solid ${C.sand100}`,
};
const searchIcon: React.CSSProperties = {
  position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
  color: C.sand400, fontSize: 16, pointerEvents: "none",
};
const searchInput_: React.CSSProperties = {
  width: "100%", padding: "9px 12px 9px 34px", borderRadius: 9, border: `1px solid ${C.sand200}`,
  background: C.cream, fontFamily: fonts.body, fontSize: 13, color: C.sand800, outline: "none",
};
const btnSearch: React.CSSProperties = {
  padding: "9px 16px", borderRadius: 9, border: `1px solid ${C.forest600}`,
  background: C.forest50, color: C.forest700, fontFamily: fonts.body, fontSize: 13, fontWeight: 600, cursor: "pointer",
};
const btnRefresh: React.CSSProperties = {
  padding: "9px 14px", borderRadius: 9, border: `1px solid ${C.sand200}`,
  background: C.white, color: C.sand600, fontFamily: fonts.body, fontSize: 15, cursor: "pointer",
};
const stateMsg: React.CSSProperties = {
  padding: "40px", textAlign: "center", fontFamily: fonts.body, fontSize: 14,
};
const tbl: React.CSSProperties = { width: "100%", borderCollapse: "collapse", minWidth: 640 };
const th: React.CSSProperties = {
  textAlign: "left", padding: "10px 14px", fontSize: 10, fontWeight: 700,
  color: C.sand600, textTransform: "uppercase", letterSpacing: "0.8px", fontFamily: fonts.body,
};
const tr_: React.CSSProperties = { borderBottom: `1px solid ${C.sand100}` };
const td_: React.CSSProperties = { padding: "13px 14px", fontSize: 13, color: C.sand600 };
const tdCode: React.CSSProperties = { ...td_ };
const codeBadge: React.CSSProperties = {
  display: "inline-block", background: C.skySoft, color: C.sky,
  fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 6,
  fontFamily: "monospace", letterSpacing: "0.5px",
};
const avatar: React.CSSProperties = {
  width: 32, height: 32, borderRadius: "50%",
  display: "flex", alignItems: "center", justifyContent: "center",
  fontSize: 11, fontWeight: 700, flexShrink: 0,
};
const btnVer: React.CSSProperties = {
  padding: "6px 14px", borderRadius: 7, border: `1px solid ${C.forest100}`,
  background: C.forest50, color: C.forest700,
  fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: fonts.body,
};
const pagination: React.CSSProperties = {
  display: "flex", justifyContent: "space-between", alignItems: "center",
  padding: "14px 20px", borderTop: `1px solid ${C.sand100}`,
};
const btnPag: React.CSSProperties = {
  padding: "7px 14px", borderRadius: 8, border: `1px solid ${C.sand200}`,
  background: C.white, color: C.sand800, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: fonts.body,
};
const btnPagDisabled: React.CSSProperties = { ...btnPag, opacity: 0.35, cursor: "not-allowed" };
const footer: React.CSSProperties = {
  display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "6px 0 4px",
};