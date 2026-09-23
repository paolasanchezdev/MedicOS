// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/notificaciones/centro/components/NotificacionesLoading.tsx
// DESCRIPCIÓN: Estado de carga institucional mientras se obtienen eventos.
// =========================================================================

import React from 'react';
import { RotateCw } from 'lucide-react';

export const NotificacionesLoading: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center text-xs text-slate-400 space-y-3">
      <RotateCw className="w-6 h-6 animate-spin text-[#1c5752] mx-auto" />
      <p>Consultando eventos recientes del expediente...</p>
    </div>
  );
};

export default NotificacionesLoading;