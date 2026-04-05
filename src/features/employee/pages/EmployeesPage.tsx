import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEmployees } from "../hooks/useEmployees";

export default function EmployeesPage() {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");

  const { employees, isLoading, error, setParams, params, refetch } = useEmployees();

  const filteredEmployees = useMemo(() => {
    if (!searchInput.trim()) return employees;

    const q = searchInput.toLowerCase();

    return employees.filter((employee) => {
      const fullName =
        `${employee.firstName ?? ""} ${employee.lastName ?? ""} ${employee.name ?? ""}`.toLowerCase();

      return (
        fullName.includes(q) ||
        (employee.email ?? "").toLowerCase().includes(q) ||
        (employee.employeeCode ?? "").toLowerCase().includes(q)
      );
    });
  }, [employees, searchInput]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Empleados</h1>
          <p className="text-sm text-slate-500">Gestiona los empleados del sistema</p>
        </div>

        <button
          onClick={() => navigate("/employees/new")}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white"
        >
          Nuevo empleado
        </button>
      </div>

      <div className="rounded-2xl border bg-white p-4">
        <div className="mb-4 flex gap-3">
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Buscar por nombre, email o código"
            className="w-full rounded-xl border px-3 py-2 outline-none"
          />

          <button
            onClick={() =>
              setParams({
                ...params,
                pageNumber: 1,
              })
            }
            className="rounded-xl border px-4 py-2 text-sm"
          >
            Buscar
          </button>

          <button
            onClick={refetch}
            className="rounded-xl border px-4 py-2 text-sm"
          >
            Refrescar
          </button>
        </div>

        {isLoading && <p className="text-sm text-slate-500">Cargando empleados...</p>}

        {error && <p className="text-sm text-red-600">{error}</p>}

        {!isLoading && !error && filteredEmployees.length === 0 && (
          <p className="text-sm text-slate-500">No hay empleados registrados.</p>
        )}

        {!isLoading && !error && filteredEmployees.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                <tr className="text-left text-sm text-slate-500">
                  <th className="border-b px-4 py-3">Código</th>
                  <th className="border-b px-4 py-3">Nombre</th>
                  <th className="border-b px-4 py-3">Correo</th>
                  <th className="border-b px-4 py-3">Rol</th>
                  <th className="border-b px-4 py-3">Estado</th>
                  <th className="border-b px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee) => {
                  const fullName =
                    employee.name ||
                    `${employee.firstName ?? ""} ${employee.lastName ?? ""}`.trim() ||
                    "Sin nombre";

                  return (
                    <tr key={employee.id} className="text-sm">
                      <td className="border-b px-4 py-3">{employee.employeeCode ?? "—"}</td>
                      <td className="border-b px-4 py-3">{fullName}</td>
                      <td className="border-b px-4 py-3">{employee.email}</td>
                      <td className="border-b px-4 py-3">{employee.role ?? "—"}</td>
                      <td className="border-b px-4 py-3">{employee.status ?? "—"}</td>
                      <td className="border-b px-4 py-3">
                        <button
                          onClick={() => navigate(`/employees/${employee.id}`)}
                          className="rounded-lg border px-3 py-1 text-xs"
                        >
                          Ver detalle
                        </button>
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