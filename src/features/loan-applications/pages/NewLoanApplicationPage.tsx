import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ClientSelectionStep } from "../components/steps/ClientSelectionStep";
import { LoanDetailsStep } from "../components/steps/LoanDetailsStep";
import { LoanReviewStep } from "../components/steps/LoanReviewStep";
import { LoanSimulationStep } from "../components/steps/LoanSimulationStep";
import { useLoanApplicationWizard } from "../hooks/useLoanApplicationWizard";
import { getApiErrorMessages } from "@/shared/utils/getApiErrorMessage";

const C = {
  forest900: "#1A3326", forest700: "#2D5A3D", forest600: "#3A6E4A",
  forest50:  "#EFF7F0", sand900:   "#1A1814", sand400:   "#9E9A92",
  sand200:   "#DDD9D2", sand100:   "#F0EDE8", coral:     "#C0524A",
  white:     "#FFFFFF", cream:     "#FAF8F5",
};

const fonts = {
  display: "'Georgia', 'Times New Roman', serif",
  body:    "'Trebuchet MS', 'Lucida Sans Unicode', sans-serif",
};

const STEPS = [
  { number: 1, label: "Cliente" },
  { number: 2, label: "Detalles" },
  { number: 3, label: "Simulación" },
  { number: 4, label: "Revisión" },
];

