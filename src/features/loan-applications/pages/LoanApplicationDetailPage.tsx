import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { loanApplicationService } from "../services/loanApplication.service";
import type { LoanApplicationDetail } from "../types/loanApplication.types";

export default function LoanApplicationDetailPage() {
  const { id } = useParams();
  const [application, setApplication] = useState<LoanApplicationDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        setError(null);
        const data = await loanApplicationService.getById(id);
        setApplication(data);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar el detalle de la solicitud.");
      } finally {
        setIsLoading(false);
      }
    };

    void run();
  }, [id]);

  if (isLoading) return <p>Cargando detalle...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!application) return <p>No se encontró la solicitud.</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Detalle de solicitud</h1>
        <p className="text-sm text-slate-500">
          Información general de la solicitud de préstamo
        </p>
      </div>

      <div className="rounded-2xl border bg-white p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Info label="Cliente" value={application.clientName} />
          <Info label="Documento" value={application.documentNumber ?? "—"} />
          <Info label="Oficial" value={application.employeeId ?? "—"} />
          <Info label="Estado" value={application.applicationStatusName} />

          <Info
            label="Monto solicitado"
            value={
              typeof application.requestedAmount === "number"
                ? application.requestedAmount.toLocaleString("es-DO")
                : "—"
            }
          />

          <Info
            label="Monto aprobado"
            value={
              typeof application.approvedAmount === "number"
                ? application.approvedAmount.toLocaleString("es-DO")
                : "—"
            }
          />

          <Info
            label="Tasa de interés solicitada"
            value={
              typeof application.requestedInterestRate === "number"
                ? `${application.requestedInterestRate}%`
                : "—"
            }
          />

          <Info
            label="Tasa de interés aprobada"
            value={
              typeof application.approvedInterestRate === "number"
                ? `${application.approvedInterestRate}%`
                : "—"
            }
          />

          <Info
            label="Plazo solicitado"
            value={
              typeof application.requestTerm === "number"
                ? `${application.requestTerm} meses`
                : "—"
            }
          />

          <Info
            label="Plazo aprobado"
            value={
              typeof application.approvedTerm === "number"
                ? `${application.approvedTerm} meses`
                : "—"
            }
          />

          <Info label="Frecuencia de pago" value={application.paymentFrequency ?? "—"} />
          <Info label="Propósito" value={application.purpose || "—"} />
          <Info label="Motivo de rechazo" value={application.rejectionReason || "—"} />
          <Info label="Código de solicitud" value={application.applicationCode ?? "—"} />
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