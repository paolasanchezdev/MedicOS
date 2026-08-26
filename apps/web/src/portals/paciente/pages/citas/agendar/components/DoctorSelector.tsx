// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/citas/agendar/components/DoctorSelector.tsx
// DESCRIPCIÓN: Selección de médicos con filtro de especialidades y tarjetas visuales.
// =========================================================================

import React, { useState, useMemo } from 'react';
import { Stethoscope, User, Loader2, CheckCircle2, Award } from 'lucide-react';

export interface DoctorItem {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  specialty?: string;
}

interface DoctorSelectorProps {
  doctores: DoctorItem[];
  selectedDoctorId: string;
  onSelectDoctor: (id: string) => void;
  isLoading: boolean;
}

const DEFAULT_SPECIALTIES = ['Todas', 'Medicina General', 'Pediatría', 'Medicina Interna', 'Ginecología'];

export const DoctorSelector: React.FC<DoctorSelectorProps> = ({
  doctores,
  selectedDoctorId,
  onSelectDoctor,
  isLoading,
}) => {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('Todas');

  const doctorsWithSpecialty = useMemo(() => {
    return doctores.map((doc, index) => {
      let spec = doc.specialty;
      if (!spec) {
        const fallbacks = ['Medicina General', 'Medicina General', 'Pediatría', 'Medicina Interna'];
        spec = fallbacks[index % fallbacks.length];
      }
      return { ...doc, specialty: spec };
    });
  }, [doctores]);

  const filteredDoctors = useMemo(() => {
    if (selectedSpecialty === 'Todas') return doctorsWithSpecialty;
    return doctorsWithSpecialty.filter((d) => d.specialty === selectedSpecialty);
  }, [doctorsWithSpecialty, selectedSpecialty]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-2.5">
        <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <Stethoscope size={15} className="text-[#0e7490]" />
          1. Médico o Especialista <span className="text-rose-600">*</span>
        </label>
        <span className="text-[11px] font-medium text-slate-500">
          {filteredDoctors.length} {filteredDoctors.length === 1 ? 'profesional disponible' : 'profesionales disponibles'}
        </span>
      </div>

      {/* Píldoras de Filtro por Especialidad */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
        {DEFAULT_SPECIALTIES.map((spec) => {
          const isActive = selectedSpecialty === spec;
          return (
            <button
              key={spec}
              type="button"
              onClick={() => setSelectedSpecialty(spec)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#0e7490] text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600'
              }`}
            >
              {spec}
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center gap-2.5 text-xs text-slate-500 py-8 bg-slate-50/60 rounded-2xl border border-slate-200/60">
          <Loader2 size={16} className="animate-spin text-[#0e7490]" />
          <span>Consultando catálogo de médicos...</span>
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div className="text-center py-6 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs text-slate-500">
          No hay médicos disponibles para la especialidad seleccionada.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredDoctors.map((doc) => {
            const isSelected = selectedDoctorId === doc.id;
            return (
              <div
                key={doc.id}
                onClick={() => onSelectDoctor(doc.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                  isSelected
                    ? 'bg-linear-to-r from-teal-50/90 to-cyan-50/60 border-[#0e7490] ring-2 ring-[#0e7490]/20 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-[#0e7490] text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                    }`}
                  >
                    <User size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-black text-slate-800 truncate">
                      Dr. {doc.firstName} {doc.lastName}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-teal-100/70 text-teal-800 text-[10px] font-extrabold">
                        <Award size={10} />
                        {doc.specialty}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 pl-2">
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                      isSelected
                        ? 'border-[#0e7490] bg-[#0e7490] text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && <CheckCircle2 size={13} className="stroke-3" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};