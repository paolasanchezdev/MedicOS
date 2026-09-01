// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/promocion-prevencion/vacunacion/registro/components/VacunacionHeader.tsx
// DESCRIPCIÓN: Banner institucional completo de registro de vacunas con estética Admin Portal,
//              onda médica ECG, fecha actual, subtítulo descriptivo y estado de conectividad.
// =========================================================================

import React from 'react';
import { ArrowLeft, Wifi, WifiOff, ShieldCheck, Calendar, Syringe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface VacunacionHeaderProps {
  isOnline: boolean;
}

export const VacunacionHeader: React.FC<VacunacionHeaderProps> = ({ isOnline }) => {
  const navigate = useNavigate();

  const fechaHoyRaw = new Date().toLocaleDateString('es-SV', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const fechaHoy = fechaHoyRaw.charAt(0).toUpperCase() + fechaHoyRaw.slice(1);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-[#2B7A78] via-[#236866] to-[#1B5250] px-5 py-3.5 sm:px-6 text-white shadow-sm border border-teal-700/50">
      {/* Resplandor y patrón decorativo tipo onda médica ECG */}
      <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none hidden lg:block">
        <svg
          width="200"
          height="100"
          viewBox="0 0 200 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 50H50L62 15L78 85L92 35L102 60L112 50H190"
            stroke="white"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Contenido Principal */}
      <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="space-y-1.5 max-w-3xl">
          {/* Badge y Botón de Retorno */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => navigate('/brigadista/promocion-prevencion/vacunacion/resumen')}
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-bold text-teal-100 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md transition-all active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver a Resumen</span>
            </button>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-semibold text-teal-100 bg-white/10 backdrop-blur-md border border-white/20 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-200" />
              <span>Esquema Nacional de Inmunización &bull; MINSAL</span>
            </span>
          </div>

          {/* Título */}
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <Syringe className="w-6 h-6 text-teal-200 hidden sm:inline" />
            Registrar Aplicación de Vacuna
          </h1>

          {/* Subtítulo y Fecha */}
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-teal-100/90 font-medium">
            <span>Registro oficial de biológicos, trazabilidad de lotes y asignación en expediente clínico.</span>
            <span className="opacity-40 hidden sm:inline">&bull;</span>
            <span className="inline-flex items-center gap-1 text-teal-200 font-semibold shrink-0">
              <Calendar className="w-3.5 h-3.5" />
              {fechaHoy}
            </span>
          </div>
        </div>

        {/* Indicador de Conectividad */}
        <div className="self-start sm:self-center shrink-0">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border backdrop-blur-md shadow-2xs ${
              isOnline
                ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-100'
                : 'bg-rose-500/20 border-rose-400/40 text-rose-100 animate-pulse'
            }`}
          >
            {isOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-300" />
                <span>En Línea (Sincronizado)</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-rose-300" />
                <span>Modo Local (Outbox)</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VacunacionHeader;