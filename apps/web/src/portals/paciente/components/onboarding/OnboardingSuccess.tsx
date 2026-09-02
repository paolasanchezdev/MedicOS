// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/components/onboarding/OnboardingSuccess.tsx
// DESCRIPCIÓN: Pantalla final de revelación apoteósica del Carnet Digital Oficial.
// =========================================================================

import React from 'react';
import { Sparkles, ArrowRight, Printer } from 'lucide-react';
import { CarnetDigitalPaciente } from '../../../../shared/components/carnet';
import type { PatientRecord } from '../../../../modules/patients';

interface OnboardingSuccessProps {
  patient: PatientRecord;
  onContinue: () => void;
}

export const OnboardingSuccess: React.FC<OnboardingSuccessProps> = ({
  patient,
  onContinue,
}) => {
  const datosAdaptados = {
    expediente: patient.dui ? `EXP-2026-${patient.dui.slice(-4)}` : `EXP-${patient.id.slice(0, 6).toUpperCase()}`,
    dui: patient.dui || '00000000-0',
    nombres: patient.firstName,
    apellidos: patient.lastName,
    fechaNacimiento: patient.dateOfBirth,
    sexo: patient.sex,
    tipoSangre: patient.clinicalRecord?.bloodType || 'O+',
    telefono: patient.phone || 'No registrado',
    direccion: patient.address || 'El Salvador',
    distrito: patient.address,
    alergiasTexto: patient.clinicalRecord?.observations || 'Ninguna reportada',
    contactoEmergencia: {
      nombre: patient.emergencyName || 'No asignado',
      parentesco: patient.emergencyRelation || 'Familiar',
      telefono: patient.emergencyPhone || 'No registrado',
    },
  };

  return (
    <div className="p-6 sm:p-10 space-y-6 text-center animate-in zoom-in-95 fade-in duration-500 max-w-xl mx-auto">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200/80 shadow-xs animate-bounce">
        <Sparkles className="w-4 h-4 text-emerald-600" />
        <span>¡Expediente Activado Exitosamente!</span>
      </div>

      <div className="space-y-1">
        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Tu Carnet Digital Oficial
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          Has completado tu registro territorial con éxito. Tu credencial ya se encuentra protegida y verificada en la red de salud MedicOS.
        </p>
      </div>

      {/* Revelación del Carnet */}
      <div className="w-full transform transition-all duration-700 hover:scale-[1.02]">
        <CarnetDigitalPaciente paciente={datosAdaptados} hideControls={true} />
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
        <button
          type="button"
          onClick={() => window.print()}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-2xl transition cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Imprimir / Guardar PDF</span>
        </button>

        <button
          type="button"
          onClick={onContinue}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#00838F] hover:bg-[#006e78] text-white text-xs font-bold rounded-2xl transition-all shadow-lg shadow-teal-900/10 active:scale-98 cursor-pointer"
        >
          <span>Acceder a mi Portal de Salud</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};