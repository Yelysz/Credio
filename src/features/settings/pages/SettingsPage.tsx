import { useMemo, useState } from "react";
import { useSettings } from "../hooks/useSettings";
import type { SystemSetting } from "../types/settings.types";

// ─── BRAND TOKENS ─────────────────────────────────────────────────────────────
const C = {
  forest900: "#1A3326", forest800: "#22422F", forest700: "#2D5A3D",
  forest600: "#3A6E4A", forest500: "#4A8A5A", forest300: "#7CB98A",
  forest100: "#D6EBD8", forest50:  "#EFF7F0",
  cream:     "#FAF8F5", sand100:   "#F0EDE8", sand200:   "#DDD9D2",
  sand400:   "#9E9A92", sand600:   "#5E5A54", sand800:   "#2A2724", sand900: "#1A1814",
  coral:     "#C0524A", coralSoft: "#FDF1F0",
  sky:       "#3D6E8A", skySoft:   "#E8F1F7",
  white:     "#FFFFFF",
};

const fonts = {
  display: "'Georgia', 'Times New Roman', serif",
  body:    "'Trebuchet MS', 'Lucida Sans Unicode', sans-serif",
};

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const { settings, isLoading, isSavingId, error, success, refetch, updateLocalValue, saveSetting } = useSettings();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return settings;
    return settings.filter(s =>
      [s.name, s.key, s.code, s.description, s.category]
        .map(v => String(v ?? "").toLowerCase())
        .some(v => v.includes(q))
    );
  }, [settings, search]);

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
          <span style={navPill}>Configuración</span>
          <span style={navDot} />
        </div>
      </nav>

      {/* HERO */}
      <div style={heroStrip}>
        <div>
          <h1 style={heroTitle}>Configuración del sistema</h1>
          <p style={heroSub}>Administra los parámetros generales del sistema</p>
        </div>
      </div>

      {/* MAIN CARD */}
      <div style={card}>

        {/* Toolbar */}
        <div style={cardHead}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 3, height: 17, background: C.forest600, borderRadius: 2, flexShrink: 0 }} />
            <h2 style={{ fontFamily: fonts.display, fontSize: 14, fontWeight: 700, color: C.sand800, margin: 0 }}>Parámetros</h2>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ position: "relative" }}>
              <span style={searchIcon}>⌕</span>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar por nombre, clave o categoría..."
                style={searchInputSt}
              />
            </div>
            <button onClick={refetch} style={btnRefresh}>↺ Refrescar</button>
          </div>
        </div>

        {/* Toasts */}
        {success && (
          <div style={{ margin: "12px 20px 0", ...toastBase, background: C.forest50, color: C.forest700, border: `1px solid ${C.forest100}` }}>
            ✓ {success}
          </div>
        )}
        {error && (
          <div style={{ margin: "12px 20px 0", ...toastBase, background: C.coralSoft, color: C.coral, border: "1px solid #f7c8c5" }}>
            ⚠ {error}
          </div>
        )}

        {/* States */}
        {isLoading && <div style={stateMsg}>Cargando configuraciones…</div>}

        {!isLoading && !error && filtered.length === 0 && (
          <div style={stateMsg}>No hay configuraciones disponibles.</div>
        )}

        {/* Settings list */}
        {!isLoading && filtered.length > 0 && (
          <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
            {filtered.map((setting, i) => {
              const rowId = String(setting.id ?? setting.key ?? setting.code ?? i);
              const label = setting.name ?? setting.key ?? setting.code ?? "Configuración";
              const originalIdx = settings.findIndex(s =>
                String(s.id ?? s.key ?? s.code ?? "") === String(setting.id ?? setting.key ?? setting.code ?? "")
              );
              return (
                <SettingCard
                  key={rowId}
                  setting={setting}
                  label={label}
                  isSaving={isSavingId === rowId}
                  onChange={v => { if (originalIdx >= 0) updateLocalValue(originalIdx, v); }}
                  onSave={() => saveSetting(setting)}
                />
              );
            })}
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

// ─── SETTING CARD ─────────────────────────────────────────────────────────────
function SettingCard({
  setting, label, isSaving, onChange, onSave,
}: {
  setting: SystemSetting; label: string;
  isSaving: boolean; onChange: (v: string) => void; onSave: () => void;
}) {
  return (
    <div style={settingRow}>

      {/* Info */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontFamily: fonts.display, fontSize: 14, fontWeight: 700, color: C.sand900 }}>{label}</div>
        {setting.description && (
          <div style={{ fontSize: 12, color: C.sand400, marginTop: 3, fontFamily: fonts.body }}>
            {String(setting.description)}
          </div>
        )}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
          {setting.category && <MetaTag variant="cat">{String(setting.category)}</MetaTag>}
          {setting.type      && <MetaTag variant="type">{String(setting.type)}</MetaTag>}
          {setting.key       && <MetaTag variant="key">{String(setting.key)}</MetaTag>}
          {setting.code      && <MetaTag variant="key">{String(setting.code)}</MetaTag>}
        </div>
      </div>

      {/* Input row */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 12, borderTop: `1px solid ${C.sand100}` }}>
        <span style={fieldLabel}>Valor</span>
        <input
          value={String(setting.value ?? "")}
          onChange={e => onChange(e.target.value)}
          style={settingInput}
        />
        <button
          onClick={onSave}
          disabled={isSaving}
          style={isSaving ? { ...btnSave, opacity: 0.6, cursor: "not-allowed" } : btnSave}
        >
          {isSaving ? "Guardando…" : "Guardar"}
        </button>
      </div>
    </div>
  );
}

