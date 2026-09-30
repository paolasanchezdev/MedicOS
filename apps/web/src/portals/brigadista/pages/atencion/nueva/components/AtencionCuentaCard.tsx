// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/atencion/nueva/components/AtencionCuentaCard.tsx
// DESCRIPCIÓN: Paso 8: Detección de cuenta existente de paciente con tarjeta oficial
//              de confirmación y protección estricta contra autofill del navegador.
// =========================================================================

import React from 'react';
import {
  Smartphone,
  Lock,
  Mail,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Info,
  KeyRound,
  FileCheck2,
  UserCheck,
} from 'lucide-react';
import type { CuentaPacienteFormState } from '../../../../../../modules/atencion/types/atencion.types';
import type { PatientRecord } from '../../../../../../modules/patients/types/patient.types';

interface AtencionCuentaCardProps {
  cuenta?: CuentaPacienteFormState;
  patient: PatientRecord | null;
  onChangeCuenta: (field: keyof CuentaPacienteFormState, value: boolean | string) => void;
  onContinuar: () => void;
  onOmitir: () => void;
}

export const AtencionCuentaCard: React.FC<AtencionCuentaCardProps> = ({
  cuenta = { crearCuenta: false, email: '', password: '', confirmPassword: '' },
  patient,
  onChangeCuenta,
  onContinuar,
  onOmitir,
}) => {
  const nombrePaciente = patient
    ? `${patient.firstName} ${patient.lastName}`.trim()
    : 'esta persona';

  // Detección estricta de cuenta existente
  const tieneCuenta = Boolean(patient?.userId || patient?.user?.email);
  const emailRegistrado = patient?.user?.email;

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/70 p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:border-slate-300 transition-all duration-200 h-full flex flex-col justify-between space-y-4">
      {/* 1. Cabecera */}
      <div className="space-y-3">
        <div className="flex items-center gap-3.5 border-b border-slate-100 pb-3">
          <div className="w-11 h-11 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-700 shadow-2xs shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 block">
              Paso 8 de 9 • Portal Digital del Paciente
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {tieneCuenta ? 'Cuenta Digital Verificada' : 'Acceso a la App MedicOS (Opcional)'}
            </h2>
          </div>
        </div>

        {/* Banner Informativo */}
        <div className="p-3.5 bg-teal-50/90 border border-teal-200/90 rounded-2xl flex items-start gap-3 shadow-2xs">
          <div className="w-8 h-8 rounded-xl bg-[#2B7A78] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
            <FileCheck2 className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-extrabold text-teal-900">
              {tieneCuenta ? 'Acceso Digital Habilitado' : '¿Para qué sirve este acceso?'}
            </h4>
            <p className="text-[11px] sm:text-xs text-teal-800 leading-relaxed mt-0.5">
              {tieneCuenta
                ? `${nombrePaciente} ya tiene credenciales de acceso activas. Podrá consultar inmediatamente los resultados de esta atención en su teléfono.`
                : 'Permite a la persona o a su responsable consultar su carnet de vacunas, recetas prescritas en esta brigada y fechas de seguimiento.'}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Cuerpo del Formulario */}
      <div className="flex-1 space-y-4 py-2">
        {tieneCuenta ? (
          /* CASO 1: LA PERSONA YA TIENE CUENTA REGISTRADA */
          <div className="p-5 sm:p-6 bg-emerald-50/90 border-2 border-emerald-200 rounded-3xl space-y-4 shadow-xs">
            <div className="flex items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider block">
                    Cuenta Digital MedicOS Activa
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                    {nombrePaciente}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">
                    Expediente vinculado al padrón nominal con usuario en la App
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold bg-white text-emerald-800 px-3.5 py-1.5 rounded-xl border border-emerald-300 shadow-2xs shrink-0">
                ACTIVA
              </span>
            </div>

            <div className="p-3.5 bg-white/90 rounded-2xl border border-emerald-200/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-bold text-slate-700">Usuario registrado:</span>
                <span className="text-xs font-mono font-extrabold text-emerald-900 truncate">
                  {emailRegistrado || 'Cuenta móvil vinculada'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Listo para sincronizar</span>
              </div>
            </div>

            <p className="text-xs text-emerald-900 leading-relaxed font-medium">
              No es necesario configurar ninguna contraseña. Esta atención se integrará automáticamente a su carnet y recetas al momento de guardar.
            </p>
          </div>
        ) : (
          /* CASO 2: LA PERSONA NO TIENE CUENTA (OPCIONAL CON BLOQUEO ANTI-AUTOFILL) */
          <div className="space-y-4">
            {/* Inputs señuelo ocultos para absorber autofill agresivo del navegador */}
            <div className="hidden" aria-hidden="true">
              <input type="text" name="medicos_dummy_username" tabIndex={-1} autoComplete="off" />
              <input type="password" name="medicos_dummy_password" tabIndex={-1} autoComplete="new-password" />
            </div>

            {/* Switch de activación voluntaria */}
            <div
              onClick={() => onChangeCuenta('crearCuenta', !cuenta.crearCuenta)}
              className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 shadow-2xs ${
                cuenta.crearCuenta
                  ? 'bg-teal-50/90 border-[#2B7A78] ring-2 ring-[#2B7A78]/20'
                  : 'bg-slate-50/80 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    cuenta.crearCuenta
                      ? 'bg-[#2B7A78] text-white shadow-xs'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">
                    Habilitar credenciales de acceso para {nombrePaciente}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Opcional. Si la persona no dispone de teléfono o correo, puedes omitir este paso sin afectar la atención.
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={cuenta.crearCuenta}
                onChange={() => {}}
                className="w-4 h-4 text-[#2B7A78] rounded-md focus:ring-teal-500 pointer-events-none"
              />
            </div>

            {/* Campos condicionales si el switch está activo */}
            {cuenta.crearCuenta && (
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3.5 animate-in fade-in duration-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Correo Electrónico de Contacto / Usuario del Paciente
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      inputMode="email"
                      name="medicos_patient_portal_email"
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck={false}
                      value={cuenta.email}
                      onChange={(e) => onChangeCuenta('email', e.target.value)}
                      placeholder="paciente@correo.com"
                      className="w-full text-xs sm:text-sm py-2 pl-10 pr-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900 placeholder-slate-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Contraseña Temporal
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="password"
                        name="medicos_patient_portal_password"
                        autoComplete="new-password"
                        autoCorrect="off"
                        spellCheck={false}
                        value={cuenta.password || ''}
                        onChange={(e) => onChangeCuenta('password', e.target.value)}
                        placeholder="Mínimo 6 caracteres"
                        className="w-full text-xs sm:text-sm py-2 pl-10 pr-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900 placeholder-slate-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Confirmar Contraseña
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="password"
                        name="medicos_patient_portal_password_confirm"
                        autoComplete="new-password"
                        autoCorrect="off"
                        spellCheck={false}
                        value={cuenta.confirmPassword || ''}
                        onChange={(e) => onChangeCuenta('confirmPassword', e.target.value)}
                        placeholder="Repite la contraseña"
                        className="w-full text-xs sm:text-sm py-2 pl-10 pr-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900 placeholder-slate-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>El paciente podrá actualizar esta contraseña tras su primer inicio de sesión.</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. Pie de Navegación */}
      <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 order-2 sm:order-1">
          <Info className="w-3.5 h-3.5 text-teal-600 shrink-0" />
          <span className="text-[11px] sm:text-xs">
            {tieneCuenta
              ? 'Cuenta nominal verificada en padrón territorial.'
              : 'Paso voluntario. No detiene ni condiciona el registro de la atención clínica.'}
          </span>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto order-1 sm:order-2 justify-end">
          {!tieneCuenta && (
            <button
              type="button"
              onClick={onOmitir}
              className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl transition cursor-pointer shadow-2xs"
            >
              Omitir por Ahora
            </button>
          )}
          <button
            type="button"
            onClick={onContinuar}
            className="px-5 py-2 bg-[#2B7A78] hover:bg-[#236866] text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5 active:scale-95"
          >
            <span>Continuar al Resumen</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AtencionCuentaCard;