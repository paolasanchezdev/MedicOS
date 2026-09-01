// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/pacientes/expediente/components/tabs/ResumenPacienteTab.tsx
// DESCRIPCIÓN: Pestaña de información estructurada con protección total contra nulos en consultas y brigadas.
// =========================================================================

import React from 'react';
import { User, HeartHandshake, FileCheck } from 'lucide-react';
import type { PatientHistoryData } from '../../../../../../../modules/patients';

interface ResumenPacienteTabProps {
  historyData: PatientHistoryData;
}

function formatDate(d?: string | Date): string {
  if (!d) return '—';
  try {
    const dateObj = typeof d === 'string' ? new Date(d) : d;
    if (isNaN(dateObj.getTime())) return String(d);
    return dateObj.toLocaleDateString('es-SV', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return String(d);
  }
}

export const ResumenPacienteTab: React.FC<ResumenPacienteTabProps> = ({ historyData }) => {
  const { patient, consultations = [] } = historyData;
  const lastConsultation = consultations[0];

  const nombreResponsable = lastConsultation?.doctor
    ? `${lastConsultation.doctor.firstName || ''} ${lastConsultation.doctor.lastName || ''}`.trim()
    : 'Personal de Salud Comunitario';

  const nombreBrigada = lastConsultation?.brigade?.name || 'Atención Comunitaria en Terreno';

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Datos Personales y Contacto */}
        <div className="group bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/70 p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#1B5250] shadow-2xs">
                  <User className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Datos Personales y Contacto
                </h3>
              </div>
            </div>

            {/* Desglose de Campos */}
            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50/70 border border-slate-100 text-slate-600">
                <span className="font-medium">Nombre Completo</span>
                <span className="font-bold text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200/60 shadow-2xs">
                  {patient?.firstName} {patient?.lastName}
                </span>
              </div>

              <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50/70 border border-slate-100 text-slate-600">
                <span className="font-medium">Documento Único (DUI)</span>
                <span className="font-mono font-bold text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200/60 shadow-2xs">
                  {patient?.dui || 'Sin DUI'}
                </span>
              </div>

              <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50/70 border border-slate-100 text-slate-600">
                <span className="font-medium">Fecha de Nacimiento</span>
                <span className="font-medium text-slate-800 bg-white px-2.5 py-1 rounded-lg border border-slate-200/60 shadow-2xs">
                  {formatDate(patient?.dateOfBirth)}
                </span>
              </div>

              <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50/70 border border-slate-100 text-slate-600">
                <span className="font-medium">Teléfono de Contacto</span>
                <span className="font-mono font-bold text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200/60 shadow-2xs">
                  {patient?.phone || 'No registrado'}
                </span>
              </div>

              <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50/70 border border-slate-100 text-slate-600">
                <span className="font-medium">Dirección / Comunidad</span>
                <span
                  className="font-medium text-slate-800 bg-white px-2.5 py-1 rounded-lg border border-slate-200/60 shadow-2xs max-w-55 truncate"
                  title={patient?.address || ''}
                >
                  {patient?.address || 'No registrada'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Contacto de Emergencia */}
        <div className="group bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/70 p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-2xs">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Contacto de Emergencia
                </h3>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50/70 border border-slate-100 text-slate-600">
                <span className="font-medium">Nombre de Referencia</span>
                <span className="font-bold text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200/60 shadow-2xs">
                  {patient?.emergencyName || 'No asignado'}
                </span>
              </div>

              <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50/70 border border-slate-100 text-slate-600">
                <span className="font-medium">Parentesco / Vínculo</span>
                <span className="font-medium text-slate-800 bg-white px-2.5 py-1 rounded-lg border border-slate-200/60 shadow-2xs">
                  {patient?.emergencyRelation || 'Familiar'}
                </span>
              </div>

              <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50/70 border border-slate-100 text-slate-600">
                <span className="font-medium">Teléfono de Emergencia</span>
                <span className="font-mono font-bold text-[#1B5250] bg-white px-2.5 py-1 rounded-lg border border-slate-200/60 shadow-2xs">
                  {patient?.emergencyPhone || 'No registrado'}
                </span>
              </div>

              <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 text-[11px] text-slate-500 font-medium leading-relaxed">
                💡 Contacto formal para coordinar traslados y notificaciones clínicas en situaciones de urgencia.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Última Atención Registrada */}
      <div className="group bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/70 p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-slate-300 transition-all duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-700 shadow-2xs">
              <FileCheck className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Última Atención Registrada
            </h3>
          </div>
        </div>

        {lastConsultation ? (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                Fecha y Entorno
              </span>
              <p className="font-bold text-slate-900 mt-1">
                {formatDate(lastConsultation.consultationDate)}
              </p>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5 truncate" title={nombreBrigada}>
                {nombreBrigada}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                Diagnóstico / Motivo
              </span>
              <p className="font-bold text-[#1B5250] mt-1 truncate" title={lastConsultation.diagnosisDesc || ''}>
                {lastConsultation.diagnosisDesc || 'Atención General'}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                Registrado por
              </span>
              <p className="font-bold text-slate-900 mt-1 truncate" title={nombreResponsable}>
                {nombreResponsable}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-400 py-3 font-medium text-center">
            No se registran consultas médicas previas para este paciente.
          </p>
        )}
      </div>
    </div>
  );
};

export default ResumenPacienteTab;