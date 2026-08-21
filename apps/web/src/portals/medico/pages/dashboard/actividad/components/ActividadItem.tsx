// =========================================================================
// ARCHIVO: apps/web/src/portals/medico/pages/dashboard/actividad/components/ActividadItem.tsx
// DESCRIPCIÓN: Fila individual corregida con importación de tipo.
// =========================================================================

import React from 'react';
import { Stethoscope, Pill, HeartPulse, FileSpreadsheet, Eye, User } from 'lucide-react';
import { EstadoActividad } from './EstadoActividad';
// Soluciona error TS verbatimModuleSyntax
import type { ActividadMedicoItem } from '../ActividadMedicoPage';

interface ActividadItemProps {
  item: ActividadMedicoItem;
  onSelect: (item: ActividadMedicoItem) => void;
}

export const ActividadItem: React.FC<ActividadItemProps> = ({ item, onSelect }) => {
  const getActionIcon = (action: string) => {
    if (action.includes('PRESCRIPTION') || action.includes('RECETA')) {
      return <Pill className="w-4 h-4 text-teal-600" />;
    }
    if (action.includes('VITAL') || action.includes('SIGNO')) {
      return <HeartPulse className="w-4 h-4 text-amber-600" />;
    }
    if (action.includes('DIAGNOSIS') || action.includes('CIE')) {
      return <FileSpreadsheet className="w-4 h-4 text-indigo-600" />;
    }
    return <Stethoscope className="w-4 h-4 text-emerald-600" />;
  };

  const formatearFecha = (fechaStr: string) => {
    try {
      const d = new Date(fechaStr);
      return d.toLocaleTimeString('es-SV', { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch {
      return fechaStr;
    }
  };

  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors text-xs text-slate-700">
      {/* Paciente */}
      <td className="p-4 font-medium">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs shrink-0">
            <User className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-slate-800">{item.patientName || 'Paciente No Especificado'}</div>
            <div className="text-[11px] text-slate-400 font-mono">DUI: {item.patientDui || 'N/A'}</div>
          </div>
        </div>
      </td>

      {/* Acción Clínica */}
      <td className="p-4 font-semibold">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-slate-100 rounded-lg">
            {getActionIcon(item.action)}
          </div>
          <span className="text-slate-800">{item.actionLabel || item.action}</span>
        </div>
      </td>

      {/* Detalle o Diagnóstico */}
      <td className="p-4 max-w-xs truncate text-slate-500 font-normal">
        {item.description || 'Sin observaciones registradas'}
      </td>

      {/* Estado */}
      <td className="p-4">
        <EstadoActividad status={item.status || 'COMPLETED'} isOffline={item.isOffline} />
      </td>

      {/* Hora */}
      <td className="p-4 font-medium text-slate-500">
        {formatearFecha(item.createdAt)}
      </td>

      {/* Acción ver detalle */}
      <td className="p-4 text-right">
        <button
          onClick={() => onSelect(item)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 rounded-xl text-[11px] font-bold transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          Ver Detalle
        </button>
      </td>
    </tr>
  );
};