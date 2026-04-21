import type FieldProps from "../types/loan.types";

export function Field({ label, value, onChange, type = "text", placeholder }: FieldProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 11, fontWeight: 700, color: C.sand600, textTransform: "uppercase", letterSpacing: "0.8px" }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={{ padding: "10px 14px", borderRadius: 10, border: `1px solid ${C.sand200}`, background: C.cream, fontSize: 14, outline: "none", fontFamily: fonts.body }}
      />
    </div>
  );
}