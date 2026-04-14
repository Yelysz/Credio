import type { LoanApplicationStep } from "../types/loanApplication.types";

interface Props {
  currentStep: LoanApplicationStep;
}

const steps = [
  { id: 1, label: "Cliente" },
  { id: 2, label: "Monto y Plazo" },
  { id: 3, label: "Simulación" },
  { id: 4, label: "Revisión" },
] as const;

export const LoanApplicationStepper = ({ currentStep }: Props) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid grid-cols-4 gap-4">
        {steps.map((step, index) => {
          const isActive = currentStep >= step.id;
          const isCompleted = currentStep > step.id;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                  isActive
                    ? "bg-violet-600 text-white"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {step.id}
              </div>

              <div className="min-w-0 flex-1">
                {!isLast && (
                  <div
                    className={`h-1 rounded-full ${
                      isCompleted ? "bg-violet-600" : "bg-slate-200"
                    }`}
                  />
                )}
                <p
                  className={`mt-2 text-sm font-medium ${
                    isActive ? "text-slate-900" : "text-slate-500"
                  }`}
                >
                  {step.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};