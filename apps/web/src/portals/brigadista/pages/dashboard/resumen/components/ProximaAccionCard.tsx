// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/dashboard/resumen/components/ProximaAccionCard.tsx
// DESCRIPCIÓN: Tarjeta de acción prioritaria con estética de panel Admin.
// =========================================================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, HeartPulse, User, QrCode } from 'lucide-react';

export interface ProximaPersonaItem {
  id: string;
  paciente: string;
  dui: string;
  hora: string;
  motivo?: string;
}

interface ProximaAccionCardProps {
  proximaPersona: ProximaPersonaItem | null;
  jornadaActiva: boolean;
}

export const ProximaAccionCard: React.FC<ProximaAccionCardProps> = ({
  proximaPersona,
  jornadaActiva,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between space-y-4">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#2B7A78] shadow-xs">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Prioridad en Campo
              </p>
              <h3 className="text-sm font-bold text-slate-900">
                Próxima Acción Operativa
              </h3>
            </div>
          </div>
          <span className="px-2.5 py-1 bg-slate-50 text-slate-600 text-[11px] font-semibold rounded-full border border-slate-200/60">
            Recomendación
          </span>
        </div>

        <div className="mt-4">
          {!jornadaActiva ? (
            <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-xl space-y-2">
              <p className="text-xs font-bold text-amber-900">Jornada no iniciada</p>
              <p className="text-xs text-amber-800 leading-relaxed">
                Inicia la jornada territorial para comenzar las actividades de campo e identificación de personas.
              </p>
            </div>
          ) : proximaPersona ? (
            <div className="p-4 bg-slate-50/70 border border-slate-200/60 rounded-xl space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-teal-100/60 text-[#2B7A78] flex items-center justify-center font-bold text-xs">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{proximaPersona.paciente}</p>
                    <p className="text-[11px] text-slate-500">DUI: {proximaPersona.dui || 'Sin documento'}</p>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-[#2B7A78] bg-white px-2 py-0.5 rounded-md border border-slate-200/60 shrink-0 font-medium">
                  {proximaPersona.hora}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>Persona pendiente de evaluación:</strong> Registrada recientemente, aún no cuenta con toma de signos vitales inicial.
              </p>
            </div>
          ) : (
            <div className="p-4 bg-emerald-50/70 border border-emerald-200/60 rounded-xl flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-emerald-950">Jornada en curso y al día</p>
                <p className="text-[11px] text-emerald-800 mt-0.5 leading-relaxed">
                  No hay personas pendientes de evaluación física. Puedes continuar registrando o escanear el QR de una persona.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100">
        {!jornadaActiva ? (
          <button
            onClick={() => navigate('/brigadista/brigada/jornada')}
            className="w-full py-2.5 bg-[#2B7A78] hover:bg-[#236866] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Gestionar Jornada</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : proximaPersona ? (
          <button
            onClick={() => navigate('/brigadista/evaluacion/signos-vitales')}
            className="w-full py-2.5 bg-[#2B7A78] hover:bg-[#236866] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Evaluar persona</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => navigate('/brigadista/pacientes/escanear')}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            <span>Escanear QR de Paciente</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};