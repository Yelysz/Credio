import type { ClientItem } from "../../types/loanApplication.types";

// ─── BRAND TOKENS ─────────────────────────────────────────────────────────────
const C = {
  forest900: "#1A3326", forest800: "#22422F", forest700: "#2D5A3D",
  forest600: "#3A6E4A", forest100: "#D6EBD8", forest50:  "#EFF7F0",
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

interface Props {
  clients: ClientItem[];
  selectedClientId: string;
  onSelect: (client: ClientItem) => void;
  onNext: () => void;
  loading?: boolean;
}

const getClientName = (c: ClientItem) =>
  c.fullName || c.name || `${c.firstName ?? ""} ${c.lastName ?? ""}`.trim();

const getScoreStyle = (score?: number): { bg: string; color: string; border: string } => {
  if (typeof score !== "number") return { bg: C.sand100,   color: C.sand600,  border: C.sand200  };
  if (score >= 800)              return { bg: C.forest50,  color: C.forest700, border: C.forest100 };
  if (score >= 700)              return { bg: C.skySoft,   color: C.sky,       border: "#c2d8e5"  };
  if (score >= 650)              return { bg: C.goldSoft,  color: C.gold,      border: "#f0ddb8"  };
  return                                { bg: C.coralSoft, color: C.coral,     border: "#f7c8c5"  };
};

export const ClientSelectionStep = ({
  clients, selectedClientId, onSelect, onNext, loading = false,
}: Props) => {
  return (
    <div style={card}>

      {/* Header */}
      <div style={cardHead}>
        <div style={{ width: 3, height: 17, background: C.forest600, borderRadius: 2, flexShrink: 0 }} />
        <h2 style={{ fontFamily: fonts.display, fontSize: 15, fontWeight: 700, color: C.sand800, margin: 0 }}>
          Selecciona el cliente
        </h2>
      </div>

      {/* Body */}
      <div style={{ padding: 22 }}>
        {loading ? (
          <div style={{ padding: "48px 0", textAlign: "center", color: C.sand400, fontFamily: fonts.body, fontSize: 14 }}>
            Cargando clientes…
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {clients.map(client => {
              const isSelected = client.id === selectedClientId;
              const name = getClientName(client);
              const ss = getScoreStyle(client.score);
              return (
                <button
                  key={client.id}
                  type="button"
                  onClick={() => onSelect(client)}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "15px 18px", borderRadius: 11, cursor: "pointer", textAlign: "left",
                    border: `1px solid ${isSelected ? C.forest600 : C.sand200}`,
                    background: isSelected ? C.forest50 : C.white,
                    transition: "border-color .12s, background .12s",
                    fontFamily: fonts.body,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {/* Check circle */}
                    <div style={{
                      width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                      border: `2px solid ${isSelected ? C.forest600 : C.sand200}`,
                      background: isSelected ? C.forest600 : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {isSelected && (
                        <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <div style={{ fontFamily: fonts.display, fontSize: 15, fontWeight: 700, color: C.sand900 }}>
                        {name}
                      </div>
                      <div style={{ fontSize: 12, color: C.sand400, marginTop: 2 }}>
                        {client.documentNumber ?? "Sin documento"}
                      </div>
                    </div>
                  </div>

                  {client.score != null && (
                    <span style={{
                      padding: "4px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700,
                      fontFamily: fonts.body, background: ss.bg, color: ss.color,
                      border: `1px solid ${ss.border}`,
                    }}>
                      Score: {client.score}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={footerNav}>
        <span style={{ fontSize: 12, color: C.sand400, fontFamily: fonts.body }}>
          {selectedClientId ? `Cliente seleccionado` : "Ningún cliente seleccionado"}
        </span>
        <button
          type="button"
          onClick={onNext}
          disabled={!selectedClientId}
          style={selectedClientId ? btnNext : { ...btnNext, opacity: 0.5, cursor: "not-allowed" }}
        >
          Siguiente ›
        </button>
      </div>
    </div>
  );
};

// ─── SHARED STYLES (re-exported for sibling steps) ────────────────────────────
export const card: React.CSSProperties = {
  background: "#FFFFFF", borderRadius: 14, border: "1px solid #DDD9D2", overflow: "hidden",
};
export const cardHead: React.CSSProperties = {
  padding: "18px 22px", borderBottom: "1px solid #F0EDE8",
  display: "flex", alignItems: "center", gap: 8,
};
export const footerNav: React.CSSProperties = {
  display: "flex", justifyContent: "space-between", alignItems: "center",
  padding: "18px 22px", borderTop: "1px solid #F0EDE8",
};
export const btnBack: React.CSSProperties = {
  padding: "9px 20px", borderRadius: 9, border: "1px solid #DDD9D2",
  background: "#FFFFFF", color: "#2A2724",
  fontFamily: "'Trebuchet MS','Lucida Sans Unicode',sans-serif",
  fontSize: 13, fontWeight: 600, cursor: "pointer",
};
export const btnNext: React.CSSProperties = {
  padding: "9px 22px", borderRadius: 9, border: "none",
  background: "#2D5A3D", color: "#FFFFFF",
  fontFamily: "'Trebuchet MS','Lucida Sans Unicode',sans-serif",
  fontSize: 13, fontWeight: 700, cursor: "pointer",
};