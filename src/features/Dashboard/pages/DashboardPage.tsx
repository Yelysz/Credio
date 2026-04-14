import { useMemo, useState } from "react";
import { useDashboard } from "../hooks/useDashboard";


// ─── BRAND TOKENS ────────────────────────────────────────────────────────────
const C = {
  // Forest greens (from logo)
  forest900: "#1A3326",
  forest800: "#22422F",
  forest700: "#2D5A3D",
  forest600: "#3A6E4A",
  forest500: "#4A8A5A",
  forest300: "#7CB98A",
  forest100: "#D6EBD8",
  forest50: "#EFF7F0",

  // Neutrals – warm off-whites
  cream: "#FAF8F5",
  sand100: "#F0EDE8",
  sand200: "#DDD9D2",
  sand400: "#9E9A92",
  sand600: "#5E5A54",
  sand800: "#2A2724",
  sand900: "#1A1814",

  // Accents
  gold: "#C9933A",
  goldSoft: "#FBF3E6",
  coral: "#C0524A",
  coralSoft: "#FDF1F0",
  sky: "#3D6E8A",
  skySoft: "#E8F1F7",

  white: "#FFFFFF",
};

// ─── INTERFACES ──────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: string | number;
  sub: string;
  accent: string;
  accentSoft: string;
  icon: string;
}
interface ProgressRowProps {
  label: string;
  value: number;
  color: string;
  bgColor: string;
}
interface InstallmentRow {
  client?: string;
  loan?: string | number;
  dueDate?: string;
  amount?: number;
  dueAmount?: number;
  status?: string;
  state?: string;
}


// ─── FORMATTERS ──────────────────────────────────────────────────────────────
const fmt$ = (v: number = 0) =>
  new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: "DOP",
    maximumFractionDigits: 0,
  }).format(v);

