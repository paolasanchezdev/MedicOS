// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/tratamientos/recordatorios/components/RecordatoriosHeader.tsx
// DESCRIPCIÓN: Cabecera médica oficial en verde institucional con selector de día.
// =========================================================================

import React from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, ShieldCheck } from 'lucide-react';

interface RecordatoriosHeaderProps {
  selectedDate: Date;
  takenCount: number;
  totalToday: number;
  onPrevDay: () => void;
  onNextDay: () => void;
  onToday: () => void;
}

export const RecordatoriosHeader: React.FC<RecordatoriosHeaderProps> = ({
  selectedDate,
  takenCount,
  totalToday,
  onPrevDay,
  onNextDay,
  onToday,
}) => {
  const isToday =
    selectedDate.toDateString() === new Date().toDateString();

  const formattedDate = selectedDate.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-[#2B7A78] via-[#236866] to-[#1B5250] p-5 sm:p-6 text-white shadow-sm border border-teal-700/50 select-none">
      <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* Identidad */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-teal-100 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-200" />
            <span>Seguimiento Farmacoterapéutico &bull; MedicOS</span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
            Mis Recordatorios
          </h1>

          <p className="text-xs sm:text-sm text-teal-100/90 font-medium max-w-xl">
            Sigue tu tratamiento sin olvidar ninguna toma. Los horarios se derivan de tus prescripciones activas.
          </p>
        </div>

        {/* Selector de Fecha y Contador */}
        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          {/* Contador de Tomas */}
          <div className="flex items-center gap-2 px-3.5 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-xs font-bold text-white shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span className="font-black text-white tabular-nums">{takenCount} de {totalToday}</span>
            <span className="font-normal text-teal-100">completadas hoy</span>
          </div>

          {/* Navegador de Fecha */}
          <div className="inline-flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-1 shadow-2xs text-xs font-bold text-white">
            <button
              type="button"
              onClick={onPrevDay}
              className="p-1.5 rounded-xl hover:bg-white/15 text-teal-100 hover:text-white transition cursor-pointer"
              aria-label="Día anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onToday}
              className="px-3 py-1 text-center font-bold text-xs hover:text-teal-100 transition cursor-pointer"
            >
              <span className="capitalize">{isToday ? `Hoy, ${formattedDate}` : formattedDate}</span>
            </button>

            <button
              type="button"
              onClick={onNextDay}
              className="p-1.5 rounded-xl hover:bg-white/15 text-teal-100 hover:text-white transition cursor-pointer"
              aria-label="Día siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordatoriosHeader;