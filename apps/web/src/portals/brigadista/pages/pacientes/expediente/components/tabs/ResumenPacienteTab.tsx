// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/pacientes/expediente/components/tabs/ResumenPacienteTab.tsx
// DESCRIPCIÓN: Ficha médica estructurada estilo EMR: lista continua de alta densidad,
//              optimizada para móviles sin cajas gigantes apiladas.
// =========================================================================

import React, { useMemo } from 'react';
import {
  User,
  HeartHandshake,
  FileCheck,
  ShieldAlert,
  Activity,
  Pill,
  Stethoscope,
} from 'lucide-react';
import type { PatientHistoryData } from '../../../../../../../modules/patients';

interface ResumenPacienteTabProps {
  historyData: PatientHistoryData;
}

function formatDate(d?: string | Date): string {
  if (!d) return 'Sin registrar';
  try {
    const dateObj = typeof d === 'string' ? new Date(d) : d;
    if (isNaN(dateObj.getTime())) return 'Sin registrar';
    return dateObj.toLocaleDateString('es-SV', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return 'Sin registrar';
  }
}

interface ParsedMetadata {
  allergies: string;
  chronicDiseases: string;
  medication: string;
}

function parseObservations(raw?: string | null): ParsedMetadata {
  const fallback: ParsedMetadata = {
    allergies: 'Ninguna reportada',
    chronicDiseases: 'Ninguna registrada',
    medication: 'Ninguna activa',
  };

  if (!raw || !raw.trim()) return fallback;

  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      return {
        allergies: (parsed.allergies || parsed.alergias || '').trim() || fallback.allergies,
        chronicDiseases: (parsed.chronicDiseases || parsed.enfermedadesCronicas || '').trim() || fallback.chronicDiseases,
        medication: (parsed.medication || parsed.medicamentos || '').trim() || fallback.medication,
      };
    }
  } catch {
    return { ...fallback, allergies: raw.trim() };
  }

  return fallback;
}

