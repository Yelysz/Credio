import type { SimulationInstallment } from "../../types/loanApplication.types";
import {
  formatCurrency,
} from "../../utils/loanApplicationFormatters";

interface Props {
  installmentAmount: number;
  totalAmount: number;
  totalInterest: number;
  totalToPay: number;
  schedule: SimulationInstallment[];
  onBack: () => void;
  onNext: () => void;
}

export const LoanSimulationStep = ({
  installmentAmount,
  totalAmount,
  totalInterest,
  totalToPay,
  schedule,
  onBack,
  onNext,
}: Props) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          Simulación de Amortización
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Cuota estimada: {formatCurrency(installmentAmount)}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 p-5">
          <p className="text-sm text-slate-500">Monto Total</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {formatCurrency(totalAmount)}
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-5">
          <p className="text-sm text-slate-500">Total Intereses</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {formatCurrency(totalInterest)}
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-5">
          <p className="text-sm text-slate-500">Total a Pagar</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {formatCurrency(totalToPay)}
          </p>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
        <div className="max-h-[420px] overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="px-4 py-3 font-semibold">PERÍODO</th>
                <th className="px-4 py-3 font-semibold">CUOTA</th>
                <th className="px-4 py-3 font-semibold">CAPITAL</th>
                <th className="px-4 py-3 font-semibold">INTERÉS</th>
                <th className="px-4 py-3 font-semibold">SALDO</th>
              </tr>
            </thead>

            <tbody>
              {schedule.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-6 text-center text-slate-500"
                  >
                    No hay datos de simulación para mostrar.
                  </td>
                </tr>
              ) : (
                schedule.map((row) => (
                  <tr
                    key={row.installmentNumber}
                    className="border-t border-slate-200"
                  >
                    <td className="px-4 py-3">
                      {row.installmentNumber}
                    </td>
                    <td className="px-4 py-3 font-semibold">
                      {formatCurrency(row.dueAmount)}
                    </td>
                    <td className="px-4 py-3">
                      {formatCurrency(row.principalAmount)}
                    </td>
                    <td className="px-4 py-3">
                      {formatCurrency(row.interestAmount)}
                    </td>
                    <td className="px-4 py-3">
                      {formatCurrency(row.remainingBalance)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl bg-slate-200 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-300"
        >
          Anterior
        </button>

        <button
          type="button"
          onClick={onNext}
          className="rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white transition hover:bg-violet-700"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};