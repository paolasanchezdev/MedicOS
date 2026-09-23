// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/educacion-ia/consejos-personalizados/components/ConsejosPersonalizadosEmpty.tsx
// DESCRIPCIÓN: Estado cuando aún no existen registros suficientes en el expediente.
// =========================================================================

import React from 'react';
import { Sprout, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ConsejosPersonalizadosEmpty: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 text-center max-w-xl mx-auto space-y-4 select-none shadow-2xs">
      <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mx-auto shadow-2xs">
        <Sprout className="w-7 h-7" />
      </div>

      <div className="space-y-2">
        <h3 className="text-base sm:text-lg font-black text-slate-900">
          Aún estamos conociendo tus hábitos
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
          Registra tus vasos de agua, sesiones de actividad o metas de descanso para que podamos ofrecerte recomendaciones prácticas y personalizadas de autocuidado.
        </p>
      </div>

      <div className="pt-2">
        <button
          type="button"
          onClick={() => navigate('/paciente/monitoreo/habitos-estilo-vida')}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-extrabold rounded-2xl shadow-xs transition cursor-pointer"
        >
          <span>Ir a Estilo de Vida</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ConsejosPersonalizadosEmpty;