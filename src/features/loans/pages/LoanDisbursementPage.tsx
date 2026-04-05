import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoanActions } from "../hooks/useLoanActions";

export default function LoanDisbursementPage() {
  const navigate = useNavigate();
  const { disburseLoan, isSubmitting, error } = useLoanActions();

  const [form, setForm] = useState({
    loanId: "",
    disbursementDate: "",
    notes: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await disburseLoan({
      loanId: form.loanId,
      disbursementDate: form.disbursementDate || undefined,
      notes: form.notes || undefined,
    });

    navigate("/");
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Desembolsar préstamo</h1>
        <p className="text-sm text-slate-500">
          Registra el desembolso de un préstamo creado
        </p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border bg-white p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Id del préstamo" value={form.loanId} onChange={(v) => handleChange("loanId", v)} />
          <Field label="Fecha desembolso" type="date" value={form.disbursementDate} onChange={(v) => handleChange("disbursementDate", v)} />
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700">Notas</label>
          <textarea
            value={form.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
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
            {isSubmitting ? "Procesando..." : "Desembolsar"}
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