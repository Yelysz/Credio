import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { employeeService } from "../services/employee.service";
import type { EmployeeDetail } from "../types/employee.types";

export default function EmployeeDetailPage() {
  const { id } = useParams();
  const [employee, setEmployee] = useState<EmployeeDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        setError(null);
        const data = await employeeService.getById(id);
        setEmployee(data);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar el detalle del empleado.");
      } finally {
        setIsLoading(false);
      }
    };

    void run();
  }, [id]);

  if (isLoading) return <p>Cargando detalle...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!employee) return <p>No se encontró el empleado.</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Detalle de empleado</h1>
        <p className="text-sm text-slate-500">
          Información general del empleado
        </p>
      </div>

      <div className="rounded-2xl border bg-white p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Info label="Código" value={employee.employeeCode} />
          <Info label="Nombre" value={employee.name ?? `${employee.firstName ?? ""} ${employee.lastName ?? ""}`} />
          <Info label="Correo" value={employee.email} />
          <Info label="Teléfono" value={employee.phone} />
          <Info label="Documento" value={employee.documentNumber} />
          <Info label="Rol" value={employee.role} />
          <Info label="Estado" value={employee.status} />
          <Info label="Dirección" value={employee.address} />
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