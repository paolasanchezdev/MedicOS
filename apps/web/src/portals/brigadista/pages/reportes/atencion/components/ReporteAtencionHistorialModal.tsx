// =========================================================================
// ARCHIVO: ReporteAtencionHistorialModal.tsx
// DESCRIPCIÓN: Modal de auditoría con historial de reportes de morbilidad generados.
// =========================================================================

import React from 'react';
import { X, History, FileText, Calendar, Activity } from 'lucide-react';
import type { ReporteMorbilidadHistoricoItem } from '../../../../../../modules/reports/types/reports.types';

interface ReporteAtencionHistorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  historial: ReporteMorbilidadHistoricoItem[];
  onSeleccionarReporte: (codigo: string) => void;
}

export const ReporteAtencionHistorialModal: React.FC<ReporteAtencionHistorialModalProps> = ({
  isOpen,
  onClose,
  historial,
  onSeleccionarReporte,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-xl max-h-[85vh] flex flex-col overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-teal-50 text-[#166E7A] border border-teal-200">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                Historial de Reportes de Morbilidad
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Auditoría de informes clínicos SOAP emitidos y archivados localmente
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

        <div className="p-4 overflow-y-auto divide-y divide-slate-100 flex-1 text-xs space-y-1">
          {historial.length === 0 ? (
            <div className="p-8 text-center text-slate-400 space-y-1">
              <FileText className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="font-bold text-slate-700">Sin reportes archivados previamente</p>
              <p className="text-[11px]">
                Los consolidados de morbilidad que emitas en PDF quedarán registrados aquí para su reimpresión.
              </p>
            </div>
          ) : (
            historial.map((h) => (
              <div
                key={h.id}
                className="p-3 hover:bg-slate-50 rounded-xl transition flex items-center justify-between gap-3"
              >
                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-[#166E7A]">
                      {h.codigoReporte}
                    </span>
                    <span className="text-[10.5px] text-slate-500 font-medium flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{h.fechaGeneracion}</span>
                    </span>
                  </div>
                  <p className="font-bold text-slate-900 truncate flex items-center gap-1">
                    <Activity className="w-3 h-3 text-slate-400" />
                    <span>Período: {h.periodoTexto}</span>
                  </p>
                  <p className="text-[10.5px] text-slate-500">
                    Por {h.generadoPor} • {h.totalAtenciones} atenciones • {h.pacientesUnicos} pacientes únicos
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onSeleccionarReporte(h.codigoReporte);
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition cursor-pointer shrink-0"
                >
                  Consultar
                </button>
              </div>
            ))
          )}
        </div>

        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};