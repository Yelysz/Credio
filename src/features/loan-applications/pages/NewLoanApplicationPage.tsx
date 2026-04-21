import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { LoanApplicationStepper } from "../components/LoanApplicationStepper";
import { ClientSelectionStep } from "../components/steps/ClientSelectionStep";
import { LoanDetailsStep } from "../components/steps/LoanDetailsStep";
import { LoanReviewStep } from "../components/steps/LoanReviewStep";
import { LoanSimulationStep } from "../components/steps/LoanSimulationStep";
import { useLoanApplicationWizard } from "../hooks/useLoanApplicationWizard";
import { getApiErrorMessages } from "@/shared/utils/getApiErrorMessage";

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

// Etiquetas y íconos por paso
const STEPS = [
  { number: 1, label: "Cliente",    icon: "◎" },
  { number: 2, label: "Detalles",   icon: "◻" },
  { number: 3, label: "Simulación", icon: "◈" },
  { number: 4, label: "Revisión",   icon: "◼" },
];

export default function NewLoanApplicationPage() {
  const navigate = useNavigate();

  const {
    step,
    setStep,
    form,
    handleFieldChange,
    handleSelectClient,
    clients,
    frequencies,
    simulation,
    schedule,
    installmentAmount,
    availableIncome,
    loadingInitialData,
    loadingSimulation,
    submitting,
    validateStep1,
    validateStep2,
    goToNextStep,
    goToPreviousStep,
    simulate,
    submit,
  } = useLoanApplicationWizard();

  const showErrors = (error: unknown) => {
    getApiErrorMessages(error).forEach((message) => toast.error(message));
  };

  const handleStep1Next = () => {
    if (!validateStep1()) {
      toast.error("Debes seleccionar un cliente.");
      return;
    }
    goToNextStep();
  };

  const handleStep2Next = async () => {
    if (!validateStep2()) {
      toast.error("Completa todos los campos requeridos.");
      return;
    }
    try {
      await simulate();
      toast.success("Simulación generada correctamente.");
    } catch (error) {
      console.error(error);
      showErrors(error);
    }
  };

  const handleSubmit = async () => {
    try {
      await submit();
      toast.success("Solicitud creada correctamente.");
      navigate("/loan-applications");
    } catch (error) {
      console.error(error);
      showErrors(error);
    }
  };

  return (
    <div style={pageWrapper}>

      {/* ── HERO HEADER ─────────────────────────────────────────── */}
      <div style={heroSection}>
        {/* Breadcrumb */}
        <div style={breadcrumb}>
          <button
            onClick={() => navigate("/loan-applications")}
            style={breadcrumbLink}
          >
            Préstamos
          </button>
          <span style={breadcrumbSep}>›</span>
          <span style={breadcrumbCurrent}>Nueva solicitud</span>
        </div>

        <div style={heroContent}>
          <div>
            <h1 style={heroTitle}>Nueva Solicitud de Crédito</h1>
            <p style={heroSub}>Completa el proceso en {STEPS.length} pasos</p>
          </div>
          <div style={heroStepIndicator}>
            <span style={heroStepLabel}>Paso</span>
            <span style={heroStepNumber}>{step}</span>
            <span style={heroStepOf}>de {STEPS.length}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div style={progressTrack}>
          <div
            style={{
              ...progressFill,
              width: `${(step / STEPS.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* ── STEPPER ─────────────────────────────────────────────── */}
      <div style={stepperCard}>
        <div style={stepperInner}>
          {STEPS.map((s, i) => {
            const isCompleted = step > s.number;
            const isActive    = step === s.number;
            return (
              <div key={s.number} style={stepperItemWrap}>
                {/* Línea conectora */}
                {i > 0 && (
                  <div
                    style={{
                      ...connectorLine,
                      background: isCompleted || isActive
                        ? C.forest700
                        : C.sand200,
                    }}
                  />
                )}

                <div style={stepperItem}>
                  {/* Círculo */}
                  <div
                    style={{
                      ...stepCircle,
                      background: isCompleted
                        ? C.forest700
                        : isActive
                        ? C.forest900
                        : C.sand100,
                      border: isActive
                        ? `2px solid ${C.forest700}`
                        : "2px solid transparent",
                      boxShadow: isActive
                        ? `0 0 0 4px ${C.forest50}`
                        : "none",
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
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 800,
                          color: isActive ? C.white : C.sand400,
                        }}
                      >
                        {s.number}
                      </span>
                    )}
                  </div>

                  {/* Etiqueta */}
                  <div style={stepLabel}>
                    <span
                      style={{
                        ...stepLabelText,
                        color: isActive
                          ? C.forest900
                          : isCompleted
                          ? C.forest700
                          : C.sand400,
                        fontWeight: isActive ? 700 : 500,
                      }}
                    >
                      {s.label}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* También renderiza el stepper original si tiene lógica interna */}
        <div style={{ display: "none" }}>
          <LoanApplicationStepper currentStep={step} />
        </div>
      </div>

      {/* ── CONTENIDO DE PASO ───────────────────────────────────── */}
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

// ── ESTILOS ──────────────────────────────────────────────────────────────────

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
  marginBottom: 16,
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
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 16,
  marginBottom: 20,
};

const heroTitle: React.CSSProperties = {
  fontFamily: fonts.display,
  fontSize: 24,
  fontWeight: 700,
  color: C.white,
  letterSpacing: "-0.4px",
  margin: 0,
};

const heroSub: React.CSSProperties = {
  fontSize: 13,
  color: "rgba(255,255,255,0.6)",
  marginTop: 4,
};

const heroStepIndicator: React.CSSProperties = {
  display: "flex",
  alignItems: "baseline",
  gap: 4,
  background: "rgba(255,255,255,0.12)",
  border: "1px solid rgba(255,255,255,0.2)",
  borderRadius: 20,
  padding: "6px 14px",
  flexShrink: 0,
};

const heroStepLabel: React.CSSProperties = {
  fontSize: 11,
  color: "rgba(255,255,255,0.6)",
};

const heroStepNumber: React.CSSProperties = {
  fontFamily: fonts.display,
  fontSize: 18,
  fontWeight: 700,
  color: C.white,
  lineHeight: 1,
};

const heroStepOf: React.CSSProperties = {
  fontSize: 11,
  color: "rgba(255,255,255,0.5)",
};

const progressTrack: React.CSSProperties = {
  height: 4,
  borderRadius: 2,
  background: "rgba(255,255,255,0.15)",
  overflow: "hidden",
};

const progressFill: React.CSSProperties = {
  height: "100%",
  borderRadius: 2,
  background: "rgba(255,255,255,0.75)",
  transition: "width 0.4s cubic-bezier(0.4,0,0.2,1)",
};

// Stepper card
const stepperCard: React.CSSProperties = {
  background: C.white,
  border: `1px solid ${C.sand200}`,
  borderRadius: 14,
  padding: "18px 28px",
};

const stepperInner: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  position: "relative",
};

const stepperItemWrap: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  flex: 1,
};

const connectorLine: React.CSSProperties = {
  flex: 1,
  height: 2,
  borderRadius: 1,
  transition: "background 0.3s ease",
  marginRight: 8,
};

const stepperItem: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 6,
  flex: "0 0 auto",
};

const stepCircle: React.CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.3s ease",
  flexShrink: 0,
};

const stepLabel: React.CSSProperties = {
  textAlign: "center",
};

const stepLabelText: React.CSSProperties = {
  fontSize: 11,
  transition: "color 0.2s ease",
  whiteSpace: "nowrap",
};

// Step content
const stepContent: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 0,
};