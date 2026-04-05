import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useClients } from "../hooks/useClients";
import { useClientForm } from "../hooks/useClientForm";

export default function ClientsPage() {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");

  const { clients, isLoading, error, refetch, setClients } = useClients();
  const { deleteClient, isSubmitting } = useClientForm();

  const filteredClients = useMemo(() => {
    if (!searchInput.trim()) return clients;

    const q = searchInput.toLowerCase();

    return clients.filter((client) => {
      const fullName =
        `${client.firstName ?? ""} ${client.lastName ?? ""} ${client.fullName ?? ""} ${client.name ?? ""}`.toLowerCase();

      return (
        fullName.includes(q) ||
        (client.email ?? "").toLowerCase().includes(q) ||
        (client.documentNumber ?? "").toLowerCase().includes(q)
      );
    });
  }, [clients, searchInput]);

  const handleDelete = async (clientId: string) => {
    const confirmed = window.confirm("¿Seguro que deseas eliminar este cliente?");
    if (!confirmed) return;

    try {
      await deleteClient(clientId);
      setClients((prev) => prev.filter((client) => client.id !== clientId));
    } catch {
      // el error ya lo maneja el hook
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Clientes</h1>
          <p className="text-sm text-slate-500">
            Gestiona los clientes del sistema
          </p>
        </div>

        <button
          onClick={() => navigate("/clients/new")}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white"
        >
          Nuevo cliente
        </button>
      </div>

      <div className="rounded-2xl border bg-white p-4">
        <div className="mb-4 flex gap-3">
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Buscar por nombre, correo o documento"
            className="w-full rounded-xl border px-3 py-2 outline-none"
          />

          <button
            onClick={refetch}
            className="rounded-xl border px-4 py-2 text-sm"
          >
            Refrescar
          </button>
        </div>

        {isLoading && <p className="text-sm text-slate-500">Cargando clientes...</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}

        {!isLoading && !error && filteredClients.length === 0 && (
          <p className="text-sm text-slate-500">No hay clientes registrados.</p>
        )}

        {!isLoading && !error && filteredClients.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                <tr className="text-left text-sm text-slate-500">
                  <th className="border-b px-4 py-3">Nombre</th>
                  <th className="border-b px-4 py-3">Documento</th>
                  <th className="border-b px-4 py-3">Correo</th>
                  <th className="border-b px-4 py-3">Teléfono</th>
                  <th className="border-b px-4 py-3">Estado</th>
                  <th className="border-b px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client) => {
                  const fullName =
                    client.fullName ||
                    client.name ||
                    `${client.firstName ?? ""} ${client.lastName ?? ""}`.trim() ||
                    "Sin nombre";

                  return (
                    <tr key={client.id} className="text-sm">
                      <td className="border-b px-4 py-3">{fullName}</td>
                      <td className="border-b px-4 py-3">{client.documentNumber ?? "—"}</td>
                      <td className="border-b px-4 py-3">{client.email ?? "—"}</td>
                      <td className="border-b px-4 py-3">{client.phone ?? "—"}</td>
                      <td className="border-b px-4 py-3">{client.status ?? "—"}</td>
                      <td className="border-b px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/clients/${client.id}`)}
                            className="rounded-lg border px-3 py-1 text-xs"
                          >
                            Ver
                          </button>

                          <button
                            onClick={() => navigate(`/clients/${client.id}/edit`)}
                            className="rounded-lg border px-3 py-1 text-xs"
                          >
                            Editar
                          </button>

                          <button
                            disabled={isSubmitting}
                            onClick={() => handleDelete(client.id)}
                            className="rounded-lg border px-3 py-1 text-xs text-red-600 disabled:opacity-60"
                          >
                            Eliminar
                          </button>
                        </div>
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