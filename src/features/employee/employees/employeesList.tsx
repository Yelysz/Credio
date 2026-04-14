import { useCallback, useEffect, useMemo, useState } from "react";
import { CirclePlus, Search, Trash2, FilePenLine, Eye, Loader2, Edit } from "lucide-react";
import { Button, Modal } from "@/shared/components";
import type { Employee } from "@/shared/models/Employee";
import {
  getEmployees,
  createEmployee,
  type CreateEmployeePayload,
} from "@/shared/services/employees";
import toast from "react-hot-toast";

type EmployeeWithFilters = Employee & {
  status?: string;
  estado?: string;
  role?: string;
  cargo?: string;
};

const initialForm: CreateEmployeePayload = {
  firstName: "",
  lastName: "",
  documentType: "",
  documentNumber: "",
  phone: "",
  email: "",
  role: "",
  address: {
    streetNumber: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    region: "",
    postalCode: "",
  },
  image: null,
};

export function Employees() {
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [filtroCargo, setFiltroCargo] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const [form, setForm] = useState<CreateEmployeePayload>(initialForm);

  const loadEmployees = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getEmployees(pageNumber, pageSize);

      setEmployees(Array.isArray(response.data) ? response.data : []);
      setTotalPages(response.totalPages ?? 1);
      setTotalRecords(response.totalRecords ?? 0);

      if (response.totalPages > 0 && pageNumber > response.totalPages) {
        setPageNumber(response.totalPages);
      }
    } catch (error) {
      console.error("Error obteniendo empleados:", error);
      setEmployees([]);
      setTotalPages(1);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  }, [pageNumber, pageSize]);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  const empleadosFiltrados = useMemo(() => {
    return (employees ?? []).filter((employee) => {
      const e = employee as EmployeeWithFilters;

      const nombreCompleto =
        `${employee.firstName ?? ""} ${employee.lastName ?? ""}`.toLowerCase();

      const documento = employee.documentNumber?.toLowerCase?.() ?? "";
      const correo = employee.email?.toLowerCase?.() ?? "";
      const textoBusqueda = busqueda.toLowerCase().trim();

      const matchBusqueda =
        !textoBusqueda ||
        nombreCompleto.includes(textoBusqueda) ||
        documento.includes(textoBusqueda) ||
        correo.includes(textoBusqueda);

      const employeeStatus =
        e.status?.toLowerCase() ?? e.estado?.toLowerCase() ?? "activo";

      const employeeRole =
        e.role?.toLowerCase() ?? e.cargo?.toLowerCase() ?? "sin-cargo";

      const matchEstado =
        filtroEstado === "todos" || employeeStatus === filtroEstado;

      const matchCargo =
        filtroCargo === "todos" || employeeRole === filtroCargo;

      return matchBusqueda && matchEstado && matchCargo;
    });
  }, [employees, busqueda, filtroEstado, filtroCargo]);

  const canGoPrevious = pageNumber > 1 && !loading;
  const canGoNext = pageNumber < totalPages && !loading;

  const closeModal = () => {
    setOpenModal(false);
    setForm(initialForm);
  };

  const handleInputChange = (
    field: keyof Omit<CreateEmployeePayload, "address" | "image">,
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddressChange = (
    field: keyof CreateEmployeePayload["address"],
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value,
      },
    }));
  };

  const handleSaveEmployee = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      await createEmployee(form);
      toast.success("Empleado registrado correctamente");

      closeModal();

      if (pageNumber !== 1) {
        setPageNumber(1);
      } else {
        await loadEmployees();
      }
    } catch (error) {
      console.error("Error creando empleado:", error);
      toast.error("Error al guardar el empleado");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Lista de empleados
          </h2>
          <p className="text-sm text-gray-500">
            Total de registros: {totalRecords}
          </p>
        </div>

        <button
          onClick={() => setOpenModal(true)}
          className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
        >
          <CirclePlus className="h-4 w-4" />
          Agregar
        </button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Buscar
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Nombre, documento o correo"
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Estado
            </label>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="todos">Todos</option>
              <option value="activo">Activos</option>
              <option value="inactivo">Inactivos</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Cargo
            </label>
            <select
              value={filtroCargo}
              onChange={(e) => setFiltroCargo(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="todos">Todos</option>
              <option value="administrator">Administrador</option>
              <option value="officer">Oficial</option>
              <option value="collector">Cobrador</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                <span className="text-sm font-medium text-gray-600">Cargando clientes...</span>
              </div>
            </div>
          ) : empleadosFiltrados.length === 0 ? (
            <div className="p-6 text-sm text-gray-500">
              No se encontraron empleados.
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                    Tipo de documento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                    Documento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                    Correo Electrónico
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {empleadosFiltrados.map((employee) => {
                  const direccion = employee.address
                    ? [
                      employee.address.streetNumber,
                      employee.address.addressLine1,
                      employee.address.addressLine2,
                    ]
                      .filter(Boolean)
                      .join(" ")
                    : "-";

                  return (
                    <tr key={employee.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {employee.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {employee.firstName} {employee.lastName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {employee.documentType}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {employee.documentNumber}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {employee.email}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">

                          <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                            title="Ver"
                          >
                            <Eye className="w-6 h-6" />
                          </button>

                          <button className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                            title="Editar"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            type="button"
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Eliminar"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>

                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className="flex flex-col gap-3 border-t border-gray-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-gray-600">
            Página <span className="font-semibold">{pageNumber}</span> de{" "}
            <span className="font-semibold">{totalPages}</span>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPageNumber(1);
              }}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>

            <button
              type="button"
              onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
              disabled={!canGoPrevious}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              Anterior
            </button>

            <button
              type="button"
              onClick={() =>
                setPageNumber((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={!canGoNext}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>

      <Modal
        open={openModal}
        title="Agregar empleado"
        onClose={closeModal}
        size="xl"
        maxHeight="max-h-[90vh]"
        closeOnOverlayClick={false}
        footer={
          <>
            <Button onClick={closeModal}>Cancelar</Button>
            <Button onClick={handleSaveEmployee} disabled={saving}>
              {saving ? "Guardando..." : "Guardar"}
            </Button>
          </>
        }
      >
        <form
          onSubmit={handleSaveEmployee}
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          <div>
            <label className="mb-1 block text-sm font-medium">Nombre</label>
            <input
              type="text"
              value={form.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Apellido</label>
            <input
              type="text"
              value={form.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Tipo de documento
            </label>
            <select
              value={form.documentType}
              onChange={(e) =>
                handleInputChange("documentType", e.target.value)
              }
              className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Seleccione</option>
              <option value="CEDULA">Cédula</option>
              <option value="Pasaporte">Pasaporte</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Documento</label>
            <input
              type="text"
              value={form.documentNumber}
              onChange={(e) =>
                handleInputChange("documentNumber", e.target.value)
              }
              className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Teléfono</label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Correo</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Rol</label>
            <select
              value={form.role}
              onChange={(e) => handleInputChange("role", e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Seleccione</option>
              <option value="administrator">Administrador</option>
              <option value="officer">Oficial</option>
              <option value="collector">Cobrador</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Número</label>
            <input
              type="text"
              value={form.address.streetNumber}
              onChange={(e) =>
                handleAddressChange("streetNumber", e.target.value)
              }
              className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Dirección 1
            </label>
            <input
              type="text"
              value={form.address.addressLine1}
              onChange={(e) =>
                handleAddressChange("addressLine1", e.target.value)
              }
              className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Dirección 2
            </label>
            <input
              type="text"
              value={form.address.addressLine2}
              onChange={(e) =>
                handleAddressChange("addressLine2", e.target.value)
              }
              className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Ciudad</label>
            <input
              type="text"
              value={form.address.city}
              onChange={(e) => handleAddressChange("city", e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Sector / Región
            </label>
            <input
              type="text"
              value={form.address.region}
              onChange={(e) => handleAddressChange("region", e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Código postal
            </label>
            <input
              type="text"
              value={form.address.postalCode}
              onChange={(e) =>
                handleAddressChange("postalCode", e.target.value)
              }
              className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium">Imagen</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  image: e.target.files?.[0] ?? null,
                }))
              }
              className="w-full rounded-lg border border-slate-200 px-3 py-2"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
