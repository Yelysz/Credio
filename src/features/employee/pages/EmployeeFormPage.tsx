import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterEmployee } from "../hooks/useRegisterEmployee";
import { useCatalogs } from "../../catalog/hooks/useCatalogs";

// ─── BRAND TOKENS ─────────────────────────────────────────────────────────────
const C = {
  forest900: "#1A3326", forest800: "#22422F", forest700: "#2D5A3D",
  forest600: "#3A6E4A", forest500: "#4A8A5A", forest100: "#D6EBD8",
  forest50:  "#EFF7F0",
  cream:     "#FAF8F5", sand100:   "#F0EDE8", sand200:   "#DDD9D2",
  sand400:   "#9E9A92", sand600:   "#5E5A54", sand800:   "#2A2724",
  sand900:   "#1A1814",
  gold:      "#C9933A", sky: "#3D6E8A",
  coral:     "#C0524A", coralSoft: "#FDF1F0",
  white:     "#FFFFFF",
};

const fonts = {
  display: "'Georgia', 'Times New Roman', serif",
  body:    "'Trebuchet MS', 'Lucida Sans Unicode', sans-serif",
};

// ─── STATIC DATA ──────────────────────────────────────────────────────────────
const EMPLOYEE_ROLES = [
  { id: "Administrator", name: "Administrador" },
  { id: "Officer",       name: "Oficial"        },
  { id: "Collector",     name: "Cobrador"        },
];

const REGIONS = [
  { id: "SD",    name: "Santo Domingo"     },
  { id: "DN",    name: "Distrito Nacional" },
  { id: "STI",   name: "Santiago"          },
  { id: "LVEGA", name: "La Vega"           },
];

