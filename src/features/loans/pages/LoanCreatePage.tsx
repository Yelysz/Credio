import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoanActions } from "../hooks/useLoanActions";

export default function LoanCreatePage() {
  const navigate = useNavigate();
  const { createLoan, isSubmitting, error } = useLoanActions();

  const [form, setForm] = useState({
    applicationId: "",
    amount: "",
    interestRate: "",
    termMonths: "",
    paymentFrequencyId: "",
    firstPaymentDate: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await createLoan({
      applicationId: form.applicationId,
      amount: form.amount ? Number(form.amount) : undefined,
      interestRate: form.interestRate ? Number(form.interestRate) : undefined,
      termMonths: form.termMonths ? Number(form.termMonths) : undefined,
      paymentFrequencyId: form.paymentFrequencyId || undefined,
      firstPaymentDate: form.firstPaymentDate || undefined,
    });

    navigate("/loan-applications");
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Crear préstamo</h1>
        <p className="text-sm text-slate-500">
          Crea un préstamo a partir de una solicitud aprobada
        </p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border bg-white p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Id de solicitud" value={form.applicationId} onChange={(v) => handleChange("applicationId", v)} />
          <Field label="Monto" type="number" value={form.amount} onChange={(v) => handleChange("amount", v)} />
          <Field label="Tasa de interés" type="number" value={form.interestRate} onChange={(v) => handleChange("interestRate", v)} />
          <Field label="Plazo en meses" type="number" value={form.termMonths} onChange={(v) => handleChange("termMonths", v)} />
          <Field label="Frecuencia de pago" value={form.paymentFrequencyId} onChange={(v) => handleChange("paymentFrequencyId", v)} />
          <Field label="Fecha primer pago" type="date" value={form.firstPaymentDate} onChange={(v) => handleChange("firstPaymentDate", v)} />
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <div className="mt-6 flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {isSubmitting ? "Creando..." : "Crear préstamo"}
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