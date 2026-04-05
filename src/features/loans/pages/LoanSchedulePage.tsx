import { useParams } from "react-router-dom";
import { useLoanSchedule } from "../hooks/useLoanSchedule";

export default function LoanSchedulePage() {
  const { id } = useParams();
  const { schedule, isLoading, error } = useLoanSchedule(id);

  if (isLoading) return <p>Cargando calendario...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!schedule) return <p>No se encontró el calendario.</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Calendario del préstamo</h1>
        <p className="text-sm text-slate-500">
          {schedule.loanNumber ? `Préstamo ${schedule.loanNumber}` : "Detalle del calendario"}
        </p>
      </div>

      <div className="rounded-2xl border bg-white p-6">
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
                <th className="border-b px-4 py-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {(schedule.installments ?? []).map((item, index) => (
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
                  <td className="border-b px-4 py-3">{item.status ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}