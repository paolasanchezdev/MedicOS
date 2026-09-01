// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/pacientes/registrar/components/DatosIdentificacionCard.tsx
// DESCRIPCIÓN: Captura de datos personales con máscara dinámica de DUI (00000000-0)
//              y validación asíncrona de disponibilidad en tiempo real.
// =========================================================================

import React from 'react';
import { User, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import type { PatientFormState } from '../../../../../../modules/patients';

interface DatosIdentificacionCardProps {
  formData: PatientFormState;
  setField: <K extends keyof PatientFormState>(field: K, value: PatientFormState[K]) => void;
  errors: Record<string, string>;
  checkingDui: boolean;
  duiAvailability: { available: boolean; patientName?: string } | null;
}

/**
 * Formatea dinámicamente el valor numérico al estándar de DUI salvadoreño: 00000000-0
 */
function formatearDUI(valor: string): string {
  // Extrae solo los dígitos numéricos y limita a un máximo de 9 dígitos
  const soloNumeros = valor.replace(/\D/g, '').slice(0, 9);

  // Si tiene 8 dígitos o menos, retorna solo los números ingresados
  if (soloNumeros.length <= 8) {
    return soloNumeros;
  }

  // Si llega al noveno dígito, inserta automáticamente el guion separador
  return `${soloNumeros.slice(0, 8)}-${soloNumeros.slice(8)}`;
}

export const DatosIdentificacionCard: React.FC<DatosIdentificacionCardProps> = ({
  formData,
  setField,
  errors,
  checkingDui,
  duiAvailability,
}) => {
  const handleDuiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valorFormateado = formatearDUI(e.target.value);
    setField('dui', valorFormateado);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-5">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
        <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#2B7A78]">
          <User className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            1. Datos de Identificación
          </h2>
          <p className="text-xs text-slate-500">Información personal formal del paciente.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* DUI con máscara automática y validación de disponibilidad */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            DUI (Documento Único de Identidad)
          </label>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              value={formData.dui}
              onChange={handleDuiChange}
              placeholder="00000000-0"
              maxLength={10}
              className={`w-full bg-slate-50/70 focus:bg-white border rounded-xl px-4 py-2.5 text-xs sm:text-sm font-mono text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 transition-all ${
                errors.dui
                  ? 'border-rose-400 focus:ring-rose-200'
                  : duiAvailability?.available && formData.dui.length === 10
                  ? 'border-emerald-400 focus:ring-emerald-200'
                  : 'border-slate-200/80 focus:ring-[#2B7A78]/20 focus:border-[#2B7A78]'
              }`}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              {checkingDui && <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />}
              {!checkingDui && duiAvailability?.available && formData.dui.length === 10 && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Disponible</span>
                </span>
              )}
              {!checkingDui && duiAvailability && !duiAvailability.available && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600">
                  <AlertCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Registrado</span>
                </span>
              )}
            </div>
          </div>
          {errors.dui && <p className="text-[11px] font-semibold text-rose-500 mt-1">{errors.dui}</p>}
        </div>

        {/* Nombres */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Nombres <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => setField('firstName', e.target.value)}
            placeholder="Ej. María Elena"
            className={`w-full bg-slate-50/70 focus:bg-white border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 transition-all ${
              errors.firstName
                ? 'border-rose-400 focus:ring-rose-200'
                : 'border-slate-200/80 focus:ring-[#2B7A78]/20 focus:border-[#2B7A78]'
            }`}
          />
          {errors.firstName && (
            <p className="text-[11px] font-semibold text-rose-500 mt-1">{errors.firstName}</p>
          )}
        </div>

        {/* Apellidos */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Apellidos <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => setField('lastName', e.target.value)}
            placeholder="Ej. Gómez Henríquez"
            className={`w-full bg-slate-50/70 focus:bg-white border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 transition-all ${
              errors.lastName
                ? 'border-rose-400 focus:ring-rose-200'
                : 'border-slate-200/80 focus:ring-[#2B7A78]/20 focus:border-[#2B7A78]'
            }`}
          />
          {errors.lastName && (
            <p className="text-[11px] font-semibold text-rose-500 mt-1">{errors.lastName}</p>
          )}
        </div>

        {/* Fecha de Nacimiento */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Fecha de Nacimiento <span className="text-rose-500">*</span>
          </label>
          <input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => setField('dateOfBirth', e.target.value)}
            className={`w-full bg-slate-50/70 focus:bg-white border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 transition-all ${
              errors.dateOfBirth
                ? 'border-rose-400 focus:ring-rose-200'
                : 'border-slate-200/80 focus:ring-[#2B7A78]/20 focus:border-[#2B7A78]'
            }`}
          />
          {errors.dateOfBirth && (
            <p className="text-[11px] font-semibold text-rose-500 mt-1">{errors.dateOfBirth}</p>
          )}
        </div>

        {/* Sexo */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Sexo Biológico <span className="text-rose-500">*</span>
          </label>
          <select
            value={formData.sex}
            onChange={(e) => setField('sex', e.target.value as PatientFormState['sex'])}
            className="w-full bg-slate-50/70 focus:bg-white border border-slate-200/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#2B7A78]/20 focus:border-[#2B7A78] transition-all cursor-pointer"
          >
            <option value="FEMALE">Femenino</option>
            <option value="MALE">Masculino</option>
            <option value="OTHER">Otro</option>
          </select>
        </div>
      </div>
    </div>
  );
};