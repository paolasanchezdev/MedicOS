// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/brigada/resumen/components/AccionesRapidasBrigada.tsx
// DESCRIPCIÓN: Accesos directos a operaciones de campo del brigadista.
// =========================================================================

import React from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, HeartPulse, Users, Calendar, Clock } from 'lucide-react';

export const AccionesRapidasBrigada: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-3">
      <span className="text-xs font-black text-slate-800 uppercase tracking-wider block">
        Acciones Rápidas de Campo
      </span>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        <Link
          to="/brigadista/pacientes/registrar"
          className="p-3 bg-slate-50 hover:bg-teal-50/50 border border-slate-200 hover:border-teal-200 rounded-xl text-center space-y-1 transition-all group block"
        >
          <UserPlus size={18} className="text-[#0e7490] mx-auto group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-slate-800 block truncate">Registrar Paciente</span>
        </Link>

        <Link
          to="/brigadista/evaluacion/signos-vitales"
          className="p-3 bg-slate-50 hover:bg-teal-50/50 border border-slate-200 hover:border-teal-200 rounded-xl text-center space-y-1 transition-all group block"
        >
          <HeartPulse size={18} className="text-[#0e7490] mx-auto group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-slate-800 block truncate">Realizar Triage</span>
        </Link>

        <Link
          to="/brigadista/brigada/pacientes"
          className="p-3 bg-slate-50 hover:bg-teal-50/50 border border-slate-200 hover:border-teal-200 rounded-xl text-center space-y-1 transition-all group block"
        >
          <Users size={18} className="text-[#0e7490] mx-auto group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-slate-800 block truncate">Ver Pacientes</span>
        </Link>

        <Link
          to="/brigadista/brigada/jornada"
          className="p-3 bg-slate-50 hover:bg-teal-50/50 border border-slate-200 hover:border-teal-200 rounded-xl text-center space-y-1 transition-all group block"
        >
          <Calendar size={18} className="text-[#0e7490] mx-auto group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-slate-800 block truncate">Ver Jornada</span>
        </Link>

        <Link
          to="/brigadista/consultas/pendientes"
          className="p-3 bg-slate-50 hover:bg-teal-50/50 border border-slate-200 hover:border-teal-200 rounded-xl text-center space-y-1 transition-all group block col-span-2 sm:col-span-1"
        >
          <Clock size={18} className="text-[#0e7490] mx-auto group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-slate-800 block truncate">Ver Pendientes</span>
        </Link>
      </div>
    </div>
  );
};