import { useMemo, useState } from "react";
import { usePortfolioReport } from "../hooks/usePortfolioReport";

const formatCurrency = (value?: number) => {
  if (typeof value !== "number") return "—";
  return value.toLocaleString("es-DO", {
    style: "currency",
    currency: "DOP",
    maximumFractionDigits: 0,
  });
};

export default function PortfolioReportPage() {
  const { report, items, isLoading, error, refetch } = usePortfolioReport();
  const [searchInput, setSearchInput] = useState("");

  const filteredItems = useMemo(() => {
    if (!searchInput.trim()) return items;

    const q = searchInput.toLowerCase();

    return items.filter((item) => {
      return (
        (item.clientName ?? "").toLowerCase().includes(q) ||
        (item.loanNumber ?? "").toLowerCase().includes(q) ||
        (item.documentNumber ?? "").toLowerCase().includes(q) ||
        (item.status ?? "").toLowerCase().includes(q)
      );
    });
  }, [items, searchInput]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Reporte de cartera</h1>
        <p className="text-sm text-slate-500">
          Consulta el estado actual de la cartera de préstamos
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <SummaryCard
          title="Cartera total"
          value={formatCurrency(
            typeof report?.totalPortfolio === "number"
              ? report.totalPortfolio
              : report?.totalBalance
          )}
        />
        <SummaryCard
          title="Balance total"
          value={formatCurrency(report?.totalBalance)}
        />
        <SummaryCard
          title="Mora total"
          value={formatCurrency(report?.totalOverdue)}
        />
        <SummaryCard
          title="Préstamos"
          value={
            typeof report?.totalLoans === "number"
              ? report.totalLoans.toLocaleString("es-DO")
              : "—"
          }
        />
      </div>

      <div className="rounded-2xl border bg-white p-4">
        <div className="mb-4 flex gap-3">
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Buscar por cliente, préstamo, documento o estado"
            className="w-full rounded-xl border px-3 py-2 outline-none"
          />

          <button
            onClick={refetch}
            className="rounded-xl border px-4 py-2 text-sm"
          >
            Refrescar
          </button>
        </div>

        {isLoading && <p className="text-sm text-slate-500">Cargando reporte...</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}

        {!isLoading && !error && filteredItems.length === 0 && (
          <p className="text-sm text-slate-500">
            No hay datos disponibles para mostrar.
          </p>
        )}

        {!isLoading && !error && filteredItems.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                <tr className="text-left text-sm text-slate-500">
                  <th className="border-b px-4 py-3">Préstamo</th>
                  <th className="border-b px-4 py-3">Cliente</th>
                  <th className="border-b px-4 py-3">Documento</th>
                  <th className="border-b px-4 py-3">Monto</th>
                  <th className="border-b px-4 py-3">Balance</th>
                  <th className="border-b px-4 py-3">Estado</th>
                  <th className="border-b px-4 py-3">Vencimiento</th>
                  <th className="border-b px-4 py-3">Días mora</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item, index) => (
                  <tr
                    key={`${item.loanId ?? item.loanNumber ?? index}`}
                    className="text-sm"
                  >
                    <td className="border-b px-4 py-3">{item.loanNumber ?? "—"}</td>
                    <td className="border-b px-4 py-3">{item.clientName ?? "—"}</td>
                    <td className="border-b px-4 py-3">{item.documentNumber ?? "—"}</td>
                    <td className="border-b px-4 py-3">
                      {typeof item.amount === "number"
                        ? formatCurrency(item.amount)
                        : "—"}
                    </td>
                    <td className="border-b px-4 py-3">
                      {typeof item.balance === "number"
                        ? formatCurrency(item.balance)
                        : "—"}
                    </td>
                    <td className="border-b px-4 py-3">{item.status ?? "—"}</td>
                    <td className="border-b px-4 py-3">
                      {item.dueDate
                        ? new Date(item.dueDate).toLocaleDateString("es-DO")
                        : "—"}
                    </td>
                    <td className="border-b px-4 py-3">
                      {typeof item.daysPastDue === "number"
                        ? item.daysPastDue
                        : "—"}
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

function SummaryCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border bg-white p-5">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 text-xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}