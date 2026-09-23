// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/notificaciones/centro/components/NotificacionesHeader.tsx
// DESCRIPCIÓN: Cabecera oficial del Centro de Notificaciones con banner verde
//              institucional (#1c5752) idéntico a Descarga de Expediente.
// =========================================================================

import React from 'react';
import { Bell, CheckCheck, RotateCw, Clock, Sparkles } from 'lucide-react';

interface NotificacionesHeaderProps {
  unreadCount: number;
  loading: boolean;
  onMarkAllAsRead: () => void;
  onRefresh: () => void;
}

export const NotificacionesHeader: React.FC<NotificacionesHeaderProps> = ({
  unreadCount,
  loading,
  onMarkAllAsRead,
  onRefresh,
}) => {
  return (
    <div className="bg-[#1c5752] rounded-3xl border border-[#164743] p-6 sm:p-8 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 text-white select-none">
      <div className="space-y-3">
        {/* Píldora superior institucional */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-semibold bg-white/10 text-teal-100 border border-white/15 backdrop-blur-xs">
          <Sparkles className="w-3.5 h-3.5 text-teal-200" />
          <span>Centro Oficial de Eventos y Avisos · MedicOS 2026</span>
          {unreadCount > 0 && (
            <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/30 ml-1">
              {unreadCount} nuevas
            </span>
          )}
        </div>

        {/* Título e Ícono */}
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-2xl bg-white/10 border border-white/15 text-white flex items-center justify-center shrink-0">
            <Bell className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Centro de Notificaciones
            </h1>
            <p className="text-xs sm:text-sm text-teal-100/90 font-medium mt-1 leading-relaxed max-w-2xl">
              Consulta y mantente al día con tus citas, consultas, recetas y documentos oficiales registrados en MedicOS.
            </p>
          </div>
        </div>
      </div>

      {/* Zona Derecha: Fecha de actualización y acciones rápidas */}
      <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-3 shrink-0">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/10 text-teal-100 border border-white/15 text-xs font-mono backdrop-blur-xs">
          <Clock className="w-3.5 h-3.5 text-teal-200" />
          <span>Última actualización: 21 de septiembre de 2026</span>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={onMarkAllAsRead}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-teal-50 text-[#1c5752] text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
            >
              <CheckCheck className="w-4 h-4 text-[#1c5752]" />
              <span>Marcar todas como leídas</span>
            </button>
          )}

          <button
            type="button"
            onClick={onRefresh}
            title="Actualizar notificaciones"
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 transition cursor-pointer shadow-xs active:scale-95"
          >
            <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin text-white' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificacionesHeader;