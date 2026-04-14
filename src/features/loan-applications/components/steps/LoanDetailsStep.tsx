import type {
  LoanApplicationFormData,
  PaymentFrequency,
} from "../../types/loanApplication.types";

interface Props {
  form: LoanApplicationFormData;
  frequencies: PaymentFrequency[];
  onChange: <K extends keyof LoanApplicationFormData>(
    field: K,
    value: LoanApplicationFormData[K]
  ) => void;
  onBack: () => void;
  onNext: () => void;
  loadingSimulation?: boolean;
}

export const LoanDetailsStep = ({
  form,
  frequencies,
  onChange,
  onBack,
  onNext,
  loadingSimulation = false,
}: Props) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-2xl font-bold text-slate-900">
        Detalles del Préstamo
      </h2>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        
        {/* MONTO */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Monto Solicitado *
          </label>
          <input
            type="number"
            min="1"
            value={form.requestedAmount}
            onChange={(e) =>
              onChange(
                "requestedAmount",
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-violet-500"
          />
        </div>

        {/* PLAZO */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Plazo (períodos) *
          </label>
          <input
            type="number"
            min="1"
            value={form.requestTerm}
            onChange={(e) =>
              onChange(
                "requestTerm",
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-violet-500"
          />
        </div>

        {/* FRECUENCIA */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Frecuencia de Pago *
          </label>
          <select
            value={form.paymentFrequencyId}
            onChange={(e) => onChange("paymentFrequencyId", e.target.value)}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-violet-500"
          >
            {frequencies.map((frequency) => (
              <option key={frequency.id} value={frequency.id}>
                {frequency.name}
              </option>
            ))}
          </select>
        </div>

        {/* TASA */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Tasa de Interés (% anual) *
          </label>
          <input
            type="number"
            min="1"
            value={form.requestedInterestRate}
            onChange={(e) =>
              onChange(
                "requestedInterestRate",
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-violet-500"
          />
        </div>

        {/* PROPÓSITO */}
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Propósito del Préstamo *
          </label>
          <textarea
            rows={4}
            value={form.purpose}
            onChange={(e) => onChange("purpose", e.target.value)}
            placeholder="Describe el uso del préstamo..."
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-violet-500"
          />
        </div>

        {/* INGRESO */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Ingreso Mensual *
          </label>
          <input
            type="number"
            min="0"
            value={form.monthlyIncome}
            onChange={(e) =>
              onChange(
                "monthlyIncome",
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-violet-500"
          />
        </div>

        {/* GASTOS */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Gastos Mensuales *
          </label>
          <input
            type="number"
            min="0"
            value={form.monthlyExpenses}
            onChange={(e) =>
              onChange(
                "monthlyExpenses",
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-violet-500"
          />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl bg-slate-200 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-300"
        >
          Anterior
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={loadingSimulation}
          className="rounded-xl bg-violet-500 px-6 py-3 font-semibold text-white hover:bg-violet-600 disabled:opacity-50"
        >
          {loadingSimulation ? "Simulando..." : "Siguiente"}
        </button>
      </div>
    </div>
  );
};