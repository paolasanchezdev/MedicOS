// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/citas/agendar/components/MotivoCitaSelector.tsx
// DESCRIPCIÓN: Selector clínico de 19 síntomas con altura calibrada para
//              ocupar el viewport completo sin generar scrollbar vertical.
// =========================================================================

import React, { useState, useMemo } from 'react';
import {
  Thermometer,
  Wind,
  Flame,
  Heart,
  Baby,
  Sparkles,
  FileText,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Check,
  Search,
  X,
  Layers,
  Activity,
} from 'lucide-react';
import {
  CATALOGO_SINTOMAS,
  CATEGORIAS_SINTOMAS,
  type CategoriaSintoma,
  obtenerOrientacionConsulta,
} from '../../../../../../modules/appointments/rules/appointmentOrientation.rules';

interface MotivoCitaSelectorProps {
  selectedSymptoms: string[];
  onToggleSymptom: (symptomId: string) => void;
  additionalNotes: string;
  onNotesChange: (notes: string) => void;
  onContinue: () => void;
}

const renderSymptomIcon = (tipo: string, isSelected: boolean) => {
  const baseClass = 'w-4 h-4 transition-transform';
  if (isSelected) return <Check className={`${baseClass} text-white stroke-3`} />;

  switch (tipo) {
    case 'termometro':
      return <Thermometer className={`${baseClass} text-amber-600`} />;
    case 'pulmon':
      return <Wind className={`${baseClass} text-sky-600`} />;
    case 'estomago':
      return <Flame className={`${baseClass} text-orange-600`} />;
    case 'corazon':
      return <Heart className={`${baseClass} text-rose-600`} />;
    case 'bebe':
      return <Baby className={`${baseClass} text-indigo-600`} />;
    case 'mujer':
      return <Sparkles className={`${baseClass} text-purple-600`} />;
    case 'cerebro':
      return <Activity className={`${baseClass} text-teal-600`} />;
    case 'piel':
      return <Activity className={`${baseClass} text-pink-600`} />;
    default:
      return <Activity className={`${baseClass} text-teal-700`} />;
  }
};

