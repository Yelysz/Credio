import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { clientService } from "../services/client.service";
import type { ClientDetail } from "../types/client.types";

// --- BRAND TOKENS CREDIO ---
const C = {
  forest900: "#1A3326",
  forest700: "#2D5A3D",
  forest600: "#3A6E4A",
  forest50: "#EFF7F0",
  sand900: "#1A1814",
  sand400: "#9E9A92",
  sand200: "#DDD9D2",
  sand100: "#F0EDE8",
  coral: "#C0524A",
  white: "#FFFFFF",
  cream: "#FAF8F5",
};

const fonts = {
  display: "'Georgia', 'Times New Roman', serif",
  body: "'Trebuchet MS', 'Lucida Sans Unicode', sans-serif",
};

type AddressLike = {
  streetNumber?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  region?: string | null;
  postalCode?: string | null;
};

function formatAddress(address?: AddressLike | null) {
  if (!address) return "—";

  const parts = [
    address.streetNumber,
    address.addressLine1,
    address.addressLine2,
    address.city,
    address.region,
    address.postalCode,
  ]
    .map((item) => item?.trim())
    .filter(Boolean);

  return parts.length ? parts.join(", ") : "—";
}

export default function ClientDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState<ClientDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      if (!id) {
        setIsLoading(false);
        setError("No se recibió el id del cliente.");
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const data = await clientService.getById(id);
        setClient(data);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar el detalle del cliente.");
      } finally {
        setIsLoading(false);
      }
    };

    void run();
  }, [id]);

  const fullName = useMemo(() => {
    if (!client) return "—";
    return (
      client.fullName ||
      client.name ||
      `${client.firstName ?? ""} ${client.lastName ?? ""}`.trim() ||
      "—"
    );
  }, [client]);

  const initials = useMemo(() => {
    if (!client) return "—";
    const source =
      client.firstName ||
      client.fullName ||
      client.name ||
      `${client.firstName ?? ""} ${client.lastName ?? ""}`.trim() ||
      "?";

    return source.charAt(0).toUpperCase();
  }, [client]);

  const formattedAddress = useMemo(() => {
    return formatAddress(client?.address as AddressLike | null | undefined);
  }, [client]);

  if (isLoading) {
    return (
      <div style={stateContainer}>
        <div style={spinnerRing} />
        <p style={stateText}>Cargando detalle del cliente…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={stateContainer}>
        <div
          style={{
            ...stateBadge,
            background: "#FFF5F5",
            border: "1px solid #F5C4C4",
          }}
        >
          <span style={{ color: C.coral, fontSize: 13, fontWeight: 700 }}>
            {error}
          </span>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div style={stateContainer}>
        <p style={stateText}>No se encontró el cliente.</p>
      </div>
    );
  }

  return (
    <div style={pageWrapper}>
      <div style={heroSection}>
        <div style={breadcrumb}>
          <button onClick={() => navigate(-1)} style={breadcrumbLink}>
            Cartera de Clientes
          </button>
          <span style={breadcrumbSep}>›</span>
          <span style={breadcrumbCurrent}>Perfil de cliente</span>
        </div>

        <div style={heroContent}>
          <div style={heroLeft}>
            <div style={heroAvatar}>{initials}</div>
            <div>
              <h1 style={heroTitle}>{fullName}</h1>
              <p style={heroSub}>{client.email ?? "—"}</p>
            </div>
          </div>

          <div style={heroBadgeWrap}>
            <span
              style={{
                ...heroBadge,
                background:
                  client.status === "Activo"
                    ? "rgba(255,255,255,0.2)"
                    : "rgba(192, 82, 74, 0.2)",
                borderColor:
                  client.status === "Activo"
                    ? "rgba(255,255,255,0.3)"
                    : C.coral,
              }}
            >
              {client.status?.toUpperCase() ?? "S/E"}
            </span>
          </div>
        </div>
      </div>

      <Section title="Información general">
        <div style={infoGrid}>
          <Info label="Nombre completo" value={fullName} />
          <Info label="Correo electrónico" value={client.email} />
          <Info label="Teléfono" value={client.phone} />
          <Info label="Tipo de documento" value={client.documentType} />
          <Info label="Número de documento" value={client.documentNumber} />
          <Info label="Dirección" value={formattedAddress} />
        </div>
      </Section>

      <Section title="Perfil financiero y laboral">
        <div style={infoGrid}>
          <Info label="Ocupación" value={client.occupation} />
          <Info label="Empleador" value={client.employer} />
          <Info
            label="Ingreso mensual"
            value={
              typeof client.monthlyIncome === "number"
                ? `RD$ ${client.monthlyIncome.toLocaleString("es-DO")}`
                : "—"
            }
          />
        </div>
      </Section>

      <div>
        <button
          onClick={() => navigate(-1)}
          style={backBtn}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = C.forest50;
            e.currentTarget.style.color = C.forest700;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = C.white;
            e.currentTarget.style.color = C.sand900;
          }}
        >
          ← Volver a la cartera
        </button>
      </div>
    </div>
  );
}

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

function Info({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div style={infoItem}>
      <p style={infoLabel}>{label}</p>
      <p style={infoValue}>{value ?? "—"}</p>
    </div>
  );
}

const pageWrapper: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 20,
  fontFamily: fonts.body,
  maxWidth: 900,
};

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

const heroBadgeWrap: React.CSSProperties = { flexShrink: 0 };

const heroBadge: React.CSSProperties = {
  border: "1px solid rgba(255,255,255,0.2)",
  borderRadius: 20,
  padding: "5px 14px",
  fontSize: 10,
  fontWeight: 800,
  color: "rgba(255,255,255,0.9)",
  letterSpacing: "0.4px",
};

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
};

const sectionTitle: React.CSSProperties = {
  fontFamily: fonts.display,
  fontSize: 15,
  fontWeight: 700,
  color: C.sand900,
  margin: 0,
};

const sectionBody: React.CSSProperties = { padding: "20px 24px" };

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