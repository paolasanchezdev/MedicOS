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
      <div className="bg-medicos-surface rounded-2xl border border-medicos-soft-border p-5 shadow-xs flex flex-col justify-between h-full space-y-4">
        <div className="flex items-center justify-between border-b border-medicos-soft-border pb-3">
          <span className="text-xs font-bold text-medicos-muted uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-medicos-teal" /> Resumen del Expediente
          </span>
        </div>
        <div className="py-6 text-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-medicos-light-bg text-medicos-teal flex items-center justify-center mx-auto">
            <FileText className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-medicos-dark-blue">Expediente Clínico Nuevo</p>
          <p className="text-[11px] text-medicos-muted max-w-xs mx-auto">
            Aún no se registran consultas ni toma de signos vitales en tu historial.
          </p>
        </div>
        <div className="pt-2 border-t border-medicos-soft-border flex items-center justify-end">
          <Link
            to="/paciente/expediente"
            className="px-3 py-1.5 rounded-lg border border-medicos-soft-border text-medicos-teal text-xs font-medium hover:bg-medicos-light-bg transition-colors flex items-center gap-1"
          >
            Ir a expediente <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  const fechaObj = resumen.ultimaConsultaFecha ? new Date(resumen.ultimaConsultaFecha) : null;
  const fechaFormateada = fechaObj && !isNaN(fechaObj.getTime())
    ? fechaObj.toLocaleDateString('es-SV', { year: 'numeric', month: 'short', day: 'numeric' })
    : null;

  const tieneSangreValida = resumen.tipoSangre && resumen.tipoSangre !== 'UNKNOWN';
  const signos = resumen.ultimosSignosVitales;

  return (
    <div className="bg-medicos-surface rounded-2xl border border-medicos-soft-border p-5 shadow-xs flex flex-col justify-between h-full space-y-4">
      <div className="flex items-center justify-between border-b border-medicos-soft-border pb-3">
        <span className="text-xs font-bold text-medicos-dark-blue uppercase tracking-wider flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-medicos-teal" /> Resumen Clínico
        </span>
        {tieneSangreValida ? (
          <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-medicos-light-bg text-medicos-teal border border-medicos-soft-border flex items-center gap-1">
            <Droplet className="w-3 h-3 text-medicos-teal" />
            {resumen.tipoSangre?.replace('_POSITIVE', '+').replace('_NEGATIVE', '-')}
          </span>
        ) : (
          <span className="text-[10px] text-medicos-muted font-medium">Sangre: No especificado</span>
        )}
      </div>

      <div className="space-y-3">
        <div className="bg-medicos-light-bg p-3 rounded-xl border border-medicos-soft-border">
          <p className="text-[11px] font-bold text-medicos-muted uppercase tracking-wider">Último Diagnóstico Clínico</p>
          <p className="text-xs font-bold text-medicos-dark-blue flex items-start gap-1.5 mt-1">
            <Stethoscope className="w-3.5 h-3.5 text-medicos-teal shrink-0 mt-0.5" />
            <span>{resumen.ultimoDiagnostico || 'Sin diagnósticos registrados'}</span>
          </p>
          {fechaFormateada && (
            <p className="text-[10px] font-medium text-medicos-muted pl-5 mt-0.5">Atención realizada el {fechaFormateada}</p>
          )}
        </div>

        {signos ? (
          <div className="space-y-1.5">
            <p className="text-[11px] font-bold text-medicos-muted uppercase tracking-wider flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-medicos-teal" /> Últimas Mediciones Vitales
            </p>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-medicos-light-bg p-2 rounded-lg border border-medicos-soft-border">
                <span className="text-[10px] text-medicos-muted flex items-center justify-center gap-1">
                  <HeartPulse className="w-3 h-3 text-medicos-teal" /> Presión
                </span>
                <span className="font-bold text-medicos-dark-blue text-xs mt-0.5">
                  {signos.systolic}/{signos.diastolic}
                </span>
              </div>

              <div className="bg-medicos-light-bg p-2 rounded-lg border border-medicos-soft-border">
                <span className="text-[10px] text-medicos-muted flex items-center justify-center gap-1">
                  <Activity className="w-3 h-3 text-medicos-teal" /> Pulso
                </span>
                <span className="font-bold text-medicos-dark-blue text-xs mt-0.5">
                  {signos.heartRate} bpm
                </span>
              </div>

              <div className="bg-medicos-light-bg p-2 rounded-lg border border-medicos-soft-border">
                <span className="text-[10px] text-medicos-muted flex items-center justify-center gap-1">
                  <Thermometer className="w-3 h-3 text-medicos-teal" /> Temp.
                </span>
                <span className="font-bold text-medicos-dark-blue text-xs mt-0.5">
                  {signos.temperature}°C
                </span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-xs text-medicos-muted italic bg-medicos-light-bg p-2.5 rounded-lg border border-medicos-soft-border text-center">
            No hay toma de signos vitales reciente.
          </p>
        )}
      </div>

      <div className="pt-2 border-t border-medicos-soft-border flex items-center justify-end">
        <Link
          to="/paciente/expediente"
          className="px-3 py-1.5 rounded-lg border border-medicos-soft-border text-medicos-teal text-xs font-semibold hover:bg-medicos-light-bg transition-colors flex items-center gap-1"
        >
          Historial clínico <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default TarjetaResumenExpediente;