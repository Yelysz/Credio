import { useEffect, useMemo, useState } from "react";
import { loanApplicationService } from "../services/loanApplication.service"; 
import type {
  ClientItem,
  LoanApplicationFormData,
  LoanApplicationStep,
  PaymentFrequency,
  SimulationInstallment,
  SimulationResult,
} from "../types/loanApplication.types";
import { getEmployeeIdFromToken } from "@/features/auth/utils/auth";

const DEFAULT_FORM: LoanApplicationFormData = {
  clientId: "",
  clientName: "",
  clientDocument: "",

  requestedAmount: 50000,
  requestTerm: 12,
  requestedInterestRate: 15,
  paymentFrequencyId: "",
  purpose: "",
  monthlyIncome: 45000,
  monthlyExpenses: 25000,
};



const getClientDisplayName = (client: ClientItem) => {
  return (
    client.fullName ||
    client.name ||
    `${client.firstName ?? ""} ${client.lastName ?? ""}`.trim()
  );
};

export const useLoanApplicationWizard = () => {
  const [step, setStep] = useState<LoanApplicationStep>(1);

  const [clients, setClients] = useState<ClientItem[]>([]);
  const [frequencies, setFrequencies] = useState<PaymentFrequency[]>([]);
  const [simulation, setSimulation] = useState<SimulationResult | null>(null);

  const [loadingInitialData, setLoadingInitialData] = useState(true);
  const [loadingSimulation, setLoadingSimulation] = useState(false);
  const [submitting] = useState(false);

  const [form, setForm] = useState<LoanApplicationFormData>(DEFAULT_FORM);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoadingInitialData(true);

        const [clientsData, frequenciesData] = await Promise.all([
          loanApplicationService.getClients({ pageNumber: 1, pageSize: 50 }),
          loanApplicationService.getPaymentFrequencies(),
        ]);

        setClients(clientsData);
        setFrequencies(frequenciesData);

        if (frequenciesData.length > 0) {
          setForm((prev) => ({
            ...prev,
            paymentFrequencyId: prev.paymentFrequencyId || frequenciesData[0].id,
          }));
        }
      } finally {
        setLoadingInitialData(false);
      }
    };

    void loadInitialData();
  }, []);

  const selectedClient = useMemo(() => {
    return clients.find((client) => client.id === form.clientId) ?? null;
  }, [clients, form.clientId]);

  const availableIncome = useMemo(() => {
    return Number(form.monthlyIncome || 0) - Number(form.monthlyExpenses || 0);
  }, [form.monthlyIncome, form.monthlyExpenses]);

const schedule: SimulationInstallment[] = useMemo(() => {
  return simulation?.schedule ?? [];
}, [simulation]);

const installmentAmount = useMemo(() => {
  return simulation?.installmentAmount ?? 0;
}, [simulation]);

  const handleFieldChange = <K extends keyof LoanApplicationFormData>(
    field: K,
    value: LoanApplicationFormData[K]
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSelectClient = (client: ClientItem) => {
    setForm((prev) => ({
      ...prev,
      clientId: client.id,
      clientName: getClientDisplayName(client),
      clientDocument: client.documentNumber ?? "",
      monthlyIncome:
        typeof client.monthlyIncome === "number"
          ? client.monthlyIncome
          : prev.monthlyIncome,
      monthlyExpenses:
        typeof client.monthlyExpenses === "number"
          ? client.monthlyExpenses
          : prev.monthlyExpenses,
    }));
  };

  const goToNextStep = () => {
    setStep((prev) => Math.min(prev + 1, 4) as LoanApplicationStep);
  };

  const goToPreviousStep = () => {
    setStep((prev) => Math.max(prev - 1, 1) as LoanApplicationStep);
  };

  const validateStep1 = () => {
    return Boolean(form.clientId);
  };

const validateStep2 = () => {
  if (form.requestedAmount === "" || Number(form.requestedAmount) <= 0)
    return false;

  if (form.requestTerm === "" || Number(form.requestTerm) <= 0)
    return false;

  if (
    form.requestedInterestRate === "" ||
    Number(form.requestedInterestRate) <= 0
  )
    return false;

  if (!form.paymentFrequencyId) return false;
  if (form.purpose.trim() === "") return false;

  if (form.monthlyIncome === "" || Number(form.monthlyIncome) < 0)
    return false;

  if (form.monthlyExpenses === "" || Number(form.monthlyExpenses) < 0)
    return false;

  return true;
};

const simulate = async () => {
  if (!validateStep2()) return;

  try {
    setLoadingSimulation(true);

    const payload = {
      requestedAmount: Number(form.requestedAmount),
      requestTerm: Number(form.requestTerm),
      requestedInterestRate: Number(form.requestedInterestRate),
      paymentFrequencyId: form.paymentFrequencyId,
    };

    const response = await loanApplicationService.simulate(payload);

    setSimulation(response);
    setStep(3);
  } finally {
    setLoadingSimulation(false);
  }
};

const submit = async () => {
  if (form.requestTerm === "" || Number(form.requestTerm) <= 0) {
    throw new Error("El plazo debe ser mayor a 0");
  }

  const payload = {
    clientId: form.clientId,
    employeeId: getEmployeeIdFromToken(),
    requestedAmount: Number(form.requestedAmount),
    requestedTerm: Number(form.requestTerm),
    requestedInterestRate: Number(form.requestedInterestRate),
    paymentFrequencyId: form.paymentFrequencyId,
  };

  return loanApplicationService.create(payload);
};

  return {
    step,
    setStep,

    form,
    handleFieldChange,
    handleSelectClient,

    clients,
    frequencies,
    selectedClient,

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
  };
};