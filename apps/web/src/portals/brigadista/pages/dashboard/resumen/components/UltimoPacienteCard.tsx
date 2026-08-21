// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/dashboard/resumen/components/UltimoPacienteCard.tsx
// =========================================================================

import React from 'react';
import { UserCheck, FileText, CheckCircle2, Circle, ArrowUpRight, User } from 'lucide-react';

export interface EstadoPacienteItem {
  label: string;
  completado: boolean;
}

export interface UltimoPacienteData {
  pacienteNombre: string;
  pasos?: EstadoPacienteItem[];
  onAbrirExpediente?: () => void;
}

interface UltimoPacienteCardProps {
  paciente?: UltimoPacienteData | null;
  onVerExpediente?: () => void;
}

export const UltimoPacienteCard: React.FC<UltimoPacienteCardProps> = ({
  paciente,
  onVerExpediente,
}) => {
  const pasosDefecto: EstadoPacienteItem[] = [
    { label: 'Signos vitales', completado: true },
    { label: 'Evaluación clínica', completado: false },
    { label: 'Observaciones', completado: false },
  ];

  const listaPasos = paciente?.pasos || pasosDefecto;
  const handleAccionExpediente = onVerExpediente || paciente?.onAbrirExpediente;

  return (
    <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between h-full hover:border-slate-300 transition-colors">
      <div className="space-y-4">
        {/* Cabecera */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-100">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Último Paciente
              </span>
              <span className="text-sm font-bold text-slate-800">
                Atención Reciente
              </span>
            </div>
          </div>

          {paciente ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 text-teal-700 text-xs font-bold rounded-full border border-teal-200/80">
              <span className="w-2 h-2 rounded-full bg-teal-600" />
              Registrado
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-400 text-xs font-medium rounded-full border border-slate-200/60">
              Sin registro
            </span>
          )}
        </div>

        {/* Contenido */}
        {!paciente ? (
          <div className="p-6 rounded-xl bg-slate-50 border border-slate-200/60 text-center flex flex-col items-center justify-center my-auto">
            <div className="p-3 rounded-full bg-slate-100 text-slate-400 mb-2">
              <User className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-700">No hay atenciones recientes</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-[220px]">
              Los datos del último paciente procesado aparecerán en esta sección.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Nombre del Paciente */}
            <div className="p-4 rounded-xl bg-slate-50/90 border border-slate-200/70 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-teal-700 shrink-0 shadow-2xs">
                <User className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Paciente Atendido
                </p>
                <p className="text-sm font-extrabold text-slate-900 truncate">
                  {paciente.pacienteNombre}
                </p>
              </div>
            </div>

            {/* Lista Estilizada de Pasos / Requisitos */}
            <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 space-y-2.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Avance de la Evaluación
              </p>
              {listaPasos.map((paso, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {paso.completado ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-300 shrink-0" />
                    )}
                    <span className={`font-medium ${paso.completado ? 'text-slate-800' : 'text-slate-400'}`}>
                      {paso.label}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      paso.completado
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {paso.completado ? 'Completado' : 'Pendiente'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Botón de Acción */}
      {paciente && (
        <button
          type="button"
          onClick={handleAccionExpediente}
          className="mt-5 w-full inline-flex items-center justify-between px-4 py-2.5 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 text-slate-700 border border-slate-200/80 rounded-xl font-bold text-xs transition-colors shadow-2xs group"
        >
          <div className="flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-teal-700" />
            <span>Abrir expediente clínico</span>
          </div>
          <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
        </button>
      )}
    </div>
  );
};