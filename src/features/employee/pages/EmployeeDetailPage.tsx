import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { employeeService } from "../services/employee.service";
import type { EmployeeDetail } from "../types/employee.types";

// --- BRAND TOKENS CREDIO ---
const C = {
  forest900: "#1A3326",
  forest700: "#2D5A3D",
  forest600: "#3A6E4A",
  forest50:  "#EFF7F0",
  sand900:   "#1A1814",
  sand400:   "#9E9A92",
  sand200:   "#DDD9D2",
  sand100:   "#F0EDE8",
  coral:     "#C0524A",
  white:     "#FFFFFF",
  cream:     "#FAF8F5",
};

const fonts = {
  display: "'Georgia', 'Times New Roman', serif",
  body:    "'Trebuchet MS', 'Lucida Sans Unicode', sans-serif",
};

export default function EmployeeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<EmployeeDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      if (!id) {
        setIsLoading(false);
        setError("No se recibió el id del empleado.");
        return;
      }
      try {
        setIsLoading(true);
        setError(null);
        const data = await employeeService.getById(id);
        setEmployee(data);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar el detalle del empleado.");
      } finally {
        setIsLoading(false);
      }
    };
    void run();
  }, [id]);

  const fullName = useMemo(() => {
    if (!employee) return "—";
    return `${employee.firstName ?? ""} ${employee.lastName ?? ""}`.trim() || "—";
  }, [employee]);

  const initials = useMemo(() => {
    if (!employee) return "—";
    return `${employee.firstName?.[0] ?? ""}${employee.lastName?.[0] ?? ""}`
      .toUpperCase() || "?";
  }, [employee]);

  const formattedAddress = useMemo(() => {
    if (!employee?.address) return "—";
    return (
      [
        employee.address.streetNumber,
        employee.address.addressLine1,
        employee.address.addressLine2,
        employee.address.city,
        employee.address.region,
        employee.address.postalCode,
      ]
        .filter((v): v is string => Boolean(v && v.trim()))
        .join(", ") || "—"
    );
  }, [employee]);

  // ── ESTADOS DE CARGA / ERROR ──────────────────────────────────────────────
  if (isLoading) {
    return (
      <div style={stateContainer}>
        <div style={spinnerRing} />
        <p style={stateText}>Cargando detalle del empleado…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={stateContainer}>
        <div style={{ ...stateBadge, background: "#FFF5F5", border: `1px solid #F5C4C4` }}>
          <span style={{ color: C.coral, fontSize: 13, fontWeight: 700 }}>{error}</span>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div style={stateContainer}>
        <p style={stateText}>No se encontró el empleado.</p>
      </div>
    );
  }

  // ── RENDER PRINCIPAL ──────────────────────────────────────────────────────
  return (
    <div style={pageWrapper}>
      {/* HERO HEADER */}
      <div style={heroSection}>
        {/* Breadcrumb */}
        <div style={breadcrumb}>
          <button
            onClick={() => navigate(-1)}
            style={breadcrumbLink}
          >
            Personal
          </button>
          <span style={breadcrumbSep}>›</span>
          <span style={breadcrumbCurrent}>Perfil de empleado</span>
        </div>

        <div style={heroContent}>
          <div style={heroLeft}>
            <div style={heroAvatar}>{initials}</div>
            <div>
              <h1 style={heroTitle}>{fullName}</h1>
              <p style={heroSub}>{employee.email ?? "—"}</p>
            </div>
          </div>
          <div style={heroBadgeWrap}>
            <span style={heroBadge}>#{employee.employeeCode ?? "—"}</span>
          </div>
        </div>
      </div>

      {/* TARJETA: INFORMACIÓN PERSONAL */}
      <Section title="Información personal">
        <div style={infoGrid}>
          <Info label="Código de empleado" value={employee.employeeCode} />
          <Info label="Nombre completo"    value={fullName} />
          <Info label="Correo electrónico" value={employee.email} />
          <Info label="Teléfono"           value={employee.phone} />
          <Info label="Tipo de documento"  value={employee.documentType} />
          <Info label="Número de documento" value={employee.documentNumber} />
        </div>
      </Section>

      {/* TARJETA: DIRECCIÓN */}
      <Section title="Dirección">
        <div style={infoGrid}>
          <Info label="Número de calle"  value={employee.address?.streetNumber} />
          <Info label="Dirección línea 1" value={employee.address?.addressLine1} />
          {employee.address?.addressLine2 && (
            <Info label="Dirección línea 2" value={employee.address.addressLine2} />
          )}
          <Info label="Ciudad / Municipio" value={employee.address?.city} />
          <Info label="Región"              value={employee.address?.region} />
          <Info label="Código postal"       value={employee.address?.postalCode} />
        </div>

        {/* Dirección completa como resumen */}
        <div style={addressSummary}>
          <span style={addressLabel}>Dirección completa</span>
          <span style={addressValue}>{formattedAddress}</span>
        </div>
      </Section>

      {/* BOTÓN VOLVER */}
      <div>
        <button
          onClick={() => navigate(-1)}
          style={backBtn}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = C.forest50;
            (e.currentTarget as HTMLButtonElement).style.color = C.forest700;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = C.white;
            (e.currentTarget as HTMLButtonElement).style.color = C.sand900;
          }}
        >
          ← Volver al directorio
        </button>
      </div>
    </div>
  );
}