const fmtDate = (v?: string) => {
  if (!v) return "—";
  const d = new Date(v);
  return isNaN(d.getTime())
    ? v
    : new Intl.DateTimeFormat("es-DO", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(d);
};

// ─── PAGE ─────────────────────────────────────────────────────────────────────



export default function DashboardPage() {
  const { data, isLoading, error, refetch } = useDashboard();
  const [hoveredBar, setHoveredBar] = useState<{
  label: string;
  disbursements: number;
  collections: number;
  x: number;
  y: number;
} | null>(null);

  const chartData = useMemo(() => {
    const disbursements = data?.cashFlow?.disbursements ?? [];
    const collections = data?.cashFlow?.collections ?? [];

    const len = Math.max(disbursements.length, collections.length);

    return Array.from({ length: len }, (_, i) => {
      const dis = disbursements[i];
      const col = collections[i];

      return {
        label: dis?.month?.slice(0, 3) ?? col?.month?.slice(0, 3) ?? "",

        disbursements: Number(dis?.amount ?? 0),
        collections: Number(col?.amount ?? 0),
      };
    });
  }, [data]);

  const maxDisbursements = useMemo(
    () => Math.max(...chartData.map((d) => d.disbursements), 1),
    [chartData],
  );

  const maxCollections = useMemo(
    () => Math.max(...chartData.map((d) => d.collections), 1),
    [chartData],
  );

  if (isLoading)
    return (
      <div
        style={{
          ...page,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <CredioMark size={56} />
          <p
            style={{
              color: C.sand600,
              marginTop: 16,
              fontFamily: fonts.body,
              fontSize: 14,
            }}
          >
            Cargando información…
          </p>
        </div>
      </div>
    );

  if (error)
    return (
      <div
        style={{
          ...page,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={card}>
          <p style={{ color: C.coral, fontFamily: fonts.body }}>
            Error: {error}
          </p>
          <button onClick={refetch} style={btn}>
            Reintentar
          </button>
        </div>
      </div>
    );

  return (
    
    <div style={page}>
      {/* ── TOP NAV ── */}
      <nav style={nav}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <CredioMark size={38} />
          <div>
            <div
              style={{
                fontFamily: fonts.display,
                fontWeight: 700,
                fontSize: 18,
                color: C.sand900,
                letterSpacing: "-0.3px",
              }}
            >
              Credio
            </div>
            <div
              style={{
                fontFamily: fonts.body,
                fontSize: 10,
                color: C.sand400,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
              }}
            >
              Sistema de Gestión
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={navPill}>Resumen Ejecutivo</div>
          <div style={navDot} />
        </div>
      </nav>

      {/* ── HERO STRIP ── */}
      <div style={heroStrip}>
        <div>
          <h1 style={heroTitle}>Resumen Ejecutivo</h1>
          <p style={heroSub}>Cartera institucional · Actualizado hoy</p>
        </div>
        <div style={heroAccentLine} />
      </div>

      {/* ── STAT CARDS ── */}
      <section style={grid4}>
        <StatCard
          label="Cartera Total"
          value={fmt$(data?.totalPortfolio)}
          sub="Capital activo en circulación"
          accent={C.sky}
          accentSoft={C.skySoft}
          icon="◈"
        />
        <StatCard
          label="Disponibilidad"
          value={fmt$(data?.availableLiquidity)}
          sub="Fondos listos para colocar"
          accent={C.forest600}
          accentSoft={C.forest50}
          icon="◉"
        />
        <StatCard
          label="Total en Mora"
          value={fmt$(data?.totalDelinquency)}
          sub={`${data?.portfolioState?.overduePercentage ?? 0}% de la cartera`}
          accent={C.coral}
          accentSoft={C.coralSoft}
          icon="◌"
        />
        <StatCard
          label="Contratos Vigentes"
          value={String(data?.activeLoans ?? 0)}
          sub="Préstamos activos hoy"
          accent={C.gold}
          accentSoft={C.goldSoft}
          icon="◎"
        />
      </section>

      {/* ── MIDDLE PANELS ── */}
      <div style={grid2}>
        {/* Cash flow chart */}
        {/* Cash flow chart */}
<div style={card}>
  <SectionLabel>Flujo de Caja</SectionLabel>

  <div style={chartLegend}>
    <LegendDot color={C.sky} label="Desembolsos" />
    <LegendDot color={C.forest500} label="Recaudaciones" />
  </div>

  <div
    style={{
      display: "flex",
      alignItems: "flex-end",
      gap: 6,
      height: 200,
      marginTop: 20,
      position: "relative",
    }}
  >
    {chartData.map((d, i) => (
      <div
        key={i}
        onMouseEnter={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const parentRect =
            e.currentTarget.parentElement?.getBoundingClientRect();

          setHoveredBar({
            label: d.label,
            disbursements: d.disbursements,
            collections: d.collections,
            x: rect.left - (parentRect?.left ?? 0) + rect.width / 2,
            y: rect.top - (parentRect?.top ?? 0),
          });
        }}
        onMouseLeave={() => setHoveredBar(null)}
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "100%",
          justifyContent: "flex-end",
          position: "relative",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 2,
            width: "100%",
            height: "90%",
          }}
        >
          <div
            style={{
              flex: 1,
              background: `linear-gradient(180deg, ${C.sky} 0%, ${C.skySoft} 100%)`,
              height: `${(d.disbursements / maxDisbursements) * 100}%`,
              borderRadius: "3px 3px 0 0",
              minHeight: d.disbursements > 0 ? 6 : 2,
              transition: "height 0.5s ease",
            }}
          />

          <div
            style={{
              flex: 1,
              background: `linear-gradient(180deg, ${C.forest500} 0%, ${C.forest100} 100%)`,
              height: `${(d.collections / maxCollections) * 100}%`,
              borderRadius: "3px 3px 0 0",
              minHeight: d.collections > 0 ? 6 : 2,
              transition: "height 0.5s ease",
            }}
          />
        </div>

        <span
          style={{
            fontSize: 10,
            color: C.sand400,
            marginTop: 6,
            fontFamily: fonts.body,
          }}
        >
          {d.label}
        </span>
      </div>
    ))}

    {hoveredBar && (
      <div
        style={{
          position: "absolute",
          left: hoveredBar.x,
          top: Math.max(8, hoveredBar.y - 92),
          transform: "translateX(-50%)",
          background: C.white,
          border: `1px solid ${C.sand200}`,
          borderRadius: 12,
          padding: "12px 14px",
          boxShadow: "0 12px 28px rgba(0,0,0,0.10)",
          minWidth: 180,
          pointerEvents: "none",
          zIndex: 20,
        }}
      >
        <div
          style={{
            fontFamily: fonts.body,
            fontWeight: 700,
            fontSize: 13,
            color: C.sand900,
            marginBottom: 10,
          }}
        >
          {hoveredBar.label}
        </div>

        <div
          style={{
            fontFamily: fonts.body,
            fontSize: 13,
            color: C.sky,
            marginBottom: 8,
          }}
        >
          Desembolsos: {fmt$(hoveredBar.disbursements)}
        </div>

        <div
          style={{
            fontFamily: fonts.body,
            fontSize: 13,
            color: C.forest600,
          }}
        >
          Recaudaciones: {fmt$(hoveredBar.collections)}
        </div>
      </div>
    )}
  </div>

  <div style={divider} />
</div>

        {/* Portfolio state */}
        <div style={card}>
          <SectionLabel>Estado de Cartera</SectionLabel>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
              marginTop: 28,
            }}
          >
            <ProgressRow
              label="Al Día"
              value={data?.portfolioState?.currentPercentage ?? 0}
              color={C.forest600}
              bgColor={C.forest50}
            />
            <ProgressRow
              label="En Mora"
              value={data?.portfolioState?.overduePercentage ?? 0}
              color={C.coral}
              bgColor={C.coralSoft}
            />
            <ProgressRow
              label="Por Vencer"
              value={data?.portfolioState?.dueSoonPercentage ?? 0}
              color={C.gold}
              bgColor={C.goldSoft}
            />
          </div>

          {/* Summary pill */}
          <div style={summaryPill}>
            <span
              style={{
                fontSize: 12,
                color: C.forest700,
                fontWeight: 600,
                fontFamily: fonts.body,
              }}
            >
              Salud general de cartera:
            </span>
            <span
              style={{
                fontSize: 12,
                color: C.forest600,
                fontWeight: 700,
                fontFamily: fonts.body,
              }}
            >
              {data?.portfolioState?.currentPercentage ?? 0}% al día
            </span>
          </div>
        </div>
      </div>

      {/* ── UPCOMING TABLE ── */}
      <div style={card}>
        <SectionLabel>Próximos Vencimientos</SectionLabel>
        <div style={{ overflowX: "auto", marginTop: 20 }}>
          <table
            style={{ width: "100%", borderCollapse: "collapse", minWidth: 560 }}
          >
            <thead>
              <tr style={{ background: C.sand100 }}>
                <th style={th}>Cliente</th>
                <th style={th}>Monto</th>
                <th style={th}>Vencimiento</th>
                <th style={th}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {(data?.upcomingInstallments ?? []).map(
                (item: InstallmentRow, i: number) => (
                  <tr
                    key={i}
                    style={{ background: i % 2 === 0 ? C.white : C.cream }}
                  >
                    <td style={td}>{item.client}</td>
                    <td style={{ ...td, fontWeight: 700, color: C.sand900 }}>
                      {fmt$(item.amount || item.dueAmount)}
                    </td>
                    <td style={{ ...td, color: C.sand400 }}>
                      {fmtDate(item.dueDate)}
                    </td>
                    <td style={td}>
                      <StatusBadge status={item.status || item.state} />
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer style={footer}>
        <CredioMark size={20} />
        <span
          style={{ fontFamily: fonts.body, fontSize: 12, color: C.sand400 }}
        >
          Credio · Sistema de Gestión de Cartera · {new Date().getFullYear()}
        </span>
      </footer>
    </div>
  );
}

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

function CredioMark({ size = 40 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.28,
        background: `linear-gradient(145deg, ${C.forest600}, ${C.forest900})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: `0 2px 8px rgba(42,87,58,0.35)`,
        flexShrink: 0,
      }}
    >
      <svg
        width={size * 0.52}
        height={size * 0.52}
        viewBox="0 0 24 24"
        fill="none"
      >
        {/* Stylized leaf / C mark */}
        <path
          d="M18 6C14 4 8 5 6 10C4.5 14 6 18 10 19.5C7 17 7 13 9 10.5C11 8 15 7.5 18 9C17 7.5 17.5 6.5 18 6Z"
          fill="white"
          opacity="0.9"
        />
        <path
          d="M8 14C9 17 12 19 15 18.5C17 18 19 16 19.5 14C18 16 15 17 13 16C11 15 9.5 13 10 11C9 11.5 8 12.5 8 14Z"
          fill="white"
          opacity="0.6"
        />
      </svg>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div
        style={{
          width: 3,
          height: 18,
          background: C.forest600,
          borderRadius: 2,
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
        {children}
      </h2>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div
        style={{ width: 8, height: 8, borderRadius: "50%", background: color }}
      />
      <span style={{ fontSize: 11, color: C.sand400, fontFamily: fonts.body }}>
        {label}
      </span>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  accent,
  accentSoft,
  icon,
}: StatCardProps) {
  return (
    <div
      style={{
        background: C.white,
        borderRadius: 14,
        padding: "22px 24px",
        border: `1px solid ${C.sand200}`,
        boxShadow: "0 2px 12px rgba(26,24,20,0.06)",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Accent blob */}
      <div
        style={{
          position: "absolute",
          top: -24,
          right: -24,
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: accentSoft,
        }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          position: "relative",
        }}
      >
        <span
          style={{
            fontFamily: fonts.body,
            fontSize: 11,
            fontWeight: 600,
            color: C.sand400,
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          {label}
        </span>
        <span style={{ fontSize: 18, color: accent }}>{icon}</span>
      </div>
      <div
        style={{
          fontFamily: fonts.display,
          fontSize: 26,
          fontWeight: 800,
          color: C.sand900,
          lineHeight: 1,
          position: "relative",
        }}
      >
        {value}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div
          style={{ width: 20, height: 2, background: accent, borderRadius: 1 }}
        />
        <span
          style={{ fontFamily: fonts.body, fontSize: 12, color: C.sand400 }}
        >
          {sub}
        </span>
      </div>
    </div>
  );
}

function ProgressRow({ label, value, color }: ProgressRowProps) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <span
          style={{ fontFamily: fonts.body, fontSize: 13, color: C.sand600 }}
        >
          {label}
        </span>
        <span
          style={{
            fontFamily: fonts.display,
            fontSize: 13,
            fontWeight: 700,
            color,
          }}
        >
          {value}%
        </span>
      </div>
      <div
        style={{
          height: 6,
          background: C.sand100,
          borderRadius: 99,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${value}%`,
            height: "100%",
            background: color,
            borderRadius: 99,
            transition: "width 0.8s cubic-bezier(.4,0,.2,1)",
          }}
        />
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status?: string }) {
  const lower = status?.toLowerCase() ?? "";
  const isGood = lower.includes("vencer") || lower.includes("pendiente");
  const isLate = lower.includes("mora") || lower.includes("vencid");
  const accent = isGood ? C.forest600 : isLate ? C.coral : C.gold;
  const soft = isGood ? C.forest50 : isLate ? C.coralSoft : C.goldSoft;
  return (
    <span
      style={{
        padding: "4px 10px",
        borderRadius: 99,
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.5px",
        fontFamily: fonts.body,
        textTransform: "uppercase",
        background: soft,
        color: accent,
        border: `1px solid ${accent}22`,
      }}
    >
      {status}
    </span>
  );
}

// ─── FONTS ───────────────────────────────────────────────────────────────────
const fonts = {
  display: "'Georgia', 'Times New Roman', serif",
  body: "'Trebuchet MS', 'Lucida Sans Unicode', sans-serif",
};

// ─── STYLES ──────────────────────────────────────────────────────────────────
const page: React.CSSProperties = {
  display: "grid",
  gap: 24,
  padding: "clamp(16px, 3vw, 32px)",
  background: C.cream,
  minHeight: "100vh",
  fontFamily: fonts.body,
  gridTemplateRows: "auto",
};

const nav: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: C.white,
  borderRadius: 14,
  padding: "14px 20px",
  border: `1px solid ${C.sand200}`,
  boxShadow: "0 2px 8px rgba(26,24,20,0.05)",
};

