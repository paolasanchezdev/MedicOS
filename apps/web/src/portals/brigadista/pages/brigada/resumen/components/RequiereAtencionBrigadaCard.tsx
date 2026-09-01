// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/brigada/resumen/components/RequiereAtencionBrigadaCard.tsx
// DESCRIPCIÓN: Alertas de seguimientos y referencias pendientes con estilo Admin.
// =========================================================================

import React from 'react';
import { AlertTriangle, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RequiereAtencionBrigadaCardProps {
  seguimientosPendientes: number;
  referenciasRealizadas: number;
}

export const RequiereAtencionBrigadaCard: React.FC<RequiereAtencionBrigadaCardProps> = ({
  seguimientosPendientes,
  referenciasRealizadas,
}) => {
  const navigate = useNavigate();
  const tieneSituaciones = seguimientosPendientes > 0 || referenciasRealizadas > 0;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between h-full">
      <div className="space-y-4">
        {/* Cabecera */}
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shadow-xs">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
              tieneSituaciones
                ? 'bg-amber-50 text-amber-700 border-amber-200/60'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
            }`}
          >
            {tieneSituaciones ? 'Atención Requerida' : 'Sin Alertas'}
          </span>
        </div>

        {/* Título de Sección */}
        <div className="mt-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Casos y Excepciones
          </p>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight mt-0.5">
            Requiere Atención
          </h2>
        </div>

        {/* Listado de Situaciones */}
        {!tieneSituaciones ? (
          <div className="p-6 bg-slate-50/70 rounded-xl border border-slate-100 text-center space-y-1">
            <p className="text-xs font-bold text-slate-800">
              Sin situaciones críticas pendientes
            </p>
            <p className="text-[11px] text-slate-500">
              Todos los casos evaluados en la brigada se encuentran al día.
            </p>
          </div>
        ) : (
          <div className="space-y-2 text-xs">
            {seguimientosPendientes > 0 && (
              <div
                onClick={() => navigate('/brigadista/seguimiento')}
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-50/70 hover:bg-slate-100/80 border border-slate-100 text-slate-700 transition-colors cursor-pointer group/item"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                  <span className="font-medium text-slate-800 group-hover/item:text-[#2B7A78] transition-colors">
                    {seguimientosPendientes}{' '}
                    {seguimientosPendientes === 1
                      ? 'paciente tiene seguimiento pendiente'
                      : 'pacientes tienen seguimiento pendiente'}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover/item:text-[#2B7A78] group-hover/item:translate-x-0.5 transition-all shrink-0" />
              </div>
            )}

            {referenciasRealizadas > 0 && (
              <div
                onClick={() => navigate('/brigadista/consultas')}
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-50/70 hover:bg-slate-100/80 border border-slate-100 text-slate-700 transition-colors cursor-pointer group/item"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
                  <span className="font-medium text-slate-800 group-hover/item:text-[#2B7A78] transition-colors">
                    {referenciasRealizadas}{' '}
                    {referenciasRealizadas === 1
                      ? 'paciente fue referido a salud'
                      : 'pacientes fueron referidos a salud'}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover/item:text-[#2B7A78] group-hover/item:translate-x-0.5 transition-all shrink-0" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Acción / Redirección */}
      <button
        type="button"
        onClick={() => navigate('/brigadista/seguimiento')}
        className="mt-5 pt-3 border-t border-slate-100 w-full inline-flex items-center justify-between text-xs font-semibold text-[#2B7A78] hover:text-[#1B5250] transition-colors group/btn cursor-pointer"
      >
        <span>Revisar situaciones en seguimiento</span>
        <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
      </button>
    </div>
  );
};