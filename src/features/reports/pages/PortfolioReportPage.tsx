import { useMemo, useState } from "react";
import { usePortfolioReport } from "../hooks/usePortfolioReport";

const formatCurrency = (value?: number) => {
  if (typeof value !== "number" || Number.isNaN(value)) return "—";

  return value.toLocaleString("es-DO", {
    style: "currency",
    currency: "DOP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatText = (value?: string | number | null) => {
  if (value === null || value === undefined || value === "") return "—";
  return String(value);
};

type PortfolioRow = {
  loanId?: string | number;
  loanNumber?: string | number;
  client?: string;
  clientName?: string;
  originalAmount?: number;
  amount?: number;
  outstandingBalance?: number;
  balance?: number;
  totalFeePaidCount?: number;
  totalFeeCount?: number;
  daysInArrears?: number | null;
  daysPastDue?: number | null;
  state?: string;
  status?: string;
};

export default function PortfolioReportPage() {
  const { report, items, isLoading, error, refetch } = usePortfolioReport();
  const [searchInput, setSearchInput] = useState("");

  const summary = report?.summary ?? report;

  const filteredItems = useMemo(() => {
    if (!searchInput.trim()) return items ?? [];

    const q = searchInput.toLowerCase().trim();

    return (items ?? []).filter((item: PortfolioRow) => {
      const client = (item.clientName ?? item.client ?? "").toLowerCase();
      const loanNumber = String(item.loanNumber ?? "").toLowerCase();
      const status = (item.status ?? item.state ?? "").toLowerCase();

      return (
        client.includes(q) ||
        loanNumber.includes(q) ||
        status.includes(q)
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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-4">
        <SummaryCard
          title="Préstamos"
          value={
            typeof summary?.totalLoans === "number"
              ? summary.totalLoans.toLocaleString("es-DO")
              : "—"
          }
        />

        <SummaryCard
          title="Cartera total"
          value={formatCurrency(summary?.totalPortfolio)}
        />

        <SummaryCard
          title="Cargos por mora"
          value={formatCurrency(summary?.lateFees ?? summary?.totalOverdue)}
        />

        <SummaryCard
          title="Balance total"
          value={formatCurrency(summary?.totalBalance)}
        />
      </div>

      <div className="rounded-2xl border bg-white p-4">
        <div className="mb-4 flex flex-col gap-3 md:flex-row">
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Buscar por cliente, préstamo o estado"
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
          <p className="text-sm text-slate-500">Cargando reporte...</p>
        )}

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
                  <th className="border-b px-4 py-3">Monto original</th>
                  <th className="border-b px-4 py-3">Balance pendiente</th>
                  <th className="border-b px-4 py-3">Cuotas pagadas</th>
                  <th className="border-b px-4 py-3">Total cuotas</th>
                  <th className="border-b px-4 py-3">Estado</th>
                  <th className="border-b px-4 py-3">Días en mora</th>
                </tr>
              </thead>

              <tbody>
                {filteredItems.map((item: PortfolioRow, index: number) => {
                  const originalAmount = item.originalAmount ?? item.amount;
                  const outstandingBalance =
                    item.outstandingBalance ?? item.balance;
                  const status = item.state ?? item.status;
                  const daysInArrears =
                    item.daysInArrears ?? item.daysPastDue;

                  return (
                    <tr
                      key={`${item.loanId ?? item.loanNumber ?? index}`}
                      className="text-sm"
                    >
                      <td className="border-b px-4 py-3">
                        {formatText(item.loanNumber)}
                      </td>
                      <td className="border-b px-4 py-3">
                        {formatText(item.client ?? item.clientName)}
                      </td>
                      <td className="border-b px-4 py-3">
                        {formatCurrency(originalAmount)}
                      </td>
                      <td className="border-b px-4 py-3">
                        {formatCurrency(outstandingBalance)}
                      </td>
                      <td className="border-b px-4 py-3">
                        {typeof item.totalFeePaidCount === "number"
                          ? item.totalFeePaidCount
                          : "—"}
                      </td>
                      <td className="border-b px-4 py-3">
                        {typeof item.totalFeeCount === "number"
                          ? item.totalFeeCount
                          : "—"}
                      </td>
                      <td className="border-b px-4 py-3">
                        {formatText(status)}
                      </td>
                      <td className="border-b px-4 py-3">
                        {typeof daysInArrears === "number"
                          ? daysInArrears
                          : "—"}
                      </td>
                    </tr>
                  );
                })}
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