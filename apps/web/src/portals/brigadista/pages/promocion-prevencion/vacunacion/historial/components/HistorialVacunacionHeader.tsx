// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/promocion-prevencion/vacunacion/historial/components/HistorialVacunacionHeader.tsx
// DESCRIPCIÓN: Cabecera contextual con botón de retorno al resumen de vacunas.
// =========================================================================

import React from 'react';
import { ArrowLeft, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const HistorialVacunacionHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-[#1B5250] to-[#2B7A78] p-5 sm:p-6 text-white shadow-md">
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={() => navigate('/brigadista/promocion-prevencion/vacunacion/resumen')}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold text-teal-100 hover:text-white bg-white/10 hover:bg-white/15 border border-white/15 transition mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a Resumen de Vacunación</span>
          </button>

          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-teal-200" />
            <h1 className="text-lg sm:text-xl font-extrabold tracking-tight">
              Historial de Inmunización Territorial
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};