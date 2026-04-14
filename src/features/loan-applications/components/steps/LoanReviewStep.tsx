import type { LoanApplicationFormData } from "../../types/loanApplication.types";
import { formatCurrency } from "../../utils/loanApplicationFormatters";

interface Props {
  form: LoanApplicationFormData;
  installmentAmount: number;
  availableIncome: number;
  onBack: () => void;
  onSubmit: () => void;
  submitting?: boolean;
}

export const LoanReviewStep = ({
  form,
  installmentAmount,
  availableIncome,
  onBack,
  onSubmit,
  submitting = false,
}: Props) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-2xl font-bold text-slate-900">
        Resumen de la Solicitud
      </h2>

      <div className="space-y-6">
        <div>
          <h3 className="mb-3 text-xl font-bold text-slate-900">
            Información del Cliente
          </h3>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-lg font-semibold text-slate-900">
              {form.clientName}
            </p>
            <p className="text-sm text-slate-500">{form.clientDocument}</p>
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-xl font-bold text-slate-900">
            Detalles del Préstamo
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Monto</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {formatCurrency(Number(form.requestedAmount || 0))}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Plazo</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {form.requestTerm} mensuales
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Tasa</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {form.requestedInterestRate}% anual
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Cuota</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {formatCurrency(installmentAmount)}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-xl font-bold text-slate-900">
            Capacidad de Pago
          </h3>

          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="flex items-center justify-between border-b border-slate-200 py-2">
              <span className="text-slate-500">Ingreso Mensual:</span>
              <span className="font-bold text-slate-900">
                {formatCurrency(Number(form.monthlyIncome || 0))}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-200 py-2">
              <span className="text-slate-500">Gastos Mensuales:</span>
              <span className="font-bold text-slate-900">
                {formatCurrency(Number(form.monthlyExpenses || 0))}
              </span>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-slate-500">Disponible:</span>
              <span
                className={`font-bold ${
                  availableIncome >= 0 ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {formatCurrency(availableIncome)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl bg-slate-200 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-300"
        >
          Anterior
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting}
          className="rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
        >
          {submitting ? "Enviando..." : "Enviar Solicitud"}
        </button>
      </div>
    </div>
  );
};