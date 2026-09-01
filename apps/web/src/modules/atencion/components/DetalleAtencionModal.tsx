// =========================================================================
// ARCHIVO: apps/web/src/modules/atencion/components/DetalleAtencionModal.tsx
// DESCRIPCIÓN: Modal global de detalle de consulta/atención con parser estructurado SOAP,
//              widgets estilo Apple Health y trazabilidad clínica para todos los portales.
// =========================================================================

import React from 'react';
import {
  Stethoscope,
  Calendar,
  CalendarClock,
  CheckCircle2,
  Activity,
  HeartHandshake,
  Building2,
  X,
  User,
  MapPin,
  Clock,
  HeartPulse,
  Thermometer,
  Gauge,
  Scale,
  Ruler,
  AlertCircle,
  ShieldCheck,
  RotateCw,
  AlertTriangle,
} from 'lucide-react';

export interface AttentionPatientSummary {
  id?: string;
  firstName?: string;
  lastName?: string;
  dui?: string | null;
  phone?: string | null;
  address?: string | null;
  dateOfBirth?: string | null;
  sex?: string;
}

export interface AttentionDoctorSummary {
  id?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}

export interface AttentionBrigadeSummary {
  id?: string;
  name?: string;
  department?: string;
  municipality?: string;
}

export interface AttentionDetailItem {
  id: string;
  consultationDate: string | Date;
  status?: string;
  syncStatus?: 'SYNCED' | 'PENDING' | 'CONFLICT' | string;
  patient?: AttentionPatientSummary | null;
  doctor?: AttentionDoctorSummary | null;
  brigade?: AttentionBrigadeSummary | null;
  chiefComplaint?: string;
  physicalExam?: string;
  diagnosisCode?: string | null;
  diagnosisDesc?: string;
  treatmentPlan?: string;
  followUpDate?: string | Date | null;
  vitalSigns?: unknown;
}

export interface DetalleAtencionModalProps {
  attention: AttentionDetailItem | null;
  isOpen: boolean;
  onClose: () => void;
}

