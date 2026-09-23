// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/educacion-ia/consejos-personalizados/ConsejosPersonalizadosPage.tsx
// DESCRIPCIÓN: Hub interactivo de autocuidado con separación de niveles clínicos,
//              rutinas de vida, prevención activa y biblioteca educativa.
// =========================================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePersonalizedAdvice } from '../../../../../modules/personalized-advice/hooks/usePersonalizedAdvice.js';
import type {
  PersonalizedAdvice,
  AdviceCategory,
} from '../../../../../modules/personalized-advice/types/personalized-advice.types.js';
import {
  ConsejosPersonalizadosHeader,
  ConsejoDestacadoCard,
  ConsejoCard,
  ConsejoDetalleModal,
  ConsejosPersonalizadosEmpty,
  ArticulosSugeridosBanner,
} from './components/index.js';
import {
  AlertCircle,
  Loader2,
  Stethoscope,
  HeartPulse,
} from 'lucide-react';

export const ConsejosPersonalizadosPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    patientName,
    hasEnoughData,
    dailyFocus,
    recommendations,
    isLoading,
    error,
    activeCategory,
    setActiveCategory,
    reload,
    dismissAdvice,
  } = usePersonalizedAdvice();

  const [selectedAdviceForModal, setSelectedAdviceForModal] = useState<PersonalizedAdvice | null>(null);

  const categories: Array<{ id: 'ALL' | AdviceCategory; label: string }> = [
    { id: 'ALL', label: 'Todos' },
    { id: 'ACTIVITY', label: 'Actividad Física' },
    { id: 'WATER', label: 'Hidratación' },
    { id: 'SLEEP', label: 'Sueño' },
    { id: 'NUTRITION', label: 'Alimentación' },
    { id: 'PREVENTION', label: 'Prevención y Signos' },
    { id: 'WELLNESS', label: 'Acompañamiento Clínico' },
  ];

  const handleExecuteAction = (advice: PersonalizedAdvice) => {
    const redirectPath = advice.actionPayload?.redirect || '/paciente/monitoreo/habitos-estilo-vida';
    navigate(redirectPath);
  };

  // Clasificación funcional cuando el filtro está en 'ALL'
  const clinicalRecommendations = recommendations.filter(
    (r) => r.category === 'PREVENTION' || r.category === 'WELLNESS'
  );

  const lifestyleRecommendations = recommendations.filter(
    (r) => r.category === 'ACTIVITY' || r.category === 'WATER' || r.category === 'SLEEP' || r.category === 'NUTRITION'
  );

  return (
    <div className="w-full space-y-6 max-w-350 mx-auto select-none animate-in fade-in duration-200">
      {/* 1. Header Oficial de MedicOS */}
      <ConsejosPersonalizadosHeader
        patientName={patientName}
        onRefresh={reload}
        isLoading={isLoading}
      />

      {/* Estado de Carga */}
      {isLoading && (
        <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-teal-700 animate-spin" />
          <p className="text-xs font-bold text-slate-500">
            Analizando expediente médico y organizando recomendaciones de autocuidado...
          </p>
        </div>
      )}

      {/* Estado de Error */}
      {error && !isLoading && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Estado Vacío */}
      {!isLoading && !hasEnoughData && <ConsejosPersonalizadosEmpty />}

      {/* Contenido Principal */}
      {!isLoading && hasEnoughData && (
        <div className="space-y-6">
          {/* 2. Enfoque de Hoy Panorámico */}
          {dailyFocus && (
            <ConsejoDestacadoCard
              advice={dailyFocus}
              onSelectAction={handleExecuteAction}
              onOpenDetails={(item) => setSelectedAdviceForModal(item)}
            />
          )}

          {/* 3. Barra de Categorías / Filtros */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-1">
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <span className="text-[11px] font-bold text-slate-400 hidden sm:inline">
              Sincronizado con tu expediente
            </span>
          </div>

          {/* 4. Visualización Segmentada o Filtrada */}
          {activeCategory === 'ALL' ? (
            <div className="space-y-6">
              {/* Sección A: Seguimiento Clínico y Signos Vitales */}
              {clinicalRecommendations.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shadow-2xs">
                      <Stethoscope className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">
                        Acompañamiento de tu Expediente y Salud
                      </h2>
                      <p className="text-[11px] font-medium text-slate-500">
                        Pautas preventivas vinculadas a tus signos vitales y diagnósticos registrados.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {clinicalRecommendations.map((item) => (
                      <ConsejoCard
                        key={item.id}
                        advice={item}
                        onSelectAction={handleExecuteAction}
                        onOpenDetails={(adv) => setSelectedAdviceForModal(adv)}
                        onDismiss={dismissAdvice}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Sección B: Hábitos y Rutinas de Autocuidado */}
              {lifestyleRecommendations.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 shadow-2xs">
                      <HeartPulse className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">
                        Hábitos Diarios y Metas de Vida
                      </h2>
                      <p className="text-[11px] font-medium text-slate-500">
                        Monitoreo continuo de actividad física, hidratación y balance nutricional.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {lifestyleRecommendations.map((item) => (
                      <ConsejoCard
                        key={item.id}
                        advice={item}
                        onSelectAction={handleExecuteAction}
                        onOpenDetails={(adv) => setSelectedAdviceForModal(adv)}
                        onDismiss={dismissAdvice}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Vista Filtrada Simple */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendations.length === 0 ? (
                <div className="col-span-full bg-white rounded-2xl border border-slate-200/80 p-8 text-center text-xs font-semibold text-slate-400">
                  No hay recomendaciones activas en esta categoría.
                </div>
              ) : (
                recommendations.map((item) => (
                  <ConsejoCard
                    key={item.id}
                    advice={item}
                    onSelectAction={handleExecuteAction}
                    onOpenDetails={(adv) => setSelectedAdviceForModal(adv)}
                    onDismiss={dismissAdvice}
                  />
                ))
              )}
            </div>
          )}

          {/* 5. Puente con Biblioteca de Artículos Educativos */}
          <div className="pt-2">
            <ArticulosSugeridosBanner />
          </div>
        </div>
      )}

      {/* Modal de Transparencia de Datos */}
      <ConsejoDetalleModal
        advice={selectedAdviceForModal}
        onClose={() => setSelectedAdviceForModal(null)}
        onExecuteAction={handleExecuteAction}
      />
    </div>
  );
};

export default ConsejosPersonalizadosPage;