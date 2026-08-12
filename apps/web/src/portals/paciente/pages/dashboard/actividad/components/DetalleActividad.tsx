// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/dashboard/actividad/components/DetalleActividad.tsx
// DESCRIPCIÓN: Modal de detalle de actividad del paciente con tipos resueltos localmente.
// =========================================================================

import React from 'react';
import { X, Calendar, User, MapPin, Activity, ShieldCheck } from 'lucide-react';
import { type ElementoActividad } from './ActividadItem';

export interface VitalSignsRecord {
  systolic?: number | string;
  diastolic?: number | string;
  heartRate?: number | string;
  temperature?: number | string;
  oxygenSat?: number | string;
}

export interface ConsultationRecord {
  chiefComplaint?: string;
  diagnosisDesc?: string;
  diagnosisCode?: string;
  treatmentPlan?: string;
  vitalSigns?: VitalSignsRecord[];
}

interface DetalleActividadProps {
  item: ElementoActividad | null;
  onCerrar: () => void;
}

const formatearFechaCompleta = (isoString: string): string => {
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('es-SV', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  } catch {
    return isoString;
  }
};

export const DetalleActividad: React.FC<DetalleActividadProps> = ({ item, onCerrar }) => {
  if (!item) return null;

  const esConsulta = item.tipo === 'consulta' || item.tipo === 'cita';
  const consulta = esConsulta ? (item.datosOriginales as ConsultationRecord) : null;
  const vitales = !esConsulta ? (item.datosOriginales as VitalSignsRecord) : consulta?.vitalSigns?.[0] || null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="p-5 border-b border-slate-200 flex items-start justify-between gap-3 sticky top-0 bg-white z-10">
          <div>
            <span className="text-[10px] font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-md uppercase">
              {item.tipo}
            </span>
            <h2 className="text-lg font-bold text-slate-900 mt-1">{item.titulo}</h2>
          </div>
          <button
            type="button"
            onClick={onCerrar}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
            aria-label="Cerrar modal de detalle"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs text-slate-700">
          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <div>
              <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1 mb-0.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Fecha
              </span>
              <p className="font-semibold text-slate-900 capitalize">
                {formatearFechaCompleta(item.fechaISO)}
              </p>
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1 mb-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" /> Estado
              </span>
              <p className="font-semibold text-slate-900">{item.estado || 'REGISTRADO'}</p>
            </div>
          </div>

          {item.profesional && (
            <div className="flex items-start gap-2">
              <User className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-slate-500 block">Profesional de Salud</span>
                <p className="font-semibold text-slate-900">{item.profesional}</p>
              </div>
            </div>
          )}

          {item.establecimiento && (
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-slate-500 block">Establecimiento / Brigada</span>
                <p className="font-semibold text-slate-900">{item.establecimiento}</p>
              </div>
            </div>
          )}

          {consulta && (
            <>
              {consulta.chiefComplaint && (
                <div className="border-t border-slate-200 pt-3">
                  <span className="font-bold text-slate-800 block mb-1">Motivo de consulta</span>
                  <p className="p-2.5 bg-slate-50 rounded-lg text-slate-700">{consulta.chiefComplaint}</p>
                </div>
              )}

              {consulta.diagnosisDesc && (
                <div className="border-t border-slate-200 pt-3">
                  <span className="font-bold text-slate-800 block mb-1">Diagnóstico registrado</span>
                  <p className="p-2.5 bg-slate-50 rounded-lg text-slate-700 font-medium">
                    {consulta.diagnosisCode ? `[${consulta.diagnosisCode}] ` : ''}
                    {consulta.diagnosisDesc}
                  </p>
                </div>
              )}

              {consulta.treatmentPlan && (
                <div className="border-t border-slate-200 pt-3">
                  <span className="font-bold text-slate-800 block mb-1">Plan de tratamiento</span>
                  <p className="p-2.5 bg-slate-50 rounded-lg text-slate-700 whitespace-pre-line">
                    {consulta.treatmentPlan}
                  </p>
                </div>
              )}
            </>
          )}

          {vitales && (
            <div className="border-t border-slate-200 pt-3 space-y-2">
              <span className="font-bold text-slate-800 flex items-center gap-1">
                <Activity className="w-4 h-4 text-teal-700" /> Signos Vitales Registrados
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-[10px] text-slate-500 block">Presión arterial</span>
                  <span className="font-bold text-slate-900">
                    {vitales.systolic && vitales.diastolic ? `${vitales.systolic}/${vitales.diastolic} mmHg` : 'N/A'}
                  </span>
                </div>
                <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-[10px] text-slate-500 block">Frecuencia cardíaca</span>
                  <span className="font-bold text-slate-900">
                    {vitales.heartRate ? `${vitales.heartRate} bpm` : 'N/A'}
                  </span>
                </div>
                <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-[10px] text-slate-500 block">Temperatura</span>
                  <span className="font-bold text-slate-900">
                    {vitales.temperature ? `${vitales.temperature} °C` : 'N/A'}
                  </span>
                </div>
                <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-[10px] text-slate-500 block">Saturación O2</span>
                  <span className="font-bold text-slate-900">
                    {vitales.oxygenSat ? `${vitales.oxygenSat}%` : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            type="button"
            onClick={onCerrar}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetalleActividad;