import type { ClientItem } from "../../types/loanApplication.types";

interface Props {
  clients: ClientItem[];
  selectedClientId: string;
  onSelect: (client: ClientItem) => void;
  onNext: () => void;
  loading?: boolean;
}

const getClientName = (client: ClientItem) => {
  return (
    client.fullName ||
    client.name ||
    `${client.firstName ?? ""} ${client.lastName ?? ""}`.trim()
  );
};

const getScoreColor = (score?: number) => {
  if (typeof score !== "number") return "bg-slate-100 text-slate-600";
  if (score >= 800) return "bg-emerald-100 text-emerald-700";
  if (score >= 700) return "bg-blue-100 text-blue-700";
  if (score >= 650) return "bg-amber-100 text-amber-700";
  return "bg-red-100 text-red-700";
};

export const ClientSelectionStep = ({
  clients,
  selectedClientId,
  onSelect,
  onNext,
  loading = false,
}: Props) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-2xl font-bold text-slate-900">
        Selecciona el Cliente
      </h2>

      {loading ? (
        <div className="py-12 text-center text-slate-500">Cargando clientes...</div>
      ) : (
        <div className="space-y-3">
          {clients.map((client) => {
            const isSelected = client.id === selectedClientId;

            return (
              <button
                key={client.id}
                type="button"
                onClick={() => onSelect(client)}
                className={`flex w-full items-center justify-between rounded-2xl border px-4 py-5 text-left transition ${
                  isSelected
                    ? "border-violet-600 bg-violet-50"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div>
                  <p className="text-xl font-semibold text-slate-900">
                    {getClientName(client)}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {client.documentNumber ?? "Sin documento"}
                  </p>
                </div>

                {client.score != null && (
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${getScoreColor(
                      client.score
                    )}`}
                  >
                    Score: {client.score}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={onNext}
          disabled={!selectedClientId}
          className="rounded-xl bg-violet-500 px-6 py-3 font-semibold text-white transition hover:bg-violet-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};