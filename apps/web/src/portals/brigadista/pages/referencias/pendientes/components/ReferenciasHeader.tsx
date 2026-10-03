// =========================================================================
// ARCHIVO: ReferenciasHeader.tsx
// DESCRIPCIÓN: Encabezado institucional de Referencias a la Red de Salud (F-01).
// =========================================================================

import React from 'react';
import { Share2, Plus, RefreshCw, History, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ReferenciasHeaderProps {
  onActualizar: () => void;
  loading?: boolean;
}

export const ReferenciasHeader: React.FC<ReferenciasHeaderProps> = ({
  onActualizar,
  loading = false,
}) => {
  const navigate = useNavigate();

  const fechaHoy = new Intl.DateTimeFormat('es-SV', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  const fechaFormateada = fechaHoy.charAt(0).toUpperCase() + fechaHoy.slice(1);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#166E7A] p-4 sm:p-5 text-white shadow-md">
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3.5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-teal-100 text-[11px] font-semibold">
            <Share2 className="w-3.5 h-3.5 text-teal-200" />
            <span>Continuidad Asistencial • Referencias a la Red de Salud (F-01)</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
            Referencias y Derivación Territorial
          </h1>

          <div className="flex items-center gap-1.5 text-[11px] font-medium text-teal-100/90">
            <Calendar className="w-3.5 h-3.5 text-teal-200" />
            <span>{fechaFormateada} • Trazabilidad Oficial MINSAL</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onActualizar}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-bold transition active:scale-95 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Actualizar</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/brigadista/referencias/historial')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-bold transition active:scale-95 cursor-pointer"
          >
            <History className="w-3.5 h-3.5" />
            <span>Historial F-01</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/brigadista/referencias/nueva')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-teal-50 text-[#166E7A] text-xs font-black shadow-xs transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ Nueva Referencia F-01</span>
          </button>
        </div>
      </div>
    </div>
  );
};