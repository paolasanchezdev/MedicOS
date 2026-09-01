// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/pacientes/buscar/components/BuscarPacienteHeader.tsx
// DESCRIPCIÓN: Cabecera contextual para la localización de pacientes.
// =========================================================================

import React from 'react';
import { Search, UserCheck } from 'lucide-react';

interface BuscarPacienteHeaderProps {
  totalResultados?: number;
}

export const BuscarPacienteHeader: React.FC<BuscarPacienteHeaderProps> = ({ totalResultados }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-[#2B7A78] via-[#236866] to-[#1B5250] p-6 sm:p-7 text-white shadow-sm border border-teal-700/50">
      <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-teal-100 shadow-2xs">
            <Search className="w-3.5 h-3.5 text-teal-200" />
            <span>Módulo de Pacientes &bull; Búsqueda Nominal</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Buscar Paciente
          </h1>

          <p className="text-xs sm:text-sm text-teal-100/90 font-medium">
            Localiza personas registradas en MedicOS por nombre, DUI o identificador clínico.
          </p>
        </div>

        {totalResultados !== undefined && totalResultados > 0 && (
          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-white shrink-0">
            <UserCheck className="w-4 h-4 text-teal-300" />
            <span>{totalResultados} {totalResultados === 1 ? 'coincidencia' : 'coincidencias'}</span>
          </div>
        )}
      </div>
    </div>
  );
};