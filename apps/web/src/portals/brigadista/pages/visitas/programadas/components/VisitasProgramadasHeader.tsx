// =========================================================================
// ARCHIVO: VisitasProgramadasHeader.tsx
// DESCRIPCIÓN: Encabezado institucional de Visitas Domiciliarias Programadas.
//              Fecha dinámica real del sistema y navegación directa.
// =========================================================================

import React from 'react';
import { Home, Calendar, RefreshCw, Plus, UserSearch } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface VisitasProgramadasHeaderProps {
  onActualizar: () => void;
  onProgramarVisita: () => void;
  loading?: boolean;
}

export const VisitasProgramadasHeader: React.FC<VisitasProgramadasHeaderProps> = ({
  onActualizar,
  onProgramarVisita,
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
            <Home className="w-3.5 h-3.5 text-teal-200" />
            <span>Continuidad Asistencial • Visitas Domiciliarias en Terreno</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
            Visitas Domiciliarias Programadas
          </h1>

          <div className="flex items-center gap-1.5 text-[11px] font-medium text-teal-100/90">
            <Calendar className="w-3.5 h-3.5 text-teal-200" />
            <span>{fechaFormateada} • Agenda Operativa de Campo</span>
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
            onClick={() => navigate('/brigadista/pacientes/buscar')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-bold transition active:scale-95 cursor-pointer"
          >
            <UserSearch className="w-3.5 h-3.5" />
            <span>Buscar Paciente</span>
          </button>

          <button
            type="button"
            onClick={onProgramarVisita}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-teal-50 text-[#166E7A] text-xs font-black shadow-xs transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ Programar Visita</span>
          </button>
        </div>
      </div>
    </div>
  );
};