export const MotivoCitaSelector: React.FC<MotivoCitaSelectorProps> = ({
  selectedSymptoms,
  onToggleSymptom,
  additionalNotes,
  onNotesChange,
  onContinue,
}) => {
  const [activeCategory, setActiveCategory] = useState<CategoriaSintoma>('TODOS');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const orientacion = useMemo(() => {
    return obtenerOrientacionConsulta(selectedSymptoms);
  }, [selectedSymptoms]);

  const filteredSymptoms = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    return CATALOGO_SINTOMAS.filter((item) => {
      const matchCategory = activeCategory === 'TODOS' || item.categoria === activeCategory;
      const matchSearch =
        !query ||
        item.label.toLowerCase().includes(query) ||
        item.descripcion.toLowerCase().includes(query);
      return matchCategory && matchSearch;
    });
  }, [activeCategory, searchTerm]);

  const selectedObjects = useMemo(() => {
    return CATALOGO_SINTOMAS.filter((s) => selectedSymptoms.includes(s.id));
  }, [selectedSymptoms]);

  const canContinue = selectedSymptoms.length > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch w-full">
      {/* COLUMNA IZQUIERDA (7 cols): CATÁLOGO COMPLETO DE 19 SÍNTOMAS */}
      <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between space-y-3">
        <div className="space-y-2.5">
          {/* Barra de cabecera con buscador integrado */}
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-7 h-7 rounded-lg bg-teal-50 text-[#2B7A78] flex items-center justify-center shrink-0">
                <Layers className="w-4 h-4" />
              </span>
              <h2 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight truncate">
                ¿Qué molestias o motivo presentas hoy?
              </h2>
            </div>

            <div className="relative w-48 sm:w-60 shrink-0">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar molestia..."
                className="w-full pl-8 pr-7 py-1.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-[#2B7A78] rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none transition-all"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Selector horizontal de categorías clínicas */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
            {CATEGORIAS_SINTOMAS.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#2B7A78] text-white shadow-2xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/70'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Cuadrícula de síntomas calibrada a 50px de altura por tarjeta */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1 max-h-97.5 overflow-y-auto pr-0.5 scrollbar-none">
            {filteredSymptoms.map((sintoma) => {
              const isSelected = selectedSymptoms.includes(sintoma.id);

              return (
                <button
                  key={sintoma.id}
                  type="button"
                  onClick={() => onToggleSymptom(sintoma.id)}
                  title={`${sintoma.label}: ${sintoma.descripcion}`}
                  className={`h-12.5 px-3 rounded-xl border transition-all duration-150 cursor-pointer flex items-center justify-between gap-2.5 select-none text-left group ${
                    isSelected
                      ? 'bg-teal-50/80 border-[#2B7A78] ring-1 ring-[#2B7A78]/25 shadow-2xs'
                      : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-[#2B7A78]'
                          : 'bg-slate-50 border border-slate-200/70 group-hover:bg-white'
                      }`}
                    >
                      {renderSymptomIcon(sintoma.icono, isSelected)}
                    </div>
                    <div className="min-w-0">
                      <p
                        className={`text-xs font-bold leading-tight truncate ${
                          isSelected ? 'text-[#2B7A78]' : 'text-slate-800'
                        }`}
                      >
                        {sintoma.label}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate leading-tight mt-0.5">
                        {sintoma.descripcion}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                      isSelected
                        ? 'border-[#2B7A78] bg-[#2B7A78] text-white'
                        : 'border-slate-300 bg-white group-hover:border-slate-400'
                    }`}
                  >
                    {isSelected && <Check className="w-2.5 h-2.5 stroke-3" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Pie de catálogo */}
        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Mostrando {filteredSymptoms.length} de {CATALOGO_SINTOMAS.length} molestias clínicas</span>
          <span className="font-bold text-[#2B7A78] bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200/60">
            {selectedSymptoms.length} seleccionada(s)
          </span>
        </div>
      </div>

      {/* COLUMNA DERECHA (5 cols): PANEL CLÍNICO INTEGRADO */}
      <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between space-y-3">
        <div className="space-y-3.5">
          {/* Tarjeta de Orientación Médica */}
          <div
            className={`p-3.5 rounded-xl border transition-all ${
              orientacion.esPrioritario
                ? 'bg-amber-50/90 border-amber-300 text-amber-950'
                : 'bg-teal-50/40 border-teal-200/80 text-teal-950'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  orientacion.esPrioritario
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-[#2B7A78] text-white shadow-2xs'
                }`}
              >
                {orientacion.esPrioritario ? (
                  <AlertTriangle className="w-4 h-4" />
                ) : (
                  <ShieldCheck className="w-4 h-4" />
                )}
              </div>

              <div className="space-y-1 text-xs min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1.5">
                  <span className="font-bold uppercase tracking-wider text-[10px] text-slate-600">
                    Orientación Sugerida:
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md font-extrabold text-xs bg-white border border-slate-200 text-[#2B7A78] shadow-2xs">
                    ★ {orientacion.areaSugerida}
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed text-xs font-medium pt-0.5">
                  {orientacion.mensaje}
                </p>
              </div>
            </div>
          </div>

          {/* Molestias seleccionadas */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
              <span>Molestias seleccionadas ({selectedObjects.length})</span>
              {selectedObjects.length > 0 && (
                <span className="text-[10px] lowercase font-normal text-slate-400">clic para remover</span>
              )}
            </div>

            {selectedObjects.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-2 bg-slate-50/60 rounded-xl px-3 border border-dashed border-slate-200">
                Selecciona al menos una molestia en el catálogo izquierdo.
              </p>
            ) : (
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-0.5 scrollbar-none">
                {selectedObjects.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => onToggleSymptom(s.id)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-50 text-[#2B7A78] text-xs font-semibold border border-teal-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 cursor-pointer transition-colors"
                  >
                    <span>{s.label}</span>
                    <X className="w-3 h-3 shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Observaciones con altura ergonómica */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              Notas o antecedentes <span className="text-slate-400 font-normal normal-case">(Opcional)</span>
            </label>
            <textarea
              rows={3}
              value={additionalNotes}
              onChange={(e) => onNotesChange(e.target.value)}
              placeholder="Medicamentos habituales, tiempo con la molestia o detalles breves para el médico..."
              className="w-full p-2.5 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 focus:border-[#2B7A78] rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none transition-all resize-none"
            />
          </div>
        </div>

        {/* Botón de Continuación */}
        <button
          type="button"
          disabled={!canContinue}
          onClick={onContinue}
          className="w-full py-3 bg-[#2B7A78] hover:bg-[#236866] disabled:bg-slate-100 disabled:text-slate-400 disabled:border disabled:border-slate-200 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:cursor-not-allowed disabled:shadow-none"
        >
          <span>Continuar a Profesional y Horarios</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default MotivoCitaSelector;