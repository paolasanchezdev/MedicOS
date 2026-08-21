// =========================================================================
// ARCHIVO: apps/web/src/portals/medico/pages/dashboard/resumen/components/TarjetaBienvenidaMedico.tsx
// DESCRIPCIÓN: Banner / Tarjeta de bienvenida institucional para el Médico.
// =========================================================================

import React from 'react';
import {
  Stethoscope,
  RefreshCw,
  Calendar,
  Award,
  Clock,
  Activity,
  UserCheck,
} from 'lucide-react';

export interface TarjetaBienvenidaMedicoProps {
  firstName?: string;
  lastName?: string;
  specialty?: string;
  medicalLicense?: string;
  activeShift?: string;
  patientsWaitingCount?: number;
  patientsAttendedCount?: number;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const TarjetaBienvenidaMedico: React.FC<TarjetaBienvenidaMedicoProps> = ({
  firstName,
  lastName,
  specialty,
  medicalLicense,
  activeShift,
  patientsWaitingCount = 0,
  patientsAttendedCount = 0,
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
  const tituloMedico = nombreCompleto ? `Dr(a). ${nombreCompleto}` : 'Doctor(a)';

  const fechaHoyRaw = new Date().toLocaleDateString('es-SV', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const fechaHoy = fechaHoyRaw.charAt(0).toUpperCase() + fechaHoyRaw.slice(1);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#2B7A78] via-[#236866] to-[#1B5250] p-6 sm:p-7 text-white shadow-sm border border-teal-700/50">
      {/* Resplandor y patrón decorativo de fondo tipo onda médica */}
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
          {/* Badges de Estado y Credenciales */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-teal-100 shadow-2xs">
              <Stethoscope className="w-3.5 h-3.5 text-teal-200" />
              <span>Estación Clínica{specialty ? ` \u2022 ${specialty}` : ''}</span>
            </div>

            {medicalLicense && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-teal-100 shadow-2xs">
                <Award className="w-3.5 h-3.5 text-amber-300" />
                <span>{medicalLicense}</span>
              </div>
            )}

            {activeShift && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-teal-100 shadow-2xs">
                <Clock className="w-3.5 h-3.5 text-teal-300" />
                <span>{activeShift}</span>
              </div>
            )}
          </div>

          {/* Título de Bienvenida */}
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            {saludo}, {tituloMedico}!
          </h1>

          {/* Métricas y Fecha */}
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-teal-100/90 font-medium">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-200 shrink-0" />
              <span>{fechaHoy}</span>
            </div>

            <span className="hidden sm:inline text-teal-300/40">&bull;</span>

            <div className="flex items-center gap-1.5 text-amber-300 font-semibold">
              <Activity className="w-4 h-4 shrink-0" />
              <span>
                {patientsWaitingCount}{' '}
                {patientsWaitingCount === 1 ? 'paciente en espera' : 'pacientes en espera'}
              </span>
            </div>

            <span className="hidden sm:inline text-teal-300/40">&bull;</span>

            <div className="flex items-center gap-1.5 text-emerald-300 font-semibold">
              <UserCheck className="w-4 h-4 shrink-0" />
              <span>
                {patientsAttendedCount}{' '}
                {patientsAttendedCount === 1 ? 'atención completada hoy' : 'atenciones completadas hoy'}
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
          <span>{isRefreshing ? 'Actualizando...' : 'Actualizar Estación'}</span>
        </button>
      </div>
    </div>
  );
};