// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/components/onboarding/OnboardingPaso3.tsx
// DESCRIPCIÓN: Paso 3 con tipografía clara y chips proporcionados sin recortes.
// =========================================================================

import React from 'react';
import { Droplet, ShieldAlert, Pill, FileText, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import type { OnboardingFormData } from '../../../../modules/patients';

interface OnboardingPaso3Props {
  formData: OnboardingFormData;
  loading: boolean;
  onChange: (field: keyof OnboardingFormData, value: string) => void;
  onBack: () => void;
}

const ALERGIAS_SUGERIDAS = ['Penicilina', 'Sulfas', 'AINEs', 'Mariscos', 'Ninguna'];
const ENFERMEDADES_SUGERIDAS = ['Hipertensión', 'Diabetes Tipo 2', 'Asma', 'Gastritis', 'Ninguna'];

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
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Grupo Sanguíneo */}
        <div className="space-y-1.5">
          <label className="block text-xs sm:text-[13px] font-semibold text-medicos-dark-blue">
            Grupo Sanguíneo y Factor Rh
          </label>
          <div className="relative">
            <Droplet className="w-4 h-4 text-medicos-teal absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={formData.bloodType}
              onChange={(e) => onChange('bloodType', e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-white/70 hover:bg-white/90 focus:bg-white backdrop-blur-md border border-white/90 focus:border-medicos-teal/70 focus:ring-4 focus:ring-medicos-teal/10 rounded-xl text-xs sm:text-sm font-medium text-slate-800 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] outline-none transition cursor-pointer"
            >
              <option value="UNKNOWN">Pendiente de determinación (Desconocido)</option>
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
        <div className="space-y-1.5">
          <label className="block text-xs sm:text-[13px] font-semibold text-medicos-dark-blue">
            Medicación Habitual
          </label>
          <div className="relative">
            <Pill className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Ej: Losartán 50mg, o Ninguna"
              value={formData.medication}
              onChange={(e) => onChange('medication', e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-white/70 hover:bg-white/90 focus:bg-white backdrop-blur-md border border-white/90 focus:border-medicos-teal/70 focus:ring-4 focus:ring-medicos-teal/10 rounded-xl text-xs sm:text-sm font-medium text-slate-800 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] outline-none transition"
            />
          </div>
        </div>

        {/* Alergias */}
        <div className="sm:col-span-2 space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs sm:text-[13px] font-semibold text-medicos-dark-blue">
              Alergias a Medicamentos o Alimentos
            </label>
            <span className="text-xs text-medicos-muted font-medium">Opcional</span>
          </div>
          <div className="relative">
            <ShieldAlert className="w-4 h-4 text-rose-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Ej: Penicilina, AINEs, Mariscos (o Ninguna)"
              value={formData.allergies}
              onChange={(e) => onChange('allergies', e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-white/70 hover:bg-white/90 focus:bg-white backdrop-blur-md border border-white/90 focus:border-medicos-teal/70 focus:ring-4 focus:ring-medicos-teal/10 rounded-xl text-xs sm:text-sm font-medium text-slate-800 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] outline-none transition"
            />
          </div>
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {ALERGIAS_SUGERIDAS.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => appendChipValue('allergies', a)}
                className="text-xs font-semibold bg-white/80 hover:bg-rose-50 hover:text-rose-700 border border-white/90 px-3 py-1 rounded-xl transition cursor-pointer shadow-2xs"
              >
                + {a}
              </button>
            ))}
          </div>
        </div>

        {/* Enfermedades Crónicas */}
        <div className="sm:col-span-2 space-y-1.5">
          <label className="block text-xs sm:text-[13px] font-semibold text-medicos-dark-blue">
            Condiciones o Enfermedades Crónicas
          </label>
          <input
            type="text"
            placeholder="Ej: Hipertensión Arterial, Diabetes Mellitus"
            value={formData.chronicDiseases}
            onChange={(e) => onChange('chronicDiseases', e.target.value)}
            className="w-full px-3 py-2.5 bg-white/70 hover:bg-white/90 focus:bg-white backdrop-blur-md border border-white/90 focus:border-medicos-teal/70 focus:ring-4 focus:ring-medicos-teal/10 rounded-xl text-xs sm:text-sm font-medium text-slate-800 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] outline-none transition"
          />
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {ENFERMEDADES_SUGERIDAS.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => appendChipValue('chronicDiseases', e)}
                className="text-xs font-semibold bg-white/80 hover:bg-medicos-light-bg hover:text-medicos-teal border border-white/90 px-3 py-1 rounded-xl transition cursor-pointer shadow-2xs"
              >
                + {e}
              </button>
            ))}
          </div>
        </div>

        {/* Observaciones */}
        <div className="sm:col-span-2 space-y-1.5">
          <label className="block text-xs sm:text-[13px] font-semibold text-medicos-dark-blue">
            Observaciones o Indicaciones de Salud
          </label>
          <div className="relative">
            <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Ej: Uso de marcapasos, cirugías previas, prótesis"
              value={formData.observations}
              onChange={(e) => onChange('observations', e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-white/70 hover:bg-white/90 focus:bg-white backdrop-blur-md border border-white/90 focus:border-medicos-teal/70 focus:ring-4 focus:ring-medicos-teal/10 rounded-xl text-xs sm:text-sm font-medium text-slate-800 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] outline-none transition"
            />
          </div>
        </div>
      </div>

      {/* Navegación */}
      <div className="flex items-center justify-between pt-3 border-t border-white/70">
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-medicos-dark-blue transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Anterior</span>
        </button>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-linear-to-r from-medicos-teal to-[#16646f] hover:from-[#186a75] hover:to-[#12535d] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-[0_6px_20px_rgba(30,127,140,0.25),inset_0_1px_1px_rgba(255,255,255,0.3)] transition active:scale-95 inline-flex items-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Guardando Ficha...</span>
            </>
          ) : (
            <>
              <span>¡Generar mi Carnet Digital!</span>
              <CheckCircle2 className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};