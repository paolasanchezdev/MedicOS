// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/brigada/pacientes/components/PacientesBrigadaTabla.tsx
// DESCRIPCIÓN: Padrón de pacientes con badges semánticos exactos y redirección al expediente.
// =========================================================================

import React, { useState } from 'react';
import { User, AlertTriangle, ChevronLeft, ChevronRight, CheckCircle2, Clock, Send, ChevronRight as ArrowRightIcon } from 'lucide-react';
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

  const renderBadgeEstado = (estado: PacienteBrigadaItem['estadoBrigada']) => {
    switch (estado) {
      case 'EVALUADO':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Evaluado
          </span>
        );
      case 'SEGUIMIENTO':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            Seguimiento
          </span>
        );
      case 'REFERIDO':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200/60">
            <Send className="w-3.5 h-3.5 text-purple-600" />
            Referido
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200/80">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            Pendiente
          </span>
        );
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
          Padrón de Pacientes
        </h2>
        <span className="text-xs font-semibold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/60">
          {pacientes.length} {pacientes.length === 1 ? 'Paciente' : 'Pacientes'}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-4 px-5">Paciente</th>
              <th className="py-4 px-5">Edad</th>
              <th className="py-4 px-5">Estado</th>
              <th className="py-4 px-5">Última Atención</th>
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
              currentItems.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => navigate(`/brigadista/pacientes/expediente?id=${p.id}`)}
                  className="hover:bg-slate-50/80 transition-colors duration-150 cursor-pointer group/row"
                >
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200/60 flex items-center justify-center text-slate-600 font-bold shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 group-hover/row:text-[#2B7A78] transition-colors block">
                          {p.nombreCompleto}
                        </span>
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
                    {renderBadgeEstado(p.estadoBrigada)}
                  </td>

                  <td className="py-4 px-5 font-mono text-slate-600">
                    {p.ultimaActividad}
                  </td>

                  <td className="py-4 px-5 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/brigadista/pacientes/expediente?id=${p.id}`);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-[#2B7A78] hover:text-[#1B5250] hover:bg-teal-50 rounded-xl transition-all cursor-pointer group/btn"
                    >
                      <span>Ver</span>
                      <ArrowRightIcon className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            Mostrando {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, pacientes.length)} de {pacientes.length}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-bold text-slate-800">
              {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};