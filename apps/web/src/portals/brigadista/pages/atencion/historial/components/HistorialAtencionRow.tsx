// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/atencion/historial/components/HistorialAtencionRow.tsx
// DESCRIPCIÓN: Componentes individuales de fila de tabla y tarjeta móvil para atenciones.
// =========================================================================

import React from 'react';
import { Eye, CheckCircle2, RotateCw, AlertTriangle } from 'lucide-react';
import type { AttentionHistoryItem } from '../../../../../../modules/atencion';

interface HistorialAtencionRowProps {
  attention: AttentionHistoryItem;
  onSelect: (item: AttentionHistoryItem) => void;
}

function formatDate(d: string): string {
  try {
    const dateObj = new Date(d);
    return dateObj.toLocaleDateString('es-SV', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return d;
  }
}

function extractCategory(text: string): string {
  if (text.includes('MALESTAR_SINTOMAS')) return 'Malestar / Síntomas';
  if (text.includes('CONTROL_RUTINA')) return 'Control de Rutina';
  if (text.includes('SEGUIMIENTO')) return 'Seguimiento';
  if (text.includes('PREVENCION')) return 'Prevención';
  if (text.includes('VACUNACION_APOYO')) return 'Vacunación';
  if (text.includes('MATERNO_INFANTIL')) return 'Materno-Infantil';
  if (text.includes('ORIENTACION_SALUD')) return 'Orientación';
  if (text.includes('PRIMEROS_AUXILIOS')) return 'Primeros Auxilios';
  return 'Atención en Terreno';
}

// ==========================================
// 1. FILA PARA ESCRITORIO (HTML <tr> VÁLIDO)
// ==========================================
export const HistorialAtencionRow: React.FC<HistorialAtencionRowProps> = ({
  attention,
  onSelect,
}) => {
  const patientFullName = `${attention.patient.firstName} ${attention.patient.lastName}`.trim();
  const categoryLabel = extractCategory(attention.chiefComplaint || attention.diagnosisDesc);

  return (
    <tr className="hover:bg-slate-50/80 transition-colors">
      <td className="py-3.5 px-4">
        <div className="min-w-0">
          <p className="font-extrabold text-slate-900 truncate">{patientFullName}</p>
          <p className="text-[11px] text-slate-400 font-mono">
            {attention.patient.dui ? `DUI: ${attention.patient.dui}` : 'Sin DUI'}
          </p>
        </div>
      </td>

      <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap font-medium">
        {formatDate(attention.consultationDate)}
      </td>

      <td className="py-3.5 px-4">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-teal-50 text-teal-800 border border-teal-200/60">
          {categoryLabel}
        </span>
      </td>

      <td className="py-3.5 px-4 text-slate-500 font-medium whitespace-nowrap">
        {attention.brigade?.name || 'Jornada Territorial'}
      </td>

      <td className="py-3.5 px-4 whitespace-nowrap">
        {attention.syncStatus === 'SYNCED' ? (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Sincronizada
          </span>
        ) : attention.syncStatus === 'PENDING' ? (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/60">
            <RotateCw className="w-3 h-3 text-amber-600" />
            Pendiente sinc.
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200/60">
            <AlertTriangle className="w-3 h-3 text-rose-600" />
            Error sinc.
          </span>
        )}
      </td>

      <td className="py-3.5 px-4 text-right whitespace-nowrap">
        <button
          type="button"
          onClick={() => onSelect(attention)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-200 hover:border-teal-200 text-xs font-bold transition cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Ver detalle</span>
        </button>
      </td>
    </tr>
  );
};

// ==========================================
// 2. TARJETA PARA DISPOSITIVOS MÓVILES (<div>)
// ==========================================
export const HistorialAtencionCard: React.FC<HistorialAtencionRowProps> = ({
  attention,
  onSelect,
}) => {
  const patientFullName = `${attention.patient.firstName} ${attention.patient.lastName}`.trim();
  const categoryLabel = extractCategory(attention.chiefComplaint || attention.diagnosisDesc);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3 shadow-2xs">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="font-extrabold text-slate-900 text-sm">{patientFullName}</h4>
          <p className="text-[11px] text-slate-400 font-mono">
            {attention.patient.dui ? `DUI: ${attention.patient.dui}` : 'Sin DUI'}
          </p>
        </div>

        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200/60">
          {categoryLabel}
        </span>
      </div>

      <div className="space-y-1 text-xs text-slate-500 pt-1 border-t border-slate-100">
        <p className="flex justify-between">
          <span>Fecha:</span>
          <span className="font-bold text-slate-700">{formatDate(attention.consultationDate)}</span>
        </p>
        <p className="flex justify-between">
          <span>Jornada:</span>
          <span className="text-slate-700">{attention.brigade?.name || 'Jornada Territorial'}</span>
        </p>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <div>
          {attention.syncStatus === 'SYNCED' ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Sincronizada
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700">
              <RotateCw className="w-3.5 h-3.5 text-amber-600" />
              Pendiente sinc.
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => onSelect(attention)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold cursor-pointer transition"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Ver detalle</span>
        </button>
      </div>
    </div>
  );
};