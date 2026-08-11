import React from 'react';
import { ShieldCheck, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

export interface EstadoSaludInfo {
  alDia: boolean;
  controlesPendientes?: number;
  mensajeEvaluacion?: string;
}

interface Props {
  estado?: EstadoSaludInfo | null;
}

export const TarjetaEstadoSalud: React.FC<Props> = ({ estado }) => {
  const alDia = estado?.alDia ?? true;

  return (
    <div className="bg-medicos-surface rounded-2xl border border-medicos-soft-border p-5 shadow-xs flex flex-col justify-between h-full space-y-4">
      <div className="flex items-center justify-between border-b border-medicos-soft-border pb-3">
        <span className="text-xs font-bold text-medicos-dark-blue uppercase tracking-wider flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-medicos-teal" /> Estado de Salud
        </span>
        <span
          className={`px-2.5 py-0.5 rounded text-[11px] font-bold border ${
            alDia
              ? 'bg-medicos-light-bg text-medicos-teal border-medicos-soft-border'
              : 'bg-amber-50 text-amber-800 border-amber-200'
          }`}
        >
          {alDia ? 'CONTROLES AL DÍA' : 'EVALUACIÓN PENDIENTE'}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-start gap-3 p-3 rounded-xl bg-medicos-light-bg border border-medicos-soft-border">
          {alDia ? (
            <CheckCircle2 className="w-5 h-5 text-medicos-teal shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          )}
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-medicos-dark-blue">
              {alDia ? 'Seguimiento Médico Normal' : 'Atención Recomendada'}
            </p>
            <p className="text-[11px] text-medicos-muted leading-snug">
              {estado?.mensajeEvaluacion ||
                (alDia
                  ? 'Tus registros médicos no indican alertas clínicas o revisiones prioritarias pendientes.'
                  : 'Se sugiere agendar un control de rutina para actualizar mediciones clínicas.')}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-medicos-muted p-2.5 bg-medicos-light-bg rounded-lg border border-medicos-soft-border">
          <span className="flex items-center gap-1.5 font-medium">
            <Clock className="w-3.5 h-3.5 text-medicos-teal" /> Revisiones programadas
          </span>
          <span className="font-bold text-medicos-dark-blue">
            {estado?.controlesPendientes ?? 0} pendientes
          </span>
        </div>
      </div>

      <div className="pt-2 border-t border-medicos-soft-border text-[11px] text-medicos-muted flex items-center justify-between">
        <span>Sistema Epidemiológico MedicOS</span>
        <span className="font-semibold text-medicos-teal">Verificado</span>
      </div>
    </div>
  );
};

export default TarjetaEstadoSalud;