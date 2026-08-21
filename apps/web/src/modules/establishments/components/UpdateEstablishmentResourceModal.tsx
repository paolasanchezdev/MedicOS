// apps/web/src/modules/establishments/components/UpdateEstablishmentResourceModal.tsx
import React, { useState } from 'react';
import type { EstablishmentResourceData } from '../types/establishment.types';

export interface UpdateEstablishmentResourceModalProps {
  item: EstablishmentResourceData | null;
  onClose: () => void;
  onSave: (updated: EstablishmentResourceData) => void;
  loading?: boolean;
}

interface FormContentProps {
  item: EstablishmentResourceData;
  onClose: () => void;
  onSave: (updated: EstablishmentResourceData) => void;
  loading: boolean;
}

const UpdateEstablishmentResourceForm: React.FC<FormContentProps> = ({
  item,
  onClose,
  onSave,
  loading,
}) => {
  const [formData, setFormData] = useState<EstablishmentResourceData>(item);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-fade-in my-8">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-800">
              Actualizar Dotación de Recursos
            </h2>
            <p className="text-xs text-slate-500">
              {item.establishment.name} ({item.establishment.code})
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg text-lg font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Ambulancias Totales
              </label>
              <input
                type="number"
                min="0"
                value={formData.ambulanciasTotales}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    ambulanciasTotales: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Ambulancias Disponibles
              </label>
              <input
                type="number"
                min="0"
                max={formData.ambulanciasTotales}
                value={formData.ambulanciasDisponibles}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    ambulanciasDisponibles: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Camas UCI Totales
              </label>
              <input
                type="number"
                min="0"
                value={formData.camasUCITotales}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    camasUCITotales: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Camas UCI Disponibles
              </label>
              <input
                type="number"
                min="0"
                max={formData.camasUCITotales}
                value={formData.camasUCIDisponibles}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    camasUCIDisponibles: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Cilindros de Oxígeno
              </label>
              <input
                type="number"
                min="0"
                value={formData.cilindrosOxigeno}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    cilindrosOxigeno: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Ventiladores Mecánicos
              </label>
              <input
                type="number"
                min="0"
                value={formData.ventiladoresMecanicos}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    ventiladoresMecanicos: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600"
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
              disabled={loading}
              className="px-4 py-2 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 disabled:opacity-50 rounded-lg transition-colors shadow-xs"
            >
              {loading ? 'Guardando...' : 'Guardar Recursos'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const UpdateEstablishmentResourceModal: React.FC<UpdateEstablishmentResourceModalProps> = ({
  item,
  onClose,
  onSave,
  loading = false,
}) => {
  if (!item) return null;

  return (
    <UpdateEstablishmentResourceForm
      key={item.establishment.id}
      item={item}
      onClose={onClose}
      onSave={onSave}
      loading={loading}
    />
  );
};