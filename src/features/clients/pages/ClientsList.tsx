import type { Client } from '@/shared/models/Client';
import { useEffect, useState } from 'react'
import { ClientForm } from './ClientForm';
import { ClientDetail } from './ClientDetail';
import { Edit, Eye, Loader2, Plus, Search } from 'lucide-react';
import { getClients } from '../services/clients.service';

export default function ClientsList() {

    const [busqueda, setBusqueda] = useState('');
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalClients, setTotalClients] = useState(0);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [modoEdicion, setEditMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [clients, setClients] = useState<Client[]>([]);

    const fetchEClients = async () => {
        try {
            setLoading(true);
            const data = await getClients(pageNumber, pageSize);
            setClients(data);
            setTotalClients(data.length || 0);
        } catch (error) {
            console.error("Error obteniendo empleados:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {

        fetchEClients();
    }, [pageNumber, pageSize]);
    const filteredClients = clients.filter((c) =>
        `${c.firstName} ${c.lastName} ${c.documentNumber} ${c.phone}`
            .toLowerCase()
            .includes(busqueda.toLowerCase())
    );

    const handleShowDetail = (cliente: Client) => {
        setSelectedClient(cliente);
        setEditMode(false);
    };

    const handleNewClient = () => {
        setSelectedClient(null);
        setShowForm(true);
        setEditMode(false);
    };

    const handleEditClient = (cliente: Client) => {
        setSelectedClient(cliente);
        setShowForm(true);
        setEditMode(true);
    };

    if (showForm) {
        return <ClientForm client={selectedClient} onCancelar={() => setShowForm(false)} onSuccess={() => { fetchEClients(); setShowForm(false); }} modoEdicion={modoEdicion} />;
    }

    if (selectedClient && !showForm) {
        return <ClientDetail clientId={selectedClient.id} onVolver={() => setSelectedClient(null)} onEditar={() => handleEditClient(selectedClient)} />;
    }

    return (
        <div className="p-4 lg:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-900">Gestión de Clientes</h2>
                    <p className="text-sm text-gray-500">
                        Total de registros: {totalClients}
                    </p>
                </div>
                <button
                    onClick={handleNewClient}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Nuevo Cliente
                </button>
            </div>

            {/* Búsqueda */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        placeholder="Buscar por nombre, cédula o teléfono..."
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
            </div>

            {/* Lista de Clientes */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {loading && (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                            <span className="text-sm font-medium text-gray-600">Cargando clientes...</span>
                        </div>
                    </div>
                )}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo de documento</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Documento</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Correo</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teléfono</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200">
                            {filteredClients.map((client) => (
                                <tr key={client.id} className="hover:bg-gray-50">

                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                        {client.id}
                                    </td>

                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {client.firstName + " " + client.lastName}
                                    </td>

                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {client.documentType}
                                    </td>

                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                        {client.documentNumber}
                                    </td>

                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {client.email}
                                    </td>

                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {client.phone}
                                    </td>


                                    {/* Acciones */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">

                                            <button
                                                onClick={() => handleShowDetail(client)}
                                                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                                                title="Ver"
                                            >
                                                <Eye className="w-6 h-6" />
                                            </button>

                                            <button
                                                onClick={() => handleEditClient(client)}
                                                className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                                                title="Editar"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </button>

                                        </div>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Paginación */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-700">
                        Página <span className="font-bold">{pageNumber}</span>
                    </span>

                    <div className="flex items-center gap-2">
                        <label htmlFor="pageSize" className="text-sm text-gray-600">Mostrar:</label>
                        <select
                            id="pageSize"
                            value={pageSize}
                            onChange={(e) => {
                                setPageSize(Number(e.target.value));
                                setPageNumber(1);
                            }}
                            className="text-sm border border-gray-300 rounded-md bg-white px-2 py-1 focus:ring-2 focus:ring-indigo-500 outline-none"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                    </div>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                    <button
                        disabled={pageNumber === 1 || loading}
                        onClick={() => setPageNumber(prev => prev - 1)}
                        className="flex-1 sm:flex-none px-4 py-2 border rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors text-sm font-medium"
                    >
                        Anterior
                    </button>

                    <button
                        disabled={clients.length < pageSize || loading}
                        onClick={() => setPageNumber(prev => prev + 1)}
                        className="flex-1 sm:flex-none px-4 py-2 border rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors text-sm font-medium"
                    >
                        Siguiente
                    </button>
                </div>
            </div>
        </div>


    );
}
