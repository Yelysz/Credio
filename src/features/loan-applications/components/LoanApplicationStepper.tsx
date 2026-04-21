import type { LoanApplicationStep } from "../types/loanApplication.types";

// --- BRAND TOKENS CREDIO ---
const C = {
  forest900: "#1A3326",
  forest700: "#2D5A3D",
  forest50:  "#EFF7F0",
  sand400:   "#9E9A92",
  sand200:   "#DDD9D2",
  sand100:   "#F0EDE8",
  white:     "#FFFFFF",
};

const fonts = {
  body: "'Trebuchet MS', 'Lucida Sans Unicode', sans-serif",
};

interface Props {
  currentStep: LoanApplicationStep;
}

const steps = [
  { id: 1, label: "Cliente" },
  { id: 2, label: "Detalles" },
  { id: 3, label: "Simulación" },
  { id: 4, label: "Revisión" },
] as const;

export const LoanApplicationStepper = ({ currentStep }: Props) => {
  return (
    <div style={stepperContainer}>
      <div style={stepsWrapper}>
        {steps.map((step, index) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} style={{ display: "flex", flex: isLast ? "none" : 1, alignItems: "center" }}>
              {/* Ítems del paso (Círculo + Texto) */}
              <div style={stepItem}>
                <div
                  style={{
                    ...stepCircle,
                    background: isCompleted ? C.forest700 : isActive ? C.forest900 : C.sand100,
                    border: isActive ? `2px solid ${C.forest700}` : "2px solid transparent",
                    boxShadow: isActive ? `0 0 0 4px ${C.forest50}` : "none",
                  }}
                >
                  {isCompleted ? (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M2 6l3 3 5-5"
                        stroke="white"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <span style={{ 
                      fontSize: 11, 
                      fontWeight: 800, 
                      color: isActive ? C.white : C.sand400 
                    }}>
                      {step.id}
                    </span>
                  )}
                </div>
                
                <span style={{ 
                  ...stepLabel, 
                  color: isActive ? C.forest900 : isCompleted ? C.forest700 : C.sand400,
                  fontWeight: isActive ? 700 : 500 
                }}>
                  {step.label}
                </span>
              </div>

              {/* Línea conectora */}
              {!isLast && (
                <div
                  style={{
                    ...connectorLine,
                    background: isCompleted ? C.forest700 : C.sand200,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- ESTILOS ---

const stepperContainer: React.CSSProperties = {
  background: C.white,
  border: `1px solid ${C.sand200}`,
  borderRadius: 16,
  padding: "24px 40px",
  width: "100%",
  boxSizing: "border-box",
  fontFamily: fonts.body,
};

const stepsWrapper: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
};

const stepItem: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 8,
  position: "relative",
  zIndex: 2,
  minWidth: 80,
};

const stepCircle: React.CSSProperties = {
  width: 32,
  height: 32,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.3s ease",
  flexShrink: 0,
};

const stepLabel: React.CSSProperties = {
  fontSize: 12,
  whiteSpace: "nowrap",
  textAlign: "center",
};

const connectorLine: React.CSSProperties = {
  height: 2,
  flex: 1,
  margin: "0 -20px", // Solapamiento para que conecte visualmente con los centros
  marginTop: "-22px", // Eleva la línea al nivel del centro de los círculos
  zIndex: 1,
  transition: "background 0.3s ease",
};