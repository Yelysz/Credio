import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { clientService } from "../services/client.service";
import type { ClientDetail } from "../types/client.types";

export default function ClientDetailPage() {
  const { id } = useParams();
  const [client, setClient] = useState<ClientDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        setError(null);
        const data = await clientService.getById(id);
        setClient(data);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar el detalle del cliente.");
      } finally {
        setIsLoading(false);
      }
    };

    void run();
  }, [id]);

  if (isLoading) return <p>Cargando detalle...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!client) return <p>No se encontró el cliente.</p>;

  const fullName =
    client.fullName ||
    client.name ||
    `${client.firstName ?? ""} ${client.lastName ?? ""}`.trim() ||
    "Sin nombre";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Detalle de cliente</h1>
        <p className="text-sm text-slate-500">
          Información general del cliente
        </p>
      </div>

      <div className="rounded-2xl border bg-white p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Info label="Nombre" value={fullName} />
          <Info label="Correo" value={client.email} />
          <Info label="Teléfono" value={client.phone} />
          <Info label="Documento" value={client.documentNumber} />
          <Info label="Tipo de documento" value={client.documentType} />
          <Info label="Dirección" value={client.address} />
          <Info label="Estado" value={client.status} />
          <Info label="Ocupación" value={client.occupation} />
          <Info label="Empleador" value={client.employer} />
          <Info
            label="Ingreso mensual"
            value={
              typeof client.monthlyIncome === "number"
                ? client.monthlyIncome.toLocaleString("es-DO")
                : undefined
            }
          />
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-sm text-slate-800">{value || "—"}</p>
    </div>
  );
}