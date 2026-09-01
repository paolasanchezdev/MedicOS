// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/pacientes/registrar/components/CuentaMedicOSCard.tsx
// DESCRIPCIÓN: Configuración de cuenta de usuario MedicOS (Correo y contraseña).
// =========================================================================

import React from 'react';
import { Lock, Mail, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import type { PatientFormState } from '../../../../../../modules/patients';

interface CuentaMedicOSCardProps {
  formData: PatientFormState;
  setField: <K extends keyof PatientFormState>(field: K, value: PatientFormState[K]) => void;
  errors: Record<string, string>;
  checkingEmail: boolean;
  emailAvailability: boolean | null;
}

export const CuentaMedicOSCard: React.FC<CuentaMedicOSCardProps> = ({
  formData,
  setField,
  errors,
  checkingEmail,
  emailAvailability,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-5">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
        <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#2B7A78]">
          <Lock className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            2. Cuenta de Acceso MedicOS
          </h2>
          <p className="text-xs text-slate-500">Credenciales con las que el paciente consultará su portal.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Correo Electrónico */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Correo Electrónico <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setField('email', e.target.value)}
              placeholder="paciente@correo.com"
              className={`w-full bg-slate-50/70 focus:bg-white border rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 transition-all ${
                errors.email
                  ? 'border-rose-400 focus:ring-rose-200'
                  : emailAvailability === true
                  ? 'border-emerald-400 focus:ring-emerald-200'
                  : 'border-slate-200/80 focus:ring-[#2B7A78]/20 focus:border-[#2B7A78]'
              }`}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {checkingEmail && <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />}
              {!checkingEmail && emailAvailability === true && (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              )}
              {!checkingEmail && emailAvailability === false && (
                <AlertCircle className="w-4 h-4 text-rose-600" />
              )}
            </div>
          </div>
          {errors.email && (
            <p className="text-[11px] font-semibold text-rose-500 mt-1">{errors.email}</p>
          )}
        </div>

        {/* Contraseña */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Contraseña <span className="text-rose-500">*</span>
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setField('password', e.target.value)}
            placeholder="Mínimo 6 caracteres"
            className={`w-full bg-slate-50/70 focus:bg-white border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 transition-all ${
              errors.password
                ? 'border-rose-400 focus:ring-rose-200'
                : 'border-slate-200/80 focus:ring-[#2B7A78]/20 focus:border-[#2B7A78]'
            }`}
          />
          {errors.password && (
            <p className="text-[11px] font-semibold text-rose-500 mt-1">{errors.password}</p>
          )}
        </div>

        {/* Confirmar Contraseña */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Confirmar Contraseña <span className="text-rose-500">*</span>
          </label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setField('confirmPassword', e.target.value)}
            placeholder="Repite la contraseña"
            className={`w-full bg-slate-50/70 focus:bg-white border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 transition-all ${
              errors.confirmPassword
                ? 'border-rose-400 focus:ring-rose-200'
                : 'border-slate-200/80 focus:ring-[#2B7A78]/20 focus:border-[#2B7A78]'
            }`}
          />
          {errors.confirmPassword && (
            <p className="text-[11px] font-semibold text-rose-500 mt-1">{errors.confirmPassword}</p>
          )}
        </div>
      </div>
    </div>
  );
};