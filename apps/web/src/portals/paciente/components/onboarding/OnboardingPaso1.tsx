// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/components/onboarding/OnboardingPaso1.tsx
// DESCRIPCIÓN: Paso 1 optimizado para móvil sin scroll vertical.
//              Cuadrícula 2x2 en celulares con botón 100% visible.
// =========================================================================

import React from 'react';
import { Calendar, User, Phone, ArrowRight, ShieldCheck } from 'lucide-react';
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
    <div className="space-y-2.5 sm:space-y-4">
      <div className="grid grid-cols-2 gap-2 sm:gap-3.5">
        {/* Fecha de Nacimiento */}
        <div className="space-y-1 sm:space-y-1.5">
          <label className="block text-[11px] sm:text-xs font-semibold text-medicos-dark-blue truncate">
            Nacimiento <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Calendar className="w-3.5 h-3.5 text-medicos-teal absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="date"
              required
              value={formData.dateOfBirth}
              onChange={(e) => onChange('dateOfBirth', e.target.value)}
              className="w-full pl-7 sm:pl-8 pr-1.5 py-1.5 sm:py-2 bg-white/70 hover:bg-white/90 focus:bg-white backdrop-blur-md border border-white/90 focus:border-medicos-teal/70 focus:ring-2 focus:ring-medicos-teal/10 rounded-xl text-xs sm:text-sm font-medium text-slate-800 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] outline-none transition"
            />
          </div>
        </div>

        {/* Sexo Biológico */}
        <div className="space-y-1 sm:space-y-1.5">
          <label className="block text-[11px] sm:text-xs font-semibold text-medicos-dark-blue truncate">
            Sexo Biológico <span className="text-rose-500">*</span>
          </label>
          <select
            value={formData.sex}
            onChange={(e) => onChange('sex', e.target.value as 'MALE' | 'FEMALE' | 'OTHER')}
            className="w-full px-2 sm:px-3 py-1.5 sm:py-2 bg-white/70 hover:bg-white/90 focus:bg-white backdrop-blur-md border border-white/90 focus:border-medicos-teal/70 focus:ring-2 focus:ring-medicos-teal/10 rounded-xl text-xs sm:text-sm font-medium text-slate-800 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] outline-none transition cursor-pointer"
          >
            <option value="FEMALE">Femenino</option>
            <option value="MALE">Masculino</option>
            <option value="OTHER">Otro</option>
          </select>
        </div>

        {/* Documento Único de Identidad (DUI) */}
        <div className="space-y-1 sm:space-y-1.5">
          <label className="block text-[11px] sm:text-xs font-semibold text-medicos-dark-blue truncate">
            DUI (Identidad)
          </label>
          <div className="relative">
            <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="00000000-0"
              maxLength={10}
              value={formData.dui}
              onChange={(e) => handleDuiInput(e.target.value)}
              className="w-full pl-7 sm:pl-8 pr-1.5 py-1.5 sm:py-2 bg-white/70 hover:bg-white/90 focus:bg-white backdrop-blur-md border border-white/90 focus:border-medicos-teal/70 focus:ring-2 focus:ring-medicos-teal/10 rounded-xl text-xs sm:text-sm font-mono font-medium text-slate-800 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] outline-none transition"
            />
          </div>
        </div>

        {/* Teléfono Personal */}
        <div className="space-y-1 sm:space-y-1.5">
          <label className="block text-[11px] sm:text-xs font-semibold text-medicos-dark-blue truncate">
            Teléfono Personal
          </label>
          <div className="relative">
            <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="tel"
              placeholder="7000-0000"
              maxLength={9}
              value={formData.phone}
              onChange={(e) => handlePhoneInput(e.target.value)}
              className="w-full pl-7 sm:pl-8 pr-1.5 py-1.5 sm:py-2 bg-white/70 hover:bg-white/90 focus:bg-white backdrop-blur-md border border-white/90 focus:border-medicos-teal/70 focus:ring-2 focus:ring-medicos-teal/10 rounded-xl text-xs sm:text-sm font-medium text-slate-800 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] outline-none transition"
            />
          </div>
        </div>

        {/* Tarjeta de Acreditación Compacta */}
        <div className="col-span-2 p-2 sm:p-2.5 bg-white/50 backdrop-blur-md rounded-xl border border-white/80 shadow-2xs flex items-center gap-2 sm:gap-2.5">
          <div className="p-1.5 rounded-lg bg-medicos-light-bg text-medicos-teal shrink-0">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <p className="text-[10.5px] sm:text-xs text-medicos-muted leading-tight">
            Tus datos autentican tu <strong>Carnet Digital con QR</strong> en brigadas médicas y consultas comunitarias.
          </p>
        </div>
      </div>

      {/* Navegación con botón visible */}
      <div className="pt-2 sm:pt-2.5 border-t border-white/70">
        <button
          type="button"
          onClick={onNext}
          className="w-full sm:w-auto sm:ml-auto px-5 py-2 sm:py-2.5 bg-linear-to-r from-medicos-teal to-[#16646f] hover:from-[#186a75] hover:to-[#12535d] text-white text-xs sm:text-sm font-bold rounded-xl shadow-[0_4px_14px_rgba(30,127,140,0.22)] transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Siguiente: Territorio y Urgencias</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default OnboardingPaso1;