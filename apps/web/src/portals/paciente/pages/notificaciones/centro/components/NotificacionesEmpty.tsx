// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/notificaciones/centro/components/NotificacionesEmpty.tsx
// DESCRIPCIÓN: Estado visual cuando no existen avisos en la categoría seleccionada.
// =========================================================================

import React from 'react';
import { Bell } from 'lucide-react';

interface NotificacionesEmptyProps {
  isUnreadFilter: boolean;
}

export const NotificacionesEmpty: React.FC<NotificacionesEmptyProps> = ({ isUnreadFilter }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center space-y-3 shadow-xs">
      <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
        <Bell className="w-6 h-6 text-slate-400" />
      </div>
      <h3 className="text-sm font-bold text-slate-800">No hay notificaciones en este filtro</h3>
      <p className="text-xs text-slate-500 max-w-sm mx-auto">
        {isUnreadFilter
          ? 'Te encuentras al día. Todas tus notificaciones han sido revisadas.'
          : 'No se registran eventos recientes en esta categoría.'}
      </p>
    </div>
  );
};

export default NotificacionesEmpty;