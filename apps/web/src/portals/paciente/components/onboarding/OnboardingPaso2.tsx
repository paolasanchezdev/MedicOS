// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/components/onboarding/OnboardingPaso2.tsx
// DESCRIPCIÓN: Paso 2 optimizado para celulares sin scroll vertical.
//              Cuadrícula 2x2 compacta con botones de navegación 100% visibles.
// =========================================================================

import React, { useMemo } from 'react';
import { MapPin, HeartHandshake, ArrowRight, ArrowLeft, Users, Phone } from 'lucide-react';
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
    <div className="space-y-2 sm:space-y-3.5">
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {/* Departamento */}
        <div className="space-y-1 sm:space-y-1.5">
          <label className="block text-[11px] sm:text-xs font-semibold text-medicos-dark-blue truncate">
            Departamento <span className="text-rose-500">*</span>
          </label>
          <select
            value={formData.department}
            onChange={(e) => handleDepartmentChange(e.target.value)}
            className="w-full px-2 sm:px-3 py-1.5 sm:py-2 bg-white/70 hover:bg-white/90 focus:bg-white backdrop-blur-md border border-white/90 focus:border-medicos-teal/70 focus:ring-2 focus:ring-medicos-teal/10 rounded-xl text-xs sm:text-sm font-medium text-slate-800 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] outline-none transition cursor-pointer"
          >
            {departamentos.map((dep) => (
              <option key={dep} value={dep}>{dep}</option>
            ))}
          </select>
        </div>

        {/* Municipio */}
        <div className="space-y-1 sm:space-y-1.5">
          <label className="block text-[11px] sm:text-xs font-semibold text-medicos-dark-blue truncate">
            Municipio <span className="text-rose-500">*</span>
          </label>
          <select
            value={formData.municipality}
            onChange={(e) => handleMunicipalityChange(e.target.value)}
            className="w-full px-2 sm:px-3 py-1.5 sm:py-2 bg-white/70 hover:bg-white/90 focus:bg-white backdrop-blur-md border border-white/90 focus:border-medicos-teal/70 focus:ring-2 focus:ring-medicos-teal/10 rounded-xl text-xs sm:text-sm font-medium text-slate-800 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] outline-none transition cursor-pointer"
          >
            {municipios.map((mun) => (
              <option key={mun} value={mun}>{mun}</option>
            ))}
          </select>
        </div>

        {/* Distrito */}
        <div className="space-y-1 sm:space-y-1.5">
          <label className="block text-[11px] sm:text-xs font-semibold text-medicos-dark-blue truncate">
            Distrito <span className="text-rose-500">*</span>
          </label>
          <select
            value={formData.district}
            onChange={(e) => onChange('district', e.target.value)}
            className="w-full px-2 sm:px-3 py-1.5 sm:py-2 bg-white/70 hover:bg-white/90 focus:bg-white backdrop-blur-md border border-white/90 focus:border-medicos-teal/70 focus:ring-2 focus:ring-medicos-teal/10 rounded-xl text-xs sm:text-sm font-medium text-slate-800 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] outline-none transition cursor-pointer"
          >
            {distritos.map((dist) => (
              <option key={dist} value={dist}>{dist}</option>
            ))}
          </select>
        </div>

        {/* Dirección Exacta */}
        <div className="space-y-1 sm:space-y-1.5">
          <label className="block text-[11px] sm:text-xs font-semibold text-medicos-dark-blue truncate">
            Dirección (Comunidad) <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <MapPin className="w-3.5 h-3.5 text-medicos-teal absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              required
              placeholder="Ej: Barrio El Centro #12"
              value={formData.address}
              onChange={(e) => onChange('address', e.target.value)}
              className="w-full pl-7 sm:pl-8 pr-1.5 py-1.5 sm:py-2 bg-white/70 hover:bg-white/90 focus:bg-white backdrop-blur-md border border-white/90 focus:border-medicos-teal/70 focus:ring-2 focus:ring-medicos-teal/10 rounded-xl text-xs sm:text-sm font-medium text-slate-800 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] outline-none transition"
            />
          </div>
        </div>

        {/* Separador Compacto de Contacto de Urgencia */}
        <div className="col-span-2 pt-1 border-t border-white/70 flex items-center gap-1.5">
          <HeartHandshake className="w-3.5 h-3.5 text-medicos-teal shrink-0" />
          <span className="text-[10px] sm:text-xs font-bold text-medicos-teal uppercase tracking-wider block truncate">
            Contacto de Urgencia (Reverso Carnet)
          </span>
        </div>

        {/* Nombre del Contacto */}
        <div className="space-y-1 sm:space-y-1.5">
          <label className="block text-[11px] sm:text-xs font-semibold text-medicos-dark-blue truncate">
            Nombre Contacto
          </label>
          <div className="relative">
            <HeartHandshake className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Ej: Carlos Sánchez"
              value={formData.emergencyName}
              onChange={(e) => onChange('emergencyName', e.target.value)}
              className="w-full pl-7 sm:pl-8 pr-1.5 py-1.5 sm:py-2 bg-white/70 hover:bg-white/90 focus:bg-white backdrop-blur-md border border-white/90 focus:border-medicos-teal/70 focus:ring-2 focus:ring-medicos-teal/10 rounded-xl text-xs sm:text-sm font-medium text-slate-800 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] outline-none transition"
            />
          </div>
        </div>

        {/* Parentesco */}
        <div className="space-y-1 sm:space-y-1.5">
          <label className="block text-[11px] sm:text-xs font-semibold text-medicos-dark-blue truncate">
            Parentesco
          </label>
          <div className="relative">
            <Users className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={formData.emergencyRelation}
              onChange={(e) => onChange('emergencyRelation', e.target.value)}
              className="w-full pl-7 sm:pl-8 pr-2 py-1.5 sm:py-2 bg-white/70 hover:bg-white/90 focus:bg-white backdrop-blur-md border border-white/90 focus:border-medicos-teal/70 focus:ring-2 focus:ring-medicos-teal/10 rounded-xl text-xs sm:text-sm font-medium text-slate-800 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] outline-none transition cursor-pointer"
            >
              {OPCIONES_PARENTESCO.map((rel) => (
                <option key={rel} value={rel}>{rel}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Teléfono del Contacto */}
        <div className="col-span-2 space-y-1 sm:space-y-1.5">
          <label className="block text-[11px] sm:text-xs font-semibold text-medicos-dark-blue truncate">
            Teléfono de Urgencia
          </label>
          <div className="relative">
            <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="tel"
              placeholder="7000-0000"
              maxLength={9}
              value={formData.emergencyPhone}
              onChange={(e) => handleEmergencyPhoneInput(e.target.value)}
              className="w-full pl-7 sm:pl-8 pr-1.5 py-1.5 sm:py-2 bg-white/70 hover:bg-white/90 focus:bg-white backdrop-blur-md border border-white/90 focus:border-medicos-teal/70 focus:ring-2 focus:ring-medicos-teal/10 rounded-xl text-xs sm:text-sm font-medium text-slate-800 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] outline-none transition"
            />
          </div>
        </div>
      </div>

      {/* Navegación con ambos botones visibles en pantalla */}
      <div className="flex items-center justify-between pt-2 sm:pt-2.5 border-t border-white/70">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1 px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-medicos-dark-blue transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Anterior</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="px-4 sm:px-5 py-1.5 sm:py-2 bg-linear-to-r from-medicos-teal to-[#16646f] hover:from-[#186a75] hover:to-[#12535d] text-white text-xs sm:text-sm font-bold rounded-xl shadow-[0_4px_14px_rgba(30,127,140,0.22)] transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>Siguiente: Información Médica</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default OnboardingPaso2;