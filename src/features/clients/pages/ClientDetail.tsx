import { Edit, Mail, MapPin, Phone, } from 'lucide-react';
import type { Client } from '@/shared/models/Client';

export const ClientDetail = ({ client, onVolver, onEditar }: { client: Client; onVolver: () => void; onEditar: () => void }) => {
  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={onVolver} className="text-indigo-600 hover:text-indigo-700 font-medium">
          ← Volver a la lista
        </button>
        <button
          onClick={onEditar}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Edit className="w-4 h-4" />
          Editar Cliente
        </button>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">{client.firstName + " " + client.lastName}</h2>
            <p className="text-sm text-gray-600">ID: {client.id}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">{client.documentType}</label>
              <p className="font-medium text-gray-900">{client.documentNumber}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Teléfono</label>
              <p className="font-medium text-gray-900 flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                {client.phone}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Correo Electrónico</label>
              <p className="font-medium text-gray-900 flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                {client.email}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">Dirección</label>
              <p className="font-medium text-gray-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                {client.addressId}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Expediente Digital */}
      {/* <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Expediente Digital</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {client.documentos.map((doc, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <FileText className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{doc}</p>
                <p className="text-xs text-gray-500">PDF • 2.4 MB</p>
              </div>
            </div>
          ))}
          <button className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-indigo-500 hover:text-indigo-600 transition-colors">
            <Upload className="w-5 h-5" />
            <span className="text-sm font-medium">Subir Documento</span>
          </button>
        </div>
      </div> */}
    </div>
  );
}
