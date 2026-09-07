// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/components/onboarding/OnboardingPaso2.tsx
// DESCRIPCIÓN: Paso 2 con tipografía ampliada y selectores desplegables equilibrados.
// =========================================================================

import React, { useMemo } from 'react';
import { MapPin, HeartHandshake, ArrowRight, ArrowLeft, Navigation, Users, Phone } from 'lucide-react';
import { TERRITORIO_EL_SALVADOR } from '../../../../shared/data/elSalvadorTerritory';
import type { OnboardingFormData } from '../../../../modules/patients';

interface OnboardingPaso2Props {
  formData: OnboardingFormData;
  onChange: (field: keyof OnboardingFormData, value: string) => void;
  onBack: () => void;
  onNext: () => void;
}

const OPCIONES_PARENTESCO = [
  'Madre / Padre',
  'Madre',
  'Padre',
  'Cónyuge / Pareja',
  'Hijo / Hija',
  'Hermano / Hermana',
  'Abuelo / Abuela',
  'Tío / Tía',
  'Tutor / Custodio Legal',
  'Familiar',
  'Amigo(a) / Vecino(a)',
  'Otro',
];

export const OnboardingPaso2: React.FC<OnboardingPaso2Props> = ({
  formData,
  onChange,
  onBack,
  onNext,
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
      const firstMun = depData.municipios[0];
      onChange('municipality', firstMun.nombre);
      if (firstMun.distritos.length > 0) {
        onChange('district', firstMun.distritos[0]);
      }
    }
  };

  const handleMunicipalityChange = (newMun: string) => {
    onChange('municipality', newMun);
    const depData = TERRITORIO_EL_SALVADOR.find((d) => d.nombre === formData.department);
    const munData = depData?.municipios.find((m) => m.nombre === newMun);
    if (munData && munData.distritos.length > 0) {
      onChange('district', munData.distritos[0]);
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
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Departamento */}
        <div className="space-y-1.5">
          <label className="block text-xs sm:text-[13px] font-semibold text-medicos-dark-blue">
            Departamento <span className="text-rose-500">*</span>
          </label>
          <select
            value={formData.department}
            onChange={(e) => handleDepartmentChange(e.target.value)}
            className="w-full px-3 py-2.5 bg-white/70 hover:bg-white/90 focus:bg-white backdrop-blur-md border border-white/90 focus:border-medicos-teal/70 focus:ring-4 focus:ring-medicos-teal/10 rounded-xl text-xs sm:text-sm font-medium text-slate-800 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] outline-none transition cursor-pointer"
          >
            {departamentos.map((dep) => (
              <option key={dep} value={dep}>{dep}</option>
            ))}
          </select>
        </div>

        {/* Municipio */}
        <div className="space-y-1.5">
          <label className="block text-xs sm:text-[13px] font-semibold text-medicos-dark-blue">
            Municipio <span className="text-rose-500">*</span>
          </label>
          <select
            value={formData.municipality}
            onChange={(e) => handleMunicipalityChange(e.target.value)}
            className="w-full px-3 py-2.5 bg-white/70 hover:bg-white/90 focus:bg-white backdrop-blur-md border border-white/90 focus:border-medicos-teal/70 focus:ring-4 focus:ring-medicos-teal/10 rounded-xl text-xs sm:text-sm font-medium text-slate-800 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] outline-none transition cursor-pointer"
          >
            {municipios.map((mun) => (
              <option key={mun} value={mun}>{mun}</option>
            ))}
          </select>
        </div>

        {/* Distrito */}
        <div className="space-y-1.5">
          <label className="block text-xs sm:text-[13px] font-semibold text-medicos-dark-blue items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5 text-medicos-teal" />
            <span>Distrito Territorial</span> <span className="text-rose-500">*</span>
          </label>
          <select
            value={formData.district}
            onChange={(e) => onChange('district', e.target.value)}
            className="w-full px-3 py-2.5 bg-white/70 hover:bg-white/90 focus:bg-white backdrop-blur-md border border-white/90 focus:border-medicos-teal/70 focus:ring-4 focus:ring-medicos-teal/10 rounded-xl text-xs sm:text-sm font-medium text-slate-800 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] outline-none transition cursor-pointer"
          >
            {distritos.map((dist) => (
              <option key={dist} value={dist}>{dist}</option>
            ))}
          </select>
        </div>

        {/* Dirección Exacta */}
        <div className="space-y-1.5">
          <label className="block text-xs sm:text-[13px] font-semibold text-medicos-dark-blue">
            Dirección Exacta (Calle, Pasaje o Casa) <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-medicos-teal absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              required
              placeholder="Ej: Barrio San José, Calle Central #12"
              value={formData.address}
              onChange={(e) => onChange('address', e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-white/70 hover:bg-white/90 focus:bg-white backdrop-blur-md border border-white/90 focus:border-medicos-teal/70 focus:ring-4 focus:ring-medicos-teal/10 rounded-xl text-xs sm:text-sm font-medium text-slate-800 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] outline-none transition"
            />
          </div>
        </div>

        {/* Separador de Urgencias */}
        <div className="sm:col-span-2 pt-1 border-t border-white/70">
          <span className="text-xs font-bold text-medicos-teal uppercase tracking-wider block">
            Contacto de Urgencia (Reverso del Carnet)
          </span>
        </div>

        {/* Nombre del Contacto */}
        <div className="space-y-1.5">
          <label className="block text-xs sm:text-[13px] font-semibold text-medicos-dark-blue">
            Nombre del Contacto
          </label>
          <div className="relative">
            <HeartHandshake className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Ej: Carlos Sánchez"
              value={formData.emergencyName}
              onChange={(e) => onChange('emergencyName', e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-white/70 hover:bg-white/90 focus:bg-white backdrop-blur-md border border-white/90 focus:border-medicos-teal/70 focus:ring-4 focus:ring-medicos-teal/10 rounded-xl text-xs sm:text-sm font-medium text-slate-800 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] outline-none transition"
            />
          </div>
        </div>

        {/* Parentesco */}
        <div className="space-y-1.5">
          <label className="block text-xs sm:text-[13px] font-semibold text-medicos-dark-blue">
            Parentesco o Vínculo
          </label>
          <div className="relative">
            <Users className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={formData.emergencyRelation}
              onChange={(e) => onChange('emergencyRelation', e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-white/70 hover:bg-white/90 focus:bg-white backdrop-blur-md border border-white/90 focus:border-medicos-teal/70 focus:ring-4 focus:ring-medicos-teal/10 rounded-xl text-xs sm:text-sm font-medium text-slate-800 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] outline-none transition cursor-pointer"
            >
              {OPCIONES_PARENTESCO.map((rel) => (
                <option key={rel} value={rel}>{rel}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Teléfono del Contacto */}
        <div className="sm:col-span-2 space-y-1.5">
          <label className="block text-xs sm:text-[13px] font-semibold text-medicos-dark-blue">
            Teléfono del Contacto
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="tel"
              placeholder="7000-0000"
              maxLength={9}
              value={formData.emergencyPhone}
              onChange={(e) => handleEmergencyPhoneInput(e.target.value)}
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
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-medicos-dark-blue transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Anterior</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="px-6 py-2.5 bg-linear-to-r from-medicos-teal to-[#16646f] hover:from-[#186a75] hover:to-[#12535d] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-[0_6px_20px_rgba(30,127,140,0.25),inset_0_1px_1px_rgba(255,255,255,0.3)] transition active:scale-95 inline-flex items-center gap-2 cursor-pointer"
        >
          <span>Siguiente: Información Médica</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};