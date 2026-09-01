// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/atencion/historial/components/HistorialAtencionesHeader.tsx
// DESCRIPCIÓN: Encabezado contextual con botón de retorno, fecha y brigada activa.
// =========================================================================

import React from 'react';
import { ArrowLeft, Calendar, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const HistorialAtencionesHeader: React.FC = () => {
  const navigate = useNavigate();

  const todayFormatted = new Date().toLocaleDateString('es-SV', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-[#1B5250] to-[#2B7A78] p-6 sm:p-8 text-white shadow-md">
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={() => navigate('/brigadista/dashboard/resumen')}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold text-teal-100 hover:text-white bg-white/10 hover:bg-white/15 border border-white/15 transition mb-3 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver al Panel</span>
          </button>

          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Historial de Atenciones
          </h1>
          <p className="text-xs sm:text-sm text-teal-100/90 font-medium mt-1 max-w-xl leading-relaxed">
            Consulta y trazabilidad de atenciones comunitarias registradas en jornadas de campo.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-center flex-wrap">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs font-semibold backdrop-blur-md">
            <Calendar className="w-3.5 h-3.5 text-teal-200" />
            <span>{todayFormatted}</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs font-semibold backdrop-blur-md">
            <MapPin className="w-3.5 h-3.5 text-teal-200" />
            <span>Jornada Activa</span>
          </div>
        </div>
      </div>
    </div>
  );
};