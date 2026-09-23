// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/salud-materna/control-embarazo/components/ControlEmbarazoEmpty.tsx
// DESCRIPCIÓN: Estado cuando la paciente no cuenta con un embarazo activo registrado.
// =========================================================================

import React from 'react';
import { Baby, CalendarPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ControlEmbarazoEmpty: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 text-center max-w-lg mx-auto space-y-4 shadow-2xs select-none">
      <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-700 border border-teal-100 flex items-center justify-center mx-auto shadow-2xs">
        <Baby className="w-7 h-7 stroke-2" />
      </div>

      <div className="space-y-1.5">
        <h3 className="text-base sm:text-lg font-black text-slate-900">
          No hay un embarazo activo registrado
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
          Cuando el personal de salud registre tu control prenatal o confirmación obstétrica en tu expediente clínico, el seguimiento y evolución aparecerán aquí.
        </p>
      </div>

      <div className="pt-3 flex flex-wrap items-center justify-center gap-2.5">
        <button
          type="button"
          onClick={() => navigate('/paciente/citas/agendar')}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-2xl shadow-xs transition cursor-pointer"
        >
          <CalendarPlus className="w-4 h-4" />
          <span>Agendar cita médica</span>
        </button>
      </div>
    </div>
  );
};

export default ControlEmbarazoEmpty;