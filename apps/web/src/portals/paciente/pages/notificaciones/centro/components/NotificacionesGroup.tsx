// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/notificaciones/centro/components/NotificacionesGroup.tsx
// DESCRIPCIÓN: Bloque cronológico agrupado (Hoy, Esta semana, Anteriores).
// =========================================================================

import React from 'react';
import { Clock } from 'lucide-react';
import { NotificacionCard, type NotificationCardData } from './NotificacionCard.js';

interface NotificacionesGroupProps {
  label: string;
  items: NotificationCardData[];
  onActionClick: (item: NotificationCardData) => void;
  onMarkAsRead: (id: string, e: React.MouseEvent) => void;
}

export const NotificacionesGroup: React.FC<NotificacionesGroupProps> = ({
  label,
  items,
  onActionClick,
  onMarkAsRead,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-1">
        <Clock className="w-3.5 h-3.5 text-[#1c5752]" />
        <h2 className="text-xs font-black uppercase tracking-wider text-slate-600">
          {label}
        </h2>
        <span className="text-[11px] font-mono text-slate-400">({items.length})</span>
      </div>

      <div className="space-y-2.5">
        {items.map((item) => (
          <NotificacionCard
            key={item.id}
            item={item}
            onActionClick={onActionClick}
            onMarkAsRead={onMarkAsRead}
          />
        ))}
      </div>
    </div>
  );
};

export default NotificacionesGroup;