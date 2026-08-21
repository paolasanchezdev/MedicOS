// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/dashboard/resumen/components/TarjetaBienvenidaBrigadista.tsx
// DESCRIPCIÓN: Banner / Tarjeta de bienvenida institucional para el Brigadista.
// =========================================================================

import React from 'react';
import {
  Shield,
  RefreshCw,
  Calendar,
  MapPin,
  Clock,
  Activity,
  Users,
} from 'lucide-react';

export interface TarjetaBienvenidaBrigadistaProps {
  firstName?: string;
  lastName?: string;
  nombreBrigada?: string;
  ubicacion?: string;
  estadoJornada?: 'activa' | 'inactiva' | string;
  fechaFormatted?: string;
  horaInicio?: string;
  totalPacientesAtendidos?: number;
  totalPendientes?: number;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const TarjetaBienvenidaBrigadista: React.FC<TarjetaBienvenidaBrigadistaProps> = ({
  firstName,
  lastName,
  nombreBrigada = 'Brigada Médica Comunitaria',
  ubicacion,
  estadoJornada = 'activa',
  fechaFormatted,
  horaInicio = '08:00 AM',
  totalPacientesAtendidos = 0,
  totalPendientes = 0,
  onRefresh,
  isRefreshing,
}) => {
  const horaActual = new Date().getHours();

  let saludo = '¡Bienvenido(a)';
  if (horaActual >= 5 && horaActual < 12) {
    saludo = '¡Buenos días';
  } else if (horaActual >= 12 && horaActual < 19) {
    saludo = '¡Buenas tardes';
  } else if (horaActual >= 19 || horaActual < 5) {
    saludo = '¡Buenas noches';
  }

  const nombreCompleto = [firstName, lastName].filter(Boolean).join(' ');
  const tituloBrigadista = nombreCompleto || 'Brigadista';
  const isJornadaActive = estadoJornada === 'activa';

  // Limpieza robusta para evitar duplicados en la insignia de ubicación
  const limpiarTextoUbicacion = (brigada: string = '', ub: string = '') => {
    const bTrim = brigada.trim();
    const uTrim = (ub || '').trim();

    if (!bTrim) return uTrim;
    if (!uTrim) return bTrim;
    if (bTrim === uTrim) return bTrim;

    // Si la brigada ya contiene la ubicación, evitamos concatenarla de nuevo
    if (bTrim.toLowerCase().includes(uTrim.toLowerCase())) {
      return bTrim;
    }

    return `${bTrim} • ${uTrim}`;
  };

  const textoUbicacionFinal = limpiarTextoUbicacion(nombreBrigada, ubicacion);

  const fechaHoyRaw =
    fechaFormatted ||
    new Date().toLocaleDateString('es-SV', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const fechaHoy = fechaHoyRaw.charAt(0).toUpperCase() + fechaHoyRaw.slice(1);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#2B7A78] via-[#236866] to-[#1B5250] p-6 sm:p-7 text-white shadow-sm border border-teal-700/50">
      {/* Resplandor y patrón decorativo de fondo */}
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
      <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-3">
          {/* Badges de Estado y Brigada */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-teal-100 shadow-2xs">
              <Shield className="w-3.5 h-3.5 text-teal-200" />
              <span>Portal Brigadista • Operativo</span>
            </div>

            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md border shadow-2xs ${
                isJornadaActive
                  ? 'bg-emerald-500/20 text-emerald-100 border-emerald-400/30'
                  : 'bg-amber-500/20 text-amber-100 border-amber-400/30'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isJornadaActive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
              <span>{isJornadaActive ? 'Jornada activa' : 'Jornada inactiva'}</span>
            </div>

            {textoUbicacionFinal && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-teal-100 shadow-2xs">
                <MapPin className="w-3.5 h-3.5 text-teal-200" />
                <span>{textoUbicacionFinal}</span>
              </div>
            )}
          </div>

          {/* Título de Bienvenida */}
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            {saludo}, {tituloBrigadista}!
          </h1>

          {/* Métricas y Fecha */}
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-teal-100/90 font-medium">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-200 shrink-0" />
              <span>{fechaHoy}</span>
            </div>

            {isJornadaActive && horaInicio && (
              <>
                <span className="hidden sm:inline text-teal-300/40">&bull;</span>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-teal-200 shrink-0" />
                  <span>Inicio: {horaInicio}</span>
                </div>
              </>
            )}

            <span className="hidden sm:inline text-teal-300/40">&bull;</span>

            <div className="flex items-center gap-1.5 text-emerald-300 font-semibold">
              <Activity className="w-4 h-4 shrink-0" />
              <span>
                {totalPacientesAtendidos}{' '}
                {totalPacientesAtendidos === 1 ? 'atendido hoy' : 'atendidos hoy'}
              </span>
            </div>

            <span className="hidden sm:inline text-teal-300/40">&bull;</span>

            <div className="flex items-center gap-1.5 text-amber-300 font-semibold">
              <Users className="w-4 h-4 shrink-0" />
              <span>
                {totalPendientes}{' '}
                {totalPendientes === 1 ? 'pendiente' : 'pendientes'}
              </span>
            </div>
          </div>
        </div>

        {/* Botón de Actualizar */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-teal-50 text-[#1B5250] text-xs sm:text-sm font-bold rounded-xl shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed shrink-0"
        >
          <RefreshCw className={`w-4 h-4 text-[#2B7A78] ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? 'Actualizando...' : 'Actualizar datos'}</span>
        </button>
      </div>
    </div>
  );
};