// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/components/onboarding/OnboardingPaso2.tsx
// DESCRIPCIÓN: Paso 2 optimizado sin scroll y con espaciados compactos estilo iOS.
// =========================================================================

import React, { useMemo } from 'react';
import { MapPin, HeartHandshake, Loader2, CheckCircle2 } from 'lucide-react';
import { TERRITORIO_EL_SALVADOR } from '../../../../shared/data/elSalvadorTerritory';
import type { OnboardingFormData } from '../../../../modules/patients';

interface OnboardingPaso2Props {
  formData: OnboardingFormData;
  loading: boolean;
  onChange: (field: keyof OnboardingFormData, value: string) => void;
  onBack: () => void;
}

export const OnboardingPaso2: React.FC<OnboardingPaso2Props> = ({
  formData,
  loading,
  onChange,
  onBack,
}) => {
  const departamentos = useMemo(() => {
    return TERRITORIO_EL_SALVADOR.map((d) => d.nombre);
  }, []);

  const municipios = useMemo(() => {
    const depData = TERRITORIO_EL_SALVADOR.find((d) => d.nombre === formData.department);
    return depData ? depData.municipios.map((m) => m.nombre) : [];
  }, [formData.department]);

  const distritos = useMemo(() => {
    const depData = TERRITORIO_EL_SALVADOR.find((d) => d.nombre === formData.department);
    if (!depData) return [];
    const munData = depData.municipios.find((m) => m.nombre === formData.municipality);
    return munData ? munData.distritos : [];
  }, [formData.department, formData.municipality]);

  const handleDepartmentChange = (newDep: string) => {
    onChange('department', newDep);
    const depData = TERRITORIO_EL_SALVADOR.find((d) => d.nombre === newDep);
    if (depData && depData.municipios.length > 0) {
      onChange('municipality', depData.municipios[0].nombre);
    }
  };

  const handleEmergencyPhoneInput = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 8);
    if (raw.length > 4) {
      onChange('emergencyPhone', `${raw.slice(0, 4)}-${raw.slice(4)}`);
    } else {
      onChange('emergencyPhone', raw);
    }
  };

  return (
    <div className="space-y-3 animate-in fade-in duration-200">
      {/* Grid compactado para evitar cualquier scroll */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {/* Departamento */}
        <div className="space-y-0.5">
          <label className="block text-[11px] font-semibold text-slate-700">
            Departamento
          </label>
          <select
            value={formData.department}
            onChange={(e) => handleDepartmentChange(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/15 outline-none transition cursor-pointer"
          >
            {departamentos.map((dep) => (
              <option key={dep} value={dep}>{dep}</option>
            ))}
          </select>
        </div>

        {/* Municipio */}
        <div className="space-y-0.5">
          <label className="block text-[11px] font-semibold text-slate-700">
            Municipio
          </label>
          <select
            value={formData.municipality}
            onChange={(e) => onChange('municipality', e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/15 outline-none transition cursor-pointer"
          >
            {municipios.map((mun) => (
              <option key={mun} value={mun}>{mun}</option>
            ))}
          </select>
        </div>

        {/* Distritos rápidos (Chips compactos) */}
        {distritos.length > 0 && (
          <div className="sm:col-span-2 space-y-1">
            <span className="text-[10px] font-semibold text-slate-400">
              Distritos sugeridos:
            </span>
            <div className="flex flex-wrap gap-1 max-h-12 overflow-y-auto">
              {distritos.map((dist) => (
                <button
                  key={dist}
                  type="button"
                  onClick={() => onChange('address', `Distrito ${dist}`)}
                  className="text-[9px] font-medium bg-slate-100 hover:bg-blue-50 hover:text-[#0071E3] border border-slate-200 px-2 py-0.5 rounded-lg transition cursor-pointer"
                >
                  + {dist}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Dirección exacta */}
        <div className="sm:col-span-2 space-y-0.5">
          <label className="block text-[11px] font-semibold text-slate-700">
            Comunidad, Barrio o Dirección <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              required
              placeholder="Ej: Barrio San José, Calle Central #12"
              value={formData.address}
              onChange={(e) => onChange('address', e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/15 outline-none transition"
            />
          </div>
        </div>

        {/* Grupo Sanguíneo */}
        <div className="space-y-0.5">
          <label className="block text-[11px] font-semibold text-slate-700">
            Grupo Sanguíneo
          </label>
          <select
            value={formData.bloodType}
            onChange={(e) => onChange('bloodType', e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/15 outline-none transition cursor-pointer"
          >
            <option value="UNKNOWN">Pendiente de determinación</option>
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

        {/* Vínculo */}
        <div className="space-y-0.5">
          <label className="block text-[11px] font-semibold text-slate-700">
            Parentesco de Contacto
          </label>
          <input
            type="text"
            placeholder="Ej: Madre, Padre, Cónyuge"
            value={formData.emergencyRelation}
            onChange={(e) => onChange('emergencyRelation', e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/15 outline-none transition"
          />
        </div>

        {/* Contacto Emergencia */}
        <div className="space-y-0.5">
          <label className="block text-[11px] font-semibold text-slate-700">
            Nombre Contacto de Urgencia
          </label>
          <div className="relative">
            <HeartHandshake className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Nombre de un familiar"
              value={formData.emergencyName}
              onChange={(e) => onChange('emergencyName', e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/15 outline-none transition"
            />
          </div>
        </div>

        {/* Teléfono Emergencia */}
        <div className="space-y-0.5">
          <label className="block text-[11px] font-semibold text-slate-700">
            Teléfono del Contacto
          </label>
          <input
            type="tel"
            placeholder="7000-0000"
            maxLength={9}
            value={formData.emergencyPhone}
            onChange={(e) => handleEmergencyPhoneInput(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/15 outline-none transition"
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition cursor-pointer"
        >
          Anterior
        </button>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-[#0071E3] hover:bg-[#005bb5] text-white text-xs font-semibold rounded-xl shadow-xs transition active:scale-95 inline-flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Generando...</span>
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