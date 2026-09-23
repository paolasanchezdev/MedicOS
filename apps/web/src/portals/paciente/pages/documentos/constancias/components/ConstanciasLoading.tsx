// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/documentos/constancias/components/ConstanciasLoading.tsx
// DESCRIPCIÓN: Skeleton de carga para la lista de constancias.
// =========================================================================

import React from 'react';

export const ConstanciasLoading: React.FC = () => {
  return (
    <div className="space-y-3 animate-pulse select-none">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-slate-200 rounded-2xl"></div>
              <div className="space-y-2">
                <div className="w-24 h-4 bg-slate-200 rounded-md"></div>
                <div className="w-48 h-5 bg-slate-200 rounded-md"></div>
              </div>
            </div>
            <div className="w-28 h-4 bg-slate-200 rounded-md"></div>
          </div>
          <div className="w-full h-10 bg-slate-100 rounded-xl"></div>
        </div>
      ))}
    </div>
  );
};

export default ConstanciasLoading;