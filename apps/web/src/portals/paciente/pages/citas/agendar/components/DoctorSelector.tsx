// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/citas/agendar/components/DoctorSelector.tsx
// DESCRIPCIÓN: Catálogo de selección interactiva de médicos disponibles.
// =========================================================================

import React from 'react';
import { Stethoscope, User, Loader2 } from 'lucide-react';

export interface DoctorItem {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
}

interface DoctorSelectorProps {
  doctores: DoctorItem[];
  selectedDoctorId: string;
  onSelectDoctor: (id: string) => void;
  isLoading: boolean;
}

export const DoctorSelector: React.FC<DoctorSelectorProps> = ({
  doctores,
  selectedDoctorId,
  onSelectDoctor,
  isLoading,
}) => {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
        <Stethoscope size={14} className="text-[#0e7490]" />
        1. Selecciona al Médico o Especialista <span className="text-rose-600">*</span>
      </label>

      {isLoading ? (
        <div className="flex items-center gap-2 text-xs text-slate-500 p-3 bg-slate-50 rounded-xl">
          <Loader2 size={15} className="animate-spin text-[#0e7490]" />
          <span>Cargando médicos disponibles...</span>
        </div>
      ) : doctores.length === 0 ? (
        <p className="text-xs text-amber-700 bg-amber-50 p-3 rounded-xl border border-amber-200">
          No hay médicos activos disponibles en este momento.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {doctores.map((doc) => {
            const isSelected = selectedDoctorId === doc.id;
            return (
              <div
                key={doc.id}
                onClick={() => onSelectDoctor(doc.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                  isSelected
                    ? 'bg-teal-50/80 border-[#0e7490] ring-1 ring-[#0e7490] shadow-xs'
                    : 'bg-slate-50/60 border-slate-200 hover:bg-white hover:border-slate-300'
                }`}
              >
                <div
                  className={`p-2 rounded-lg ${
                    isSelected ? 'bg-[#0e7490] text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  <User size={16} />
                </div>
                <div className="truncate">
                  <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                    Dr. {doc.firstName} {doc.lastName}
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium truncate">{doc.email}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};