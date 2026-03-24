import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import type { Client } from '@/shared/models/Client';
import { createClient } from '../services/clients.service';


export const ClientForm = ({
  client,
  onCancelar,
  modoEdicion
}: {
  client: Client | null;
  onCancelar: () => void;
  modoEdicion: boolean;
}) => {

  const [formData, setFormData] = useState({
    firstName: client?.firstName || '',
    lastName: client?.lastName || '',
    age: client?.age || '',
    email: client?.email || '',
    documentType: client?.documentType || '',
    documentNumber: client?.documentNumber || '',
    phone: client?.phone || '',
    employeeId: client?.employeeId || '',
    homeLatitude: client?.homeLatitude || '',
    homeLongitude: client?.homeLongitude || '',
    image: null as File | null,

    addressDto: {
      streetNumber: client?.addressDto?.streetNumber || '',
      addressLine1: client?.addressDto?.addressLine1 || '',
      addressLine2: client?.addressDto?.addressLine2 || '',
      city: client?.addressDto?.city || '',
      region: client?.addressDto?.region || '',
      postalCode: client?.addressDto?.postalCode || '',
    }
  });

  const handleAddressChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      addressDto: {
        ...formData.addressDto,
        [field]: value
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const payload = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "addressDto" && key !== "image") {
        payload.append(key, String(value));
      }
    });

    Object.entries(formData.addressDto).forEach(([key, value]) => {
      payload.append(`addressDto.${key}`, value);
    });

    if (formData.image) {
      payload.append("image", formData.image);
    }

    const result = await createClient(payload);

    console.log("Cliente creado:", result);

    alert("Cliente registrado correctamente");
    onCancelar();

  } catch (error) {
    console.error("Error al crear cliente:", error);
    alert("Error al registrar cliente");
  }
};

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <button onClick={onCancelar} className="text-indigo-600 hover:text-indigo-700 font-medium">
        ← Cancelar
      </button>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          {modoEdicion ? 'Editar Cliente' : 'Nuevo Cliente'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* DATOS PERSONALES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <input
              placeholder="Nombre"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />

            <input
              placeholder="Apellido"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />

            <input
              type="number"
              placeholder="Edad"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />

            <select
              value={formData.documentType}
              onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="">Tipo Documento</option>
              <option value="Cedula">Cédula</option>
              <option value="Pasaporte">Pasaporte</option>
            </select>

            <input
              placeholder="Número de documento"
              value={formData.documentNumber}
              onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />

            <input
              placeholder="Teléfono"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />

            <input
              type="email"
              placeholder="Correo"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />

            <input
              placeholder="Empleado ID"
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />

            <input
              placeholder="Latitud"
              value={formData.homeLatitude}
              onChange={(e) => setFormData({ ...formData, homeLatitude: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />

            <input
              placeholder="Longitud"
              value={formData.homeLongitude}
              onChange={(e) => setFormData({ ...formData, homeLongitude: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* DIRECCIÓN */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              placeholder="Número de calle"
              value={formData.addressDto.streetNumber}
              onChange={(e) => handleAddressChange("streetNumber", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />

            <input
              placeholder="Dirección línea 1"
              value={formData.addressDto.addressLine1}
              onChange={(e) => handleAddressChange("addressLine1", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />

            <input
              placeholder="Dirección línea 2"
              value={formData.addressDto.addressLine2}
              onChange={(e) => handleAddressChange("addressLine2", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />

            <input
              placeholder="Ciudad"
              value={formData.addressDto.city}
              onChange={(e) => handleAddressChange("city", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />

            <input
              placeholder="Región"
              value={formData.addressDto.region}
              onChange={(e) => handleAddressChange("region", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />

            <input
              placeholder="Código Postal"
              value={formData.addressDto.postalCode}
              onChange={(e) => handleAddressChange("postalCode", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* IMAGEN */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-500 transition-colors cursor-pointer">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setFormData({ ...formData, image: file });
                }
              }}
            />
          </div>

          {/* BOTONES */}
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
};