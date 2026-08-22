// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/dashboard/resumen/components/TarjetaResumenExpediente.tsx
// DESCRIPCIÓN: Tarjeta de resumen clínico y signos vitales con diseño unificado MedicOS.
// =========================================================================

import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Activity, ChevronRight, Stethoscope, HeartPulse, Thermometer, Droplet } from 'lucide-react';

export interface SignosVitalesData {
  systolic: number;
  diastolic: number;
  heartRate: number;
  temperature: number;
  oxygenSat?: number;
}

export interface ResumenExpedienteData {
  tipoSangre?: string | null;
  observaciones?: string | null;
  antecedentesFamiliares?: string | null;
  antecedentesQuirurgicos?: string | null;
  ultimaConsultaFecha?: string | Date | null;
  ultimoDiagnostico?: string | null;
  ultimosSignosVitales?: SignosVitalesData | null;
}

interface Props {
  resumen: ResumenExpedienteData | null;
}

export const TarjetaResumenExpediente: React.FC<Props> = ({ resumen }) => {
  if (!resumen) {
    return (
      <div className="group bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between h-full">
        <div>
          {/* Cabecera */}
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/70 flex items-center justify-center text-slate-500 shadow-2xs">
              <FileText className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200/60">
              Expediente nuevo
            </span>
          </div>

          {/* Métrica / Título */}
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Resumen Clínico
            </p>
            <p className="text-base font-bold text-slate-800 tracking-tight mt-1">
              Sin registros clínicos previos
            </p>
            <p className="text-xs text-slate-500 font-normal leading-relaxed mt-1">
              Aún no registras consultas diagnósticas ni toma de signos vitales en el sistema.
            </p>
          </div>
        </div>

        {/* Acción inferior */}
        <Link
          to="/paciente/expediente"
          className="mt-5 pt-3 border-t border-slate-100 w-full inline-flex items-center justify-between text-xs font-semibold text-[#2a726d] hover:text-[#23605c] transition-colors group/btn"
        >
          <span>Ir a expediente completo</span>
          <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
        </Link>
      </div>
    );
  }

  const fechaObj = resumen.ultimaConsultaFecha ? new Date(resumen.ultimaConsultaFecha) : null;
  const fechaFormateada = fechaObj && !isNaN(fechaObj.getTime())
    ? fechaObj.toLocaleDateString('es-SV', { year: 'numeric', month: 'short', day: 'numeric' })
    : null;

  const tieneSangreValida = resumen.tipoSangre && resumen.tipoSangre !== 'UNKNOWN';
  const tipoSangreTexto = tieneSangreValida
    ? resumen.tipoSangre?.replace('_POSITIVE', '+').replace('_NEGATIVE', '-')
    : null;

  const signos = resumen.ultimosSignosVitales;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between h-full">
      <div>
        {/* Cabecera */}
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-xs">
            <FileText className="w-5 h-5" />
          </div>
          {tipoSangreTexto ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200/60">
              <Droplet className="w-3 h-3 text-rose-500 fill-rose-500" />
              {tipoSangreTexto}
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200/60">
              Expediente activo
            </span>
          )}
        </div>

        {/* Título / Diagnóstico */}
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Último Diagnóstico Clínico
          </p>
          <div className="mt-1.5 p-2.5 rounded-lg bg-slate-50/70 border border-slate-100">
            <p className="text-xs font-bold text-slate-900 flex items-start gap-1.5 leading-snug">
              <Stethoscope className="w-3.5 h-3.5 text-[#2a726d] shrink-0 mt-0.5" />
              <span>{resumen.ultimoDiagnostico || 'Sin diagnósticos registrados'}</span>
            </p>
            {fechaFormateada && (
              <p className="text-[11px] text-slate-400 font-medium pl-5 mt-0.5">
                Atención realizada el {fechaFormateada}
              </p>
            )}
          </div>
        </div>

        {/* Signos Vitales */}
        <div className="mt-3.5">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
            <Activity className="w-3.5 h-3.5 text-[#2a726d]" />
            <span>Últimas Mediciones Vitales</span>
          </p>

          {signos ? (
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-slate-50/70 p-2 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-500 font-medium flex items-center justify-center gap-1">
                  <HeartPulse className="w-3 h-3 text-rose-500" /> P.A.
                </span>
                <span className="font-bold text-slate-900 text-xs mt-0.5 block">
                  {signos.systolic}/{signos.diastolic}
                </span>
              </div>

              <div className="bg-slate-50/70 p-2 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-500 font-medium flex items-center justify-center gap-1">
                  <Activity className="w-3 h-3 text-indigo-500" /> Pulso
                </span>
                <span className="font-bold text-slate-900 text-xs mt-0.5 block">
                  {signos.heartRate} <span className="text-[10px] font-normal text-slate-500">bpm</span>
                </span>
              </div>

              <div className="bg-slate-50/70 p-2 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-500 font-medium flex items-center justify-center gap-1">
                  <Thermometer className="w-3 h-3 text-amber-500" /> Temp.
                </span>
                <span className="font-bold text-slate-900 text-xs mt-0.5 block">
                  {signos.temperature}°C
                </span>
              </div>
            </div>
          ) : (
            <div className="p-2.5 rounded-lg bg-slate-50/70 border border-slate-100 text-center">
              <p className="text-[11px] text-slate-400 font-medium">
                Sin mediciones de signos vitales registradas.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Acción inferior */}
      <Link
        to="/paciente/expediente"
        className="mt-5 pt-3 border-t border-slate-100 w-full inline-flex items-center justify-between text-xs font-semibold text-[#2a726d] hover:text-[#23605c] transition-colors group/btn"
      >
        <span>Ver historial clínico</span>
        <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
      </Link>
    </div>
  );
};

export default TarjetaResumenExpediente;