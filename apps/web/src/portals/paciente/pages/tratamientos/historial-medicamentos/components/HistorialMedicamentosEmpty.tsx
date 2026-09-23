// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/tratamientos/historial-medicamentos/components/HistorialMedicamentosEmpty.tsx
// DESCRIPCIÓN: Estado vacío para pacientes sin fármacos registrados.
// =========================================================================

import React from 'react';
import { Pill, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HistorialMedicamentosEmpty: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-10 text-center text-xs text-slate-500 shadow-2xs space-y-3.5 max-w-xl mx-auto select-none">
      <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 text-medicos-teal flex items-center justify-center mx-auto shadow-2xs">
        <Pill className="w-6 h-6" />
      </div>

      <div className="space-y-1">
        <h2 className="text-base font-black text-slate-900">
          Aún no tienes medicamentos registrados
        </h2>
        <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
          Cuando se registre una consulta o receta médica en tu expediente, tus indicaciones farmacológicas aparecerán documentadas aquí.
        </p>
      </div>

      <div className="pt-2">
        <Link
          to="/paciente/tratamientos/recetas-activas"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-medicos-teal hover:text-[#16646e] transition"
        >
          <span>Consultar recetas activas</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default HistorialMedicamentosEmpty;