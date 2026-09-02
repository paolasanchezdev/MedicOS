// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/components/onboarding/OnboardingPaso1.tsx
// DESCRIPCIÓN: Paso 1 optimizado para ocupar exactamente el espacio sin dejar huecos.
// =========================================================================

import React from 'react';
import { Calendar, User, Phone, ArrowRight, Sparkles } from 'lucide-react';
import type { OnboardingFormData } from '../../../../modules/patients';

interface OnboardingPaso1Props {
  formData: OnboardingFormData;
  onChange: (field: keyof OnboardingFormData, value: string) => void;
  onNext: () => void;
}

export const OnboardingPaso1: React.FC<OnboardingPaso1Props> = ({
  formData,
  onChange,
  onNext,
}) => {
  const handleDuiInput = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 9);
    if (raw.length > 8) {
      onChange('dui', `${raw.slice(0, 8)}-${raw.slice(8)}`);
    } else {
      onChange('dui', raw);
    }
  };

  const handlePhoneInput = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 8);
    if (raw.length > 4) {
      onChange('phone', `${raw.slice(0, 4)}-${raw.slice(4)}`);
    } else {
      onChange('phone', raw);
    }
  };

  return (
    <div className="space-y-3 py-1">
      <div className="space-y-0.5">
        <div className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-medicos-teal">
          <Sparkles className="w-3 h-3" />
          <span>Fase 1 de 2 &bull; Identificación</span>
        </div>
        <h4 className="text-xs font-bold text-slate-800">
          Cuéntanos sobre ti
        </h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Fecha de Nacimiento */}
        <div className="space-y-1">
          <label className="block text-[11px] font-semibold text-slate-700">
            Fecha de Nacimiento <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="date"
              required
              value={formData.dateOfBirth}
              onChange={(e) => onChange('dateOfBirth', e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:border-medicos-teal focus:ring-2 focus:ring-medicos-teal/15 outline-none transition"
            />
          </div>
        </div>

        {/* DUI */}
        <div className="space-y-1">
          <label className="block text-[11px] font-semibold text-slate-700">
            Documento Único de Identidad (DUI)
          </label>
          <div className="relative">
            <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="00000000-0"
              maxLength={10}
              value={formData.dui}
              onChange={(e) => handleDuiInput(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium text-slate-800 focus:bg-white focus:border-medicos-teal focus:ring-2 focus:ring-medicos-teal/15 outline-none transition"
            />
          </div>
        </div>

        {/* Sexo Biológico */}
        <div className="space-y-1">
          <label className="block text-[11px] font-semibold text-slate-700">
            Sexo Biológico <span className="text-rose-500">*</span>
          </label>
          <select
            value={formData.sex}
            onChange={(e) => onChange('sex', e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:border-medicos-teal focus:ring-2 focus:ring-medicos-teal/15/15 outline-none transition cursor-pointer"
          >
            <option value="FEMALE">Femenino</option>
            <option value="MALE">Masculino</option>
            <option value="OTHER">Otro / Sin especificar</option>
          </select>
        </div>

        {/* Teléfono Personal */}
        <div className="space-y-1">
          <label className="block text-[11px] font-semibold text-slate-700">
            Teléfono Personal
          </label>
          <div className="relative">
            <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="tel"
              placeholder="7000-0000"
              maxLength={9}
              value={formData.phone}
              onChange={(e) => handlePhoneInput(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:border-medicos-teal focus:ring-2 focus:ring-medicos-teal/15 outline-none transition"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="button"
          onClick={onNext}
          className="px-5 py-2.5 bg-medicos-teal hover:bg-[#156772] text-white text-xs font-semibold rounded-xl shadow-xs transition active:scale-95 inline-flex items-center gap-1.5 cursor-pointer"
        >
          <span>Siguiente: Territorio y Urgencias</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};