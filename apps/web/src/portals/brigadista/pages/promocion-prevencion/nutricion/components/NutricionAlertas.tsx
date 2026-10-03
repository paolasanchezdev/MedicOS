// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/promocion-prevencion/nutricion/components/NutricionAlertas.tsx
// DESCRIPCIÓN: Bandeja de alertas y casos prioritarios de nutrición.
// =========================================================================

import React from 'react';
import { AlertTriangle, Clock, Scale, History, ShieldCheck, UserCheck } from 'lucide-react';
import type { PersonaVigilanciaItem } from '../../../../../../modules/nutrition/types/nutrition.types';

interface NutricionAlertasProps {
  personasAlerta: PersonaVigilanciaItem[];
  onRegistrarControl: (pacienteId: string, nombre: string, expediente: string) => void;
  onVerHistorial: (paciente: PersonaVigilanciaItem) => void;
}

export const NutricionAlertas: React.FC<NutricionAlertasProps> = ({
  personasAlerta,
  onRegistrarControl,
  onVerHistorial,
}) => {
  if (personasAlerta.length === 0) {
    return (
      <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center space-y-2 shadow-2xs">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-100">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-black text-slate-800">Comunidad al Día • Sin Alertas Nutricionales</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">
            No se registran casos con bajo peso severo, pérdida acelerada ni evaluaciones atrasadas.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4 text-rose-600" />
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
            Casos Prioritarios y Alertas Nutricionales ({personasAlerta.length})
          </h3>
        </div>
        <span className="text-[10px] font-bold text-slate-400">Atención y seguimiento recomendados en la jornada</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {personasAlerta.map((p) => (
          <div
            key={p.id}
            className="p-3.5 rounded-2xl border border-rose-200 bg-rose-50/40 hover:bg-rose-50/70 transition shadow-2xs flex flex-col justify-between gap-2.5"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-rose-100 text-rose-700 border border-rose-200">
                  {p.clasificacionActual === 'BAJO_PESO' ? 'Bajo Peso' : 'Alerta Nutricional'}
                </span>
                <span className="font-mono text-[9px] font-bold text-[#166E7A] bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                  {p.expediente}
                </span>
              </div>

              <h4 className="text-xs font-extrabold text-slate-900">{p.nombreCompleto}</h4>
              <p className="text-[11px] text-slate-600 font-medium">
                Edad: <strong>{p.edadTexto}</strong> • Grupo: <span className="text-[#166E7A] font-bold">{p.grupoEtario}</span>
              </p>

              <div className="mt-1.5 p-2 rounded-lg bg-white/90 border border-rose-100 text-[11px] text-rose-900">
                <p className="font-semibold flex items-center gap-1">
                  <Clock className="w-3 h-3 text-rose-600 shrink-0" />
                  <span>Motivo: {p.motivoAlerta || 'Evaluación de control requerida'}</span>
                </p>
                {p.tutorNombre && (
                  <p className="text-[10px] text-slate-600 mt-0.5 flex items-center gap-1 truncate">
                    <UserCheck className="w-3 h-3 text-emerald-700 shrink-0" />
                    <span>Tutor: {p.tutorNombre} • Tel: {p.tutorTelefono || 'S/N'}</span>
                  </p>
                )}
                <p className="text-[10px] text-slate-400 truncate mt-0.5">{p.direccion}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-1.5 pt-1.5 border-t border-rose-200/60">
              <button
                type="button"
                onClick={() => onVerHistorial(p)}
                className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold transition cursor-pointer flex items-center gap-1"
              >
                <History className="w-3 h-3 text-slate-500" />
                <span>Historial</span>
              </button>

              <button
                type="button"
                onClick={() => onRegistrarControl(p.pacienteId, p.nombreCompleto, p.expediente)}
                className="px-3 py-1 rounded-lg bg-[#166E7A] hover:bg-[#105F68] text-white text-xs font-black transition shadow-2xs cursor-pointer flex items-center gap-1"
              >
                <Scale className="w-3 h-3" />
                <span>+ Control</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};