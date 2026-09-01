// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/pacientes/registrar/components/ConfirmacionRegistroCard.tsx
// DESCRIPCIÓN: Resumen previo y consentimiento de registro para el Paso 5 con
//              formateo legible de grupo sanguíneo, teléfono y parentesco.
// =========================================================================

import React from 'react';
import { ShieldCheck, AlertCircle, User, Mail, MapPin, Heart, Phone, Users } from 'lucide-react';
import type { PatientFormState } from '../../../../../../modules/patients';

interface ConfirmacionRegistroCardProps {
  formData: PatientFormState;
  setField: <K extends keyof PatientFormState>(field: K, value: PatientFormState[K]) => void;
  errors: Record<string, string>;
  generalError: string | null;
}

const BLOOD_TYPE_LABELS: Record<string, string> = {
  O_POSITIVE: 'O+',
  O_NEGATIVE: 'O-',
  A_POSITIVE: 'A+',
  A_NEGATIVE: 'A-',
  B_POSITIVE: 'B+',
  B_NEGATIVE: 'B-',
  AB_POSITIVE: 'AB+',
  AB_NEGATIVE: 'AB-',
  UNKNOWN: 'Por determinar',
};

export const ConfirmacionRegistroCard: React.FC<ConfirmacionRegistroCardProps> = ({
  formData,
  setField,
  errors,
  generalError,
}) => {
  const bloodLabel = BLOOD_TYPE_LABELS[formData.bloodType] || 'Por determinar';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-5">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
        <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#2B7A78]">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Revisión de Información del Paciente
          </h2>
          <p className="text-xs text-slate-500">
            Verifica los datos antes de emitir el expediente y carnet digital.
          </p>
        </div>
      </div>

      {/* Resumen rápido de datos ingresados */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50/80 rounded-2xl border border-slate-200/60 text-xs">
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400">Paciente</span>
          <p className="font-extrabold text-slate-900 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-[#2B7A78]" />
            {formData.firstName || '—'} {formData.lastName || ''}
          </p>
          <p className="text-slate-600 font-mono">DUI: {formData.dui || 'Sin DUI registrado'}</p>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400">Cuenta de Usuario</span>
          <p className="font-bold text-slate-900 flex items-center gap-1.5 truncate">
            <Mail className="w-3.5 h-3.5 text-[#2B7A78]" />
            {formData.email || '—'}
          </p>
          <p className="text-emerald-700 font-semibold">Rol: Paciente (PATIENT)</p>
        </div>

        <div className="space-y-1 sm:col-span-2 pt-2 border-t border-slate-200/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-slate-700">
            <MapPin className="w-3.5 h-3.5 text-[#2B7A78] shrink-0" />
            <span className="truncate max-w-md">
              {formData.address}, {formData.district ? `${formData.district}, ` : ''}
              {formData.municipality}, {formData.department}
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-700 shrink-0">
            <span className="flex items-center gap-1 font-bold">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              Sangre: {bloodLabel}
            </span>
            {formData.phone && (
              <span className="flex items-center gap-1 font-mono">
                <Phone className="w-3.5 h-3.5 text-[#2B7A78]" />
                {formData.phone}
              </span>
            )}
          </div>
        </div>

        {/* Contacto de Emergencia en el Resumen si existe */}
        {formData.emergencyName && (
          <div className="sm:col-span-2 pt-2 border-t border-slate-200/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-slate-600">
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#2B7A78]" />
              <strong>Emergencia:</strong> {formData.emergencyName} ({formData.emergencyRelation || 'Contacto'})
            </span>
            {formData.emergencyPhone && (
              <span className="font-mono text-slate-800 font-bold">
                Tel: {formData.emergencyPhone}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Consentimiento */}
      <div className="flex items-start gap-3 p-4 bg-teal-50/50 rounded-xl border border-teal-100">
        <input
          type="checkbox"
          id="confirmarCheck"
          checked={formData.confirmed}
          onChange={(e) => setField('confirmed', e.target.checked)}
          className="w-4 h-4 rounded text-[#2B7A78] focus:ring-[#2B7A78] border-slate-300 cursor-pointer mt-0.5"
        />
        <label
          htmlFor="confirmarCheck"
          className="text-xs sm:text-sm font-bold text-slate-800 cursor-pointer leading-snug"
        >
          Confirmo que la información suministrada corresponde a la persona presente y autorizo la creación de su cuenta y expediente en MedicOS.
        </label>
      </div>

      {errors.confirmed && (
        <p className="text-xs font-semibold text-rose-500 pl-1">{errors.confirmed}</p>
      )}

      {generalError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-xs text-rose-700 font-semibold">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{generalError}</span>
        </div>
      )}
    </div>
  );
};