// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/promocion-prevencion/nutricion/components/ModalHistorialNutricional.tsx
// DESCRIPCIÓN: Modal para consultar la evolución de peso, IMC y tendencia.
// =========================================================================

import React from 'react';
import { X, Scale, Calendar, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { PersonaVigilanciaItem } from '../../../../../../modules/nutrition/types/nutrition.types';

interface ModalHistorialNutricionalProps {
  isOpen: boolean;
  onClose: () => void;
  persona: PersonaVigilanciaItem | null;
  onNuevoControl: () => void;
}

export const ModalHistorialNutricional: React.FC<ModalHistorialNutricionalProps> = ({
  isOpen,
  onClose,
  persona,
  onNuevoControl,
}) => {
  if (!isOpen || !persona) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Cabecera */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-50 text-[#166E7A] border border-teal-200/80">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-slate-900">{persona.nombreCompleto}</h3>
                <span className="font-mono text-[11px] font-extrabold text-[#166E7A] bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  {persona.expediente}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {persona.edadTexto} • Grupo: {persona.grupoEtario} • Estado: {persona.clasificacionActual}
              </p>
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

        {/* Contenido */}
        <div className="p-5 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-600">
              Evolución Antropométrica y Controles ({persona.historialEvaluaciones.length})
            </h4>
            <button
              type="button"
              onClick={() => {
                onClose();
                onNuevoControl();
              }}
              className="text-xs font-bold text-[#166E7A] hover:underline cursor-pointer"
            >
              + Agregar Nueva Evaluación
            </button>
          </div>

          {persona.historialEvaluaciones.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <p className="text-xs font-bold text-slate-700">Sin controles registrados aún</p>
              <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                Esta persona se encuentra en vigilancia, pero aún no tiene evaluaciones registradas durante las jornadas.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {persona.historialEvaluaciones.map((evalItem) => {
                return (
                  <div
                    key={evalItem.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-[#166E7A]/40 transition space-y-2.5 shadow-2xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-[#166E7A]" />
                        <span className="text-xs font-extrabold text-slate-900">{evalItem.fechaControl}</span>
                        {evalItem.imc && (
                          <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                            IMC: {evalItem.imc} kg/m²
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full border bg-slate-50 text-slate-700 border-slate-200">
                        {evalItem.clasificacion}
                      </span>
                    </div>

                    {/* Fila de medidas */}
                    <div className="grid grid-cols-3 gap-2 p-2 rounded-xl bg-slate-50 text-[11px] text-slate-600">
                      <div>
                        <span className="text-slate-400 block text-[9.5px]">Peso</span>
                        <strong>{evalItem.pesoKg} kg</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9.5px]">Talla</span>
                        <strong>{evalItem.tallaM} m</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9.5px]">Variación</span>
                        <strong className="flex items-center gap-0.5">
                          {evalItem.cambioPesoKg !== null && evalItem.cambioPesoKg !== undefined ? (
                            evalItem.cambioPesoKg > 0 ? (
                              <>
                                <TrendingUp className="w-3 h-3 text-emerald-600" />
                                <span>+{evalItem.cambioPesoKg} kg</span>
                              </>
                            ) : evalItem.cambioPesoKg < 0 ? (
                              <>
                                <TrendingDown className="w-3 h-3 text-rose-600" />
                                <span>{evalItem.cambioPesoKg} kg</span>
                              </>
                            ) : (
                              <>
                                <Minus className="w-3 h-3 text-slate-400" />
                                <span>0.0 kg</span>
                              </>
                            )
                          ) : (
                            'Línea base'
                          )}
                        </strong>
                      </div>
                    </div>

                    {/* Situaciones reportadas */}
                    {evalItem.situacionesIdentificadas && evalItem.situacionesIdentificadas.length > 0 && (
                      <div className="text-[10.5px]">
                        <span className="text-slate-400 font-semibold block mb-0.5">Situaciones identificadas:</span>
                        <div className="flex flex-wrap gap-1">
                          {evalItem.situacionesIdentificadas.map((sit, i) => (
                            <span key={i} className="bg-rose-50 text-rose-700 px-2 py-0.5 rounded text-[10px]">
                              • {sit}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Educación brindada */}
                    {evalItem.temasEducacion && evalItem.temasEducacion.length > 0 && (
                      <div className="text-[10.5px]">
                        <span className="text-slate-400 font-semibold block mb-0.5">Consejería entregada:</span>
                        <div className="flex flex-wrap gap-1">
                          {evalItem.temasEducacion.map((edu, i) => (
                            <span key={i} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px]">
                              ✓ {edu}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pie */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium">Historial acumulado en expediente clínico</span>
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