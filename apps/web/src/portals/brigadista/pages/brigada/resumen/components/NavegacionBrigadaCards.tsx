// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/brigada/resumen/components/NavegacionBrigadaCards.tsx
// DESCRIPCIÓN: Dos accesos directos tácticos con estilo y bordes Admin.
// =========================================================================

import React from 'react';
import { Calendar, Users, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NavegacionBrigadaCards: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        Exploración y Detalle
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 1. Ver Jornada */}
        <div
          onClick={() => navigate('/brigadista/brigada/jornada')}
          className="group bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#2B7A78] shadow-xs">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200/60">
                Operación
              </span>
            </div>

            <div className="mt-4">
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#2B7A78] transition-colors">
                Jornada Territorial
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Ver el desarrollo, equipo multidisciplinario asignado y control del turno actual.
              </p>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 w-full inline-flex items-center justify-between text-xs font-semibold text-[#2B7A78] group-hover:text-[#1B5250] transition-colors">
            <span>Ver jornada</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>

        {/* 2. Ver Pacientes */}
        <div
          onClick={() => navigate('/brigadista/brigada/pacientes')}
          className="group bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-xs">
                <Users className="w-5 h-5" />
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
                Padrón
              </span>
            </div>

            <div className="mt-4">
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                Pacientes de la Brigada
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Consultar el padrón territorial, expedientes y personas asociadas a esta brigada.
              </p>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 w-full inline-flex items-center justify-between text-xs font-semibold text-blue-600 group-hover:text-blue-700 transition-colors">
            <span>Ver pacientes</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </div>
  );
};