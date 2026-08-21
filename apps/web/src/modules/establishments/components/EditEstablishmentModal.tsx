// apps/web/src/modules/establishments/components/EditEstablishmentModal.tsx
import React, { useState } from 'react';
import type {
  Establishment,
  UpdateEstablishmentInput,
  EstablishmentLevel,
  EstablishmentStatus,
} from '../types/establishment.types';

export interface EditEstablishmentModalProps {
  establishment: Establishment;
  onClose: () => void;
  onSave: (payload: UpdateEstablishmentInput) => Promise<void>;
  loading?: boolean;
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

export const EditEstablishmentModal: React.FC<EditEstablishmentModalProps> = ({
  establishment,
  onClose,
  onSave,
  loading = false,
}) => {
  const [formData, setFormData] = useState<Establishment>(establishment);

  const isHospital = establishment.type === 'HOSPITAL';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      id: formData.id,
      name: formData.name,
      level: formData.level,
      status: formData.status,
      department: formData.department,
      municipality: formData.municipality,
      address: formData.address,
      phone: formData.phone ?? undefined,
      emergencyPhone: formData.emergencyPhone ?? undefined,
      totalBeds: formData.totalBeds,
      availableBeds: formData.availableBeds,
      latitude: formData.latitude ?? undefined,
      longitude: formData.longitude ?? undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-8 animate-fade-in">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-800">
              Editar {isHospital ? 'Hospital' : 'Establecimiento'}
            </h2>
            <p className="text-xs text-slate-500">
              Actualización de registro ({formData.code})
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition-colors text-lg font-bold"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Nombre
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Nivel de Atención
              </label>
              <select
                value={formData.level}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    level: e.target.value as EstablishmentLevel,
                  })
                }
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
              >
                <option value="BASIC">Básico (Nivel 1)</option>
                <option value="DEPARTMENTAL">Departamental (Nivel 2)</option>
                <option value="REGIONAL">Regional (Nivel 2)</option>
                <option value="SPECIALIZED">Especializado (Nivel 3)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Estado Operativo
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as EstablishmentStatus,
                  })
                }
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
              >
                <option value="OPERATIONAL">Operativo</option>
                <option value="FULL_CAPACITY">Capacidad Máxima</option>
                <option value="MAINTENANCE">Mantenimiento</option>
                <option value="INACTIVE">Inactivo</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Departamento
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
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
                required
                value={formData.municipality}
                onChange={(e) => setFormData({ ...formData, municipality: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Dirección Exacta
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Teléfono Institucional
              </label>
              <input
                type="text"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Teléfono de Emergencias
              </label>
              <input
                type="text"
                value={formData.emergencyPhone || ''}
                onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
              />
            </div>

            {isHospital && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Camas Totales
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.totalBeds}
                    onChange={(e) =>
                      setFormData({ ...formData, totalBeds: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Camas Disponibles
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.availableBeds}
                    onChange={(e) =>
                      setFormData({ ...formData, availableBeds: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                  />
                </div>
              </>
            )}
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
              disabled={loading}
              className="px-4 py-2 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 disabled:opacity-50 rounded-lg transition-colors shadow-xs"
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};