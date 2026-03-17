import React, { useState } from 'react'
import { Upload } from 'lucide-react';
import type { Client } from '@/shared/models/Client';

export const ClientForm = ({ client, onCancelar, modoEdicion }: { client: Client | null; onCancelar: () => void; modoEdicion: boolean }) => {
   const [formData, setFormData] = useState({
      name: client?.firstName  || '',
      lastName: client?.firstName  || '',
      documentNumber: client?.documentNumber || '',
      phone: client?.phone || '',
      email: client?.email || '',
      addressId: client?.addressId || ''
    });

     const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert(modoEdicion ? 'Cliente actualizado correctamente' : 'Cliente registrado correctamente');
        onCancelar();
      };
  
     return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={onCancelar} className="text-indigo-600 hover:text-indigo-700 font-medium">
          ← Cancelar
        </button>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          {modoEdicion ? 'Editar Cliente' : 'Nuevo Cliente'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre*
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apellido*
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Identificación*
              </label>
              <input
                type="text"
                value={formData.documentNumber}
                onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo Electrónico *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dirección Completa *
              </label>
              <textarea
                value={formData.addressId}
                onChange={(e) => setFormData({ ...formData, addressId: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>

          {/* Carga de Documentos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Documentos del Expediente
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-500 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-1">
                Arrastra archivos aquí o haz clic para seleccionar
              </p>
              <p className="text-xs text-gray-500">
                PDF, JPG, PNG (máx. 10MB por archivo)
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              {modoEdicion ? 'Actualizar Cliente' : 'Registrar Cliente'}
            </button>
            <button
              type="button"
              onClick={onCancelar}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