const navPill: React.CSSProperties = {
  background: C.forest50,
  color: C.forest700,
  fontSize: 12,
  fontWeight: 600,
  padding: "5px 14px",
  borderRadius: 99,
  fontFamily: fonts.body,
  border: `1px solid ${C.forest100}`,
};

const navDot: React.CSSProperties = {
  width: 8,
  height: 8,
  borderRadius: "50%",
  background: C.forest500,
  boxShadow: `0 0 0 3px ${C.forest100}`,
};

const heroStrip: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: `linear-gradient(135deg, ${C.forest900} 0%, ${C.forest700} 100%)`,
  borderRadius: 16,
  padding: "28px 32px",
  position: "relative",
  overflow: "hidden",
};

const heroTitle: React.CSSProperties = {
  fontFamily: fonts.display,
  fontSize: "clamp(22px, 4vw, 32px)",
  fontWeight: 700,
  color: C.white,
  margin: 0,
  letterSpacing: "-0.5px",
};

const heroSub: React.CSSProperties = {
  fontFamily: fonts.body,
  fontSize: 13,
  color: C.forest300,
  marginTop: 6,
  marginBottom: 0,
};

const heroAccentLine: React.CSSProperties = {
  width: 3,
  height: 60,
  background: `linear-gradient(180deg, ${C.forest300}, transparent)`,
  borderRadius: 2,
  opacity: 0.6,
};

