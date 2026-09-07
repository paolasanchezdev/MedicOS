// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/citas/agendar/components/SlotPicker.tsx
// DESCRIPCIÓN: Selector de fecha y bloques horarios (mañana / tarde) alineado
//              con la paleta visual y diseño institucional de MedicOS.
// =========================================================================

import React, { useMemo } from 'react';
import { Calendar as CalendarIcon, Loader2, Sun, Moon, Clock } from 'lucide-react';

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

  const formattedDateLabel = useMemo(() => {
    if (!selectedDate) return '';
    try {
      const dateObj = new Date(`${selectedDate}T00:00:00`);
      const raw = dateObj.toLocaleDateString('es-SV', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      return raw.charAt(0).toUpperCase() + raw.slice(1);
    } catch {
      return selectedDate;
    }
  }, [selectedDate]);

  return (
    <div className="space-y-4">
      {/* Cabecera del Paso */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200/80 pb-3">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-[#2B7A78]" />
            2. Fecha y Horario de Consulta <span className="text-rose-500">*</span>
          </label>
          <p className="text-xs text-slate-500 mt-0.5">
            Selecciona el día y turno disponible para tu atención médica.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200/80 self-start sm:self-auto">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          Turnos estándar de 30 min
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
            className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-[#2B7A78] rounded-xl text-xs sm:text-sm font-semibold text-slate-900 outline-none transition-all duration-150"
          />
        </div>
        {formattedDateLabel && (
          <span className="text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200/80 px-3 py-2 rounded-xl">
            {formattedDateLabel}
          </span>
        )}
      </div>

      {/* Bloques de Horarios */}
      {isLoading ? (
        <div className="flex items-center justify-center gap-2.5 text-xs text-slate-500 py-10 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <Loader2 className="w-4 h-4 animate-spin text-[#2B7A78]" />
          <span>Consultando turnos libres para esta fecha...</span>
        </div>
      ) : slots.length === 0 ? (
        <div className="p-4 bg-amber-50/90 border border-amber-200/80 rounded-2xl text-xs text-amber-900 font-medium space-y-1">
          <p className="font-bold">No hay turnos disponibles para este día</p>
          <p className="text-amber-700">Por favor, selecciona una fecha distinta en el calendario.</p>
        </div>
      ) : (
        <div className="space-y-4 pt-1">
          {/* Turno Mañana */}
          {morningSlots.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1.5 uppercase tracking-wider">
                <Sun className="w-3.5 h-3.5 text-amber-500" />
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
                          ? 'bg-[#2B7A78] text-white border-[#2B7A78] shadow-sm ring-2 ring-[#2B7A78]/20'
                          : 'bg-white text-slate-700 border-slate-200/90 hover:bg-slate-50 hover:border-slate-300'
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
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1.5 uppercase tracking-wider">
                <Moon className="w-3.5 h-3.5 text-indigo-500" />
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
                          ? 'bg-[#2B7A78] text-white border-[#2B7A78] shadow-sm ring-2 ring-[#2B7A78]/20'
                          : 'bg-white text-slate-700 border-slate-200/90 hover:bg-slate-50 hover:border-slate-300'
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

export default SlotPicker;