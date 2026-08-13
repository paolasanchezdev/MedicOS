// =========================================================================
// ARCHIVO: apps/web/src/portals/admin/pages/dashboard/actividad/components/ActividadItem.tsx
// DESCRIPCIÓN: Renglón individual de la tabla de auditoría con información del actor y acción.
// =========================================================================

import React from 'react';
import type { AuditLogItem } from '../../../../../../modules/admin/types/admin-dashboard.types';
import { EstadoActividad } from './EstadoActividad';
import { User } from 'lucide-react';

interface ActividadItemProps {
  item: AuditLogItem;
  onSelect: (item: AuditLogItem) => void;
}

export const ActividadItem: React.FC<ActividadItemProps> = ({ item, onSelect }) => {
  const formattedDate = new Date(item.createdAt).toLocaleString('es-SV', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <tr
      onClick={() => onSelect(item)}
      className="group hover:bg-emerald-50/30 cursor-pointer transition-all duration-200 text-xs text-slate-600 border-b border-slate-100 last:border-0"
    >
      <td className="p-4 font-medium text-slate-900">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-slate-100 rounded-lg text-emerald-600/70">
            <User className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="block font-semibold text-slate-900">
              {item.user ? `${item.user.firstName} ${item.user.lastName}` : 'Sistema / Job'}
            </span>
            <span className="text-[10px] text-slate-400">{item.user?.email || 'N/A'}</span>
          </div>
        </div>
      </td>

      <td className="p-4">
        <span className="px-2 py-1 bg-slate-100/80 font-mono text-[10px] rounded-md text-slate-600 border border-slate-200/50">
          {item.user?.role || 'SYSTEM'}
        </span>
      </td>

      <td className="p-4">
        <EstadoActividad action={item.action} />
      </td>

      <td className="p-4 font-medium text-slate-700">{item.entity}</td>

      <td className="p-4 text-slate-500">{formattedDate}</td>

      <td className="p-4 text-right font-mono text-slate-400 text-[11px]">
        {item.ipAddress || item.device?.serialNumber || 'Central'}
      </td>
    </tr>
  );
};