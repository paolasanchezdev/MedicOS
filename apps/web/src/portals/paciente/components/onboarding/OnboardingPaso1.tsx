// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/components/onboarding/OnboardingPaso1.tsx
// DESCRIPCIÓN: Paso 1 con tipografía ampliada y escala visual clara.
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
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Fecha de Nacimiento */}
        <div className="space-y-1.5">
          <label className="block text-xs sm:text-[13px] font-semibold text-medicos-dark-blue">
            Fecha de Nacimiento <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Calendar className="w-4 h-4 text-medicos-teal absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="date"
              required
              value={formData.dateOfBirth}
              onChange={(e) => onChange('dateOfBirth', e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-white/70 hover:bg-white/90 focus:bg-white backdrop-blur-md border border-white/90 focus:border-medicos-teal/70 focus:ring-4 focus:ring-medicos-teal/10 rounded-xl text-xs sm:text-sm font-medium text-slate-800 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] outline-none transition"
            />
          </div>
        </div>

        {/* DUI */}
        <div className="space-y-1.5">
          <label className="block text-xs sm:text-[13px] font-semibold text-medicos-dark-blue">
            Documento Único de Identidad (DUI)
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="00000000-0"
              maxLength={10}
              value={formData.dui}
              onChange={(e) => handleDuiInput(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-white/70 hover:bg-white/90 focus:bg-white backdrop-blur-md border border-white/90 focus:border-medicos-teal/70 focus:ring-4 focus:ring-medicos-teal/10 rounded-xl text-xs sm:text-sm font-mono font-medium text-slate-800 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] outline-none transition"
            />
          </div>
        </div>

        {/* Sexo Biológico */}
        <div className="space-y-1.5">
          <label className="block text-xs sm:text-[13px] font-semibold text-medicos-dark-blue">
            Sexo Biológico <span className="text-rose-500">*</span>
          </label>
          <select
            value={formData.sex}
            onChange={(e) => onChange('sex', e.target.value as 'MALE' | 'FEMALE' | 'OTHER')}
            className="w-full px-3 py-2.5 bg-white/70 hover:bg-white/90 focus:bg-white backdrop-blur-md border border-white/90 focus:border-medicos-teal/70 focus:ring-4 focus:ring-medicos-teal/10 rounded-xl text-xs sm:text-sm font-medium text-slate-800 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] outline-none transition cursor-pointer"
          >
            <option value="FEMALE">Femenino</option>
            <option value="MALE">Masculino</option>
            <option value="OTHER">Otro / Sin especificar</option>
          </select>
        </div>

        {/* Teléfono Personal */}
        <div className="space-y-1.5">
          <label className="block text-xs sm:text-[13px] font-semibold text-medicos-dark-blue">
            Teléfono Personal
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="tel"
              placeholder="7000-0000"
              maxLength={9}
              value={formData.phone}
              onChange={(e) => handlePhoneInput(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-white/70 hover:bg-white/90 focus:bg-white backdrop-blur-md border border-white/90 focus:border-medicos-teal/70 focus:ring-4 focus:ring-medicos-teal/10 rounded-xl text-xs sm:text-sm font-medium text-slate-800 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] outline-none transition"
            />
          </div>
        </div>

        {/* Tarjeta de Acreditación */}
        <div className="sm:col-span-2 p-3.5 bg-white/50 backdrop-blur-md rounded-2xl border border-white/80 shadow-[0_4px_16px_rgba(30,127,140,0.04)] flex items-start gap-3.5">
          <div className="p-2 rounded-xl bg-medicos-light-bg text-medicos-teal shrink-0 mt-0.5">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="space-y-0.5">
            <h4 className="text-xs sm:text-sm font-bold text-medicos-dark-blue">
              Acreditación de Identidad Nominal
            </h4>
            <p className="text-xs text-medicos-muted leading-relaxed">
              Tus datos de fecha de nacimiento y DUI se registrarán en la red del Sistema Nacional de Salud. En brigadas médicas territoriales podrás identificarte de forma inmediata presentando tu Carnet Digital con QR.
            </p>
          </div>
        </div>
      </div>

      {/* Navegación */}
      <div className="flex justify-end pt-3 border-t border-white/70">
        <button
          type="button"
          onClick={onNext}
          className="px-6 py-2.5 bg-linear-to-r from-medicos-teal to-[#16646f] hover:from-[#186a75] hover:to-[#12535d] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-[0_6px_20px_rgba(30,127,140,0.25),inset_0_1px_1px_rgba(255,255,255,0.3)] transition active:scale-95 inline-flex items-center gap-2 cursor-pointer"
        >
          <span>Siguiente: Territorio y Urgencias</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};