// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/monitoreo/habitos-estilo-vida/components/EstiloVidaHeader.tsx
// DESCRIPCIÓN: Cabecera médica oficial en verde institucional limpio y minimalista.
// =========================================================================

import React from 'react';
import { ShieldCheck, Flame, Plus, Calendar } from 'lucide-react';

interface EstiloVidaHeaderProps {
  activeDaysCount: number;
  onOpenRecordActivity: () => void;
  onOpenCreateGoal: () => void;
}

export const EstiloVidaHeader: React.FC<EstiloVidaHeaderProps> = ({
  activeDaysCount,
  onOpenRecordActivity,
  onOpenCreateGoal,
}) => {
  const hoyStr = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-[#2B7A78] via-[#236866] to-[#1B5250] p-6 text-white shadow-sm border border-teal-700/50 select-none">
      <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-teal-100 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-200" />
            <span>Mi Diario de Bienestar &bull; MedicOS</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Hábitos y Estilo de Vida
          </h1>

          <p className="text-xs sm:text-sm text-teal-100/90 font-medium max-w-xl">
            Tu espacio personal de autocuidado. Registra tus hábitos diarios y mantén el equilibrio de tu salud preventiva.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          <div className="flex items-center gap-2 px-3.5 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-xs font-bold text-white shadow-2xs">
            <Calendar className="w-4 h-4 text-teal-200" />
            <span className="capitalize">{hoyStr}</span>
            <span className="text-teal-300">&bull;</span>
            <span className="text-emerald-300 font-extrabold">{activeDaysCount} días activos</span>
          </div>

          <button
            type="button"
            onClick={onOpenRecordActivity}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-teal-800 hover:bg-teal-50 text-xs font-bold rounded-2xl shadow-xs transition cursor-pointer"
          >
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>+ Actividad</span>
          </button>

          <button
            type="button"
            onClick={onOpenCreateGoal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold rounded-2xl text-white transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Meta semanal</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EstiloVidaHeader;