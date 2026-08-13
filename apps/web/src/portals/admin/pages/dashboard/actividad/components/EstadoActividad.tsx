// =========================================================================
// ARCHIVO: apps/web/src/portals/admin/pages/dashboard/actividad/components/EstadoActividad.tsx
// DESCRIPCIÓN: Insignia de estado/acción estilizada para la bitácora.
// =========================================================================

import React from 'react';

interface EstadoActividadProps {
  action: string;
}

export const EstadoActividad: React.FC<EstadoActividadProps> = ({ action }) => {
  const act = action.toUpperCase();

  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';

  if (act.includes('CREATE') || act.includes('REGISTER')) {
    colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
  } else if (act.includes('UPDATE') || act.includes('SYNC')) {
    colorClasses = 'bg-sky-50 text-sky-700 border-sky-200/80';
  } else if (act.includes('DELETE') || act.includes('REMOVE')) {
    colorClasses = 'bg-rose-50 text-rose-700 border-rose-200/80';
  } else if (act.includes('LOGIN')) {
    colorClasses = 'bg-teal-50 text-teal-700 border-teal-200/80';
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-lg border ${colorClasses} tracking-wider shadow-2xs`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75" />
      {action}
    </span>
  );
};