// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/pacientes/registrar/components/RegistrarPacienteHeader.tsx
// DESCRIPCIÓN: Encabezado contextual de Registro de Paciente con botón de retorno exterior.
// =========================================================================

import React from 'react';
import { UserPlus, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const RegistrarPacienteHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      {/* Botón de Retorno Exterior */}
      <button
        type="button"
        onClick={() => navigate('/brigadista/pacientes/buscar')}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-teal-700 transition-colors cursor-pointer group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
        <span>Volver a Búsqueda</span>
      </button>

      {/* Banner Institucional Superior */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-[#2B7A78] via-[#236866] to-[#1B5250] p-6 sm:p-7 text-white shadow-sm border border-teal-700/50">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-teal-200">
            <UserPlus className="w-3.5 h-3.5" />
            <span>Alta Nominal &bull; Nuevo Expediente</span>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Registrar Paciente
            </h1>
            <p className="text-xs sm:text-sm text-teal-100/90 font-medium max-w-2xl">
              Crea el expediente clínico, la cuenta de acceso y genera el carnet digital de identificación territorial.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};