const CITIES_BY_REGION: Record<string, Array<{ id: string; name: string }>> = {
  SD:    [{ id: "SDE", name: "Santo Domingo Este" }, { id: "SDN", name: "Santo Domingo Norte" },
          { id: "SDO", name: "Santo Domingo Oeste" }, { id: "BCH", name: "Boca Chica" },
          { id: "LCH", name: "Los Alcarrizos" }],
  DN:    [{ id: "DNC", name: "Distrito Nacional" }],
  STI:   [{ id: "STIC", name: "Santiago de los Caballeros" }, { id: "TAM", name: "Tamboril" },
          { id: "LCE",  name: "Licey al Medio" }],
  LVEGA: [{ id: "LV", name: "La Vega" }, { id: "JAR", name: "Jarabacoa" },
          { id: "CST", name: "Constanza" }],
};

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function EmployeeFormPage() {
  const navigate = useNavigate();
  const { registerEmployee, isSubmitting, error } = useRegisterEmployee();
  const { documentTypes, isLoading: catalogsLoading, error: catalogsError } = useCatalogs();

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    documentNumber: "", documentType: "", role: "", password: "",
    address: {
      streetNumber: "", addressLine1: "", addressLine2: "",
      city: "", region: "", postalCode: "",
    },
  });

  const [file, setFile]               = useState<File | null>(null);
  const [localError, setLocalError]   = useState<string | null>(null);

  const set = (field: keyof Omit<typeof form, "address">, value: string) =>
    setForm(p => ({ ...p, [field]: value }));

  const setAddr = (field: keyof typeof form.address, value: string) =>
    setForm(p => ({ ...p, address: { ...p.address, [field]: value } }));

  const setRegion = (value: string) =>
    setForm(p => ({ ...p, address: { ...p.address, region: value, city: "" } }));

  const validate = () => {
    if (!form.firstName.trim())          return "El nombre es obligatorio.";
    if (!form.lastName.trim())           return "El apellido es obligatorio.";
    if (!form.email.trim())              return "El correo es obligatorio.";
    if (!form.phone.trim())              return "El teléfono es obligatorio.";
    if (!form.documentType)              return "Debe seleccionar un tipo de documento.";
    if (!form.documentNumber.trim())     return "El número de documento es obligatorio.";
    if (!form.role)                      return "Debe seleccionar un rol.";
    if (!form.password.trim())           return "La contraseña es obligatoria.";
    if (!form.address.addressLine1.trim()) return "La dirección línea 1 es obligatoria.";
    if (!form.address.region)            return "Debe seleccionar una región.";
    if (!form.address.city)              return "Debe seleccionar una ciudad.";
    if (!form.address.postalCode.trim()) return "El código postal es obligatorio.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    const err = validate();
    if (err) { setLocalError(err); return; }
    const ok = await registerEmployee({ ...form, file });
    if (ok) navigate("/employees");
  };

  const anyError = localError || error || catalogsError;

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
        <div style={breadcrumb}>
          <span style={{ color: C.forest600, fontWeight: 600, cursor: "pointer" }} onClick={() => navigate("/employees")}>Personal</span>
          <span style={{ color: C.sand400 }}>›</span>
          <span style={{ color: C.sand600 }}>Nuevo empleado</span>
        </div>
      </nav>

      {/* HERO */}
      <div style={heroStrip}>
        <div>
          <h1 style={heroTitle}>Nuevo empleado</h1>
          <p style={heroSub}>Completa la información para registrar un colaborador</p>
        </div>
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          <button type="button" onClick={() => navigate("/employees")} style={btnCancel}>
            Cancelar
          </button>
          <button
            form="employee-form"
            type="submit"
            disabled={isSubmitting || catalogsLoading}
            style={isSubmitting || catalogsLoading ? { ...btnSubmit, opacity: 0.6 } : btnSubmit}
          >
            <div style={btnSubmitIcon}>+</div>
            {isSubmitting ? "Guardando…" : "Registrar empleado"}
          </button>
        </div>
      </div>

      {/* FORM */}
      <form id="employee-form" onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>

        {/* Personal info */}
        <FormCard title="Información personal" accentColor={C.forest600} badge="Requerido">
          <Field label="Nombre"            value={form.firstName}      onChange={v => set("firstName", v)}      placeholder="Ej. Juan" />
          <Field label="Apellido"          value={form.lastName}       onChange={v => set("lastName", v)}       placeholder="Ej. Díaz" />
          <Field label="Correo electrónico" value={form.email}         onChange={v => set("email", v)}          type="email" placeholder="empleado@credio.do" />
          <Field label="Teléfono"          value={form.phone}          onChange={v => set("phone", v)}          placeholder="809-000-0000" />
          <SelectField
            label="Tipo de documento"
            value={form.documentType}
            onChange={v => set("documentType", v)}
            options={documentTypes.map(d => ({ value: d.name, label: d.name }))}
            placeholder={catalogsLoading ? "Cargando…" : "Seleccione un tipo"}
            disabled={catalogsLoading}
          />
          <Field label="Número de documento" value={form.documentNumber} onChange={v => set("documentNumber", v)} placeholder="001-0000000-0" />
        </FormCard>

        {/* System access */}
        <FormCard title="Acceso al sistema" accentColor={C.sky} badge="Requerido">
          <SelectField
            label="Rol"
            value={form.role}
            onChange={v => set("role", v)}
            options={EMPLOYEE_ROLES.map(r => ({ value: r.id, label: r.name }))}
            placeholder="Seleccione un rol"
          />
          <Field label="Contraseña inicial" value={form.password} onChange={v => set("password", v)} type="password" placeholder="Mínimo 8 caracteres" />
        </FormCard>

        {/* Address */}
        <FormCard title="Dirección" accentColor={C.gold} badge="Requerido">
          <Field label="Número de calle"   value={form.address.streetNumber}  onChange={v => setAddr("streetNumber", v)}  placeholder="Ej. 45" />
          <Field label="Dirección línea 1" value={form.address.addressLine1}  onChange={v => setAddr("addressLine1", v)}  placeholder="Calle, sector…" />
          <div style={{ gridColumn: "span 2" }}>
            <Field
              label="Dirección línea 2"
              value={form.address.addressLine2}
              onChange={v => setAddr("addressLine2", v)}
              placeholder="Apto, edificio… (opcional)"
              optional
            />
          </div>
          <SelectField
            label="Región"
            value={form.address.region}
            onChange={setRegion}
            options={REGIONS.map(r => ({ value: r.id, label: r.name }))}
            placeholder="Seleccione una región"
          />
          <SelectField
            label="Ciudad / Municipio"
            value={form.address.city}
            onChange={v => setAddr("city", v)}
            options={(CITIES_BY_REGION[form.address.region] ?? []).map(c => ({ value: c.name, label: c.name }))}
            placeholder={form.address.region ? "Seleccione una ciudad" : "Seleccione primero una región"}
            disabled={!form.address.region}
          />
          <Field label="Código postal" value={form.address.postalCode} onChange={v => setAddr("postalCode", v)} placeholder="Ej. 10100" />
        </FormCard>

        {/* Photo */}
        <FormCard title="Foto de perfil" accentColor={C.sand400} badge="Opcional">
          <div style={{ gridColumn: "span 2" }}>
            <FileUpload file={file} onChange={setFile} />
          </div>
        </FormCard>

        {/* Error */}
        {anyError && (
          <div style={errorBar}>
            <span style={{ fontSize: 14 }}>⚠</span>
            {anyError}
          </div>
        )}
      </form>

      {/* Footer */}
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

