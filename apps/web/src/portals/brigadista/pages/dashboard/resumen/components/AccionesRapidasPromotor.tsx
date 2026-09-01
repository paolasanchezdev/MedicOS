// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/dashboard/resumen/components/AccionesRapidasPromotor.tsx
// DESCRIPCIÓN: Panel de accesos tácticos del Promotor estilizado con el Design System Aqua MedicOS.
// =========================================================================

import React from 'react';
import { UserPlus, QrCode, HeartPulse, Users, ShieldCheck, RefreshCw, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AccionItem {
  label: string;
  description: string;
  icon: React.ElementType;
  path: string;
  isSpecial?: boolean;
}

export const AccionesRapidasPromotor: React.FC = () => {
  const navigate = useNavigate();

  const acciones: AccionItem[] = [
    {
      label: 'Registrar Persona',
      description: 'Nuevo ingreso al padrón',
      icon: UserPlus,
      path: '/brigadista/pacientes/registrar',
    },
    {
      label: 'Escanear QR',
      description: 'Identificación rápida',
      icon: QrCode,
      path: '/brigadista/pacientes/escanear',
      isSpecial: true,
    },
    {
      label: 'Evaluar Signos',
      description: 'Capturar constantes vitales',
      icon: HeartPulse,
      path: '/brigadista/evaluacion/signos-vitales',
    },
    {
      label: 'Padrón de Personas',
      description: 'Buscar y consultar historial',
      icon: Users,
      path: '/brigadista/pacientes/buscar',
    },
    {
      label: 'Control de Jornada',
      description: 'Gestión activa en terreno',
      icon: ShieldCheck,
      path: '/brigadista/brigada/jornada',
    },
    {
      label: 'Sincronización',
      description: 'Estado de estación local',
      icon: RefreshCw,
      path: '/brigadista/sincronizacion/estado',
    },
  ];

  return (
    <div className="bg-medicos-surface rounded-2xl border border-medicos-soft-border p-5 shadow-xs">
      <div className="flex items-center justify-between mb-3 px-0.5">
        <h3 className="text-xs font-bold tracking-wider text-medicos-muted uppercase">
          Acciones Operativas Principales
        </h3>
        <span className="text-[11px] text-medicos-muted font-medium hidden sm:inline">
          Accesos rápidos para trabajo en terreno
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {acciones.map((acc, index) => {
          const IconComponent = acc.icon;
          return (
            <button
              key={index}
              onClick={() => navigate(acc.path)}
              className={`group flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200 active:scale-[0.98] text-left cursor-pointer ${
                acc.isSpecial
                  ? 'bg-medicos-light-bg/70 hover:bg-medicos-light-bg border-medicos-teal/50 hover:border-medicos-teal shadow-2xs'
                  : 'bg-medicos-canvas/50 hover:bg-medicos-light-bg/40 active:bg-medicos-light-bg/70 border-medicos-soft-border/80 hover:border-medicos-teal/40'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 border ${
                    acc.isSpecial
                      ? 'bg-medicos-teal text-white border-medicos-teal shadow-xs'
                      : 'bg-medicos-surface text-medicos-teal border-medicos-soft-border'
                  }`}
                >
                  <IconComponent className="w-5 h-5 stroke-2" />
                </div>
                <div className="truncate">
                  <span className="block text-xs font-bold text-medicos-dark-blue truncate tracking-tight">
                    {acc.label}
                  </span>
                  <span className="block text-[11px] text-medicos-muted font-normal leading-tight mt-0.5 truncate">
                    {acc.description}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-medicos-muted/60 group-hover:text-medicos-teal group-hover:translate-x-0.5 transition-all shrink-0 ml-1.5" />
            </button>
          );
        })}
      </div>
    </div>
  );
};