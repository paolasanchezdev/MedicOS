// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/brigada/jornada/components/JornadaEquipoCard.tsx
// DESCRIPCIÓN: Equipo multidisciplinario real asignado a la brigada.
// =========================================================================

import React from 'react';
import { Users, Shield, User, UserX } from 'lucide-react';
import type { JornadaEquipoMiembro } from '../../../../../../modules/brigades';

interface JornadaEquipoCardProps {
  equipo: JornadaEquipoMiembro[];
}

export const JornadaEquipoCard: React.FC<JornadaEquipoCardProps> = ({ equipo }) => {
  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between h-full">
      <div className="space-y-4">
        {/* Cabecera */}
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-xs">
            <Users className="w-5 h-5" />
          </div>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
            {equipo.length} Miembros
          </span>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Personal Registrado
          </p>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight mt-0.5">
            Equipo Asignado
          </h2>
        </div>

        {/* Lista de Miembros Reales */}
        {equipo.length === 0 ? (
          <div className="p-6 bg-slate-50/70 rounded-xl border border-slate-100 text-center space-y-1">
            <UserX className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-bold text-slate-800">Sin miembros asignados</p>
            <p className="text-[11px] text-slate-500">
              No hay personal asignado a esta brigada en la tabla BrigadeMember.
            </p>
          </div>
        ) : (
          <div className="pt-2 space-y-2 text-xs max-h-72 overflow-y-auto pr-1">
            {equipo.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 border border-slate-100"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      m.esLider
                        ? 'bg-teal-50 border border-teal-200 text-[#2B7A78]'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {m.esLider ? <Shield className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>

                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 truncate">{m.nombre}</p>
                    <p className="text-[11px] text-slate-500 truncate">{m.rol}</p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                    m.esLider
                      ? 'bg-teal-50 text-teal-700 border-teal-200/60'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {m.esLider ? 'Responsable' : 'Operativo'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};