export const ResumenPacienteTab: React.FC<ResumenPacienteTabProps> = ({ historyData }) => {
  const { patient, consultations = [] } = historyData;

  // Filtrar para obtener la última consulta médica real
  const lastConsultation = useMemo(() => {
    return consultations.find(
      (c) =>
        !c.chiefComplaint?.includes('[VACUNACION]') &&
        !c.diagnosisDesc?.includes('[VACUNACION]')
    );
  }, [consultations]);

  const clinicalRecord = patient.clinicalRecord;
  const obs = useMemo(
    () => parseObservations(clinicalRecord?.observations),
    [clinicalRecord?.observations]
  );

  const nombreResponsable = lastConsultation?.doctor
    ? `${lastConsultation.doctor.firstName || ''} ${lastConsultation.doctor.lastName || ''}`.trim()
    : 'Personal Comunitario';

  const nombreBrigada = lastConsultation?.brigade?.name || 'Brigada Territorial';

  const direccionLimpia =
    patient?.address && !patient.address.toLowerCase().includes('pendiente')
      ? patient.address
      : 'Comunidad sin registrar';

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        {/* BLOQUE 1: FICHA DEMOGRÁFICA Y TERRITORIAL (LISTA CONTINUA) */}
        <section className="bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/80 p-3.5 sm:p-4 shadow-2xs">
          <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
            <div className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-[#1B5250] shadow-2xs shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                Ficha Demográfica y Territorial
              </h3>
              <p className="text-[10px] text-slate-400 font-medium">Información oficial del padrón</p>
            </div>
          </div>

          <dl className="divide-y divide-slate-100 text-xs">
            <div className="py-2 flex items-center justify-between gap-2">
              <dt className="text-slate-500 font-medium shrink-0">Nombre Completo</dt>
              <dd className="font-bold text-slate-900 text-right truncate">
                {patient?.firstName} {patient?.lastName}
              </dd>
            </div>

            <div className="py-2 flex items-center justify-between gap-2">
              <dt className="text-slate-500 font-medium shrink-0">Documento (DUI)</dt>
              <dd className="font-mono font-bold text-slate-800 text-right">
                {patient?.dui || 'Sin registrar'}
              </dd>
            </div>

            <div className="py-2 flex items-center justify-between gap-2">
              <dt className="text-slate-500 font-medium shrink-0">Fecha de Nacimiento</dt>
              <dd className="font-semibold text-slate-800 text-right">
                {formatDate(patient?.dateOfBirth)}
              </dd>
            </div>

            <div className="py-2 flex items-center justify-between gap-2">
              <dt className="text-slate-500 font-medium shrink-0">Teléfono Móvil</dt>
              <dd className="font-mono font-bold text-[#1B5250] text-right">
                {patient?.phone || 'No registrado'}
              </dd>
            </div>

            <div className="py-2 flex flex-col gap-0.5">
              <dt className="text-slate-500 font-medium">Comunidad / Dirección</dt>
              <dd className="font-medium text-slate-800 leading-snug wrap-break-word">
                {direccionLimpia}
              </dd>
            </div>
          </dl>
        </section>

        {/* BLOQUE 2: ANTECEDENTES Y ALERTAS CLÍNICAS */}
        <section className="bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/80 p-3.5 sm:p-4 shadow-2xs">
          <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
            <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700 shadow-2xs shrink-0">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                Antecedentes y Alertas Clínicas
              </h3>
              <p className="text-[10px] text-slate-400 font-medium">Historial verificado en expediente</p>
            </div>
          </div>

          <dl className="divide-y divide-slate-100 text-xs">
            <div className="py-2 flex items-center justify-between gap-2">
              <dt className="text-slate-500 font-medium flex items-center gap-1 shrink-0">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                <span>Alergias Conocidas</span>
              </dt>
              <dd
                className={`font-bold text-right truncate ${
                  obs.allergies !== 'Ninguna reportada' ? 'text-rose-700 font-black' : 'text-slate-800'
                }`}
              >
                {obs.allergies}
              </dd>
            </div>

            <div className="py-2 flex items-center justify-between gap-2">
              <dt className="text-slate-500 font-medium flex items-center gap-1 shrink-0">
                <Activity className="w-3.5 h-3.5 text-teal-600" />
                <span>Enfermedades Crónicas</span>
              </dt>
              <dd className="font-semibold text-slate-800 text-right truncate">
                {obs.chronicDiseases}
              </dd>
            </div>

            <div className="py-2 flex items-center justify-between gap-2">
              <dt className="text-slate-500 font-medium shrink-0">Antecedentes Familiares</dt>
              <dd className="font-medium text-slate-700 text-right truncate">
                {clinicalRecord?.familyHistory || 'Sin antecedentes'}
              </dd>
            </div>

            <div className="py-2 flex items-center justify-between gap-2">
              <dt className="text-slate-500 font-medium shrink-0">Antecedentes Quirúrgicos</dt>
              <dd className="font-medium text-slate-700 text-right truncate">
                {clinicalRecord?.surgicalHistory || 'Sin cirugías previas'}
              </dd>
            </div>

            <div className="py-2 flex items-center justify-between gap-2">
              <dt className="text-slate-500 font-medium flex items-center gap-1 shrink-0">
                <Pill className="w-3.5 h-3.5 text-teal-600" />
                <span>Medicación Habitual</span>
              </dt>
              <dd className="font-semibold text-slate-800 text-right truncate">
                {obs.medication}
              </dd>
            </div>
          </dl>
        </section>

        {/* BLOQUE 3: RED DE CONTACTO DE EMERGENCIA */}
        <section className="bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/80 p-3.5 sm:p-4 shadow-2xs">
          <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
            <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-2xs shrink-0">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                Contacto de Emergencia
              </h3>
              <p className="text-[10px] text-slate-400 font-medium">Referencia para avisos médicos</p>
            </div>
          </div>

          <dl className="divide-y divide-slate-100 text-xs">
            <div className="py-2 flex items-center justify-between gap-2">
              <dt className="text-slate-500 font-medium shrink-0">Persona Responsable</dt>
              <dd className="font-bold text-slate-900 text-right truncate">
                {patient?.emergencyName || 'No asignado'}
              </dd>
            </div>

            <div className="py-2 flex items-center justify-between gap-2">
              <dt className="text-slate-500 font-medium shrink-0">Parentesco / Vínculo</dt>
              <dd className="font-semibold text-slate-800 text-right">
                {patient?.emergencyRelation || 'No asignado'}
              </dd>
            </div>

            <div className="py-2 flex items-center justify-between gap-2">
              <dt className="text-slate-500 font-medium shrink-0">Teléfono SOS</dt>
              <dd className="font-mono font-black text-[#1B5250] text-right">
                {patient?.emergencyPhone || 'Sin registrar'}
              </dd>
            </div>
          </dl>
        </section>

        {/* BLOQUE 4: ÚLTIMO ENCUENTRO CLÍNICO EN BRIGADA */}
        <section className="bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/80 p-3.5 sm:p-4 shadow-2xs">
          <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-700 shadow-2xs shrink-0">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                Última Consulta Médica
              </h3>
              <p className="text-[10px] text-slate-400 font-medium">Atención diagnóstica reciente</p>
            </div>
          </div>

          {lastConsultation ? (
            <div className="pt-2 space-y-2 text-xs">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="font-bold text-slate-900 leading-tight">
                    {formatDate(lastConsultation.consultationDate)}
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium truncate">
                    {nombreBrigada}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-bold uppercase text-slate-400 block">Médico</span>
                  <p className="font-semibold text-slate-800 text-[11px] truncate">
                    {nombreResponsable}
                  </p>
                </div>
              </div>

              <div className="p-2.5 bg-teal-50/70 rounded-xl border border-teal-100">
                <span className="text-[9px] font-bold uppercase text-teal-800 block">
                  Diagnóstico / Motivo
                </span>
                <p className="font-black text-[#1B5250] text-xs mt-0.5 leading-snug">
                  {lastConsultation.diagnosisDesc || lastConsultation.chiefComplaint || 'Atención General'}
                </p>
              </div>
            </div>
          ) : (
            <div className="py-6 text-center space-y-1">
              <Stethoscope className="w-5 h-5 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-700">Sin consultas previas en brigada</p>
              <p className="text-[10px] text-slate-400">
                Los registros clínicos se generarán al documentar atenciones en terreno.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ResumenPacienteTab;