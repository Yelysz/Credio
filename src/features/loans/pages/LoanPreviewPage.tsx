import { useState } from "react";
import { useLoanPreview } from "../hooks/useLoanPreview";

export default function LoanPreviewPage() {
  const { installments, isLoading, error, preview } = useLoanPreview();

  const [form, setForm] = useState({
    applicationId: "",
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

    await preview({
      applicationId: form.applicationId || undefined,
      amount: form.amount ? Number(form.amount) : undefined,
      interestRate: form.interestRate ? Number(form.interestRate) : undefined,
      termMonths: form.termMonths ? Number(form.termMonths) : undefined,
      paymentFrequencyId: form.paymentFrequencyId || undefined,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Previsualización de amortización</h1>
        <p className="text-sm text-slate-500">
          Genera una vista previa antes de crear el préstamo
        </p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border bg-white p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Id de solicitud" value={form.applicationId} onChange={(v) => handleChange("applicationId", v)} />
          <Field label="Monto" type="number" value={form.amount} onChange={(v) => handleChange("amount", v)} />
          <Field label="Tasa de interés" type="number" value={form.interestRate} onChange={(v) => handleChange("interestRate", v)} />
          <Field label="Plazo en meses" type="number" value={form.termMonths} onChange={(v) => handleChange("termMonths", v)} />
          <Field label="Frecuencia de pago" value={form.paymentFrequencyId} onChange={(v) => handleChange("paymentFrequencyId", v)} />
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <div className="mt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {isLoading ? "Calculando..." : "Previsualizar"}
          </button>
        </div>
      </form>

      {installments.length > 0 && (
        <div className="rounded-2xl border bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">Tabla estimada</h2>

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
                {installments.map((item, index) => (
                  <tr key={`${item.installmentNumber ?? index}`} className="text-sm">
                    <td className="border-b px-4 py-3">{item.installmentNumber ?? "—"}</td>
                    <td className="border-b px-4 py-3">
                      {item.dueDate ? new Date(item.dueDate).toLocaleDateString("es-DO") : "—"}
                    </td>
                    <td className="border-b px-4 py-3">
                      {typeof item.principal === "number" ? item.principal.toLocaleString("es-DO") : "—"}
                    </td>
                    <td className="border-b px-4 py-3">
                      {typeof item.interest === "number" ? item.interest.toLocaleString("es-DO") : "—"}
                    </td>
                    <td className="border-b px-4 py-3">
                      {typeof item.totalPayment === "number" ? item.totalPayment.toLocaleString("es-DO") : "—"}
                    </td>
                    <td className="border-b px-4 py-3">
                      {typeof item.remainingBalance === "number" ? item.remainingBalance.toLocaleString("es-DO") : "—"}
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

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
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