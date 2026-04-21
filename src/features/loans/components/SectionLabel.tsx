export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
      <div style={{ width: 4, height: 18, background: C.forest700, borderRadius: 2 }} />
      <h2 style={{ fontFamily: font.display, fontSize: 16, fontWeight: 700, color: C.sand900, margin: 0 }}>
        {children}
      </h2>
    </div>
  );
}