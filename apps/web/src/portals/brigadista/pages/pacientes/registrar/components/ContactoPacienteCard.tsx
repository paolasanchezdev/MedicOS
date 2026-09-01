// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/pacientes/registrar/components/ContactoPacienteCard.tsx
// DESCRIPCIÓN: Formulario territorial que consume el catálogo compartido de El Salvador.
// =========================================================================

import React, { useMemo } from 'react';
import { Phone, MapPin, Building2, Map } from 'lucide-react';
import { TERRITORIO_EL_SALVADOR } from '../../../../../../shared/data/elSalvadorTerritory';
import type { PatientFormState } from '../../../../../../modules/patients';

interface ContactoPacienteCardProps {
  formData: PatientFormState;
  setField: <K extends keyof PatientFormState>(field: K, value: PatientFormState[K]) => void;
  errors: Record<string, string>;
}

function formatearTelefonoSV(valor: string): string {
  const soloNumeros = valor.replace(/\D/g, '').slice(0, 8);
  if (soloNumeros.length <= 4) {
    return soloNumeros;
  }
  return `${soloNumeros.slice(0, 4)}-${soloNumeros.slice(4)}`;
}

export const ContactoPacienteCard: React.FC<ContactoPacienteCardProps> = ({
  formData,
  setField,
  errors,
}) => {
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formateado = formatearTelefonoSV(e.target.value);
    setField('phone', formateado);
  };

  const departamentos = useMemo(() => TERRITORIO_EL_SALVADOR.map((d) => d.nombre), []);

  const municipiosDisponibles = useMemo(() => {
    const deptoActual = TERRITORIO_EL_SALVADOR.find((d) => d.nombre === formData.department);
    return deptoActual ? deptoActual.municipios.map((m) => m.nombre) : [];
  }, [formData.department]);

  const distritosDisponibles = useMemo(() => {
    const deptoActual = TERRITORIO_EL_SALVADOR.find((d) => d.nombre === formData.department);
    if (!deptoActual) return [];
    const mpioActual = deptoActual.municipios.find((m) => m.nombre === formData.municipality);
    return mpioActual ? mpioActual.distritos : [];
  }, [formData.department, formData.municipality]);

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nuevoDepto = e.target.value;
    setField('department', nuevoDepto);

    const deptoData = TERRITORIO_EL_SALVADOR.find((d) => d.nombre === nuevoDepto);
    if (deptoData && deptoData.municipios.length > 0) {
      const primerMunicipio = deptoData.municipios[0];
      setField('municipality', primerMunicipio.nombre);
      setField('district', primerMunicipio.distritos[0] || '');
    } else {
      setField('municipality', '');
      setField('district', '');
    }
  };

  const handleMunicipalityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nuevoMpio = e.target.value;
    setField('municipality', nuevoMpio);

    const deptoData = TERRITORIO_EL_SALVADOR.find((d) => d.nombre === formData.department);
    const mpioData = deptoData?.municipios.find((m) => m.nombre === nuevoMpio);
    if (mpioData && mpioData.distritos.length > 0) {
      setField('district', mpioData.distritos[0]);
    } else {
      setField('district', '');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-5">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
        <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#2B7A78]">
          <Map className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            3. Información de Contacto y Ubicación Territorial
          </h2>
          <p className="text-xs text-slate-500">
            División administrativa oficial de El Salvador para seguimiento territorial.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Teléfono Personal */}
        <div className="sm:col-span-2 lg:col-span-1">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Teléfono Personal
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="tel"
              inputMode="numeric"
              value={formData.phone}
              onChange={handlePhoneChange}
              placeholder="7123-4567"
              maxLength={9}
              className="w-full bg-slate-50/70 focus:bg-white border border-slate-200/80 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm font-mono text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#2B7A78]/20 focus:border-[#2B7A78] transition-all"
            />
          </div>
        </div>

        {/* Dirección Específica */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Dirección Específica (Calle / Pasaje / Casa) <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setField('address', e.target.value)}
              placeholder="Ej. Barrio El Centro, Calle Principal #12"
              className={`w-full bg-slate-50/70 focus:bg-white border rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 transition-all ${
                errors.address
                  ? 'border-rose-400 focus:ring-rose-200'
                  : 'border-slate-200/80 focus:ring-[#2B7A78]/20 focus:border-[#2B7A78]'
              }`}
            />
          </div>
          {errors.address && (
            <p className="text-[11px] font-semibold text-rose-500 mt-1">{errors.address}</p>
          )}
        </div>

        {/* 1. Departamento */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Departamento
          </label>
          <select
            value={formData.department}
            onChange={handleDepartmentChange}
            className="w-full bg-slate-50/70 focus:bg-white border border-slate-200/80 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#2B7A78]/20 focus:border-[#2B7A78] transition-all cursor-pointer"
          >
            {departamentos.map((depto) => (
              <option key={depto} value={depto}>
                {depto}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Municipio (44 Municipios) */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Municipio
          </label>
          <select
            value={formData.municipality}
            onChange={handleMunicipalityChange}
            disabled={municipiosDisponibles.length === 0}
            className="w-full bg-slate-50/70 focus:bg-white border border-slate-200/80 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#2B7A78]/20 focus:border-[#2B7A78] transition-all cursor-pointer disabled:opacity-50"
          >
            {municipiosDisponibles.map((mpio) => (
              <option key={mpio} value={mpio}>
                {mpio}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Distrito */}
        <div>
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-[#2B7A78]" />
            <span>Distrito</span>
          </label>
          <select
            value={formData.district}
            onChange={(e) => setField('district', e.target.value)}
            disabled={distritosDisponibles.length === 0}
            className="w-full bg-slate-50/70 focus:bg-white border border-slate-200/80 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#2B7A78]/20 focus:border-[#2B7A78] transition-all cursor-pointer disabled:opacity-50"
          >
            {distritosDisponibles.map((distrito) => (
              <option key={distrito} value={distrito}>
                {distrito}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};