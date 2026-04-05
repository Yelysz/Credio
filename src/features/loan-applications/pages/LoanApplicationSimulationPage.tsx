import { useState } from "react";
import { useLoanApplicationSimulation } from "../hooks/useLoanApplicationSimulation";

export default function LoanApplicationSimulationPage() {
  const { result, isLoading, error, simulate } = useLoanApplicationSimulation();

  const [form, setForm] = useState({
    amount: "",
    interestRate: "",
    termMonths: "",
    paymentFrequencyId: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await simulate({
      amount: Number(form.amount),
      interestRate: Number(form.interestRate),
      termMonths: Number(form.termMonths),
      paymentFrequencyId: form.paymentFrequencyId || undefined,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Simulación de préstamo</h1>
        <p className="text-sm text-slate-500">
          Calcula una tabla de amortización estimada
        </p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border bg-white p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field
            label="Monto"
            type="number"
            value={form.amount}
            onChange={(value) => handleChange("amount", value)}
          />
          <Field
            label="Tasa de interés"
            type="number"
            value={form.interestRate}
            onChange={(value) => handleChange("interestRate", value)}
          />
          <Field
            label="Plazo en meses"
            type="number"
            value={form.termMonths}
            onChange={(value) => handleChange("termMonths", value)}
          />
          <Field
            label="Frecuencia de pago"
            value={form.paymentFrequencyId}
            onChange={(value) => handleChange("paymentFrequencyId", value)}
          />
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <div className="mt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {isLoading ? "Simulando..." : "Simular"}
          </button>
        </div>
      </form>

      {result && (
        <div className="rounded-2xl border bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">Resultado</h2>

          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <Info
              label="Total interés"
              value={
                typeof result.totalInterest === "number"
                  ? result.totalInterest.toLocaleString("es-DO")
                  : "—"
              }
            />
            <Info
              label="Total pago"
              value={
                typeof result.totalPayment === "number"
                  ? result.totalPayment.toLocaleString("es-DO")
                  : "—"
              }
            />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                <tr className="text-left text-sm text-slate-500">
                  <th className="border-b px-4 py-3">Cuota</th>
                  <th className="border-b px-4 py-3">Fecha</th>
                  <th className="border-b px-4 py-3">Capital</th>
                  <th className="border-b px-4 py-3">Interés</th>
                  <th className="border-b px-4 py-3">Pago total</th>
                  <th className="border-b px-4 py-3">Balance</th>
                </tr>
              </thead>
              <tbody>
                {(result.installments ?? []).map((item, index) => (
                  <tr key={`${item.installmentNumber ?? index}`} className="text-sm">
                    <td className="border-b px-4 py-3">{item.installmentNumber ?? "—"}</td>
                    <td className="border-b px-4 py-3">
                      {item.dueDate
                        ? new Date(item.dueDate).toLocaleDateString("es-DO")
                        : "—"}
                    </td>
                    <td className="border-b px-4 py-3">
                      {typeof item.principal === "number"
                        ? item.principal.toLocaleString("es-DO")
                        : "—"}
                    </td>
                    <td className="border-b px-4 py-3">
                      {typeof item.interest === "number"
                        ? item.interest.toLocaleString("es-DO")
                        : "—"}
                    </td>
                    <td className="border-b px-4 py-3">
                      {typeof item.totalPayment === "number"
                        ? item.totalPayment.toLocaleString("es-DO")
                        : "—"}
                    </td>
                    <td className="border-b px-4 py-3">
                      {typeof item.remainingBalance === "number"
                        ? item.remainingBalance.toLocaleString("es-DO")
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}

function Field({ label, value, onChange, type = "text" }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border px-3 py-2 outline-none"
      />
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-sm text-slate-800">{value}</p>
    </div>
  );
}