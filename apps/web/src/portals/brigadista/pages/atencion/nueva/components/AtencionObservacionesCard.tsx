// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/atencion/nueva/components/AtencionObservacionesCard.tsx
// DESCRIPCIÓN: Paso 4: Observaciones en terreno con tarjetas interactivas independientes y campos de descripción libre.
// =========================================================================

import React, { useState } from 'react';
import {
  Eye,
  Home,
  Info,
  CheckCircle2,
  Circle,
  UserCheck,
  Activity,
  Sparkles,
  AlertTriangle,
  Wind,
  AlertCircle,
  Sun,
  Droplets,
  ShieldCheck,
  Bug,
  Layers,
} from 'lucide-react';

interface AtencionObservacionesCardProps {
  observacionesGenerales: string;
  condicionVivienda: string;
  onChangeObservaciones: (
    field: 'observacionesClinicas' | 'observacionesGenerales' | 'condicionVivienda',
    value: string
  ) => void;
}

interface ItemHallazgo {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  colorClass: string;
  bgClass: string;
}

const HALLAZGOS_FISICOS: ItemHallazgo[] = [
  {
    label: 'Paciente orientado y alerta',
    icon: UserCheck,
    colorClass: 'text-emerald-600',
    bgClass: 'bg-emerald-50 border-emerald-100',
  },
  {
    label: 'Marcha y movilidad estable',
    icon: Activity,
    colorClass: 'text-teal-600',
    bgClass: 'bg-teal-50 border-teal-100',
  },
  {
    label: 'Buena higiene general',
    icon: Sparkles,
    colorClass: 'text-blue-600',
    bgClass: 'bg-blue-50 border-blue-100',
  },
  {
    label: 'Palidez cutánea leve',
    icon: AlertTriangle,
    colorClass: 'text-amber-600',
    bgClass: 'bg-amber-50 border-amber-100',
  },
  {
    label: 'Dificultad evidente al caminar',
    icon: AlertCircle,
    colorClass: 'text-rose-600',
    bgClass: 'bg-rose-50 border-rose-100',
  },
  {
    label: 'Respiración agitada en reposo',
    icon: Wind,
    colorClass: 'text-orange-600',
    bgClass: 'bg-orange-50 border-orange-100',
  },
];

const ENTORNO_VIVIENDA: ItemHallazgo[] = [
  {
    label: 'Vivienda ventilada e iluminada',
    icon: Sun,
    colorClass: 'text-amber-600',
    bgClass: 'bg-amber-50 border-amber-100',
  },
  {
    label: 'Agua potable intradomiciliar',
    icon: Droplets,
    colorClass: 'text-sky-600',
    bgClass: 'bg-sky-50 border-sky-100',
  },
  {
    label: 'Presencia de agua estancada / criaderos',
    icon: AlertTriangle,
    colorClass: 'text-rose-600',
    bgClass: 'bg-rose-50 border-rose-100',
  },
  {
    label: 'Pila con abate verificado',
    icon: ShieldCheck,
    colorClass: 'text-emerald-600',
    bgClass: 'bg-emerald-50 border-emerald-100',
  },
  {
    label: 'Animales de granja cercanos',
    icon: Bug,
    colorClass: 'text-indigo-600',
    bgClass: 'bg-indigo-50 border-indigo-100',
  },
  {
    label: 'Hogar con piso de tierra',
    icon: Layers,
    colorClass: 'text-orange-600',
    bgClass: 'bg-orange-50 border-orange-100',
  },
];

