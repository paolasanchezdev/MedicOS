// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/promocion-prevencion/materno-infantil/components/ModalHistorialControles.tsx
// DESCRIPCIÓN: Modal para consultar el expediente y la línea de tiempo de
//              todas las atenciones registradas para una gestante o niño.
// =========================================================================

import React from 'react';
import { X, FileText, Calendar } from 'lucide-react';
import type { AtencionPreventivaItem } from '../../../../../../modules/maternal-health/types/materno-infantil.types';

interface ModalHistorialControlesProps {
  isOpen: boolean;
  onClose: () => void;
  nombrePaciente: string;
  expediente: string;
  subtitulo: string;
  atenciones: AtencionPreventivaItem[];
  onNuevoControl: () => void;
}

export const ModalHistorialControles: React.FC<ModalHistorialControlesProps> = ({
  isOpen,
  onClose,
  nombrePaciente,
  expediente,
  subtitulo,
  atenciones,
  onNuevoControl,
}) => {
  if (!isOpen) return null;

  const formatearDesenlace = (d: string) => {
    switch (d) {
      case 'SEGUIMIENTO_NORMAL':
        return { label: 'Seguimiento Normal', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
      case 'PROXIMO_CONTROL':
        return { label: 'Próximo Control Programado', color: 'text-teal-700 bg-teal-50 border-teal-200' };
      case 'REQUIERE_VALORACION':
        return { label: 'Requiere Valoración Médica', color: 'text-amber-700 bg-amber-50 border-amber-200' };
      case 'REFERIDO_RED':
        return { label: 'Referido a la Red Asistencial', color: 'text-rose-700 bg-rose-50 border-rose-200' };
      default:
        return { label: d, color: 'text-slate-700 bg-slate-50 border-slate-200' };
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Cabecera */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-50 text-[#166E7A] border border-teal-200/80">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-slate-900">{nombrePaciente}</h3>
                <span className="font-mono text-[11px] font-extrabold text-[#166E7A] bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  {expediente}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">{subtitulo}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Historial Acumulado */}
        <div className="p-5 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-600">
              Historial de Controles y Atenciones Registradas ({atenciones.length})
            </h4>
            <button
              type="button"
              onClick={() => {
                onClose();
                onNuevoControl();
              }}
              className="text-xs font-bold text-[#166E7A] hover:underline cursor-pointer"
            >
              + Agregar Nueva Atención
            </button>
          </div>

          {atenciones.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <p className="text-xs font-bold text-slate-700">Sin atenciones registradas en el historial</p>
              <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                Aún no se han capturado evaluaciones preventivas durante las jornadas comunitarias para este paciente.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {atenciones.map((atn) => {
                const badge = formatearDesenlace(atn.desenlace);
                return (
                  <div
                    key={atn.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-[#166E7A]/40 transition space-y-2.5 shadow-2xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-[#166E7A]" />
                        <span className="text-xs font-extrabold text-slate-900">{atn.fechaControl}</span>
                        {atn.semanasGestacion && (
                          <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                            {atn.semanasGestacion} semanas
                          </span>
                        )}
                      </div>
                      <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${badge.color}`}>
                        {badge.label}
                      </span>
                    </div>

                    {/* Medidas registradas */}
                    <div className="grid grid-cols-3 gap-2 p-2 rounded-xl bg-slate-50 text-[11px] text-slate-600">
                      <div>
                        <span className="text-slate-400 block text-[9.5px]">Peso</span>
                        <strong>{atn.pesoKg ? `${atn.pesoKg} kg` : 'No registrado'}</strong>
                      </div>
                      {atn.presionArterial ? (
                        <div>
                          <span className="text-slate-400 block text-[9.5px]">Presión Arterial</span>
                          <strong>{atn.presionArterial} mmHg</strong>
                        </div>
                      ) : (
                        <div>
                          <span className="text-slate-400 block text-[9.5px]">Talla / Longitud</span>
                          <strong>{atn.tallaCm ? `${atn.tallaCm} cm` : 'No registrada'}</strong>
                        </div>
                      )}
                      <div>
                        <span className="text-slate-400 block text-[9.5px]">Próximo Control</span>
                        <strong>{atn.fechaProximoSeguimiento || 'Por programar'}</strong>
                      </div>
                    </div>

                    {/* Educación brindada */}
                    {atn.temasEducacion && atn.temasEducacion.length > 0 && (
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          Educación y Consejería Brindada:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {atn.temasEducacion.map((tema, i) => (
                            <span
                              key={i}
                              className="text-[10.5px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                            >
                              ✓ {tema}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {atn.observaciones && (
                      <p className="text-[11px] text-slate-600 italic bg-amber-50/60 p-2 rounded-lg border border-amber-100">
                        "{atn.observaciones}"
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pie */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium">Registro oficial de continuidad comunitaria</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};