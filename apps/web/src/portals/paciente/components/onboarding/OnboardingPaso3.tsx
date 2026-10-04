// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/components/onboarding/OnboardingPaso3.tsx
// DESCRIPCIÓN: Paso 3 optimizado para celular sin scroll vertical.
//              Cuadrícula 2x2 compacta con chips miniaturas y botón final visible.
// =========================================================================

import React from 'react';
import { Droplet, ShieldAlert, Pill, FileText, Loader2, CheckCircle2, ArrowLeft, HeartPulse } from 'lucide-react';
import type { OnboardingFormData } from '../../../../modules/patients';

interface OnboardingPaso3Props {
  formData: OnboardingFormData;
  loading: boolean;
  onChange: (field: keyof OnboardingFormData, value: string) => void;
  onBack: () => void;
}

const ALERGIAS_SUGERIDAS = ['Penicilina', 'Sulfas', 'AINEs', 'Mariscos', 'Ninguna'];
const ENFERMEDADES_SUGERIDAS = ['Hipertensión', 'Diabetes', 'Asma', 'Gastritis', 'Ninguna'];

export const OnboardingPaso3: React.FC<OnboardingPaso3Props> = ({
  formData,
  loading,
  onChange,
  onBack,
}) => {
  const appendChipValue = (field: 'allergies' | 'chronicDiseases', val: string) => {
    if (val === 'Ninguna') {
      onChange(field, 'Ninguna');
      return;
    }
    const current = formData[field]?.trim() || '';
    if (!current || current === 'Ninguna') {
      onChange(field, val);
      return;
    }
    const list = current.split(',').map((s) => s.trim());
    if (!list.includes(val)) {
      onChange(field, `${current}, ${val}`);
    }
  };

  return (
    <div className="space-y-2 sm:space-y-3.5">
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {/* Grupo Sanguíneo */}
        <div className="space-y-1 sm:space-y-1.5">
          <label className="block text-[11px] sm:text-xs font-semibold text-medicos-dark-blue truncate">
            Grupo Sanguíneo (Rh)
          </label>
          <div className="relative">
            <Droplet className="w-3.5 h-3.5 text-medicos-teal absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={formData.bloodType}
              onChange={(e) => onChange('bloodType', e.target.value)}
              className="w-full pl-7 sm:pl-8 pr-1.5 py-1.5 sm:py-2 bg-white/70 hover:bg-white/90 focus:bg-white backdrop-blur-md border border-white/90 focus:border-medicos-teal/70 focus:ring-2 focus:ring-medicos-teal/10 rounded-xl text-xs sm:text-sm font-medium text-slate-800 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] outline-none transition cursor-pointer"
            >
              <option value="UNKNOWN">Desconocido</option>
              <option value="O_POSITIVE">O Positivo (O+)</option>
              <option value="O_NEGATIVE">O Negativo (O-)</option>
              <option value="A_POSITIVE">A Positivo (A+)</option>
              <option value="A_NEGATIVE">A Negativo (A-)</option>
              <option value="B_POSITIVE">B Positivo (B+)</option>
              <option value="B_NEGATIVE">B Negativo (B-)</option>
              <option value="AB_POSITIVE">AB Positivo (AB+)</option>
              <option value="AB_NEGATIVE">AB Negativo (AB-)</option>
            </select>
          </div>
        </div>

        {/* Medicación Habitual */}
        <div className="space-y-1 sm:space-y-1.5">
          <label className="block text-[11px] sm:text-xs font-semibold text-medicos-dark-blue truncate">
            Medicación Habitual
          </label>
          <div className="relative">
            <Pill className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Ej: Losartán o Ninguna"
              value={formData.medication}
              onChange={(e) => onChange('medication', e.target.value)}
              className="w-full pl-7 sm:pl-8 pr-1.5 py-1.5 sm:py-2 bg-white/70 hover:bg-white/90 focus:bg-white backdrop-blur-md border border-white/90 focus:border-medicos-teal/70 focus:ring-2 focus:ring-medicos-teal/10 rounded-xl text-xs sm:text-sm font-medium text-slate-800 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] outline-none transition"
            />
          </div>
        </div>

        {/* Alergias */}
        <div className="space-y-1 sm:space-y-1.5">
          <label className="block text-[11px] sm:text-xs font-semibold text-medicos-dark-blue truncate">
            Alergias (Medicamentos/Otros)
          </label>
          <div className="relative">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Ej: Penicilina, Ninguna"
              value={formData.allergies}
              onChange={(e) => onChange('allergies', e.target.value)}
              className="w-full pl-7 sm:pl-8 pr-1.5 py-1.5 sm:py-2 bg-white/70 hover:bg-white/90 focus:bg-white backdrop-blur-md border border-white/90 focus:border-medicos-teal/70 focus:ring-2 focus:ring-medicos-teal/10 rounded-xl text-xs sm:text-sm font-medium text-slate-800 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] outline-none transition"
            />
          </div>
          <div className="flex flex-wrap gap-1 pt-0.5">
            {ALERGIAS_SUGERIDAS.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => appendChipValue('allergies', a)}
                className="text-[9.5px] sm:text-xs font-semibold bg-white/80 hover:bg-rose-50 hover:text-rose-700 border border-white/90 px-1.5 py-0.5 rounded-md transition cursor-pointer shadow-2xs"
              >
                +{a}
              </button>
            ))}
          </div>
        </div>

        {/* Enfermedades Crónicas */}
        <div className="space-y-1 sm:space-y-1.5">
          <label className="block text-[11px] sm:text-xs font-semibold text-medicos-dark-blue truncate">
            Condiciones Crónicas
          </label>
          <div className="relative">
            <HeartPulse className="w-3.5 h-3.5 text-medicos-teal absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Ej: HTA, Diabetes"
              value={formData.chronicDiseases}
              onChange={(e) => onChange('chronicDiseases', e.target.value)}
              className="w-full pl-7 sm:pl-8 pr-1.5 py-1.5 sm:py-2 bg-white/70 hover:bg-white/90 focus:bg-white backdrop-blur-md border border-white/90 focus:border-medicos-teal/70 focus:ring-2 focus:ring-medicos-teal/10 rounded-xl text-xs sm:text-sm font-medium text-slate-800 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] outline-none transition"
            />
          </div>
          <div className="flex flex-wrap gap-1 pt-0.5">
            {ENFERMEDADES_SUGERIDAS.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => appendChipValue('chronicDiseases', e)}
                className="text-[9.5px] sm:text-xs font-semibold bg-white/80 hover:bg-medicos-light-bg hover:text-medicos-teal border border-white/90 px-1.5 py-0.5 rounded-md transition cursor-pointer shadow-2xs"
              >
                +{e}
              </button>
            ))}
          </div>
        </div>

        {/* Observaciones */}
        <div className="col-span-2 space-y-1 sm:space-y-1.5">
          <label className="block text-[11px] sm:text-xs font-semibold text-medicos-dark-blue truncate">
            Observaciones o Indicaciones de Salud (Opcional)
          </label>
          <div className="relative">
            <FileText className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Ej: Cirugías previas, marcapasos o ninguna"
              value={formData.observations}
              onChange={(e) => onChange('observations', e.target.value)}
              className="w-full pl-7 sm:pl-8 pr-1.5 py-1.5 sm:py-2 bg-white/70 hover:bg-white/90 focus:bg-white backdrop-blur-md border border-white/90 focus:border-medicos-teal/70 focus:ring-2 focus:ring-medicos-teal/10 rounded-xl text-xs sm:text-sm font-medium text-slate-800 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] outline-none transition"
            />
          </div>
        </div>
      </div>

      {/* Navegación con botón final visible en pantalla */}
      <div className="flex items-center justify-between pt-2 sm:pt-2.5 border-t border-white/70">
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className="inline-flex items-center gap-1 px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-medicos-dark-blue transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Anterior</span>
        </button>

        <button
          type="submit"
          disabled={loading}
          className="px-4 sm:px-5 py-1.5 sm:py-2 bg-gradient-to-r from-medicos-teal to-[#16646f] hover:from-[#186a75] hover:to-[#12535d] text-white text-xs sm:text-sm font-bold rounded-xl shadow-[0_4px_14px_rgba(30,127,140,0.22)] transition active:scale-95 flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Guardando...</span>
            </>
          ) : (
            <>
              <span>¡Generar mi Carnet Digital!</span>
              <CheckCircle2 className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default OnboardingPaso3;