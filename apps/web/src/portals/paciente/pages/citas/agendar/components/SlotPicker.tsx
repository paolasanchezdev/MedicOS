// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/citas/agendar/components/SlotPicker.tsx
// DESCRIPCIÓN: Selector de fecha y visualizador de bloques de 30 minutos disponibles.
// =========================================================================

import React from 'react';
import { Calendar as CalendarIcon, Clock, Loader2 } from 'lucide-react';

export interface AvailableSlot {
  time: string;
  dateTime: string;
}

interface SlotPickerProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  minDate: string;
  slots: AvailableSlot[];
  selectedSlot: AvailableSlot | null;
  onSelectSlot: (slot: AvailableSlot) => void;
  isLoading: boolean;
}

export const SlotPicker: React.FC<SlotPickerProps> = ({
  selectedDate,
  onDateChange,
  minDate,
  slots,
  selectedSlot,
  onSelectSlot,
  isLoading,
}) => {
  return (
    <div className="space-y-4">
      {/* Selector de Fecha */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <CalendarIcon size={14} className="text-[#0e7490]" />
          2. Selecciona la Fecha de la Consulta <span className="text-rose-600">*</span>
        </label>
        <input
          type="date"
          min={minDate}
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          className="w-full sm:max-w-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 focus:outline-hidden"
        />
      </div>

      {/* Bloques de Horarios Libres */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <Clock size={14} className="text-[#0e7490]" />
          3. Horarios Disponibles para esta Fecha <span className="text-rose-600">*</span>
        </label>

        {isLoading ? (
          <div className="flex items-center gap-2 text-xs text-slate-500 p-4 bg-slate-50 rounded-xl">
            <Loader2 size={15} className="animate-spin text-[#0e7490]" />
            <span>Calculando bloques libres del médico...</span>
          </div>
        ) : slots.length === 0 ? (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 font-medium">
            No hay horarios disponibles para el día seleccionado. Intenta con otra fecha.
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {slots.map((slot) => {
              const isSelected = selectedSlot?.dateTime === slot.dateTime;
              return (
                <button
                  key={slot.dateTime}
                  type="button"
                  onClick={() => onSelectSlot(slot)}
                  className={`py-2 px-2 rounded-xl text-xs font-mono font-bold transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-[#0e7490] text-white border-[#0e7490] shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  {slot.time}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};