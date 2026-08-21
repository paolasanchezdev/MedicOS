// apps/web/src/portals/admin/pages/establecimientos/hospitales/components/CreateHospitalModal.tsx
import React, { useState } from 'react';
import type { Hospital } from './HospitalTable';

export interface CreateHospitalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (hospitalData: Omit<Hospital, 'id'>) => void;
}

const DEPARTAMENTOS_SV = [
  'Ahuachapán',
  'Cabañas',
  'Chalatenango',
  'Cuscatlán',
  'La Libertad',
  'La Paz',
  'La Unión',
  'Morazán',
  'San Miguel',
  'San Salvador',
  'San Vicente',
  'Santa Ana',
  'Sonsonate',
  'Usulután',
];

export const CreateHospitalModal: React.FC<CreateHospitalModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<Omit<Hospital, 'id'>>({
    code: '',
    name: '',
    type: 'HOSPITAL',
    level: 'DEPARTMENTAL',
    department: 'San Salvador',
    municipality: 'San Salvador Centro',
    address: '',
    totalBeds: 0,
    availableBeds: 0,
    status: 'OPERATIONAL',
    phone: '',
    emergencyPhone: '',
    latitude: null,
    longitude: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: null,
    syncStatus: 'SYNCED',
    version: 1,
    originDeviceId: 'local-station',
    lastModifiedByDeviceId: 'local-station',
    lastModified: new Date().toISOString(),
  });

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();
    onSubmit({
      ...formData,
      createdAt: now,
      updatedAt: now,
      lastModified: now,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-8 animate-fade-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-800">
              Registrar Nuevo Hospital
            </h2>
            <p className="text-xs text-slate-500">
              Ingreso de establecimiento a la red oficial del MINSAL / ISSS
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 rounded-lg p-1 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Código Institucional
              </label>
              <input
                type="text"
                name="code"
                required
                placeholder="Ej: MINSAL-HN-043"
                value={formData.code}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Nombre del Hospital
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="Ej: Hospital Nacional San Rafael"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Nivel de Atención
              </label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
              >
                <option value="SPECIALIZED">Especializado</option>
                <option value="REGIONAL">Regional</option>
                <option value="DEPARTMENTAL">Departamental</option>
                <option value="BASIC">Básico</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Estado Operativo
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
              >
                <option value="OPERATIONAL">Operativo</option>
                <option value="FULL_CAPACITY">Capacidad Total</option>
                <option value="MAINTENANCE">Mantenimiento</option>
                <option value="INACTIVE">Inactivo</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Departamento
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
              >
                {DEPARTAMENTOS_SV.map((dep) => (
                  <option key={dep} value={dep}>
                    {dep}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Municipio
              </label>
              <input
                type="text"
                name="municipality"
                required
                placeholder="Ej: Santa Tecla"
                value={formData.municipality}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Dirección Exacta
              </label>
              <input
                type="text"
                name="address"
                required
                placeholder="Ej: Final 4ª Calle Poniente, Barrio El Calvario"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Teléfono Institucional
              </label>
              <input
                type="text"
                name="phone"
                placeholder="Ej: +503 2222-0000"
                value={formData.phone || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Teléfono de Emergencias
              </label>
              <input
                type="text"
                name="emergencyPhone"
                placeholder="Ej: +503 2222-0001"
                value={formData.emergencyPhone || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Camas Totales
              </label>
              <input
                type="number"
                name="totalBeds"
                min="0"
                required
                value={formData.totalBeds}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Camas Disponibles
              </label>
              <input
                type="number"
                name="availableBeds"
                min="0"
                required
                value={formData.availableBeds}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors shadow-xs"
            >
              Guardar Hospital
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};