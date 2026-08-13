// =========================================================================
// ARCHIVO: apps/web/src/portals/admin/pages/dashboard/resumen/components/TarjetaPacientes.tsx
// DESCRIPCIÓN: Tarjeta de resumen para pacientes basada en datos reales del backend.
// =========================================================================

import React, { useState } from 'react';
import { UserCheck, ChevronRight, RefreshCw, TrendingUp, User, Calendar, BarChart2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface RecentPatient {
  id: string;
  fullName: string;
  documentNumber?: string;
  createdAt: string | Date;
  gender?: string;
}

export interface RegistrationTrendDay {
  dayLabel: string; // Ej: 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'
  count: number;
}

interface TarjetaPacientesProps {
  total: number;
  syncPending: number;
  recentPatients?: RecentPatient[];
  registrationTrend?: RegistrationTrendDay[];
  isLoading?: boolean;
}

export const TarjetaPacientes: React.FC<TarjetaPacientesProps> = ({
  total,
  syncPending,
  recentPatients = [],
  registrationTrend = [],
  isLoading = false,
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'trend' | 'recent'>('trend');

  // Cálculo dinámico en base a los datos reales pasados por props
  const totalSemana = registrationTrend.reduce((acc, curr) => acc + curr.count, 0);
  const maxCount = Math.max(...registrationTrend.map((d) => d.count), 1);

  return (
    <div className="group bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/70 p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Cabecera de la Tarjeta */}
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-700 shadow-2xs">
            <UserCheck className="w-5 h-5 stroke-2" />
          </div>

          {syncPending > 0 ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
              <RefreshCw className="w-3.5 h-3.5 text-amber-600 animate-spin" />
              {syncPending} pend. sync
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Al día
            </span>
          )}
        </div>

        {/* Métrica Principal y Control Segmentado */}
        <div className="mt-4 flex items-baseline justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Pacientes en Expediente
            </p>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              {isLoading ? '...' : total}
            </p>
          </div>

          {/* Selector Estilo iOS */}
          <div className="bg-slate-100/90 p-0.5 rounded-lg flex items-center border border-slate-200/60 text-[11px] font-medium">
            <button
              onClick={() => setActiveTab('trend')}
              className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                activeTab === 'trend'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Gráfica
            </button>
            <button
              onClick={() => setActiveTab('recent')}
              className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                activeTab === 'recent'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Recientes
            </button>
          </div>
        </div>

        {/* Vista Dinámica: Gráfica de Tendencia vs Lista de Recientes */}
        <div className="mt-4 pt-3 border-t border-slate-100 min-h-35">
          {activeTab === 'trend' ? (
            <div>
              <div className="flex items-center justify-between mb-2 text-xs">
                <span className="text-slate-500 font-medium flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  Registros últimos 7 días
                </span>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
                  +{totalSemana} esta semana
                </span>
              </div>

              {/* Gráfica de Barras Real o Estado Vacío */}
              {registrationTrend.length === 0 ? (
                <div className="h-24 flex flex-col items-center justify-center text-slate-400 text-xs gap-1">
                  <BarChart2 className="w-5 h-5 text-slate-300" />
                  <span>Sin datos de tendencia registrados</span>
                </div>
              ) : (
                <div className="h-24 flex items-end justify-between gap-1.5 pt-4 px-1">
                  {registrationTrend.map((item, idx) => {
                    const heightPercent = item.count > 0 ? Math.round((item.count / maxCount) * 100) : 0;
                    return (
                      <div
                        key={idx}
                        className="flex-1 flex flex-col items-center gap-1.5 group/bar relative"
                      >
                        {/* Tooltip Hover */}
                        <div className="absolute -top-7 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-xs whitespace-nowrap pointer-events-none z-10">
                          {item.count} pac.
                        </div>

                        {/* Contenedor Barra */}
                        <div className="w-full bg-slate-100 rounded-t-md h-16 flex items-end overflow-hidden p-0.5">
                          <div
                            style={{ height: `${item.count > 0 ? Math.max(heightPercent, 12) : 0}%` }}
                            className="w-full bg-emerald-500/80 group-hover/bar:bg-emerald-600 rounded-xs transition-all duration-300"
                          />
                        </div>

                        {/* Etiqueta Día */}
                        <span className="text-[10px] font-medium text-slate-400 group-hover/bar:text-slate-700 transition-colors">
                          {item.dayLabel}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* Lista de Pacientes Recientes Real */
            <div className="space-y-1.5">
              {recentPatients.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400 flex flex-col items-center justify-center">
                  <User className="w-6 h-6 text-slate-300 mb-1" />
                  <span>Sin registros recientes de pacientes</span>
                </div>
              ) : (
                recentPatients.slice(0, 5).map((patient) => (
                  <div
                    key={patient.id}
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-50/70 hover:bg-slate-100/80 transition-colors border border-slate-100 text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 flex items-center justify-center font-bold text-xs shrink-0">
                        {patient.fullName ? patient.fullName.charAt(0).toUpperCase() : 'P'}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800 truncate leading-tight">
                          {patient.fullName}
                        </p>
                        {patient.documentNumber && (
                          <p className="text-[10px] text-slate-400 truncate">
                            Doc: {patient.documentNumber}
                          </p>
                        )}
                      </div>
                    </div>

                    <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1 shrink-0 ml-2">
                      <Calendar className="w-3 h-3 text-slate-300" />
                      {new Date(patient.createdAt).toLocaleDateString('es-SV', {
                        day: '2-digit',
                        month: 'short',
                      })}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Acción / Redirección */}
      <button
        onClick={() => navigate('/admin/pacientes')}
        className="mt-5 pt-3 border-t border-slate-100 w-full inline-flex items-center justify-between text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors group/btn cursor-pointer"
      >
        <span>Ver expedientes</span>
        <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
      </button>
    </div>
  );
};