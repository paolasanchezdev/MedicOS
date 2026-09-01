// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/pacientes/expediente/components/tabs/DetalleConsultaModal.tsx
// DESCRIPCIÓN: Cuadro flotante de detalle clínico con estética Apple Health y widgets estructurados.
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
} from 'lucide-react';
import type { ConsultationRecord } from '../../../../../../../modules/patients';

interface DetalleConsultaModalProps {
  consultation: ConsultationRecord | null;
  isOpen: boolean;
  onClose: () => void;
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

export const DetalleConsultaModal: React.FC<DetalleConsultaModalProps> = ({
  consultation,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !consultation) return null;

  const nombreDoctor = consultation.doctor
    ? `${consultation.doctor.firstName || ''} ${consultation.doctor.lastName || ''}`.trim()
    : 'Personal de Salud Comunitario';

  const nombreBrigada = consultation.brigade?.name || 'Atención Comunitaria en Terreno';

  // Desglose del Motivo y Síntomas (S / O)
  const motivoRaw = consultation.chiefComplaint || '';
  const partesMotivo = motivoRaw.split(' | ').map((p) => p.trim()).filter(Boolean);

  let motivoTexto = '';
  let sintomasLista: string[] = [];
  let evolucionTexto = '';
  const otrasObservacionesMotivo: string[] = [];

  partesMotivo.forEach((parte) => {
    if (parte.startsWith('Motivo:')) {
      motivoTexto = parte.replace('Motivo:', '').replace(/\[.*?\]/g, '').trim();
    } else if (parte.startsWith('Síntomas reportados:')) {
      const rawSintomas = parte.replace('Síntomas reportados:', '').trim();
      sintomasLista = rawSintomas.split(',').map((s) => s.trim()).filter(Boolean);
    } else if (parte.startsWith('Evolución:')) {
      evolucionTexto = parte.replace('Evolución:', '').trim();
    } else {
      otrasObservacionesMotivo.push(parte);
    }
  });

  if (!motivoTexto && partesMotivo.length > 0 && sintomasLista.length === 0) {
    motivoTexto = partesMotivo[0].replace(/\[.*?\]/g, '').trim();
  }

  // Desglose del Plan de Tratamiento y Continuidad (P)
  const planRaw = consultation.treatmentPlan || '';
  const partesPlan = planRaw.split(' | ').map((p) => p.trim()).filter(Boolean);

  let accionesLista: string[] = [];
  let recomendacionesTexto = '';
  let seguimientoTexto = '';
  let referenciaTexto = '';
  const otrosPlanes: string[] = [];

  partesPlan.forEach((parte) => {
    if (parte.startsWith('Acciones realizadas:')) {
      const rawAcciones = parte.replace('Acciones realizadas:', '').trim();
      accionesLista = rawAcciones.split(',').map((a) => a.trim()).filter(Boolean);
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

  // Extracción segura de Signos Vitales (soportando objeto único o arreglo)
  const rawVitals = consultation.vitalSigns as unknown;
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
        
        {/* Cabecera Apple Health */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/40">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-700 shrink-0 shadow-2xs">
              <Stethoscope className="w-6 h-6 stroke-2" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200/80 px-2.5 py-0.5 rounded-full">
                  Expediente Clínico
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {consultation.status || 'COMPLETED'}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight mt-1 truncate">
                {(consultation.diagnosisDesc || 'Atención Comunitaria').replace(/\[.*?\]/g, '').trim()}
              </h3>
              <p className="text-xs text-slate-500 font-medium flex items-center gap-2 mt-0.5 truncate">
                <span className="flex items-center gap-1 text-slate-600">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  {nombreDoctor}
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1 text-teal-700 font-semibold truncate">
                  <MapPin className="w-3.5 h-3.5 text-teal-600" />
                  {nombreBrigada}
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

        {/* Contenido con Widgets */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
          
          {/* Fecha y Entorno */}
          <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-50/70 border border-slate-100 text-slate-600">
            <span className="font-medium flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              Fecha de Registro
            </span>
            <span className="font-bold text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200/60 shadow-2xs">
              {formatDate(consultation.consultationDate)}
            </span>
          </div>

          {/* Widgets de Signos Vitales (si existen) */}
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

          {/* Sección 1: Motivo y Síntomas */}
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
                  {sintomasLista.map((sintoma) => (
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
                {otrasObservacionesMotivo.map((obs, idx) => (
                  <p key={idx} className="text-xs text-slate-600 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                    {obs}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Sección 2: Acciones y Consejería */}
          <div className="bg-white/80 rounded-2xl border border-slate-200/70 p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <div className="w-7 h-7 rounded-lg bg-teal-500/10 text-teal-700 border border-teal-500/20 flex items-center justify-center">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                2. Procedimientos y Consejería
              </h4>
            </div>

            {accionesLista.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Acciones en Terreno
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {accionesLista.map((acc) => (
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

          {/* Sección 3: Plan de Continuidad y Derivación */}
          {(seguimientoTexto || referenciaTexto) && (
            <div className="bg-white/80 rounded-2xl border border-slate-200/70 p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <div className="w-7 h-7 rounded-lg bg-sky-500/10 text-sky-700 border border-sky-500/20 flex items-center justify-center">
                  <CalendarClock className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  3. Plan de Continuidad y Derivación
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
                {otrosPlanes.map((plan, idx) => (
                  <p key={idx}>{plan}</p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Pie del Modal */}
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

export default DetalleConsultaModal;