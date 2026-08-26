// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/brigada/jornada/components/AccionesJornada.tsx
// DESCRIPCIÓN: Accesos rápidos operativos para la jornada en curso.
// =========================================================================

import React from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, HeartPulse, Users, Clock, Calendar } from 'lucide-react';

export const AccionesJornada: React.FC = () => {
  return (
    <div className="bg-medicos-surface border border-medicos-soft-border rounded-2xl p-6 shadow-xs space-y-4">
      <span className="text-xs font-black text-medicos-dark-blue uppercase tracking-wider block">
        Acciones Operativas de la Jornada
      </span>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <Link
          to="/brigadista/pacientes/registrar"
          className="p-3.5 bg-medicos-canvas hover:bg-medicos-light-bg/50 border border-medicos-soft-border hover:border-medicos-teal rounded-xl text-center space-y-1.5 transition-all group block"
        >
          <UserPlus size={18} className="text-medicos-teal mx-auto group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-medicos-dark-blue block truncate">Registrar Paciente</span>
        </Link>

        <Link
          to="/brigadista/evaluacion/signos-vitales"
          className="p-3.5 bg-medicos-canvas hover:bg-medicos-light-bg/50 border border-medicos-soft-border hover:border-medicos-teal rounded-xl text-center space-y-1.5 transition-all group block"
        >
          <HeartPulse size={18} className="text-medicos-teal mx-auto group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-medicos-dark-blue block truncate">Realizar Triage</span>
        </Link>

        <Link
          to="/brigadista/brigada/pacientes"
          className="p-3.5 bg-medicos-canvas hover:bg-medicos-light-bg/50 border border-medicos-soft-border hover:border-medicos-teal rounded-xl text-center space-y-1.5 transition-all group block"
        >
          <Users size={18} className="text-medicos-teal mx-auto group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-medicos-dark-blue block truncate">Ver Pacientes</span>
        </Link>

        <Link
          to="/brigadista/brigada/resumen"
          className="p-3.5 bg-medicos-canvas hover:bg-medicos-light-bg/50 border border-medicos-soft-border hover:border-medicos-teal rounded-xl text-center space-y-1.5 transition-all group block"
        >
          <Calendar size={18} className="text-medicos-teal mx-auto group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-medicos-dark-blue block truncate">Ver Resumen</span>
        </Link>

        <Link
          to="/brigadista/consultas/pendientes"
          className="p-3.5 bg-medicos-canvas hover:bg-medicos-light-bg/50 border border-medicos-soft-border hover:border-medicos-teal rounded-xl text-center space-y-1.5 transition-all group block col-span-2 sm:col-span-1"
        >
          <Clock size={18} className="text-medicos-teal mx-auto group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-medicos-dark-blue block truncate">Ver Pendientes</span>
        </Link>
      </div>
    </div>
  );
};