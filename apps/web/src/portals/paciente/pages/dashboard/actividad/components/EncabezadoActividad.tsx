// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/dashboard/actividad/components/EncabezadoActividad.tsx
// DESCRIPCIÓN: Cabecera institucional para la bitácora de actividad médica.
// =========================================================================

import React from 'react';
import { Activity } from 'lucide-react';

interface EncabezadoActividadProps {
  totalActividades?: number;
}

export const EncabezadoActividad: React.FC<EncabezadoActividadProps> = ({ totalActividades }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100/80 flex items-center justify-center text-[#2a726d] shadow-2xs shrink-0">
            <Activity className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              Mi Actividad Médica
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Consulta y revisa la bitácora cronológica de atenciones, diagnósticos y constantes vitales.
            </p>
          </div>
        </div>

        {typeof totalActividades === 'number' && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-teal-50 text-[#2a726d] border border-teal-200/60 shadow-2xs self-start sm:self-center">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2a726d] animate-pulse" />
            <span>
              {totalActividades} {totalActividades === 1 ? 'registro' : 'registros'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EncabezadoActividad;