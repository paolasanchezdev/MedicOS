// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/brigada/resumen/components/MetricasBrigadaCards.tsx
// DESCRIPCIÓN: Tarjetas de métricas con bordes, pills y pie de navegación estilo Admin.
// =========================================================================

import React from 'react';
import { Users, HeartPulse, AlertTriangle, Send, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MetricasBrigadaCardsProps {
  pacientesRegistrados: number;
  evaluacionesRealizadas: number;
  seguimientosPendientes: number;
  referidos: number;
}

export const MetricasBrigadaCards: React.FC<MetricasBrigadaCardsProps> = ({
  pacientesRegistrados,
  evaluacionesRealizadas,
  seguimientosPendientes,
  referidos,
}) => {
  const navigate = useNavigate();

  const metricas = [
    {
      label: 'Pacientes en Padrón',
      pill: 'Activos',
      pillClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
      hasPulse: true,
      value: pacientesRegistrados,
      icon: Users,
      iconBg: 'bg-blue-50 border-blue-100 text-blue-600',
      footerText: 'Ver pacientes',
      footerColor: 'text-blue-600 hover:text-blue-700',
      ruta: '/brigadista/brigada/pacientes',
    },
    {
      label: 'Evaluaciones Físicas',
      pill: 'Al día',
      pillClass: 'bg-teal-50 text-teal-700 border-teal-200/60',
      hasPulse: false,
      value: evaluacionesRealizadas,
      icon: HeartPulse,
      iconBg: 'bg-teal-50 border-teal-100 text-[#2B7A78]',
      footerText: 'Ver signos vitales',
      footerColor: 'text-[#2B7A78] hover:text-[#1B5250]',
      ruta: '/brigadista/evaluacion/signos-vitales',
    },
    {
      label: 'Casos en Seguimiento',
      pill: 'En alerta',
      pillClass: 'bg-amber-50 text-amber-700 border-amber-200/60',
      hasPulse: false,
      value: seguimientosPendientes,
      icon: AlertTriangle,
      iconBg: 'bg-amber-50 border-amber-100 text-amber-600',
      footerText: 'Ver seguimientos',
      footerColor: 'text-amber-600 hover:text-amber-700',
      ruta: '/brigadista/seguimiento',
    },
    {
      label: 'Referencias Médicas',
      pill: 'Despacho',
      pillClass: 'bg-purple-50 text-purple-700 border-purple-200/60',
      hasPulse: false,
      value: referidos,
      icon: Send,
      iconBg: 'bg-purple-50 border-purple-100 text-purple-600',
      footerText: 'Ver consultas',
      footerColor: 'text-purple-600 hover:text-purple-700',
      ruta: '/brigadista/consultas',
    },
  ];

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        Indicadores Clave
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricas.map((item, idx) => {
          const IconComponent = item.icon;
          return (
            <div
              key={idx}
              className="group bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Cabecera con Icono y Pill */}
                <div className="flex items-center justify-between">
                  <div
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center shadow-xs ${item.iconBg}`}
                  >
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${item.pillClass}`}
                  >
                    {item.hasPulse && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    )}
                    {item.pill}
                  </span>
                </div>

                {/* Métricas Principales */}
                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {item.label}
                  </p>
                  <p className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                    {item.value}
                  </p>
                </div>
              </div>

              {/* Acción / Redirección */}
              <button
                type="button"
                onClick={() => navigate(item.ruta)}
                className={`mt-5 pt-3 border-t border-slate-100 w-full inline-flex items-center justify-between text-xs font-semibold ${item.footerColor} transition-colors group/btn cursor-pointer`}
              >
                <span>{item.footerText}</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};