export const AtencionObservacionesCard: React.FC<AtencionObservacionesCardProps> = ({
  observacionesGenerales,
  condicionVivienda,
  onChangeObservaciones,
}) => {
  const [selectedFisicos, setSelectedFisicos] = useState<string[]>([]);
  const [selectedEntorno, setSelectedEntorno] = useState<string[]>([]);

  const toggleFisico = (label: string) => {
    setSelectedFisicos((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );
  };

  const toggleEntorno = (label: string) => {
    setSelectedEntorno((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/70 p-4 sm:p-4.5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:border-slate-300 transition-all duration-200 h-full flex flex-col justify-between space-y-2.5">
      {/* 1. Bloque Superior: Cabecera + Bloque Paciente + Bloque Entorno */}
      <div className="space-y-2">
        {/* Cabecera */}
        <div className="flex items-center gap-3 border-b border-slate-100 pb-2">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-700 shadow-2xs shrink-0">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 block">
              Paso 4 de 8 • Observación Directa
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight leading-snug">
              Hallazgos Observables en Terreno
            </h2>
          </div>
        </div>

        {/* SECCIÓN 1: Observación Física / Visual de la Persona */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-teal-600" />
              1. Estado Físico y Conductual de la Persona
            </span>
            <span className="text-[11px] font-semibold text-slate-400">
              Toca para marcar o desmarcar
            </span>
          </div>

          {/* Grid 3x2 de Tarjetas de Hallazgos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {HALLAZGOS_FISICOS.map(({ label, icon: Icon, colorClass, bgClass }) => {
              const active = selectedFisicos.includes(label);
              return (
                <button
                  type="button"
                  key={label}
                  onClick={() => toggleFisico(label)}
                  className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all duration-200 flex items-center justify-between gap-2 cursor-pointer relative ${
                    active
                      ? 'bg-teal-50/90 border-[#2B7A78] ring-2 ring-[#2B7A78]/20 shadow-xs'
                      : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/70 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div
                      className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${
                        active
                          ? 'bg-[#2B7A78] text-white border-teal-600'
                          : `${bgClass} ${colorClass}`
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span
                      className={`text-xs font-bold leading-tight truncate ${
                        active ? 'text-[#1B5250]' : 'text-slate-800'
                      }`}
                    >
                      {label}
                    </span>
                  </div>

                  <div className="shrink-0">
                    {active ? (
                      <CheckCircle2 className="w-4 h-4 text-[#2B7A78]" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 text-slate-300" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <textarea
            rows={2}
            value={observacionesGenerales}
            onChange={(e) => {
              onChangeObservaciones('observacionesClinicas', e.target.value);
            }}
            placeholder="Detalla otros hallazgos físicos u objetivos verificados en la persona durante la consulta..."
            className="w-full text-xs sm:text-sm py-1.5 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white placeholder-slate-400 leading-snug shadow-2xs resize-none"
          />
        </div>

        {/* SECCIÓN 2: Condiciones del Entorno y Vivienda */}
        <div className="space-y-1.5 pt-1.5 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Home className="w-4 h-4 text-teal-600" />
              2. Condiciones del Entorno y Factores Ambientales
            </span>
            <span className="text-[11px] font-semibold text-slate-400">
              Saneamiento comunitario
            </span>
          </div>

          {/* Grid 3x2 de Entorno */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {ENTORNO_VIVIENDA.map(({ label, icon: Icon, colorClass, bgClass }) => {
              const active = selectedEntorno.includes(label);
              return (
                <button
                  type="button"
                  key={label}
                  onClick={() => toggleEntorno(label)}
                  className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all duration-200 flex items-center justify-between gap-2 cursor-pointer relative ${
                    active
                      ? 'bg-teal-50/90 border-[#2B7A78] ring-2 ring-[#2B7A78]/20 shadow-xs'
                      : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/70 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div
                      className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${
                        active
                          ? 'bg-[#2B7A78] text-white border-teal-600'
                          : `${bgClass} ${colorClass}`
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span
                      className={`text-xs font-bold leading-tight truncate ${
                        active ? 'text-[#1B5250]' : 'text-slate-800'
                      }`}
                    >
                      {label}
                    </span>
                  </div>

                  <div className="shrink-0">
                    {active ? (
                      <CheckCircle2 className="w-4 h-4 text-[#2B7A78]" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 text-slate-300" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <textarea
            rows={2}
            value={condicionVivienda}
            onChange={(e) => onChangeObservaciones('condicionVivienda', e.target.value)}
            placeholder="Detalla condiciones del patio, recipientes con agua, ventilación, presencia de vectores o factores de riesgo..."
            className="w-full text-xs sm:text-sm py-1.5 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white placeholder-slate-400 leading-snug shadow-2xs resize-none"
          />
        </div>
      </div>

      {/* 2. Bloque Inferior: Pie Informativo */}
      <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between gap-2 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-teal-600 shrink-0" />
          <span className="text-[11px] sm:text-xs">
            Registra únicamente hallazgos visuales y objetivos verificados durante la visita comunitaria.
          </span>
        </div>
        <span className="text-[11px] font-semibold text-slate-400 shrink-0">Paso 4 de 8</span>
      </div>
    </div>
  );
};

export default AtencionObservacionesCard;