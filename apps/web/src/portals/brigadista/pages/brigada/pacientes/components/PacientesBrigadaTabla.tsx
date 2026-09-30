// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/brigada/pacientes/components/PacientesBrigadaTabla.tsx
// DESCRIPCIÓN: Padrón de pacientes con diseño responsivo híbrido: tarjetas táctiles
//              fluidas en móviles (< md) para evitar compresión de texto y tabla
//              estructurada en pantallas de escritorio (>= md).
// =========================================================================

import React, { useState } from 'react';
import {
  User,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  Send,
  PlusCircle,
  Activity,
  ChevronRight as ArrowRightIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { PacienteBrigadaItem } from '../../../../../../modules/brigades';

interface PacientesBrigadaTablaProps {
  pacientes: PacienteBrigadaItem[];
}

const ITEMS_PER_PAGE = 10;

export const PacientesBrigadaTabla: React.FC<PacientesBrigadaTablaProps> = ({ pacientes }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<number>(1);

  const totalPages = Math.max(1, Math.ceil(pacientes.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = pacientes.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const renderBadgeEstado = (estado: PacienteBrigadaItem['estadoBrigada'], tieneRiesgo: boolean) => {
    switch (estado) {
      case 'EVALUADO':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 shrink-0">
            <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600" />
            Evaluado
          </span>
        );
      case 'SEGUIMIENTO':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60 shrink-0">
            <AlertTriangle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-600" />
            Seguimiento
          </span>
        );
      case 'REFERIDO':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200/60 shrink-0">
            <Send className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-purple-600" />
            Referido
          </span>
        );
      default:
        return (
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold border shrink-0 ${
              tieneRiesgo
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : 'bg-slate-100 text-slate-600 border-slate-200/80'
            }`}
          >
            {tieneRiesgo ? (
              <AlertTriangle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-rose-600" />
            ) : (
              <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400" />
            )}
            {tieneRiesgo ? 'En Espera (Alerta)' : 'En Espera'}
          </span>
        );
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all duration-200 overflow-hidden">
      {/* Cabecera del Listado */}
      <div className="p-3.5 sm:p-5 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
          Padrón de Pacientes del Turno
        </h2>
        <span className="text-[11px] sm:text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200/60">
          {pacientes.length} {pacientes.length === 1 ? 'Paciente' : 'Pacientes'}
        </span>
      </div>

      {/* 1. VISTA MÓVIL: Tarjetas Clínicas (< md) */}
      <div className="block md:hidden divide-y divide-slate-100">
        {currentItems.length === 0 ? (
          <div className="py-10 px-4 text-center text-slate-400 italic text-xs">
            No se encontraron pacientes asociados con los criterios seleccionados.
          </div>
        ) : (
          currentItems.map((p) => {
            const esPendiente = p.estadoBrigada === 'PENDIENTE';

            return (
              <div
                key={p.id}
                onClick={() => navigate(`/brigadista/pacientes/expediente?id=${p.id}`)}
                className="p-3.5 hover:bg-slate-50/80 transition-colors cursor-pointer space-y-2.5 active:bg-slate-50"
              >
                {/* Fila 1: Avatar, Nombre sin romper y Estado */}
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-start gap-2.5 min-w-0 flex-1">
                    <div
                      className={`w-9 h-9 rounded-xl border flex items-center justify-center font-bold shrink-0 mt-0.5 ${
                        p.tieneRiesgo
                          ? 'bg-rose-50 border-rose-200 text-rose-700'
                          : 'bg-teal-50 border-teal-100 text-[#1B5250]'
                      }`}
                    >
                      <User className="w-4 h-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-snug">
                          {p.nombreCompleto}
                        </h4>
                        {p.tieneRiesgo && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-rose-100 text-rose-800 shrink-0">
                            Alerta
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium mt-0.5">
                        <span className="font-mono text-slate-700 font-bold">
                          {p.dui ? `DUI: ${p.dui}` : 'Sin DUI'}
                        </span>
                        <span>•</span>
                        <span>{p.edad} años</span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 pt-0.5">
                    {renderBadgeEstado(p.estadoBrigada, p.tieneRiesgo)}
                  </div>
                </div>

                {/* Fila 2: Triage y Signos Vitales (si constan) */}
                {p.ultimaEvaluacion && (
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span className="text-slate-500 font-medium">Triage:</span>
                      <span
                        className={`font-mono font-bold ${
                          p.tieneRiesgo ? 'text-rose-700' : 'text-slate-800'
                        }`}
                      >
                        PA {p.ultimaEvaluacion.pa}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-slate-500">
                      Temp: {p.ultimaEvaluacion.temp} | SpO2: {p.ultimaEvaluacion.spo2}
                    </span>
                  </div>
                )}

                {/* Fila 3: Botón de Acción Móvil */}
                <div className="pt-0.5">
                  {esPendiente ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(
                          `/brigadista/atencion/nueva?patientId=${p.id}&nombre=${encodeURIComponent(
                            p.nombreCompleto
                          )}&dui=${encodeURIComponent(p.dui)}`
                        );
                      }}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#2B7A78] hover:bg-[#236866] text-white rounded-xl text-xs font-bold transition shadow-xs active:scale-95 cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Atender Paciente</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/brigadista/pacientes/expediente?id=${p.id}`);
                      }}
                      className="w-full inline-flex items-center justify-center gap-1 px-3 py-2 text-xs font-bold text-[#1B5250] bg-teal-50 hover:bg-teal-100 border border-teal-200/80 rounded-xl transition cursor-pointer active:scale-95 group/btn"
                    >
                      <span>Ver Expediente Clínico</span>
                      <ArrowRightIcon className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 2. VISTA ESCRITORIO: Tabla Clásica (>= md) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-4 px-5">Paciente</th>
              <th className="py-4 px-5">Edad</th>
              <th className="py-4 px-5">Estado</th>
              <th className="py-4 px-5">Signos Vitales / Alerta</th>
              <th className="py-4 px-5 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-400 italic">
                  No se encontraron pacientes asociados con los criterios seleccionados.
                </td>
              </tr>
            ) : (
              currentItems.map((p) => {
                const esPendiente = p.estadoBrigada === 'PENDIENTE';

                return (
                  <tr
                    key={p.id}
                    onClick={() => navigate(`/brigadista/pacientes/expediente?id=${p.id}`)}
                    className="hover:bg-slate-50/80 transition-colors duration-150 cursor-pointer group/row"
                  >
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl border flex items-center justify-center font-bold shrink-0 ${
                            p.tieneRiesgo
                              ? 'bg-rose-50 border-rose-200 text-rose-700'
                              : 'bg-slate-100 border-slate-200/60 text-slate-600'
                          }`}
                        >
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 group-hover/row:text-[#2B7A78] transition-colors">
                              {p.nombreCompleto}
                            </span>
                            {p.tieneRiesgo && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-rose-100 text-rose-800">
                                Alerta
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono block">
                            DUI: {p.dui}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-5 text-slate-700 font-medium">
                      {p.edad} años
                    </td>

                    <td className="py-4 px-5">
                      {renderBadgeEstado(p.estadoBrigada, p.tieneRiesgo)}
                    </td>

                    {/* Signos Vitales y Alertas de Triage */}
                    <td className="py-4 px-5">
                      {p.ultimaEvaluacion ? (
                        <div className="space-y-0.5 text-[11px]">
                          <span
                            className={`font-mono font-bold block ${
                              p.tieneRiesgo ? 'text-rose-700' : 'text-slate-700'
                            }`}
                          >
                            PA: {p.ultimaEvaluacion.pa}
                          </span>
                          <span className="text-slate-400 font-mono text-[10px]">
                            Temp: {p.ultimaEvaluacion.temp} | SpO2: {p.ultimaEvaluacion.spo2}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">Sin toma previa</span>
                      )}
                    </td>

                    {/* Botón de Acción según el estado operativo */}
                    <td className="py-4 px-5 text-right">
                      {esPendiente ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(
                              `/brigadista/atencion/nueva?patientId=${p.id}&nombre=${encodeURIComponent(
                                p.nombreCompleto
                              )}&dui=${encodeURIComponent(p.dui)}`
                            );
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#2B7A78] hover:bg-[#236866] text-white rounded-xl text-xs font-bold transition-all shadow-2xs active:scale-95 cursor-pointer"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>Atender</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/brigadista/pacientes/expediente?id=${p.id}`);
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-[#2B7A78] hover:text-[#1B5250] hover:bg-teal-50 rounded-xl transition-all cursor-pointer group/btn"
                        >
                          <span>Expediente</span>
                          <ArrowRightIcon className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación Compartida */}
      {totalPages > 1 && (
        <div className="p-3.5 sm:p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, pacientes.length)} de{' '}
            {pacientes.length}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 sm:p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
              aria-label="Página anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-bold text-slate-800 text-xs px-1">
              {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 sm:p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
              aria-label="Página siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PacientesBrigadaTabla;