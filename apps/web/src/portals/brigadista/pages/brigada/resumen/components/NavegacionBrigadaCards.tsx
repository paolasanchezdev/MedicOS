// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/brigada/resumen/components/NavegacionBrigadaCards.tsx
// DESCRIPCIÓN: Panel de Despliegue de Jornadas alimentado con datos 100% reales
//              de PostgreSQL (WorkSession) sin registros ficticios.
// =========================================================================

import React from 'react';
import { Calendar, CheckCircle2, Clock, PlayCircle, User, HeartPulse } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { ResumenJornadaItem } from '../../../../../../modules/brigades';

interface NavegacionBrigadaCardsProps {
  enCurso?: boolean;
  jornadas?: ResumenJornadaItem[];
}

export const NavegacionBrigadaCards: React.FC<NavegacionBrigadaCardsProps> = ({
  jornadas = [],
}) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Cronograma Operativo de la Misión
          </p>
          <h3 className="text-base font-black text-slate-900">
            Jornadas Territoriales Registradas en la Brigada
          </h3>
        </div>

        <button
          type="button"
          onClick={() => navigate('/brigadista/brigada/jornada')}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2B7A78] hover:bg-[#236866] text-white text-xs font-bold rounded-xl shadow-xs transition active:scale-95 cursor-pointer"
        >
          <PlayCircle className="w-4 h-4" />
          <span>Ir a la Jornada de Hoy</span>
        </button>
      </div>

      {jornadas.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <Calendar className="w-8 h-8 text-slate-400 mx-auto" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-800">
              Sin jornadas registradas aún en esta brigada
            </h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Cada vez que abras un turno de trabajo (WorkSession) en terreno, quedará registrado
              oficialmente en este historial con su fecha, responsable y total de atenciones.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jornadas.map((j) => {
            const estaEnCurso = j.estado === 'STARTED';

            return (
              <div
                key={j.id}
                onClick={() => navigate('/brigadista/brigada/jornada')}
                className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col justify-between cursor-pointer hover:shadow-md transition-all ${
                  estaEnCurso ? 'border-[#2B7A78]/70 ring-1 ring-[#2B7A78]/30' : 'border-slate-200/80'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-900">
                      {j.fecha}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        estaEnCurso
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {estaEnCurso ? (
                        <>
                          <Clock className="w-3 h-3 text-emerald-600 animate-pulse" />
                          <span>Turno Activo</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-slate-500" />
                          <span>Concluida</span>
                        </>
                      )}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">Operador: {j.responsable}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>
                        {j.horaInicio} {j.horaFin ? `- ${j.horaFin}` : ''} ({j.duracion})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1 text-[#2B7A78]">
                    <HeartPulse className="w-3.5 h-3.5" />
                    {j.totalConsultas} {j.totalConsultas === 1 ? 'atención' : 'atenciones'}
                  </span>
                  <span className="text-[11px] text-slate-400">Ver turno &rarr;</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NavegacionBrigadaCards;