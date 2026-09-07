// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/expediente/consultas/components/HistorialConsultasEmpty.tsx
// DESCRIPCIÓN: Vista vacía con acción para agendar cita.
// =========================================================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileQuestion, Plus } from 'lucide-react';

export const HistorialConsultasEmpty: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-10 text-center space-y-4 shadow-2xs max-w-lg mx-auto my-8">
      <div className="w-14 h-14 bg-teal-50 text-[#2B7A78] rounded-full flex items-center justify-center mx-auto border border-teal-100">
        <FileQuestion className="w-7 h-7" />
      </div>

      <div className="space-y-1">
        <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
          Aún no tienes consultas registradas
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
          Cuando recibas atención médica en brigada o establecimiento, los informes de tus consultas aparecerán aquí.
        </p>
      </div>

      <div className="pt-2">
        <button
          type="button"
          onClick={() => navigate('/paciente/citas/agendar')}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2B7A78] hover:bg-[#236866] text-white text-xs font-bold rounded-xl shadow-xs transition active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Agendar una Cita Médica</span>
        </button>
      </div>
    </div>
  );
};

export default HistorialConsultasEmpty;