export default function NewLoanApplicationPage() {
  const navigate = useNavigate();

  const {
    step, setStep, form, handleFieldChange, handleSelectClient,
    clients, frequencies, simulation, schedule, installmentAmount,
    availableIncome, loadingInitialData, loadingSimulation, submitting,
    validateStep1, validateStep2, goToNextStep, goToPreviousStep,
    simulate, submit,
  } = useLoanApplicationWizard();

  const showErrors = (error: unknown) => {
    getApiErrorMessages(error).forEach((message) => toast.error(message));
  };

  const handleStep1Next = () => {
    if (!validateStep1()) { toast.error("Debes seleccionar un cliente."); return; }
    goToNextStep();
  };

  const handleStep2Next = async () => {
    if (!validateStep2()) { toast.error("Completa todos los campos requeridos."); return; }
    try {
      await simulate();
      toast.success("Simulación generada correctamente.");
    } catch (error) { showErrors(error); }
  };

  const handleSubmit = async () => {
    try {
      await submit();
      toast.success("Solicitud creada correctamente.");
      navigate("/loan-applications");
    } catch (error) { showErrors(error); }
  };

  return (
    <div style={pageWrapper}>

      {/* ── HERO HEADER (Full Width) ─────────────────────────────────── */}
      <div style={heroSection}>
        <div style={breadcrumb}>
          <button onClick={() => navigate("/loan-applications")} style={breadcrumbLink}>Préstamos</button>
          <span style={breadcrumbSep}>›</span>
          <span style={breadcrumbCurrent}>Nueva solicitud</span>
        </div>

        <div style={heroContent}>
          <div>
            <h1 style={heroTitle}>Nueva Solicitud de Crédito</h1>
            <p style={heroSub}>Sigue los pasos para registrar la solicitud en el sistema</p>
          </div>
          <div style={heroStepIndicator}>
            <span style={heroStepLabel}>Paso</span>
            <span style={heroStepNumber}>{step}</span>
            <span style={heroStepOf}>de {STEPS.length}</span>
          </div>
        </div>

        <div style={progressTrack}>
          <div style={{ ...progressFill, width: `${(step / STEPS.length) * 100}%` }} />
        </div>
      </div>

      {/* ── STEPPER (Arreglado para ocupar todo el ancho) ──────────────── */}
      <div style={stepperCard}>
        <div style={stepperInner}>
          {STEPS.map((s, i) => {
            const isCompleted = step > s.number;
            const isActive = step === s.number;
            
            return (
              <div key={s.number} style={{ 
                display: "flex", 
                alignItems: "center", 
                flex: i === STEPS.length - 1 ? "none" : 1  // El último no estira
              }}>
                <div style={stepperItem}>
                  <div style={{
                    ...stepCircle,
                    background: isCompleted ? C.forest700 : isActive ? C.forest900 : C.sand100,
                    border: isActive ? `2px solid ${C.forest700}` : "2px solid transparent",
                    boxShadow: isActive ? `0 0 0 4px ${C.forest50}` : "none",
                  }}>
                    {isCompleted ? (
                      <CheckIcon />
                    ) : (
                      <span style={{ fontSize: 11, fontWeight: 800, color: isActive ? C.white : C.sand400 }}>
                        {s.number}
                      </span>
                    )}
                  </div>
                  <span style={{ 
                    ...stepLabelText, 
                    color: isActive ? C.forest900 : isCompleted ? C.forest700 : C.sand400,
                    fontWeight: isActive ? 700 : 500
                  }}>
                    {s.label}
                  </span>
                </div>

                {/* Línea conectora entre pasos */}
                {i < STEPS.length - 1 && (
                  <div style={{
                    ...connectorLine,
                    background: isCompleted ? C.forest700 : C.sand200,
                  }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── CONTENIDO DEL PASO ────────────────────────────────────────── */}
      <div style={stepContent}>
        {step === 1 && (
          <ClientSelectionStep
            clients={clients}
            selectedClientId={form.clientId}
            onSelect={handleSelectClient}
            onNext={handleStep1Next}
            loading={loadingInitialData}
          />
        )}
        {step === 2 && (
          <LoanDetailsStep
            form={form}
            frequencies={frequencies}
            onChange={handleFieldChange}
            onBack={goToPreviousStep}
            onNext={handleStep2Next}
            loadingSimulation={loadingSimulation}
          />
        )}
        {step === 3 && simulation && (
          <LoanSimulationStep
            installmentAmount={installmentAmount}
            totalAmount={Number(simulation.totalAmount ?? form.requestedAmount)}
            totalInterest={Number(simulation.totalInterest ?? 0)}
            totalToPay={Number(simulation.totalToPay ?? 0)}
            schedule={schedule}
            onBack={goToPreviousStep}
            onNext={() => setStep(4)}
          />
        )}
        {step === 4 && (
          <LoanReviewStep
            form={form}
            installmentAmount={installmentAmount}
            availableIncome={availableIncome}
            onBack={() => setStep(3)}
            onSubmit={handleSubmit}
            submitting={submitting}
          />
        )}
      </div>
    </div>
  );
}

// Componente pequeño para el check
function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── ESTILOS CORREGIDOS ───────────────────────────────────────────────────────

const pageWrapper: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 20,
  fontFamily: fonts.body,
  width: "100%", // Ocupa todo el ancho
};

const heroSection: React.CSSProperties = {
  background: `linear-gradient(135deg, ${C.forest900} 0%, ${C.forest700} 60%, ${C.forest600} 100%)`,
  borderRadius: 16,
  padding: "24px 28px",
  color: C.white,
};

const breadcrumb: React.CSSProperties = { display: "flex", alignItems: "center", gap: 6, marginBottom: 16 };
const breadcrumbLink: React.CSSProperties = { background: "transparent", border: "none", cursor: "pointer", fontSize: 12, color: "rgba(255,255,255,0.6)", padding: 0 };
const breadcrumbSep: React.CSSProperties = { fontSize: 12, color: "rgba(255,255,255,0.35)" };
const breadcrumbCurrent: React.CSSProperties = { fontSize: 12, color: "rgba(255,255,255,0.9)", fontWeight: 600 };

const heroContent: React.CSSProperties = { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 20 };
const heroTitle: React.CSSProperties = { fontFamily: fonts.display, fontSize: 28, fontWeight: 700, margin: 0, letterSpacing: "-0.5px" };
const heroSub: React.CSSProperties = { fontSize: 14, color: "rgba(255,255,255,0.6)", marginTop: 4 };

const heroStepIndicator: React.CSSProperties = {
  display: "flex", alignItems: "baseline", gap: 4, background: "rgba(255,255,255,0.12)",
  border: "1px solid rgba(255,255,255,0.2)", borderRadius: 20, padding: "6px 14px",
};

const heroStepLabel: React.CSSProperties = { fontSize: 11, color: "rgba(255,255,255,0.6)" };
const heroStepNumber: React.CSSProperties = { fontFamily: fonts.display, fontSize: 18, fontWeight: 700, color: C.white };
const heroStepOf: React.CSSProperties = { fontSize: 11, color: "rgba(255,255,255,0.5)" };

const progressTrack: React.CSSProperties = { height: 4, borderRadius: 2, background: "rgba(255,255,255,0.15)", overflow: "hidden" };
const progressFill: React.CSSProperties = { height: "100%", background: "rgba(255,255,255,0.75)", transition: "width 0.4s ease" };

const stepperCard: React.CSSProperties = {
  background: C.white,
  border: `1px solid ${C.sand200}`,
  borderRadius: 14,
  padding: "24px 40px", // Más padding para que respire
};

const stepperInner: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
};

const stepperItem: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 8,
  position: "relative",
  zIndex: 2,
};

const connectorLine: React.CSSProperties = {
  height: 2,
  flex: 1,
  margin: "0 15px",
  marginTop: "-20px", // Alinea la línea con el centro de los círculos
  zIndex: 1,
};

const stepCircle: React.CSSProperties = {
  width: 32,
  height: 32,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.3s ease",
};

const stepLabelText: React.CSSProperties = {
  fontSize: 12,
  whiteSpace: "nowrap",
};

const stepContent: React.CSSProperties = { display: "flex", flexDirection: "column", width: "100%" };