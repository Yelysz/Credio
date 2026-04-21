import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useClientForm } from "../hooks/useClientForm";
import { useCatalogs } from "../../catalog/hooks/useCatalogs";

// ─── BRAND TOKENS ─────────────────────────────────────────────────────────────
const C = {
  forest900: "#1A3326",
  forest800: "#22422F",
  forest700: "#2D5A3D",
  forest600: "#3A6E4A",
  forest500: "#4A8A5A",
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
  coralSoft: "#FDF1F0",
  white: "#FFFFFF",
};

const fonts = {
  display: "'Georgia', 'Times New Roman', serif",
  body: "'Trebuchet MS', 'Lucida Sans Unicode', sans-serif",
};

// ─── STATIC DATA ──────────────────────────────────────────────────────────────
const REGIONS = [
  { id: "SD", name: "Santo Domingo" },
  { id: "DN", name: "Distrito Nacional" },
  { id: "STI", name: "Santiago" },
  { id: "LVEGA", name: "La Vega" },
] as const;

const CITIES_BY_REGION: Record<string, Array<{ id: string; name: string }>> = {
  SD: [
    { id: "SDE", name: "Santo Domingo Este" },
    { id: "SDN", name: "Santo Domingo Norte" },
    { id: "SDO", name: "Santo Domingo Oeste" },
    { id: "BCH", name: "Boca Chica" },
  ],
  DN: [{ id: "DNC", name: "Distrito Nacional" }],
  STI: [
    { id: "STIC", name: "Santiago de los Caballeros" },
    { id: "TAM", name: "Tamboril" },
  ],
  LVEGA: [
    { id: "LV", name: "La Vega" },
    { id: "JAR", name: "Jarabacoa" },
  ],
};

// ─── TYPES ────────────────────────────────────────────────────────────────────
type ClientFormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  documentNumber: string;
  documentType: string;
  occupation: string;
  employer: string;
  monthlyIncome: string;
  address: string;
  region: string;
  city: string;
};

type CreateClientPayload = ClientFormState & {
  monthlyIncome: number;
  file: File | null;
};

type SelectOption = {
  value: string;
  label: string;
};

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
};

type SelectFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder: string;
  disabled?: boolean;
};

type FileUploadProps = {
  file: File | null;
  onChange: (file: File | null) => void;
  label: string;
};