function MetaTag({ variant, children }: { variant: "cat" | "type" | "key"; children: React.ReactNode }) {
  const styles: Record<typeof variant, React.CSSProperties> = {
    cat:  { background: C.forest50,  color: C.forest700, border: `1px solid ${C.forest100}` },
    type: { background: C.skySoft,   color: C.sky,       border: "1px solid #c2d8e5"        },
    key:  { background: C.sand100,   color: C.sand600,   border: `1px solid ${C.sand200}`, fontFamily: "monospace", letterSpacing: "0.3px" },
  };
  return (
    <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 99, fontFamily: fonts.body, ...styles[variant] }}>
      {children}
    </span>
  );
}

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
  background: C.forest500, boxShadow: `0 0 0 3px ${C.forest100}`,
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
const card: React.CSSProperties = {
  background: C.white, borderRadius: 14, border: `1px solid ${C.sand200}`, overflow: "hidden",
};
const cardHead: React.CSSProperties = {
  padding: "15px 20px", borderBottom: `1px solid ${C.sand100}`,
  display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
};
const searchIcon: React.CSSProperties = {
  position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)",
  color: C.sand400, fontSize: 14, pointerEvents: "none",
};
const searchInputSt: React.CSSProperties = {
  padding: "8px 10px 8px 30px", borderRadius: 9, border: `1px solid ${C.sand200}`,
  background: C.cream, fontFamily: fonts.body, fontSize: 12, color: C.sand900, outline: "none", width: 260,
};
const btnRefresh: React.CSSProperties = {
  padding: "8px 14px", borderRadius: 9, border: `1px solid ${C.sand200}`,
  background: C.white, color: C.sand600, fontFamily: fonts.body, fontSize: 13, cursor: "pointer",
};
const toastBase: React.CSSProperties = {
  borderRadius: 9, padding: "10px 14px", fontSize: 12, fontFamily: fonts.body,
  display: "flex", alignItems: "center", gap: 7,
};
const stateMsg: React.CSSProperties = {
  padding: "40px", textAlign: "center", color: C.sand400, fontFamily: fonts.body, fontSize: 13,
};
const settingRow: React.CSSProperties = {
  border: `1px solid ${C.sand200}`, borderRadius: 11, padding: "16px 18px",
  background: C.white, transition: "border-color .12s",
};
const fieldLabel: React.CSSProperties = {
  fontSize: 10, fontWeight: 700, color: C.sand600, textTransform: "uppercase",
  letterSpacing: "0.7px", fontFamily: fonts.body, whiteSpace: "nowrap",
};
const settingInput: React.CSSProperties = {
  flex: 1, padding: "8px 12px", borderRadius: 9, border: `1px solid ${C.sand200}`,
  background: C.cream, fontFamily: fonts.body, fontSize: 13, color: C.sand900, outline: "none",
};
const btnSave: React.CSSProperties = {
  padding: "8px 18px", borderRadius: 9, border: "none",
  background: C.forest700, color: C.white,
  fontFamily: fonts.body, fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
};