// =========================================================================
// ARCHIVO: apps/web/src/portals/admin/pages/dashboard/resumen/components/ActividadReciente.tsx
// DESCRIPCIÓN: Tarjeta de actividad reciente estilo minimalista (iOS / Modern UI)
// =========================================================================

import React from 'react';
import { Clock, ArrowRight, ShieldAlert, User, Cpu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface AuditLogItem {
  id: string;
  action: string;
  entity: string;
  createdAt: string | Date;
  user?: {
    firstName?: string;
    lastName?: string;
    role?: string;
  } | null;
  [key: string]: unknown;
}

interface ActividadRecienteProps {
  logs: AuditLogItem[];
}

export const ActividadReciente: React.FC<ActividadRecienteProps> = ({ logs }) => {
  const navigate = useNavigate();

  const formatActionName = (action: string) => {
    return action
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Cabecera */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100/70 flex items-center justify-center text-slate-600 transition-transform group-hover:scale-105">
              <Clock className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-800 tracking-tight">
                Actividad Reciente
              </h3>
              <p className="text-[11px] font-normal text-slate-400">
                Trazabilidad y operaciones del sistema
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/admin/dashboard/actividad')}
            className="group flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors py-1 px-2.5 rounded-lg hover:bg-slate-100/60"
          >
            <span>Ver todas</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 text-slate-400 group-hover:text-slate-900" />
          </button>
        </div>

        {/* Lista de Registros */}
        <div className="mt-3">
          {logs.length === 0 ? (
            <div className="py-12 text-center flex flex-col items-center justify-center bg-slate-50/40 rounded-xl border border-dashed border-slate-200/60 my-2">
              <div className="w-9 h-9 rounded-full bg-slate-100/80 flex items-center justify-center text-slate-400 mb-2">
                <ShieldAlert className="w-4 h-4 stroke-[1.8]" />
              </div>
              <p className="text-xs font-medium text-slate-600">Sin actividad registrada</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                No hay eventos reportados en las últimas horas.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {logs.slice(0, 5).map((log) => {
                const userName = log.user
                  ? `${log.user.firstName || ''} ${log.user.lastName || ''}`.trim()
                  : 'Sistema Central';
                const userRole = log.user?.role || 'SYSTEM';

                return (
                  <div
                    key={log.id}
                    className="py-2.5 px-2 rounded-xl hover:bg-slate-50/60 transition-colors duration-150 flex items-center justify-between gap-3 group/item"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-slate-100/80 text-slate-600 flex items-center justify-center shrink-0 border border-slate-200/50">
                        {log.user ? (
                          <User className="w-3.5 h-3.5 stroke-2" />
                        ) : (
                          <Cpu className="w-3.5 h-3.5 stroke-2" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-800 truncate">
                            {userName}
                          </span>
                          <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500 uppercase tracking-wider border border-slate-200/40">
                            {userRole}
                          </span>
                        </div>

                        <p className="text-[12px] text-slate-500 mt-0.5 truncate">
                          <span className="font-medium text-slate-700">
                            {formatActionName(log.action)}
                          </span>
                          {' en '}
                          <span className="text-slate-600 font-medium">{log.entity}</span>
                        </p>
                      </div>
                    </div>

                    <span className="text-[11px] font-normal text-slate-400 whitespace-nowrap shrink-0 group-hover/item:text-slate-600 transition-colors">
                      {new Date(log.createdAt).toLocaleTimeString('es-SV', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};