// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/citas/agendar/components/SlotPicker.tsx
// DESCRIPCIÓN: Selector de fecha y bloques horarios (mañana / tarde).
// =========================================================================

import React, { useMemo } from 'react';
import { Calendar as CalendarIcon, Loader2, Sun, Moon } from 'lucide-react';

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
  const morningSlots = useMemo(() => {
    return slots.filter((s) => {
      const hour = parseInt(s.time.split(':')[0], 10);
      return hour < 12;
    });
  }, [slots]);

  const afternoonSlots = useMemo(() => {
    return slots.filter((s) => {
      const hour = parseInt(s.time.split(':')[0], 10);
      return hour >= 12;
    });
  }, [slots]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-2.5">
        <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <CalendarIcon size={15} className="text-[#0e7490]" />
          2. Fecha y Horario de Atención <span className="text-rose-600">*</span>
        </label>
        <span className="text-[11px] font-medium text-slate-500">
          Turnos estándar de 30 minutos
        </span>
      </div>

      {/* Selector de Fecha */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <input
            type="date"
            min={minDate}
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-full pl-3.5 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 focus:outline-hidden"
          />
        </div>
        <span className="text-xs text-slate-500">
          {new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </span>
      </div>

      {/* Bloques de Horarios */}
      {isLoading ? (
        <div className="flex items-center justify-center gap-2.5 text-xs text-slate-500 py-8 bg-slate-50/60 rounded-2xl border border-slate-200/60">
          <Loader2 size={16} className="animate-spin text-[#0e7490]" />
          <span>Calculando bloques disponibles...</span>
        </div>
      ) : slots.length === 0 ? (
        <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl text-xs text-amber-800 font-medium">
          No hay turnos disponibles para este día. Por favor elige otra fecha en el calendario.
        </div>
      ) : (
        <div className="space-y-3 pt-1">
          {/* Turno Mañana */}
          {morningSlots.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1 uppercase tracking-wider">
                <Sun size={13} className="text-amber-500" />
                Mañana (08:00 - 12:00)
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                {morningSlots.map((slot) => {
                  const isSelected = selectedSlot?.dateTime === slot.dateTime;
                  return (
                    <button
                      key={slot.dateTime}
                      type="button"
                      onClick={() => onSelectSlot(slot)}
                      className={`py-2 px-2.5 rounded-xl text-xs font-mono font-bold transition-all border cursor-pointer ${
                        isSelected
                          ? 'bg-[#0e7490] text-white border-[#0e7490] shadow-sm'
                          : 'bg-slate-50/80 text-slate-700 border-slate-200 hover:bg-white hover:border-slate-300'
                      }`}
                    >
                      {slot.time}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Turno Tarde */}
          {afternoonSlots.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1 uppercase tracking-wider">
                <Moon size={13} className="text-indigo-500" />
                Tarde (14:00 - 17:00)
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                {afternoonSlots.map((slot) => {
                  const isSelected = selectedSlot?.dateTime === slot.dateTime;
                  return (
                    <button
                      key={slot.dateTime}
                      type="button"
                      onClick={() => onSelectSlot(slot)}
                      className={`py-2 px-2.5 rounded-xl text-xs font-mono font-bold transition-all border cursor-pointer ${
                        isSelected
                          ? 'bg-[#0e7490] text-white border-[#0e7490] shadow-sm'
                          : 'bg-slate-50/80 text-slate-700 border-slate-200 hover:bg-white hover:border-slate-300'
                      }`}
                    >
                      {slot.time}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};