import { useState, useEffect } from 'react';
import { CirclePlus, Search, Trash2, FilePenLine, Eye } from 'lucide-react';
import { Button, Modal } from '@/shared/components';
import type { Employee } from '@/shared/models/Employee';
import { getEmployees } from '@/shared/services/employees';
export function Employees() {
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const data = await getEmployees();
        setEmployees(data);
      } catch (error) {
        console.error("Error obteniendo empleados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // const prestamosFiltrados = mockPrestamos.filter((p: any) => {
  //   const matchEstado = filtroEstado === 'todos' || p.estado === filtroEstado;
  //   const matchBusqueda = p.clienteNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
  //     p.id.toLowerCase().includes(busqueda.toLowerCase());
  //   return matchEstado && matchBusqueda;
  // });

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Lista de empleados</h2>
        </div>
        <button onClick={() => setOpenModal(true)} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white 
        rounded-lg hover:bg-green-700 transition-colors">
          <CirclePlus className="w-4 h-4" />
          Agregar
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Cliente"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="todos">Todos</option>
              <option value="activo">Activos</option>
              <option value="vencido">Vencidos</option>
              <option value="pagado">Pagados</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="todos">Todos</option>
              <option value="activo">Activos</option>
              <option value="vencido">Vencidos</option>
              <option value="pagado">Pagados</option>
            </select>
          </div>
        </div>
      </div>


      {/* Tabla */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo de documento</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Documento</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Correo Electrónico</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dirección</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ciudad</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sector</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {employees.map((employee: any) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{employee.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{employee.firstName + " " + employee.lastName}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{employee.documentType}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{employee.documentNumber}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{employee.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600"> {employee.address.streetNumber + " " 
                  + employee.address.addressLine1 + " " 
                  + employee.address.addressLine2}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{employee.address.city}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{employee.address.region}</td>
                  {/* <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${employee.activo ? 'bg-green-100 text-green-700' :
                      'bg-red-100 text-red-700'
                      }`}>
                      {employee.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td> */}
                  <td className="flex h-16 w-16 items-center justify-center">
                    <a className="btn btn-sm btn-light-warning btn-icon mr-2">
                      <FilePenLine className="w-5 h-5 " />
                    </a>
                    <a className="btn btn-sm btn-light-info btn-icon mr-2">
                      <Eye className="w-5 h-5 " />
                    </a>
                    <a className="btn btn-sm btn-light-danger btn-icon mr-2">
                      <Trash2 className="w-5 h-5 " />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal
        open={openModal}
        title="Agregar empleado"
        onClose={() => setOpenModal(false)}
        size="xl"
        maxHeight="max-h-[90vh]"
        closeOnOverlayClick={false}
        footer={
          <>
            <Button onClick={() => setOpenModal(false)}>
              Cancelar
            </Button>
            <Button>
              Guardar
            </Button>
          </>
        }
      >
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">


          <div>
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <input
              type="text"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Apellido</label>
            <input
              type="text"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tipo de documento</label>
            <select
              className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
            >
              <option value="">Seleccione</option>
              <option value="cedula">Cédula</option>
              <option value="pasaporte">Pasaporte</option>
              <option value="rnc">RNC</option>
            </select>
          </div>


          <div>
            <label className="block text-sm font-medium mb-1">Número de documento</label>
            <input
              type="text"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>


          <div>
            <label className="block text-sm font-medium mb-1">Teléfono</label>
            <input
              type="text"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Rol</label>
            <select
              className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
            >
              <option value="">Seleccione</option>
              <option value="cedula">Cédula</option>
              <option value="pasaporte">Pasaporte</option>
              <option value="rnc">RNC</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Número de calle</label>
            <input
              type="text"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Dirección Línea 1</label>
            <input
              type="text"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Dirección Línea 2</label>
            <input
              type="text"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Ciudad</label>
            <input
              type="text"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Región</label>
            <input
              type="text"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Código Postal</label>
            <input
              type="text"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          {/* Image */}
          <div >
            <label className="block text-sm font-medium mb-1">Imagen</label>
            <input
              type="file"
              accept="image/*"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none"
            />
          </div>

        </form>
      </Modal>
    </div>
  );
}
