import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoanApplications } from "../hooks/useLoanApplications";

export default function LoanApplicationsPage() {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");

  const { applications, isLoading, error, refetch } = useLoanApplications();

  const filteredApplications = useMemo(() => {
    if (!searchInput.trim()) return applications;

    const q = searchInput.toLowerCase().trim();

    return applications.filter((application) => {
      return (
        (application.clientName ?? "").toLowerCase().includes(q) ||
        (application.employeeId ?? "").toLowerCase().includes(q) ||
        (application.applicationStatusName ?? "").toLowerCase().includes(q) ||
        String(application.requestedAmount ?? "").includes(q) ||
        (application.applicationCode ?? "").toLowerCase().includes(q) ||
        (application.paymentFrequency ?? "").toLowerCase().includes(q)
      );
    });
  }, [applications, searchInput]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Solicitudes de préstamo</h1>
          <p className="text-sm text-slate-500">
            Consulta las solicitudes registradas en el sistema
          </p>
        </div>

<div className="flex gap-3">
  <button onClick={() => navigate("/loan-applications/create")} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white">
    Nueva solicitud
  </button>

  <button onClick={() => navigate("/loan-applications/simulate")} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white">
    Simular préstamo
  </button>
</div>
      
      </div>

      <div className="rounded-2xl border bg-white p-4">
        <div className="mb-4 flex gap-3">
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Buscar por cliente, oficial, estado o monto"
            className="w-full rounded-xl border px-3 py-2 outline-none"
          />

          <button
            onClick={refetch}
            className="rounded-xl border px-4 py-2 text-sm"
          >
            Refrescar
          </button>
        </div>

        {isLoading && (
          <p className="text-sm text-slate-500">Cargando solicitudes...</p>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        {!isLoading && !error && filteredApplications.length === 0 && (
          <p className="text-sm text-slate-500">
            No hay solicitudes registradas.
          </p>
        )}

        {!isLoading && !error && filteredApplications.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                <tr className="text-left text-sm text-slate-500">
                  <th className="border-b px-4 py-3">Cliente</th>
                  <th className="border-b px-4 py-3">Oficial</th>
                  <th className="border-b px-4 py-3">Monto solicitado</th>
                  <th className="border-b px-4 py-3">Plazo</th>
                  <th className="border-b px-4 py-3">Estado</th>
                  <th className="border-b px-4 py-3">Frecuencia</th>
                  <th className="border-b px-4 py-3">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {filteredApplications.map((application) => (
                  <tr key={application.id} className="text-sm">
                    <td className="border-b px-4 py-3">
                      {application.clientName ?? "—"}
                    </td>

                    <td className="border-b px-4 py-3">
                      {application.employeeId ?? "—"}
                    </td>

                    <td className="border-b px-4 py-3">
                      {typeof application.requestedAmount === "number"
                        ? application.requestedAmount.toLocaleString("es-DO")
                        : "—"}
                    </td>

                    <td className="border-b px-4 py-3">
                      {typeof application.requestTerm === "number"
                        ? `${application.requestTerm} meses`
                        : "—"}
                    </td>

                    <td className="border-b px-4 py-3">
                      {application.applicationStatusName ?? "—"}
                    </td>

                    <td className="border-b px-4 py-3">
                      {application.paymentFrequency ?? "—"}
                    </td>

                    <td className="border-b px-4 py-3">
                      <button
                        onClick={() =>
                          navigate(`/loan-applications/${application.id}`)
                        }
                        className="rounded-lg border px-3 py-1 text-xs"
                      >
                        Ver detalle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}