type FormCardProps = {
  title: string;
  accentColor: string;
  badge?: string;
  children: React.ReactNode;
};

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function ClientFormPage() {
  const navigate = useNavigate();
  const { createClient, isSubmitting, error } = useClientForm();
  const {
    documentTypes,
    isLoading: catalogsLoading,
    error: catalogsError,
  } = useCatalogs();

  const [form, setForm] = useState<ClientFormState>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    documentNumber: "",
    documentType: "",
    occupation: "",
    employer: "",
    monthlyIncome: "",
    address: "",
    region: "",
    city: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const set = (field: keyof ClientFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = (): string | null => {
    if (!form.firstName.trim()) return "El nombre es obligatorio.";
    if (!form.lastName.trim()) return "El apellido es obligatorio.";
    if (!form.documentType) return "Debe seleccionar un tipo de documento.";
    if (!form.documentNumber.trim())
      return "El número de documento es obligatorio.";
    if (!form.phone.trim()) return "El teléfono es obligatorio.";
    if (!form.address.trim()) return "La dirección es obligatoria.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError(null);

    const err = validate();
    if (err) {
      setLocalError(err);
      return;
    }

    const payload: CreateClientPayload = {
      ...form,
      monthlyIncome: Number(form.monthlyIncome) || 0,
      file,
    };

    const ok = await createClient(payload);
    if (ok) navigate("/clients");
  };

  const anyError = localError || error || catalogsError;

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

        <div style={breadcrumb}>
          <span
            style={{
              color: C.forest600,
              fontWeight: 600,
              cursor: "pointer",
            }}
            onClick={() => navigate("/clients")}
          >
            Clientes
          </span>
          <span style={{ color: C.sand400 }}>›</span>
          <span style={{ color: C.sand600 }}>Nuevo cliente</span>
        </div>
      </nav>

      <div style={heroStrip}>
        <div>
          <h1 style={heroTitle}>Nuevo cliente</h1>
          <p style={heroSub}>
            Ingresa los datos para la apertura de perfil del cliente
          </p>
        </div>

        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          <button
            type="button"
            onClick={() => navigate("/clients")}
            style={btnCancel}
          >
            Cancelar
          </button>

          <button
            form="client-form"
            type="submit"
            disabled={isSubmitting || catalogsLoading}
            style={
              isSubmitting || catalogsLoading
                ? { ...btnSubmit, opacity: 0.6 }
                : btnSubmit
            }
          >
            <div style={btnSubmitIcon}>+</div>
            {isSubmitting ? "Registrando…" : "Crear cliente"}
          </button>
        </div>
      </div>

      <form
        id="client-form"
        onSubmit={handleSubmit}
        style={{ display: "grid", gap: 16 }}
      >
        <FormCard
          title="Identidad del Cliente"
          accentColor={C.forest600}
          badge="Requerido"
        >
          <Field
            label="Nombre"
            value={form.firstName}
            onChange={(v) => set("firstName", v)}
            placeholder="Ej. Ana"
          />
          <Field
            label="Apellido"
            value={form.lastName}
            onChange={(v) => set("lastName", v)}
            placeholder="Ej. María"
          />
          <SelectField
            label="Tipo de documento"
            value={form.documentType}
            onChange={(v) => set("documentType", v)}
            options={documentTypes.map((d) => ({
              value: d.name,
              label: d.name,
            }))}
            placeholder={catalogsLoading ? "Cargando…" : "Seleccione un tipo"}
            disabled={catalogsLoading}
          />
          <Field
            label="Número de documento"
            value={form.documentNumber}
            onChange={(v) => set("documentNumber", v)}
            placeholder="402-0000000-0"
          />
          <Field
            label="Correo electrónico"
            value={form.email}
            onChange={(v) => set("email", v)}
            type="email"
            placeholder="cliente@correo.com"
          />
          <Field
            label="Teléfono"
            value={form.phone}
            onChange={(v) => set("phone", v)}
            placeholder="809-000-0000"
          />
        </FormCard>

        <FormCard
          title="Perfil Financiero y Laboral"
          accentColor={C.sky}
          badge="Información de Riesgo"
        >
          <Field
            label="Ocupación"
            value={form.occupation}
            onChange={(v) => set("occupation", v)}
            placeholder="Ej. Contador"
          />
          <Field
            label="Empleador / Negocio"
            value={form.employer}
            onChange={(v) => set("employer", v)}
            placeholder="Nombre de la empresa"
          />
          <div style={{ gridColumn: "span 2" }}>
            <Field
              label="Ingreso Mensual (RD$)"
              value={form.monthlyIncome}
              onChange={(v) => set("monthlyIncome", v)}
              type="number"
              placeholder="Ej. 45000"
            />
          </div>
        </FormCard>

        <FormCard title="Ubicación" accentColor={C.gold} badge="Requerido">
          <div style={{ gridColumn: "span 2" }}>
            <Field
              label="Dirección Detallada"
              value={form.address}
              onChange={(v) => set("address", v)}
              placeholder="Calle, # casa, sector..."
            />
          </div>

          <SelectField
            label="Región"
            value={form.region}
            onChange={(v) => {
              set("region", v);
              set("city", "");
            }}
            options={REGIONS.map((r) => ({
              value: r.id,
              label: r.name,
            }))}
            placeholder="Seleccione región"
          />

          <SelectField
            label="Ciudad"
            value={form.city}
            onChange={(v) => set("city", v)}
            options={(CITIES_BY_REGION[form.region] ?? []).map((c) => ({
              value: c.name,
              label: c.name,
            }))}
            placeholder={form.region ? "Seleccione ciudad" : "Primero elija región"}
            disabled={!form.region}
          />
        </FormCard>

        <FormCard
          title="Documentación Visual"
          accentColor={C.sand400}
          badge="Opcional"
        >
          <div style={{ gridColumn: "span 2" }}>
            <FileUpload
              file={file}
              onChange={setFile}
              label="Foto del cliente / Documento"
            />
          </div>
        </FormCard>

        {anyError && (
          <div style={errorBar}>
            <span>⚠</span> {anyError}
          </div>
        )}
      </form>

      <footer
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          padding: "20px 0",
        }}
      >
        <CredioMark size={20} />
        <span
          style={{
            fontFamily: fonts.body,
            fontSize: 12,
            color: C.sand400,
          }}
        >
          Credio · Sistema de Gestión · {new Date().getFullYear()}
        </span>
      </footer>
    </div>
  );
}