function FormCard({ title, accentColor, badge, children }: {
  title: string; accentColor: string; badge?: string; children: React.ReactNode;
}) {
  return (
    <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.sand200}`, overflow: "hidden" }}>
      <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.sand100}`, display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 3, height: 17, background: accentColor, borderRadius: 2, flexShrink: 0 }} />
        <h2 style={{ fontFamily: fonts.display, fontSize: 14, fontWeight: 700, color: C.sand800, margin: 0 }}>{title}</h2>
        {badge && (
          <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 700, color: C.sand400, background: C.sand100, padding: "2px 8px", borderRadius: 99, fontFamily: fonts.body }}>
            {badge}
          </span>
        )}
      </div>
      <div style={{ padding: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {children}
      </div>
    </div>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  optional?: boolean;
}

function Field({ label, value, onChange, type = "text", placeholder, optional }: FieldProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={fieldLabel}>
        {label}
        {optional && <span style={{ color: C.sand400, fontSize: 10, fontWeight: 400, textTransform: "none", letterSpacing: 0, marginLeft: 4 }}>(opcional)</span>}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        style={inputStyle}
      />
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  disabled?: boolean;
}

function SelectField({ label, value, onChange, options, placeholder = "Seleccione una opción", disabled }: SelectFieldProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={fieldLabel}>{label}</label>
      <select
        value={value}
        disabled={disabled}
        onChange={e => onChange(e.target.value)}
        style={{ ...inputStyle, background: disabled ? C.sand100 : C.cream, color: disabled ? C.sand400 : C.sand900 }}
      >
        <option value="">{placeholder}</option>
        {options.map(o => <option key={`${label}-${o.value}`} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function FileUpload({ file, onChange }: { file: File | null; onChange: (f: File | null) => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={fieldLabel}>Imagen de perfil</label>
      <label style={fileDropStyle}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: C.forest50, border: `1px solid ${C.forest100}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: C.forest600 }}>
          +
        </div>
        <div style={{ fontSize: 13, color: C.sand600, fontFamily: fonts.body }}>
          <strong style={{ color: C.forest700 }}>Haz clic para subir</strong> o arrastra la imagen aquí
        </div>
        <div style={{ fontSize: 11, color: C.sand400, fontFamily: fonts.body }}>PNG, JPG hasta 5 MB</div>
        <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => onChange(e.target.files?.[0] ?? null)} />
      </label>
      {file && (
        <div style={{ fontSize: 12, color: C.forest700, fontFamily: fonts.body, padding: "4px 0" }}>
          ✓ {file.name}
        </div>
      )}
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
const breadcrumb: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 6,
  fontSize: 12, color: C.sand400, fontFamily: fonts.body,
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
  fontFamily: fonts.body, fontSize: 12, color: C.forest100, marginTop: 4, marginBottom: 0,
};
const btnCancel: React.CSSProperties = {
  padding: "9px 16px", borderRadius: 9, border: "1px solid rgba(255,255,255,.2)",
  background: "rgba(255,255,255,.08)", color: "rgba(255,255,255,.8)",
  fontFamily: fonts.body, fontSize: 13, fontWeight: 600, cursor: "pointer",
};
const btnSubmit: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 6, padding: "9px 18px",
  borderRadius: 9, border: "none", background: C.white, color: C.forest800,
  fontFamily: fonts.body, fontSize: 13, fontWeight: 700, cursor: "pointer",
};
const btnSubmitIcon: React.CSSProperties = {
  width: 18, height: 18, borderRadius: 5, background: C.forest600, color: C.white,
  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, lineHeight: "1",
};
const fieldLabel: React.CSSProperties = {
  fontSize: 11, fontWeight: 700, color: C.sand600, textTransform: "uppercase",
  letterSpacing: "0.7px", fontFamily: fonts.body,
};
const inputStyle: React.CSSProperties = {
  padding: "9px 12px", borderRadius: 9, border: `1px solid ${C.sand200}`,
  background: C.cream, fontFamily: fonts.body, fontSize: 13, color: C.sand900, outline: "none",
};
const fileDropStyle: React.CSSProperties = {
  border: `1.5px dashed ${C.sand200}`, borderRadius: 9, padding: "20px 16px",
  display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
  cursor: "pointer", background: C.cream,
};
const errorBar: React.CSSProperties = {
  background: C.coralSoft, border: "1px solid #f7c8c5", borderRadius: 10,
  padding: "12px 16px", display: "flex", alignItems: "center", gap: 8,
  fontSize: 13, color: C.coral, fontFamily: fonts.body,
};