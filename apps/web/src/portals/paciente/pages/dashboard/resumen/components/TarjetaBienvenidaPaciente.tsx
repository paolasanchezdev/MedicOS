// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/dashboard/resumen/components/TarjetaBienvenidaPaciente.tsx
// DESCRIPCIÓN: Banner institucional de bienvenida con diseño unificado MedicOS.
// =========================================================================

import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, PlusCircle, FileText, Calendar, Activity, FileCheck2 } from 'lucide-react';

export interface PacienteIdentificacionData {
  id?: string;
  nombreCompleto: string;
  dui?: string | null;
  fechaNacimiento?: string | null;
}

interface Props {
  paciente: PacienteIdentificacionData | null;
  usuarioSesionNombre?: string;
}

export const TarjetaBienvenidaPaciente: React.FC<Props> = ({ paciente, usuarioSesionNombre }) => {
  const nombreMostrar = paciente?.nombreCompleto || usuarioSesionNombre || 'Paciente';

  const fechaNac = paciente?.fechaNacimiento ? new Date(paciente.fechaNacimiento) : null;
  const fechaNacFormateada = fechaNac && !isNaN(fechaNac.getTime())
    ? fechaNac.toLocaleDateString('es-SV', { year: 'numeric', month: 'short', day: 'numeric' })
    : null;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-[#2B7A78] via-[#236866] to-[#1B5250] p-6 sm:p-7 text-white shadow-sm border border-teal-700/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
      {/* Resplandor decorativo de fondo */}
      <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Onda médica institucional en SVG */}
      <div className="absolute right-36 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none hidden lg:block">
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
      <div className="relative z-10 space-y-2.5">
        {/* Badges de Estado */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-teal-100 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-200" />
            <span>Expediente Activo &bull; Portal Paciente</span>
          </div>

          {paciente?.dui && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-teal-100 shadow-2xs">
              <FileCheck2 className="w-3.5 h-3.5 text-teal-200" />
              <span>DUI: {paciente.dui}</span>
            </div>
          )}
        </div>

        {/* Título */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            ¡Hola, {nombreMostrar}!
          </h1>
          <p className="text-xs sm:text-sm text-teal-100/90 mt-0.5 font-medium">
            Panel de Control Clínico — Sistema Integrado de Salud MedicOS
          </p>
        </div>

        {/* Metadatos inferiores */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-teal-100/90 pt-1 font-medium">
          {fechaNacFormateada && (
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-teal-200" />
              Nacimiento: <strong className="text-white font-semibold">{fechaNacFormateada}</strong>
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-teal-200" />
            Estado: Sincronizado
          </span>
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="relative z-10 flex flex-col sm:flex-row items-stretch md:items-center gap-3 shrink-0">
        <Link
          to="/paciente/citas/agendar"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-teal-50 text-[#1B5250] text-xs sm:text-sm font-bold rounded-xl shadow-sm hover:shadow-md transition-all duration-200 active:scale-95"
        >
          <PlusCircle className="w-4 h-4 text-[#2B7A78]" />
          <span>Solicitar Cita</span>
        </Link>
        <Link
          to="/paciente/expediente"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold rounded-xl border border-white/20 backdrop-blur-md shadow-2xs transition-all duration-200 active:scale-95"
        >
          <FileText className="w-4 h-4 text-teal-200" />
          <span>Ver Expediente</span>
        </Link>
      </div>
    </div>
  );
};

export default TarjetaBienvenidaPaciente;