// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/salud-materna/citas-prenatales/components/CitasPrenatalesEmpty.tsx
// DESCRIPCIÓN: Estado vacío para cuando no hay citas registradas o coincidentes.
// =========================================================================

import React from 'react';
import { CalendarPlus, CalendarClock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CitasPrenatalesEmptyProps {
  isFiltered?: boolean;
}

export const CitasPrenatalesEmpty: React.FC<CitasPrenatalesEmptyProps> = ({
  isFiltered = false,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-8 sm:p-12 text-center select-none shadow-sm space-y-4">
      <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 mx-auto shadow-xs">
        <CalendarClock className="w-6 h-6 stroke-2" />
      </div>

      <div className="space-y-1 max-w-md mx-auto">
        <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
          {isFiltered
            ? 'No hay citas en esta categoría'
            : 'No tienes citas prenatales registradas'}
        </h3>
        <p className="text-xs text-slate-500 font-medium leading-relaxed">
          {isFiltered
            ? 'Prueba seleccionando otra pestaña para ver otras citas de tu historial obstétrico.'
            : 'Los controles periódicos garantizan la salud tuya y de tu bebé. Agenda tu próxima cita con el equipo de salud.'}
        </p>
      </div>

      {!isFiltered && (
        <button
          type="button"
          onClick={() => navigate('/paciente/citas/agendar')}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0F766E] hover:bg-[#0d645e] active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <CalendarPlus className="w-4 h-4" />
          <span>Agendar Primera Cita Prenatal</span>
        </button>
      )}
    </div>
  );
};

export default CitasPrenatalesEmpty;