// =========================================================================
// ARCHIVO: ModalDetalleSeguimiento.tsx
// DESCRIPCIÓN: Panel amplio con información del paciente, estado de continuidad
//              y Línea de Tiempo (Historial de Acciones).
// =========================================================================

import React from 'react';
import {
  X,
  Calendar,
  History,
  Phone,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import type { SeguimientoItem } from '../../../../../../modules/continuity/types/continuity.types';
import { calcularTemporalidad } from '../../../../../../modules/continuity/hooks/useContinuidadPacientes';

interface ModalDetalleSeguimientoProps {
  isOpen: boolean;
  onClose: () => void;
  seguimiento: SeguimientoItem | null;
  onRegistrarAccion: (seg: SeguimientoItem) => void;
  onCerrarSeguimiento: (id: string, motivo: string) => Promise<boolean>;
}

export const ModalDetalleSeguimiento: React.FC<ModalDetalleSeguimientoProps> = ({
  isOpen,
  onClose,
  seguimiento,
  onRegistrarAccion,
  onCerrarSeguimiento,
}) => {
  if (!isOpen || !seguimiento) return null;

  const temp = calcularTemporalidad(seguimiento.fechaPrevista, seguimiento.estado);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in duration-150">
        
        {/* Cabecera */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/90 shrink-0">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold text-[#166E7A] bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                {seguimiento.pacienteExpediente}
              </span>
              <span
                className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${
                  temp === 'VENCIDO'
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : temp === 'HOY'
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : temp === 'COMPLETADO'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-teal-50 text-[#166E7A] border-teal-200'
                }`}
              >
                ● {temp}
              </span>
              {seguimiento.prioridad === 'ALTA' && (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-rose-100 text-rose-800 border border-rose-200">
                  Prioridad Alta
                </span>
              )}
            </div>
            <h3 className="text-base font-black text-[#1A282D]">
              {seguimiento.pacienteNombre}
            </h3>
            <p className="text-xs text-medicos-muted font-medium flex items-center gap-3">
              <span>{seguimiento.pacienteEdad}</span>
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-400" />
                <span>{seguimiento.pacienteTelefono}</span>
              </span>
              <span className="flex items-center gap-1 truncate max-w-xs">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span className="truncate">{seguimiento.pacienteDireccion}</span>
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-5 overflow-y-auto space-y-4">
          
          {/* Tarjeta de Próxima Acción */}
          <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#166E7A]">
                Tarea de Continuidad Pendiente
              </span>
              <span className="font-bold text-[#166E7A] flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Fecha Prevista: {seguimiento.fechaPrevista}</span>
              </span>
            </div>
            <h4 className="text-sm font-black text-[#1A282D]">{seguimiento.proximaAccion}</h4>
            <p className="text-xs text-medicos-muted">{seguimiento.descripcion}</p>
          </div>

          {/* Línea de Tiempo (Historial de Continuidad) */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center gap-1.5">
              <History className="w-4 h-4 text-[#166E7A]" />
              <h4 className="text-xs font-black uppercase tracking-wider text-[#1A282D]">
                Línea de Tiempo del Seguimiento ({seguimiento.historialAcciones.length} registros)
              </h4>
            </div>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-teal-200">
              {seguimiento.historialAcciones.map((acc) => (
                <div key={acc.id} className="relative space-y-1">
                  {/* Punto de la línea de tiempo */}
                  <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-[#166E7A] ring-4 ring-white" />

                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-extrabold text-[#1A282D]">
                      {acc.tipoAccion}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">{acc.fecha}</span>
                  </div>

                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 leading-relaxed">
                    "{acc.observaciones}"
                  </p>

                  <div className="flex items-center gap-3 text-[10.5px] text-slate-400 font-medium">
                    <span>
                      Resultado: <strong className="text-slate-700">{acc.resultado}</strong>
                    </span>
                    <span>•</span>
                    <span>{acc.responsable}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pie con Acciones */}
        <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50/90 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={async () => {
              const ok = await onCerrarSeguimiento(
                seguimiento.id,
                'Seguimiento completado y cerrado por el brigadista.'
              );
              if (ok) onClose();
            }}
            disabled={seguimiento.estado === 'COMPLETADO'}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition disabled:opacity-40 cursor-pointer"
          >
            Cerrar Seguimiento
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Cerrar
            </button>

            {seguimiento.estado !== 'COMPLETADO' && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onRegistrarAccion(seguimiento);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#166E7A] hover:bg-[#105F68] text-white text-xs font-black rounded-xl shadow-xs transition active:scale-95 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Registrar Acción</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};