const grid4: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 20,
};

const grid2: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
  gap: 24,
};

const card: React.CSSProperties = {
  background: C.white,
  borderRadius: 16,
  padding: "24px",
  border: `1px solid ${C.sand200}`,
  boxShadow: "0 2px 12px rgba(26,24,20,0.05)",
};

const chartLegend: React.CSSProperties = {
  display: "flex",
  gap: 16,
  marginTop: 12,
};

const divider: React.CSSProperties = {
  height: 1,
  background: C.sand100,
  marginTop: 20,
};

const summaryPill: React.CSSProperties = {
  marginTop: 24,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: C.forest50,
  borderRadius: 10,
  padding: "12px 16px",
  border: `1px solid ${C.forest100}`,
};

const th: React.CSSProperties = {
  textAlign: "left",
  padding: "10px 14px",
  fontSize: 11,
  fontWeight: 700,
  color: C.sand600,
  letterSpacing: "0.8px",
  textTransform: "uppercase",
  fontFamily: fonts.body,
  borderBottom: `2px solid ${C.sand200}`,
};

const td: React.CSSProperties = {
  padding: "14px",
  fontSize: 13,
  color: C.sand600,
  fontFamily: fonts.body,
  borderBottom: `1px solid ${C.sand100}`,
};

const footer: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 10,
  padding: "20px 0 8px",
};

const btn: React.CSSProperties = {
  background: C.forest700,
  color: C.white,
  border: "none",
  borderRadius: 10,
  padding: "10px 22px",
  cursor: "pointer",
  fontWeight: 600,
  fontFamily: fonts.body,
  marginTop: 12,
};
