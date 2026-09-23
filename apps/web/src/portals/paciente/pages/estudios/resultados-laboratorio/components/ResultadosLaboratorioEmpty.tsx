// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/estudios/resultados-laboratorio/components/ResultadosLaboratorioEmpty.tsx
// DESCRIPCIÓN: Estado vacío para pacientes sin estudios registrados.
// =========================================================================

import React from 'react';
import { FlaskConical } from 'lucide-react';

export const ResultadosLaboratorioEmpty: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-10 text-center text-xs text-slate-500 shadow-2xs space-y-3.5 max-w-xl mx-auto select-none">
      <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 text-medicos-teal flex items-center justify-center mx-auto shadow-2xs">
        <FlaskConical className="w-6 h-6" />
      </div>

      <div className="space-y-1">
        <h2 className="text-base font-black text-slate-900">
          No tienes resultados de laboratorio registrados
        </h2>
        <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
          Cuando se procese un estudio clínico o análisis en tu expediente médico, los parámetros y rangos de referencia aparecerán aquí.
        </p>
      </div>
    </div>
  );
};

export default ResultadosLaboratorioEmpty;