// ─── REUSED UI COMPONENTS ─────────────────────────────────────────────────────

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

function FormCard({
  title,
  accentColor,
  badge,
  children,
}: FormCardProps) {
  return (
    <div
      style={{
        background: C.white,
        borderRadius: 14,
        border: `1px solid ${C.sand200}`,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "16px 20px",
          borderBottom: `1px solid ${C.sand100}`,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div
          style={{
            width: 3,
            height: 17,
            background: accentColor,
            borderRadius: 2,
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
          {title}
        </h2>

        {badge && (
          <span
            style={{
              marginLeft: "auto",
              fontSize: 10,
              fontWeight: 700,
              color: C.sand400,
              background: C.sand100,
              padding: "2px 8px",
              borderRadius: 99,
            }}
          >
            {badge}
          </span>
        )}
      </div>

      <div
        style={{
          padding: 20,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 14,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: FieldProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={fieldLabel}>{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={inputStyle}
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
  disabled,
}: SelectFieldProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={fieldLabel}>{label}</label>
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        style={{
          ...inputStyle,
          background: disabled ? C.sand100 : C.cream,
        }}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function FileUpload({ file, onChange, label }: FileUploadProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={fieldLabel}>{label}</label>
      <label style={fileDropStyle}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: C.forest50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: C.forest600,
          }}
        >
          +
        </div>
        <div style={{ fontSize: 13, color: C.sand600 }}>
          <strong>Subir imagen</strong>
        </div>
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        />
      </label>
      {file && (
        <div style={{ fontSize: 12, color: C.forest700 }}>✓ {file.name}</div>
      )}
    </div>
  );
}

// ─── SHARED STYLES ───────────────────────────────────────────────────────────
const page: React.CSSProperties = {
  display: "grid",
  gap: 18,
  padding: "clamp(16px, 3vw, 28px)",
  background: C.cream,
  minHeight: "100vh",
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

const breadcrumb: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  fontSize: 12,
};

const heroStrip: React.CSSProperties = {
  background: C.forest900,
  borderRadius: 14,
  padding: "22px 28px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const heroTitle: React.CSSProperties = {
  fontFamily: fonts.display,
  fontSize: 24,
  fontWeight: 700,
  color: C.white,
  margin: 0,
};

const heroSub: React.CSSProperties = {
  fontSize: 12,
  color: C.forest100,
  marginTop: 4,
};

const btnCancel: React.CSSProperties = {
  padding: "9px 16px",
  borderRadius: 9,
  border: "1px solid rgba(255,255,255,.2)",
  background: "rgba(255,255,255,.08)",
  color: "rgba(255,255,255,.8)",
  fontWeight: 600,
  cursor: "pointer",
};

const btnSubmit: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  padding: "9px 18px",
  borderRadius: 9,
  border: "none",
  background: C.white,
  color: C.forest800,
  fontWeight: 700,
  cursor: "pointer",
};

const btnSubmitIcon: React.CSSProperties = {
  width: 18,
  height: 18,
  borderRadius: 5,
  background: C.forest600,
  color: C.white,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const fieldLabel: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: C.sand600,
  textTransform: "uppercase",
  letterSpacing: "0.7px",
};

const inputStyle: React.CSSProperties = {
  padding: "9px 12px",
  borderRadius: 9,
  border: `1px solid ${C.sand200}`,
  background: C.cream,
  fontSize: 13,
  outline: "none",
};

const fileDropStyle: React.CSSProperties = {
  border: `1.5px dashed ${C.sand200}`,
  borderRadius: 9,
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 6,
  cursor: "pointer",
};

const errorBar: React.CSSProperties = {
  background: C.coralSoft,
  border: "1px solid #f7c8c5",
  borderRadius: 10,
  padding: "12px",
  display: "flex",
  gap: 8,
  color: C.coral,
  fontSize: 13,
};