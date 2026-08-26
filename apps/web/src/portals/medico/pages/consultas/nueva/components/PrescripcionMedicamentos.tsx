// =========================================================================
// ARCHIVO: apps/web/src/portals/medico/pages/consultas/nueva/components/PrescripcionMedicamentos.tsx
// DESCRIPCIÓN: Constructor dinámico de prescripción médica con exportación estricta de tipos.
// =========================================================================

import React from 'react';
import { Pill, Plus, Trash2 } from 'lucide-react';

export interface PrescripcionItem {
  id: string;
  medicine: string;
  dose: string;
  route: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface PrescripcionMedicamentosProps {
  items: PrescripcionItem[];
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
  onUpdateItem: (id: string, field: keyof PrescripcionItem, value: string) => void;
  disabled: boolean;
}

const COMMON_MEDS = [
  'Paracetamol 500mg',
  'Ibuprofeno 400mg',
  'Amoxicilina 500mg',
  'Loratadina 10mg',
  'Omeprazol 20mg',
  'Salbutamol Aerosol',
  'Suero Oral (SRO)',
  'Metformina 850mg',
  'Enalapril 20mg',
];

export const PrescripcionMedicamentos: React.FC<PrescripcionMedicamentosProps> = ({
  items,
  onAddItem,
  onRemoveItem,
  onUpdateItem,
  disabled,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-2.5">
        <div>
          <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Pill size={15} className="text-[#0e7490]" />
            Prescripción y Farmacoterapia
          </span>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
            Medicamentos indicados con posología y duración del tratamiento.
          </p>
        </div>

        <button
          type="button"
          disabled={disabled}
          onClick={onAddItem}
          className="px-3.5 py-1.5 bg-[#0e7490] hover:bg-[#0891b2] disabled:bg-slate-200 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto shadow-2xs"
        >
          <Plus size={14} />
          <span>Agregar Medicamento</span>
        </button>
      </div>

      {/* Medicamentos Rápidos */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
        <span className="text-[10px] font-bold uppercase text-slate-400 shrink-0">Frecuentes:</span>
        {COMMON_MEDS.map((med) => (
          <button
            key={med}
            type="button"
            disabled={disabled}
            onClick={() => {
              onAddItem();
              setTimeout(() => {
                if (items.length > 0) {
                  onUpdateItem(items[items.length - 1].id, 'medicine', med);
                }
              }, 50);
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-[#0e7490] text-slate-600 text-[11px] font-bold whitespace-nowrap transition-colors cursor-pointer"
          >
            + {med}
          </button>
        ))}
      </div>

      {/* Lista de Fármacos */}
      {items.length === 0 ? (
        <div className="p-6 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-xs text-slate-500">
          No se han añadido medicamentos a la receta. Haz clic en <strong>Agregar Medicamento</strong> para prescribir.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="p-4 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-3 relative group"
            >
              <div className="flex items-center justify-between border-b border-slate-200/70 pb-2">
                <span className="text-xs font-bold text-slate-800">
                  Fármaco #{index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => onRemoveItem(item.id)}
                  className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition-colors cursor-pointer"
                  title="Eliminar medicamento"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 text-xs">
                {/* Medicamento */}
                <div className="sm:col-span-4">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                    Medicamento / Presentación <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Amoxicilina 500mg cápsulas"
                    value={item.medicine}
                    onChange={(e) => onUpdateItem(item.id, 'medicine', e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-teal-600"
                  />
                </div>

                {/* Dosis */}
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                    Dosis <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="1 cápsula"
                    value={item.dose}
                    onChange={(e) => onUpdateItem(item.id, 'dose', e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-teal-600"
                  />
                </div>

                {/* Frecuencia */}
                <div className="sm:col-span-3">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                    Frecuencia <span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={item.frequency}
                    onChange={(e) => onUpdateItem(item.id, 'frequency', e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-teal-600"
                  >
                    <option value="Cada 8 horas">Cada 8 horas (3 veces al día)</option>
                    <option value="Cada 12 horas">Cada 12 horas (2 veces al día)</option>
                    <option value="Cada 24 horas">Cada 24 horas (1 vez al día)</option>
                    <option value="Cada 6 horas">Cada 6 horas</option>
                    <option value="Dosis única">Dosis única</option>
                    <option value="Según sea necesario">Según sea necesario (PRN)</option>
                  </select>
                </div>

                {/* Duración */}
                <div className="sm:col-span-3">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                    Duración <span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={item.duration}
                    onChange={(e) => onUpdateItem(item.id, 'duration', e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-teal-600"
                  >
                    <option value="Por 3 días">Por 3 días</option>
                    <option value="Por 5 días">Por 5 días</option>
                    <option value="Por 7 días">Por 7 días</option>
                    <option value="Por 10 días">Por 10 días</option>
                    <option value="Por 14 días">Por 14 días</option>
                    <option value="Por 30 días">Por 30 días (Crónico)</option>
                    <option value="Dosis única">Dosis única</option>
                  </select>
                </div>

                {/* Instrucciones Adicionales */}
                <div className="sm:col-span-12">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                    Instrucciones para el Paciente (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Tomar después de las comidas con abundante agua."
                    value={item.instructions}
                    onChange={(e) => onUpdateItem(item.id, 'instructions', e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-hidden focus:border-teal-600"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PrescripcionMedicamentos;