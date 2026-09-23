// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/educacion-ia/asistente/components/SelectorContextoClinico.tsx
// DESCRIPCIÓN: Selector clínico integral estilo iOS Health: Diagnósticos,
//              Medicamentos, Síntomas, Signos, Laboratorio y Hábitos de Salud.
// =========================================================================

import React, { useState } from 'react';
import {
  FlaskConical,
  Pill,
  Activity,
  Stethoscope,
  HeartPulse,
  ClipboardList,
  Check,
  X,
  FileCheck2,
} from 'lucide-react';
import type {
  ClinicalContextItem,
  ClinicalContextType,
} from '../../../../../../modules/ai-assistant/index.js';

interface SelectorContextoClinicoProps {
  contexts: ClinicalContextItem[];
  selectedContext: ClinicalContextItem | null;
  onSelectContext: (item: ClinicalContextItem | null) => void;
}

type FilterCategory = 'ALL' | ClinicalContextType;

export const SelectorContextoClinico: React.FC<SelectorContextoClinicoProps> = ({
  contexts,
  selectedContext,
  onSelectContext,
}) => {
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('ALL');

  if (contexts.length === 0) return null;

  const categories: Array<{ id: FilterCategory; label: string }> = [
    { id: 'ALL', label: 'Todos' },
    { id: 'DIAGNOSIS', label: 'Diagnósticos' },
    { id: 'MEDICATION', label: 'Medicamentos' },
    { id: 'VITAL_SIGNS', label: 'Signos Vitales' },
    { id: 'LAB_RESULT', label: 'Laboratorio' },
    { id: 'CONSULTATION', label: 'Consultas y Síntomas' },
    { id: 'LIFESTYLE', label: 'Estilo de Vida' },
  ];

  // Filtrar según la categoría activa y solo mostrar categorías que tengan items
  const availableTypes = new Set(contexts.map((c) => c.type));
  const visibleCategories = categories.filter(
    (cat) => cat.id === 'ALL' || availableTypes.has(cat.id as ClinicalContextType)
  );

  const filteredItems =
    activeCategory === 'ALL'
      ? contexts
      : contexts.filter((c) => c.type === activeCategory);

  const getCategoryConfig = (type: ClinicalContextType, isSelected: boolean) => {
    switch (type) {
      case 'DIAGNOSIS':
        return {
          icon: <Stethoscope className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-amber-600'}`} />,
          badge: 'Diagnóstico',
        };
      case 'MEDICATION':
        return {
          icon: <Pill className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-sky-600'}`} />,
          badge: 'Medicamento',
        };
      case 'VITAL_SIGNS':
        return {
          icon: <Activity className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-rose-500'}`} />,
          badge: 'Signos Vitales',
        };
      case 'LAB_RESULT':
        return {
          icon: <FlaskConical className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-teal-600'}`} />,
          badge: 'Laboratorio',
        };
      case 'CONSULTATION':
        return {
          icon: <ClipboardList className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-indigo-600'}`} />,
          badge: 'Consulta',
        };
      case 'LIFESTYLE':
        return {
          icon: <HeartPulse className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-emerald-600'}`} />,
          badge: 'Hábito',
        };
      default:
        return {
          icon: <FlaskConical className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-500'}`} />,
          badge: 'Clínico',
        };
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-3.5 sm:p-4 shadow-2xs space-y-2.5 select-none animate-in fade-in duration-200">
      {/* 1. Cabecera del Selector con estado y deselección */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileCheck2 className="w-4 h-4 text-teal-700" />
          <span className="text-xs font-extrabold text-slate-800 tracking-tight">
            Consultar sobre un dato de mi expediente
          </span>
          {selectedContext && (
            <span className="px-2 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-[10px] font-bold animate-in fade-in">
              Contexto activo
            </span>
          )}
        </div>

        {selectedContext && (
          <button
            type="button"
            onClick={() => onSelectContext(null)}
            className="text-[11px] font-bold text-slate-400 hover:text-rose-600 flex items-center gap-1 cursor-pointer transition"
          >
            <X className="w-3.5 h-3.5" />
            <span>Quitar selección</span>
          </button>
        )}
      </div>

      {/* 2. Pestañas de Filtrado por Categoría estilo iOS */}
      {visibleCategories.length > 2 && (
        <div className="flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-1">
          {visibleCategories.map((cat) => {
            const isTabActive = activeCategory === cat.id;
            return (
              <button
                type="button"
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1 rounded-full text-[11px] font-bold shrink-0 transition cursor-pointer ${
                  isTabActive
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      )}

      {/* 3. Carrusel de Elementos Clínicos Seleccionables */}
      <div className="flex items-center gap-2.5 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-1">
        {filteredItems.map((item) => {
          const isSelected = selectedContext?.id === item.id;
          const { icon, badge } = getCategoryConfig(item.type, isSelected);

          return (
            <button
              type="button"
              key={item.id}
              onClick={() => onSelectContext(isSelected ? null : item)}
              className={`px-4 py-2.5 rounded-2xl border text-left shrink-0 transition flex items-center gap-3 cursor-pointer shadow-2xs ${
                isSelected
                  ? 'bg-teal-700 border-teal-700 text-white shadow-sm ring-2 ring-teal-600/30'
                  : 'bg-slate-50/80 border-slate-200/90 hover:bg-white hover:border-slate-300'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                  isSelected ? 'bg-white/20' : 'bg-white border border-slate-100'
                }`}
              >
                {icon}
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[9.5px] font-extrabold uppercase tracking-wider ${
                      isSelected ? 'text-teal-200' : 'text-slate-400'
                    }`}
                  >
                    {badge}
                  </span>
                </div>
                <p
                  className={`text-xs font-bold truncate max-w-56 ${
                    isSelected ? 'text-white' : 'text-slate-800'
                  }`}
                >
                  {item.title}
                </p>
                <p
                  className={`text-[10px] truncate max-w-56 font-medium ${
                    isSelected ? 'text-teal-100' : 'text-slate-400'
                  }`}
                >
                  {item.subtitle}
                </p>
              </div>

              {isSelected && <Check className="w-4 h-4 text-teal-200 shrink-0 ml-1" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SelectorContextoClinico;