// ── COMPONENTES INTERNOS ────────────────────────────────────────────────────

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div style={sectionCard}>
      <div style={sectionHeader}>
        <div style={sectionAccent} />
        <h2 style={sectionTitle}>{title}</h2>
      </div>
      <div style={sectionBody}>{children}</div>
    </div>
  );
}

function Info({ label, value }: { label: string; value?: string | null }) {
  return (
    <div style={infoItem}>
      <p style={infoLabel}>{label}</p>
      <p style={infoValue}>{value || "—"}</p>
    </div>
  );
}

// ── ESTILOS ─────────────────────────────────────────────────────────────────

const pageWrapper: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 20,
  fontFamily: fonts.body,
  maxWidth: 900,
};

// Hero
const heroSection: React.CSSProperties = {
  background: `linear-gradient(135deg, ${C.forest900} 0%, ${C.forest700} 60%, ${C.forest600} 100%)`,
  borderRadius: 16,
  padding: "24px 28px",
  color: C.white,
  position: "relative",
  overflow: "hidden",
};

const breadcrumb: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  marginBottom: 18,
};

const breadcrumbLink: React.CSSProperties = {
  background: "transparent",
  border: "none",
  cursor: "pointer",
  fontSize: 12,
  color: "rgba(255,255,255,0.6)",
  fontFamily: fonts.body,
  padding: 0,
  transition: "color 0.15s ease",
};

const breadcrumbSep: React.CSSProperties = {
  fontSize: 12,
  color: "rgba(255,255,255,0.35)",
};

const breadcrumbCurrent: React.CSSProperties = {
  fontSize: 12,
  color: "rgba(255,255,255,0.9)",
  fontWeight: 600,
};

const heroContent: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 16,
};

const heroLeft: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 16,
};

const heroAvatar: React.CSSProperties = {
  width: 52,
  height: 52,
  borderRadius: 14,
  background: "rgba(255,255,255,0.15)",
  border: "1.5px solid rgba(255,255,255,0.25)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 18,
  fontWeight: 800,
  color: C.white,
  flexShrink: 0,
};

const heroTitle: React.CSSProperties = {
  fontFamily: fonts.display,
  fontSize: 22,
  fontWeight: 700,
  color: C.white,
  letterSpacing: "-0.4px",
  margin: 0,
};

const heroSub: React.CSSProperties = {
  fontSize: 13,
  color: "rgba(255,255,255,0.6)",
  marginTop: 3,
};

const heroBadgeWrap: React.CSSProperties = {
  flexShrink: 0,
};

const heroBadge: React.CSSProperties = {
  background: "rgba(255,255,255,0.12)",
  border: "1px solid rgba(255,255,255,0.2)",
  borderRadius: 20,
  padding: "5px 14px",
  fontSize: 12,
  fontWeight: 700,
  color: "rgba(255,255,255,0.9)",
  letterSpacing: "0.4px",
};

// Sección card
const sectionCard: React.CSSProperties = {
  background: C.white,
  borderRadius: 16,
  border: `1px solid ${C.sand200}`,
  overflow: "hidden",
};

const sectionHeader: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: "16px 24px",
  borderBottom: `1px solid ${C.sand100}`,
};

const sectionAccent: React.CSSProperties = {
  width: 4,
  height: 18,
  borderRadius: 2,
  background: C.forest700,
  flexShrink: 0,
};

const sectionTitle: React.CSSProperties = {
  fontFamily: fonts.display,
  fontSize: 15,
  fontWeight: 700,
  color: C.sand900,
  margin: 0,
};

const sectionBody: React.CSSProperties = {
  padding: "20px 24px",
};

// Info grid
const infoGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
  gap: "20px 32px",
};

const infoItem: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 4,
};

const infoLabel: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 700,
  color: C.sand400,
  textTransform: "uppercase",
  letterSpacing: "0.8px",
  margin: 0,
};

const infoValue: React.CSSProperties = {
  fontSize: 14,
  color: C.sand900,
  fontWeight: 500,
  margin: 0,
};

// Address summary
const addressSummary: React.CSSProperties = {
  marginTop: 20,
  paddingTop: 16,
  borderTop: `1px solid ${C.sand100}`,
  display: "flex",
  flexDirection: "column",
  gap: 4,
};

const addressLabel: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 700,
  color: C.sand400,
  textTransform: "uppercase",
  letterSpacing: "0.8px",
};

const addressValue: React.CSSProperties = {
  fontSize: 13,
  color: C.sand900,
  lineHeight: 1.6,
};

// Botón volver
const backBtn: React.CSSProperties = {
  padding: "10px 18px",
  background: C.white,
  border: `1px solid ${C.sand200}`,
  borderRadius: 10,
  fontSize: 13,
  fontWeight: 600,
  color: C.sand900,
  cursor: "pointer",
  fontFamily: fonts.body,
  transition: "all 0.2s ease",
};

// Estados carga / error
const stateContainer: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "60px 20px",
  gap: 16,
};

const stateText: React.CSSProperties = {
  fontSize: 14,
  color: C.sand400,
  fontFamily: fonts.body,
};

const stateBadge: React.CSSProperties = {
  padding: "10px 20px",
  borderRadius: 10,
};

const spinnerRing: React.CSSProperties = {
  width: 32,
  height: 32,
  borderRadius: "50%",
  border: `3px solid ${C.sand200}`,
  borderTopColor: C.forest700,
  animation: "spin 0.8s linear infinite",
};