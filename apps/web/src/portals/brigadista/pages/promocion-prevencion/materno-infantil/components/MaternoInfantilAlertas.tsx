// =========================================================================
// ARCHIVO: MaternoInfantilAlertas.tsx
// DESCRIPCIÓN: Bandeja compacta de alertas sin relleno innecesario.
// =========================================================================

import React from 'react';
import { AlertTriangle, Clock, HeartPulse, History, ShieldCheck, UserCheck } from 'lucide-react';
import type {
  GestanteItem,
  NinoItem,
  TipoControlMaternoInfantil,
} from '../../../../../../modules/maternal-health/types/materno-infantil.types';

interface MaternoInfantilAlertasProps {
  gestantesPendientes: GestanteItem[];
  ninosPendientes: NinoItem[];
  onRegistrarControl: (tipo: TipoControlMaternoInfantil, pacienteId: string, nombre: string, expediente: string, semanas?: number) => void;
  onVerHistorial: (tipo: TipoControlMaternoInfantil, pacienteId: string, nombre: string, expediente: string, subtitulo: string) => void;
}

function formatearFechaHumana(fechaStr?: string): string {
  if (!fechaStr) return '';
  const d = new Date(fechaStr);
  if (isNaN(d.getTime())) return fechaStr;
  return d.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export const MaternoInfantilAlertas: React.FC<MaternoInfantilAlertasProps> = ({
  gestantesPendientes,
  ninosPendientes,
  onRegistrarControl,
  onVerHistorial,
}) => {
  const totalAlertas = gestantesPendientes.length + ninosPendientes.length;

  if (totalAlertas === 0) {
    return (
      <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center space-y-2 shadow-2xs">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-100">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-black text-slate-800">Territorio al Día • Sin Controles Pendientes</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Todas las gestantes y pacientes pediátricos censados tienen sus controles preventivos al día.
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
            Casos Prioritarios y Alertas Activas ({totalAlertas})
          </h3>
        </div>
        <span className="text-[10px] font-bold text-slate-400">Atención recomendada en la jornada de hoy</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Gestantes con Alerta */}
        {gestantesPendientes.map((g) => (
          <div
            key={g.id}
            className="p-3.5 rounded-2xl border border-rose-200 bg-rose-50/40 hover:bg-rose-50/70 transition shadow-2xs flex flex-col justify-between gap-2.5"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-rose-100 text-rose-700 border border-rose-200">
                  Prioridad Materna
                </span>
                <span className="font-mono text-[9px] font-bold text-[#166E7A] bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                  {g.expediente}
                </span>
              </div>

              <h4 className="text-xs font-extrabold text-slate-900">{g.nombreCompleto}</h4>
              <p className="text-[11px] text-[#166E7A] font-bold">
                {g.semanasGestacion} semanas • FPP: {formatearFechaHumana(g.fechaProbableParto)}
              </p>

              <div className="mt-1.5 p-2 rounded-lg bg-white/90 border border-rose-100 text-[11px] text-rose-900">
                <p className="font-semibold flex items-center gap-1">
                  <Clock className="w-3 h-3 text-rose-600 shrink-0" />
                  <span>{g.motivoAtencion || 'Control prenatal pendiente'}</span>
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5 truncate">
                  Ubicación: {g.direccion} • Tel: {g.telefono}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-1.5 pt-1.5 border-t border-rose-200/60">
              <button
                type="button"
                onClick={() =>
                  onVerHistorial(
                    'materno',
                    g.pacienteId,
                    g.nombreCompleto,
                    g.expediente,
                    `${g.edad} años • Gestante (${g.semanasGestacion} sem)`
                  )
                }
                className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold transition cursor-pointer flex items-center gap-1"
              >
                <History className="w-3 h-3 text-slate-500" />
                <span>Historial</span>
              </button>

              <button
                type="button"
                onClick={() => onRegistrarControl('materno', g.pacienteId, g.nombreCompleto, g.expediente, g.semanasGestacion)}
                className="px-3 py-1 rounded-lg bg-[#166E7A] hover:bg-[#105F68] text-white text-xs font-black transition shadow-2xs cursor-pointer flex items-center gap-1"
              >
                <HeartPulse className="w-3 h-3" />
                <span>+ Control</span>
              </button>
            </div>
          </div>
        ))}

        {/* Niños con Alerta */}
        {ninosPendientes.map((n) => (
          <div
            key={n.id}
            className="p-3.5 rounded-2xl border border-amber-200 bg-amber-50/40 hover:bg-amber-50/70 transition shadow-2xs flex flex-col justify-between gap-2.5"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
                  Control Pendiente
                </span>
                <span className="font-mono text-[9px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  {n.expediente}
                </span>
              </div>

              <h4 className="text-xs font-extrabold text-slate-900">{n.nombreCompleto}</h4>
              <p className="text-[11px] text-emerald-800 font-bold">
                Edad: {n.edadTexto} ({formatearFechaHumana(n.fechaNacimiento)})
              </p>

              <div className="mt-1.5 p-2 rounded-lg bg-white/90 border border-amber-100 text-[11px] text-amber-950">
                <p className="font-semibold flex items-center gap-1 text-amber-900">
                  <Clock className="w-3 h-3 text-amber-700 shrink-0" />
                  <span>{n.motivoAtencion || 'Control de crecimiento y desarrollo pendiente'}</span>
                </p>
                <p className="text-[10px] text-slate-600 mt-0.5 flex items-center gap-1 truncate">
                  <UserCheck className="w-3 h-3 text-emerald-700 shrink-0" />
                  <span>
                    Tutor: <strong>{n.tutorNombre}</strong> ({n.tutorParentesco}) • Tel: {n.tutorTelefono}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-1.5 pt-1.5 border-t border-amber-200/60">
              <button
                type="button"
                onClick={() =>
                  onVerHistorial(
                    'infantil',
                    n.pacienteId,
                    n.nombreCompleto,
                    n.expediente,
                    `Edad: ${n.edadTexto} • Tutor: ${n.tutorNombre} (${n.tutorParentesco})`
                  )
                }
                className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold transition cursor-pointer flex items-center gap-1"
              >
                <History className="w-3 h-3 text-slate-500" />
                <span>Historial</span>
              </button>

              <button
                type="button"
                onClick={() => onRegistrarControl('infantil', n.pacienteId, n.nombreCompleto, n.expediente)}
                className="px-3 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black transition shadow-2xs cursor-pointer flex items-center gap-1"
              >
                <HeartPulse className="w-3 h-3" />
                <span>+ Control</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};