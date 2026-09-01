// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/dashboard/resumen/components/EstadoJornadaOperativaCard.tsx
// DESCRIPCIÓN: Tarjeta de control de jornada con estética limpia y botones del Admin.
// =========================================================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

interface EstadoJornadaOperativaCardProps {
  jornadaActiva: boolean;
  nombreBrigada: string;
  ubicacion?: string;
  horaInicio?: string;
}

export const EstadoJornadaOperativaCard: React.FC<EstadoJornadaOperativaCardProps> = ({
  jornadaActiva,
  nombreBrigada,
  ubicacion,
  horaInicio,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-start sm:items-center gap-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-xs border ${
            jornadaActiva
              ? 'bg-teal-50 border-teal-100 text-[#2B7A78]'
              : 'bg-amber-50 border-amber-100 text-amber-600'
          }`}
        >
          {jornadaActiva ? <ShieldCheck className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                jornadaActiva
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                  : 'bg-amber-50 text-amber-700 border-amber-200/60'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  jornadaActiva ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`}
              />
              {jornadaActiva ? 'Jornada Activa en Terreno' : 'Sin Jornada Activa'}
            </span>

            {horaInicio && (
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#2B7A78]" /> Inicio: {horaInicio}
              </span>
            )}
          </div>

          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
            {nombreBrigada}
          </h2>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#2B7A78] shrink-0" />
            <span>
              Ubicación / Comunidad: <strong className="text-slate-700">{ubicacion || 'Comunidad en territorio'}</strong>
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0">
        <button
          onClick={() => navigate('/brigadista/brigada/jornada')}
          className="px-4 py-2.5 bg-[#2B7A78] hover:bg-[#236866] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs hover:shadow-md transition-all duration-200 active:scale-95 flex items-center gap-2 cursor-pointer"
        >
          <span>Gestionar Jornada</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};