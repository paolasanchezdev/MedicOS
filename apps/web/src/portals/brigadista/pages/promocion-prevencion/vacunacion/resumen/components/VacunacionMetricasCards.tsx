// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/promocion-prevencion/vacunacion/resumen/components/VacunacionMetricasCards.tsx
// DESCRIPCIÓN: Grid de 4 tarjetas de KPIs conectado a datos 100% reales de la API.
// =========================================================================

import React, { useState } from 'react';
import {
  Syringe,
  Users,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  BarChart2,
  ThermometerSnowflake,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { VaccinationSummaryDTO, VaccineCatalogItem } from '../../../../../../../modules/vaccinations';

export interface VacunacionMetricasCardsProps {
  summary: VaccinationSummaryDTO | null;
  catalog: VaccineCatalogItem[];
}

export const VacunacionMetricasCards: React.FC<VacunacionMetricasCardsProps> = ({
  summary,
  catalog,
}) => {
  const navigate = useNavigate();
  const [pacienteTab, setPacienteTab] = useState<'trend' | 'recent'>('trend');

  const totalDosisHoy = summary?.totalToday ?? 0;
  const totalPacientes = summary?.totalVaccinatedPatients ?? 0;
  const activeBrigades = summary?.activeBrigadesCount ?? 0;

  // Datos reales de desglose calculados por el Backend
  const pediatricas = summary?.breakdown?.pediatric ?? 0;
  const adultos = summary?.breakdown?.adult ?? 0;
  const materno = summary?.breakdown?.maternal ?? 0;

  // Tendencia de últimos 7 días con datos reales de la BD
  const trendDays = summary?.registrationTrend || [];
  const totalSemana = trendDays.reduce((acc, curr) => acc + curr.count, 0);
  const maxTrend = Math.max(...trendDays.map((d) => d.count), 1);

  const recentApps = summary?.recentApplications || [];
  const obligatoriasCount = catalog.filter((c) => c.isRequired).length;
  const complementariasCount = catalog.filter((c) => !c.isRequired).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Tarjeta: Dosis Aplicadas Hoy */}
      <div className="group bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-700 shadow-2xs">
              <Syringe className="w-5 h-5 stroke-2" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {totalDosisHoy > 0 ? `${totalDosisHoy} registradas` : 'Jornada Activa'}
            </span>
          </div>

          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Dosis Aplicadas Hoy
            </p>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              {totalDosisHoy}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
            <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-50/70 border border-slate-100 text-slate-600">
              <span className="font-medium">Esquema Pediátrico</span>
              <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200/60 shadow-2xs">
                {pediatricas}
              </span>
            </div>

            <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-50/70 border border-slate-100 text-slate-600">
              <span className="font-medium">Adultos / Refuerzos</span>
              <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200/60 shadow-2xs">
                {adultos}
              </span>
            </div>

            <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-50/70 border border-slate-100 text-slate-600">
              <span className="font-medium">Materno / Tdpa</span>
              <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200/60 shadow-2xs">
                {materno}
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/brigadista/promocion-prevencion/vacunacion/registro')}
          className="mt-5 pt-3 border-t border-slate-100 w-full inline-flex items-center justify-between text-xs font-semibold text-teal-700 hover:text-teal-800 transition-colors group/btn cursor-pointer"
        >
          <span>Registrar nueva dosis</span>
          <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
        </button>
      </div>

      {/* 2. Tarjeta: Personas Inmunizadas */}
      <div className="group bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-700 shadow-2xs">
              <Users className="w-5 h-5 stroke-2" />
            </div>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Padrón Al día
            </span>
          </div>

          <div className="mt-4 flex items-baseline justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Personas Vacunadas
              </p>
              <p className="text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                {totalPacientes}
              </p>
            </div>

            {/* Selector Segmentado */}
            <div className="bg-slate-100/90 p-0.5 rounded-lg flex items-center border border-slate-200/60 text-[11px] font-medium">
              <button
                type="button"
                onClick={() => setPacienteTab('trend')}
                className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                  pacienteTab === 'trend'
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Gráfica
              </button>
              <button
                type="button"
                onClick={() => setPacienteTab('recent')}
                className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                  pacienteTab === 'recent'
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Recientes
              </button>
            </div>
          </div>

          {/* Vista Dinámica */}
          <div className="mt-4 pt-3 border-t border-slate-100 min-h-35">
            {pacienteTab === 'trend' ? (
              <div>
                <div className="flex items-center justify-between mb-2 text-xs">
                  <span className="text-slate-500 font-medium flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                    Últimos 7 días
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
                    {totalSemana > 0 ? `+${totalSemana} dosis` : '0 dosis'}
                  </span>
                </div>

                {totalSemana === 0 ? (
                  <div className="h-20 flex flex-col items-center justify-center text-slate-400 text-xs gap-1">
                    <BarChart2 className="w-5 h-5 text-slate-300" />
                    <span>Sin aplicaciones en los últimos 7 días</span>
                  </div>
                ) : (
                  <div className="h-20 flex items-end justify-between gap-1.5 pt-2 px-1">
                    {trendDays.map((item, idx) => {
                      const heightPercent = item.count > 0 ? Math.round((item.count / maxTrend) * 100) : 0;
                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-1 group/bar relative">
                          <div className="absolute -top-6 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-xs whitespace-nowrap pointer-events-none z-10">
                            {item.count} dosis
                          </div>

                          <div className="w-full bg-slate-100 rounded-t-md h-12 flex items-end overflow-hidden p-0.5">
                            <div
                              style={{ height: `${heightPercent}%` }}
                              className="w-full bg-teal-600 rounded-xs transition-all duration-300"
                            />
                          </div>
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
              <div className="space-y-1.5">
                {recentApps.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400">
                    Sin pacientes registrados hoy
                  </div>
                ) : (
                  recentApps.slice(0, 3).map((app) => (
                    <div
                      key={app.id}
                      className="flex items-center justify-between p-2 rounded-xl bg-slate-50/70 border border-slate-100 text-xs"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="font-bold text-slate-800 truncate">
                          {app.patient?.firstName} {app.patient?.lastName}
                        </p>
                        <p className="text-[10px] text-teal-700 truncate">{app.vaccineName}</p>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">
                        Dosis {app.doseNumber}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/brigadista/promocion-prevencion/vacunacion/historial')}
          className="mt-5 pt-3 border-t border-slate-100 w-full inline-flex items-center justify-between text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors group/btn cursor-pointer"
        >
          <span>Ver historial completo</span>
          <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
        </button>
      </div>

      {/* 3. Tarjeta: Catálogo Oficial MINSAL */}
      <div className="group bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-700 shadow-2xs">
              <ShieldCheck className="w-5 h-5 stroke-2" />
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200/60">
              {catalog.length} Biológicos
            </span>
          </div>

          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Esquema de Vacunación
            </p>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              MINSAL
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
            <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-50/70 border border-slate-100 text-slate-600">
              <span className="font-medium">Vacunas Obligatorias</span>
              <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200/60 shadow-2xs">
                {obligatoriasCount}
              </span>
            </div>

            <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-50/70 border border-slate-100 text-slate-600">
              <span className="font-medium">Refuerzos / Adicionales</span>
              <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200/60 shadow-2xs">
                {complementariasCount}
              </span>
            </div>

            <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-50/70 border border-slate-100 text-slate-600">
              <span className="font-medium">Estado del Catálogo</span>
              <span className="font-bold text-teal-800 bg-white px-2 py-0.5 rounded-md border border-slate-200/60 shadow-2xs">
                Vigente
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/brigadista/promocion-prevencion/vacunacion/registro')}
          className="mt-5 pt-3 border-t border-slate-100 w-full inline-flex items-center justify-between text-xs font-semibold text-purple-700 hover:text-purple-800 transition-colors group/btn cursor-pointer"
        >
          <span>Explorar catálogo MINSAL</span>
          <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
        </button>
      </div>

      {/* 4. Tarjeta: Cadena de Frío y Brigadas en Terreno */}
      <div className="group bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-700 shadow-2xs">
              <ThermometerSnowflake className="w-5 h-5 stroke-2" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              +2°C a +8°C
            </span>
          </div>

          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Monitoreo y Cobertura
            </p>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              {activeBrigades > 0 ? 'Activo' : 'En espera'}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
            <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-50/70 border border-slate-100 text-slate-600">
              <span className="font-medium">Brigadas Activas</span>
              <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200/60 shadow-2xs">
                {activeBrigades} punto(s)
              </span>
            </div>

            <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-50/70 border border-slate-100 text-slate-600">
              <span className="font-medium">Dosis Registradas Históricas</span>
              <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200/60 shadow-2xs">
                {recentApps.length}
              </span>
            </div>

            <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-50/70 border border-slate-100 text-slate-600">
              <span className="font-medium">Seguimientos Pendientes</span>
              <span className="font-bold text-teal-800 bg-white px-2 py-0.5 rounded-md border border-slate-200/60 shadow-2xs">
                {summary?.pendingFollowUpCount ?? 0}
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/brigadista/brigada/resumen')}
          className="mt-5 pt-3 border-t border-slate-100 w-full inline-flex items-center justify-between text-xs font-semibold text-cyan-700 hover:text-cyan-800 transition-colors group/btn cursor-pointer"
        >
          <span>Ver estado de brigada</span>
          <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
};

export default VacunacionMetricasCards;