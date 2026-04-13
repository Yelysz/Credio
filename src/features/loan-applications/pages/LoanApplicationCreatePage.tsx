import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoanActions } from "../hooks/useLoanApplicationActions";

export default function LoanApplicationCreatePage() {
  const navigate = useNavigate();
  const { createLoanApplication, isSubmitting, error } = useLoanActions();

  const [form, setForm] = useState({
    requestedInterestRate: "",
    requestedAmount: "",
    requestedTerm: "",
    clientId: "",
    employeeId: "",
    paymentFrequencyId: "",
    purpose: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await createLoanApplication({
      requestedInterestRate: Number(form.requestedInterestRate),
      requestedAmount: Number(form.requestedAmount),
      requestedTerm: Number(form.requestedTerm),
      clientId: form.clientId.trim(),
      employeeId: form.employeeId.trim(),
      paymentFrequencyId: form.paymentFrequencyId.trim(),
      purpose: form.purpose.trim() || undefined,
    });

    if (!result) return;

    navigate("/loan-applications");
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Crear solicitud de préstamo</h1>
        <p className="text-sm text-slate-500">
          Registra una solicitud para luego aprobarla o rechazarla
        </p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border bg-white p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field
            label="Tasa solicitada"
            type="number"
            value={form.requestedInterestRate}
            onChange={(v) => handleChange("requestedInterestRate", v)}
          />
          <Field
            label="Monto solicitado"
            type="number"
            value={form.requestedAmount}
            onChange={(v) => handleChange("requestedAmount", v)}
          />
          <Field
            label="Plazo solicitado"
            type="number"
            value={form.requestedTerm}
            onChange={(v) => handleChange("requestedTerm", v)}
          />
          <Field
            label="Id cliente"
            value={form.clientId}
            onChange={(v) => handleChange("clientId", v)}
          />
          <Field
            label="Id empleado"
            value={form.employeeId}
            onChange={(v) => handleChange("employeeId", v)}
          />
          <Field
            label="Id frecuencia de pago"
            value={form.paymentFrequencyId}
            onChange={(v) => handleChange("paymentFrequencyId", v)}
          />
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700">Propósito</label>
          <textarea
            value={form.purpose}
            onChange={(e) => handleChange("purpose", e.target.value)}
            className="min-h-28 rounded-xl border px-3 py-2 outline-none"
          />
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <div className="mt-6 flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {isSubmitting ? "Guardando..." : "Crear solicitud"}
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-xl border px-4 py-2 text-sm"
          >
            Cancelar
          </button>
        </div>
      </form>
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