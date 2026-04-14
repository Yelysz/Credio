import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { LoanApplicationStepper } from "../components/LoanApplicationStepper";
import { ClientSelectionStep } from "../components/steps/ClientSelectionStep";
import { LoanDetailsStep } from "../components/steps/LoanDetailsStep";
import { LoanReviewStep } from "../components/steps/LoanReviewStep";
import { LoanSimulationStep } from "../components/steps/LoanSimulationStep";
import { useLoanApplicationWizard } from "../hooks/useLoanApplicationWizard";
import { getApiErrorMessages } from "@/shared/utils/getApiErrorMessage";

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
    const messages = getApiErrorMessages(error);

    messages.forEach((message) => {
      toast.error(message);
    });
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
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          Nueva Solicitud de Crédito
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Completa el proceso en 4 pasos
        </p>
      </div>

      <LoanApplicationStepper currentStep={step} />

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
  );
}