function formatDate(d?: string | Date | null): string {
  if (!d) return '—';
  try {
    const dateObj = typeof d === 'string' ? new Date(d) : d;
    if (isNaN(dateObj.getTime())) return String(d);
    return dateObj.toLocaleDateString('es-SV', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return String(d);
  }
}

function formatCategoryLabel(catRaw: string): string {
  const normalized = catRaw.toUpperCase().replace(/[[\]]/g, '').trim();
  const map: Record<string, string> = {
    MATERNO_INFANTIL: 'Materno-Infantil',
    MALESTAR_SINTOMAS: 'Malestar / Síntomas',
    SINTOMAS: 'Malestar / Síntomas',
    CONTROL_RUTINA: 'Control de Rutina',
    CRONICO: 'Control Crónico',
    SEGUIMIENTO: 'Seguimiento Territorial',
    VACUNACION_APOYO: 'Inmunización / Vacunas',
    VACUNACION: 'Inmunización / Vacunas',
    PREVENCION: 'Promoción y Prevención',
    ORIENTACION_SALUD: 'Orientación Sanitaria',
    PRIMEROS_AUXILIOS: 'Primeros Auxilios',
    GENERAL: 'Atención Comunitaria',
  };
  return map[normalized] || normalized.replace(/_/g, ' ');
}

export const DetalleAtencionModal: React.FC<DetalleAtencionModalProps> = ({
  attention,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !attention) return null;

  // 1. Identificación del Paciente, Profesional y Brigada
  const patientFullName = attention.patient
    ? `${attention.patient.firstName || ''} ${attention.patient.lastName || ''}`.trim()
    : 'Persona Atendida';

  const patientDui = attention.patient?.dui || undefined;

  const doctorFullName = attention.doctor
    ? `${attention.doctor.firstName || ''} ${attention.doctor.lastName || ''}`.trim()
    : 'Personal de Salud Comunitario';

  const brigadeName = attention.brigade?.name || 'Atención en Terreno';

  // 2. Extracción de Categoría y Título Limpio
  let categoriaExtraida = '';
  const matchCat = (attention.diagnosisDesc || attention.chiefComplaint || '').match(/\[(.*?)\]/);
  if (matchCat && matchCat[1]) {
    categoriaExtraida = formatCategoryLabel(matchCat[1]);
  }

  const tituloDiagnostico = (attention.diagnosisDesc || 'Atención Comunitaria')
    .replace(/\[.*?\]/g, '')
    .trim();

  // 3. Desglose del Motivo y Síntomas (S)
  const motivoRaw = attention.chiefComplaint || '';
  const partesMotivo = motivoRaw.split(' | ').map((p: string) => p.trim()).filter(Boolean);

  let motivoTexto = '';
  let sintomasLista: string[] = [];
  let evolucionTexto = '';
  const otrasObservacionesMotivo: string[] = [];

  partesMotivo.forEach((parte: string) => {
    if (parte.startsWith('Motivo:')) {
      motivoTexto = parte.replace(/^Motivo:\s*/i, '').replace(/\[.*?\]/g, '').trim();
    } else if (parte.startsWith('Síntomas reportados:')) {
      const rawSintomas = parte.replace('Síntomas reportados:', '').trim();
      sintomasLista = rawSintomas.split(',').map((s: string) => s.trim()).filter(Boolean);
    } else if (parte.startsWith('Evolución:')) {
      evolucionTexto = parte.replace('Evolución:', '').trim();
    } else {
      otrasObservacionesMotivo.push(parte);
    }
  });

  if (!motivoTexto && partesMotivo.length > 0 && sintomasLista.length === 0) {
    motivoTexto = partesMotivo[0].replace(/\[.*?\]/g, '').trim();
  }

  // 4. Desglose del Examen Físico y Hallazgos (O)
  const physicalExamRaw = attention.physicalExam || '';
  const partesPhysical = physicalExamRaw.split(' | ').map((p: string) => p.trim()).filter(Boolean);

  let hallazgosClinicos = '';
  let entornoVivienda = '';
  const otrosHallazgos: string[] = [];

  partesPhysical.forEach((parte: string) => {
    if (parte.startsWith('Hallazgos de evaluación:')) {
      hallazgosClinicos = parte.replace('Hallazgos de evaluación:', '').trim();
    } else if (parte.startsWith('Entorno/Vivienda:')) {
      entornoVivienda = parte.replace('Entorno/Vivienda:', '').trim();
    } else {
      otrosHallazgos.push(parte);
    }
  });

  if (!hallazgosClinicos && partesPhysical.length > 0) {
    hallazgosClinicos = partesPhysical[0];
  }

  // 5. Desglose del Plan de Tratamiento, Acciones, Seguimiento y Derivación (P)
  const planRaw = attention.treatmentPlan || '';
  const partesPlan = planRaw.split(' | ').map((p: string) => p.trim()).filter(Boolean);

  let accionesLista: string[] = [];
  let recomendacionesTexto = '';
  let seguimientoTexto = '';
  let referenciaTexto = '';
  const otrosPlanes: string[] = [];

  partesPlan.forEach((parte: string) => {
    if (parte.startsWith('Acciones realizadas:')) {
      const rawAcciones = parte.replace('Acciones realizadas:', '').trim();
      accionesLista = rawAcciones.split(',').map((a: string) => a.trim()).filter(Boolean);
    } else if (parte.startsWith('Recomendaciones brindadas:')) {
      recomendacionesTexto = parte.replace('Recomendaciones brindadas:', '').trim();
    } else if (parte.startsWith('Seguimiento programado:')) {
      seguimientoTexto = parte.replace('Seguimiento programado:', '').trim();
    } else if (parte.startsWith('Referencia emitida:')) {
      referenciaTexto = parte.replace('Referencia emitida:', '').trim();
    } else {
      otrosPlanes.push(parte);
    }
  });

  if (
    !recomendacionesTexto &&
    partesPlan.length > 0 &&
    accionesLista.length === 0 &&
    !seguimientoTexto &&
    !referenciaTexto
  ) {
    recomendacionesTexto = partesPlan.join(' ');
  }

  // 6. Signos Vitales e IMC
  const rawVitals = attention.vitalSigns as unknown;
  const vitals = Array.isArray(rawVitals)
    ? rawVitals[0]
    : (rawVitals as {
        systolic?: number;
        diastolic?: number;
        heartRate?: number;
        temperature?: number;
        oxygenSat?: number;
        weight?: number | null;
        height?: number | null;
      } | null | undefined);

  const bmi =
    vitals?.weight && vitals?.height && vitals.height > 0
      ? (vitals.weight / Math.pow(vitals.height, 2)).toFixed(1)
      : null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/80 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col justify-between overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Cabecera */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/50">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-700 shrink-0 shadow-2xs">
              <Stethoscope className="w-6 h-6 stroke-2" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                {categoriaExtraida && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200/80 px-2.5 py-0.5 rounded-md">
                    {categoriaExtraida}
                  </span>
                )}
                {attention.syncStatus === 'SYNCED' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Sincronizada
                  </span>
                ) : attention.syncStatus === 'PENDING' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200/60">
                    <RotateCw className="w-3 h-3 text-amber-600" />
                    Pendiente sinc.
                  </span>
                ) : attention.syncStatus ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200/60">
                    <AlertTriangle className="w-3 h-3 text-rose-600" />
                    Local
                  </span>
                ) : null}
              </div>

              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight mt-1 truncate">
                {patientFullName}
              </h3>

              <p className="text-xs text-slate-500 font-medium flex items-center gap-2 mt-0.5 truncate">
                {patientDui && <span className="font-mono text-slate-400">DUI: {patientDui} &bull;</span>}
                <span className="flex items-center gap-1 text-slate-600">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  {doctorFullName}
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1 text-teal-700 font-semibold truncate">
                  <MapPin className="w-3.5 h-3.5 text-teal-600" />
                  {brigadeName}
                </span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido con Widgets Estructurados */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
          
          {/* Fecha y Diagnóstico */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-slate-50/70 border border-slate-100 text-slate-600">
            <span className="font-medium flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              Fecha de Registro: <strong className="text-slate-900">{formatDate(attention.consultationDate)}</strong>
            </span>
            <span className="text-[11px] font-bold text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200/60 shadow-2xs">
              {tituloDiagnostico || 'Atención Comunitaria'}
            </span>
          </div>

          {/* Widgets de Signos Vitales */}
          {vitals && (
            <div className="bg-white/80 rounded-2xl border border-slate-200/70 p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-teal-500/10 text-teal-700 border border-teal-500/20 flex items-center justify-center">
                    <HeartPulse className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Signos Vitales y Constantes
                  </h4>
                </div>
                {bmi && (
                  <span className="text-[10px] font-bold text-teal-800 bg-teal-50 border border-teal-200/80 px-2 py-0.5 rounded-md">
                    IMC: {bmi} kg/m²
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                {vitals.systolic !== undefined && vitals.diastolic !== undefined && (
                  <div className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-100 space-y-0.5">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Gauge className="w-3 h-3 text-slate-400" /> Presión
                    </span>
                    <p className="text-sm font-extrabold text-slate-900">
                      {vitals.systolic}/{vitals.diastolic} <span className="text-[10px] font-normal text-slate-500">mmHg</span>
                    </p>
                  </div>
                )}

                {vitals.heartRate !== undefined && (
                  <div className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-100 space-y-0.5">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <HeartPulse className="w-3 h-3 text-rose-500" /> Pulso
                    </span>
                    <p className="text-sm font-extrabold text-slate-900">
                      {vitals.heartRate} <span className="text-[10px] font-normal text-slate-500">lpm</span>
                    </p>
                  </div>
                )}

                {vitals.temperature !== undefined && (
                  <div className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-100 space-y-0.5">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Thermometer className="w-3 h-3 text-amber-500" /> Temp.
                    </span>
                    <p className="text-sm font-extrabold text-slate-900">
                      {vitals.temperature} <span className="text-[10px] font-normal text-slate-500">°C</span>
                    </p>
                  </div>
                )}

                {vitals.oxygenSat !== undefined && (
                  <div className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-100 space-y-0.5">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Activity className="w-3 h-3 text-sky-500" /> SpO₂
                    </span>
                    <p className="text-sm font-extrabold text-slate-900">
                      {vitals.oxygenSat} <span className="text-[10px] font-normal text-slate-500">%</span>
                    </p>
                  </div>
                )}

                {vitals.weight !== undefined && vitals.weight !== null && (
                  <div className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-100 space-y-0.5">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Scale className="w-3 h-3 text-teal-600" /> Peso
                    </span>
                    <p className="text-sm font-extrabold text-slate-900">
                      {vitals.weight} <span className="text-[10px] font-normal text-slate-500">kg</span>
                    </p>
                  </div>
                )}

                {vitals.height !== undefined && vitals.height !== null && (
                  <div className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-100 space-y-0.5">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Ruler className="w-3 h-3 text-indigo-600" /> Talla
                    </span>
                    <p className="text-sm font-extrabold text-slate-900">
                      {vitals.height} <span className="text-[10px] font-normal text-slate-500">m</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 1. Motivo y Síntomas */}
          <div className="bg-white/80 rounded-2xl border border-slate-200/70 p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <div className="w-7 h-7 rounded-lg bg-teal-500/10 text-teal-700 border border-teal-500/20 flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                1. Motivo de Consulta y Síntomas
              </h4>
            </div>

            {motivoTexto && (
              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Descripción Clínica
                </span>
                <p className="text-xs text-slate-800 font-medium leading-relaxed bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                  {motivoTexto}
                </p>
              </div>
            )}

            {sintomasLista.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Síntomas Reportados
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {sintomasLista.map((sintoma: string) => (
                    <span
                      key={sintoma}
                      className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200/80 shadow-2xs"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      {sintoma}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {evolucionTexto && (
              <div className="space-y-1 pt-1">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  Evolución Temporal
                </span>
                <p className="text-xs text-slate-700 font-medium leading-relaxed bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                  {evolucionTexto}
                </p>
              </div>
            )}

            {otrasObservacionesMotivo.length > 0 && (
              <div className="space-y-1 pt-1">
                {otrasObservacionesMotivo.map((obs: string, idx: number) => (
                  <p key={idx} className="text-xs text-slate-600 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                    {obs}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* 2. Examen Físico y Evaluación del Entorno */}
          {(hallazgosClinicos || entornoVivienda) && (
            <div className="bg-white/80 rounded-2xl border border-slate-200/70 p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <div className="w-7 h-7 rounded-lg bg-teal-500/10 text-teal-700 border border-teal-500/20 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  2. Valoración Física y Entorno
                </h4>
              </div>

              {hallazgosClinicos && (
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Hallazgos de Evaluación
                  </span>
                  <p className="text-xs text-slate-800 font-medium leading-relaxed bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                    {hallazgosClinicos}
                  </p>
                </div>
              )}

              {entornoVivienda && (
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Condiciones de Vivienda / Entorno
                  </span>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                    {entornoVivienda}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 3. Procedimientos y Consejería */}
          <div className="bg-white/80 rounded-2xl border border-slate-200/70 p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <div className="w-7 h-7 rounded-lg bg-teal-500/10 text-teal-700 border border-teal-500/20 flex items-center justify-center">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                3. Procedimientos y Consejería Realizada
              </h4>
            </div>

            {accionesLista.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Acciones en Terreno
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {accionesLista.map((acc: string) => (
                    <span
                      key={acc}
                      className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 border border-teal-200/80 shadow-2xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                      {acc}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {recomendacionesTexto && (
              <div className="space-y-1 pt-1">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Educación y Recomendaciones
                </span>
                <p className="text-xs text-slate-800 font-medium leading-relaxed bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                  {recomendacionesTexto}
                </p>
              </div>
            )}
          </div>

          {/* 4. Continuidad Territorial y Derivación */}
          {(seguimientoTexto || referenciaTexto) && (
            <div className="bg-white/80 rounded-2xl border border-slate-200/70 p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <div className="w-7 h-7 rounded-lg bg-sky-500/10 text-sky-700 border border-sky-500/20 flex items-center justify-center">
                  <CalendarClock className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  4. Plan de Continuidad y Derivación
                </h4>
              </div>

              {seguimientoTexto && (
                <div className="p-3 bg-sky-50/60 border border-sky-200/80 rounded-xl space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-sky-900">
                    <CalendarClock className="w-4 h-4 text-sky-700" />
                    <span>Seguimiento Territorial Programado</span>
                  </div>
                  <p className="text-sky-950 font-medium pl-5 leading-relaxed">
                    {seguimientoTexto}
                  </p>
                </div>
              )}

              {referenciaTexto && (
                <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-xl space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900">
                    <Building2 className="w-4 h-4 text-amber-700" />
                    <span>Derivación a Red Hospitalaria</span>
                  </div>
                  <p className="text-amber-950 font-medium pl-5 leading-relaxed">
                    {referenciaTexto}
                  </p>
                </div>
              )}
            </div>
          )}

          {otrosPlanes.length > 0 && (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                {otrosPlanes.map((plan: string, idx: number) => (
                  <p key={idx}>{plan}</p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Pie */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/60 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Cerrar Detalle
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetalleAtencionModal;