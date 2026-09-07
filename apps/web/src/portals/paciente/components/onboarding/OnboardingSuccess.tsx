// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/components/onboarding/OnboardingSuccess.tsx
// DESCRIPCIÓN: Pantalla final sin scrollbars: desempaqueta campos clínicos JSON,
//              extrae el distrito con precisión y despliega exclusivamente Giro 3D.
// =========================================================================

import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
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
  const cleanDui = patient.dui ? patient.dui.replace(/\D/g, '') : '';
  const expedienteGenerado = cleanDui.length >= 4 
    ? `EXP-2026-${cleanDui.slice(-4)}` 
    : `EXP-${patient.id.slice(0, 6).toUpperCase()}`;

  // 1. Extracción precisa del distrito territorial
  let distritoLimpio = 'San Miguel Tepezontes';
  if (patient.address) {
    const match = patient.address.match(/Distrito\s+([^,]+)/i);
    if (match) {
      distritoLimpio = match[1].trim();
    } else {
      const parts = patient.address.split(',').map((s) => s.trim());
      if (parts.length > 1) {
        distritoLimpio = parts[1].replace(/^Distrito\s+/i, '').trim();
      } else {
        distritoLimpio = parts[0].replace(/^Distrito\s+/i, '').trim();
      }
    }
  }

  // 2. Desempaquetado del JSON de observaciones clínicas
  let alergias = 'Ninguna';
  let enfermedades = 'Ninguna';
  let medicacion = 'Ninguna';
  let notas = 'Ninguna';

  if (patient.clinicalRecord?.observations) {
    const raw = patient.clinicalRecord.observations;
    if (typeof raw === 'string' && raw.trim().startsWith('{')) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          alergias = parsed.allergies || alergias;
          enfermedades = parsed.chronicDiseases || enfermedades;
          medicacion = parsed.medication || medicacion;
          notas = parsed.notes || parsed.observations || notas;
        }
      } catch {
        alergias = raw;
      }
    } else {
      alergias = raw;
    }
  }

  const datosAdaptados = {
    id: patient.id,
    expediente: expedienteGenerado,
    dui: patient.dui || 'Sin DUI',
    nombres: patient.firstName,
    apellidos: patient.lastName,
    fechaNacimiento: patient.dateOfBirth,
    sexo: patient.sex,
    tipoSangre: patient.clinicalRecord?.bloodType || 'O+',
    telefono: patient.phone || 'No registrado',
    direccion: patient.address || 'El Salvador',
    distrito: distritoLimpio,
    alergiasTexto: alergias,
    enfermedadesTexto: enfermedades,
    medicacionTexto: medicacion,
    observacionesTexto: notas,
    contactoEmergencia: {
      nombre: patient.emergencyName || 'No asignado',
      parentesco: patient.emergencyRelation || 'Familiar',
      telefono: patient.emergencyPhone || 'No registrado',
    },
  };

  return (
    <div className="p-5 sm:p-6 flex flex-col items-center justify-between space-y-3.5 w-full select-none">
      {/* Cabecera Concisa */}
      <div className="flex flex-col items-center gap-1 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-medicos-light-bg text-medicos-teal text-xs font-semibold border border-medicos-soft-border shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-medicos-teal" />
          <span>Ficha Territorial y Médica Activada</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-medicos-dark-blue tracking-tight">
          Tu Carnet Digital Oficial
        </h2>
        <p className="text-xs text-medicos-muted max-w-md leading-relaxed">
          Haz clic sobre la credencial para voltearla en 3D e inspeccionar tus datos clínicos.
        </p>
      </div>

      {/* Carnet en Modo Exclusivo 3D Proporcionado */}
      <div className="w-full flex justify-center items-center">
        <CarnetDigitalPaciente paciente={datosAdaptados} only3D={true} />
      </div>

      {/* Botón Principal */}
      <div className="w-full flex justify-center pt-2 border-t border-white/70">
        <button
          type="button"
          onClick={onContinue}
          className="inline-flex items-center justify-center gap-2 px-8 py-2.5 bg-linear-to-r from-medicos-teal to-[#16646f] hover:from-[#186a75] hover:to-[#12535d] text-white text-xs sm:text-sm font-semibold rounded-2xl shadow-[0_6px_20px_rgba(30,127,140,0.25),inset_0_1px_1px_rgba(255,255,255,0.3)] transition active:scale-95 cursor-pointer"
        >
          <ShieldCheck className="w-4 h-4 text-white" />
          <span>Ingresar a mi Portal de Paciente</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};