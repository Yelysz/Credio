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
          <Info label="Documento" value={application.documentNumber} />
          <Info label="Oficial" value={application.employeeName} />
          <Info label="Estado" value={application.applicationStatus} />
          <Info
            label="Monto solicitado"
            value={
              typeof application.requestedAmount === "number"
                ? application.requestedAmount.toLocaleString("es-DO")
                : String(application.requestedAmount ?? "—")
            }
          />
          <Info
            label="Monto aprobado"
            value={
              typeof application.approvedAmount === "number"
                ? application.approvedAmount.toLocaleString("es-DO")
                : String(application.approvedAmount ?? "—")
            }
          />
          <Info
            label="Tasa de interés"
            value={
              typeof application.interestRate === "number"
                ? `${application.interestRate}%`
                : String(application.interestRate ?? "—")
            }
          />
          <Info
            label="Plazo"
            value={
              application.termMonths ? `${application.termMonths} meses` : "—"
            }
          />
          <Info label="Frecuencia de pago" value={application.paymentFrequency} />
          <Info label="Notas" value={application.notes} />
          <Info label="Motivo de rechazo" value={application.rejectionReason} />
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