// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/monitoreo/habitos-estilo-vida/EstiloVidaPage.tsx
// DESCRIPCIÓN: Vista oficial de Hábitos y Estilo de Vida: simétrica, amplia,
//              minimalista, sin huecos y conectada 100% a PostgreSQL.
// =========================================================================

import React, { useState } from 'react';
import {
  useLifestyleData,
  type LifestyleHabitType,
  RegistrarActividadModal,
  RegistrarHabitoModal,
  CrearObjetivoModal,
} from '../../../../../modules/lifestyle/index.js';
import {
  EstiloVidaHeader,
  EstiloVidaStatusCards,
  HabitoTrackerCard,
  MetaSemanalCard,
  ActividadesHistorialCard,
  EstiloVidaLoading,
  EstiloVidaError,
} from './components/index.js';
import { ShieldCheck } from 'lucide-react';

export const EstiloVidaPage: React.FC = () => {
  const {
    activeGoal,
    weeklyStats,
    habits,
    recentActivities,
    loading,
    error,
    refetch,
    logHabit,
    recordActivity,
    createGoal,
  } = useLifestyleData();

  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [selectedHabitForModal, setSelectedHabitForModal] = useState<LifestyleHabitType | null>(null);

  if (loading && habits.length === 0) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-5 max-w-[1700px] mx-auto">
        <EstiloVidaLoading />
      </div>
    );
  }

  if (error && habits.length === 0) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-10 max-w-md mx-auto">
        <EstiloVidaError message={error} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-5 space-y-5 max-w-[1700px] mx-auto animate-in fade-in duration-200">
      {/* 1. Cabecera Institucional Oficial */}
      <EstiloVidaHeader
        activeDaysCount={weeklyStats.activeDaysCount}
        onOpenRecordActivity={() => setIsActivityModalOpen(true)}
        onOpenCreateGoal={() => setIsGoalModalOpen(true)}
      />

      {/* 2. Grid Superior: 4 Tarjetas KPI Amplias y Claras */}
      <EstiloVidaStatusCards
        weeklyStats={weeklyStats}
        activeGoal={activeGoal}
        onOpenRecordActivity={() => setIsActivityModalOpen(true)}
        onOpenWaterModal={() => setSelectedHabitForModal('WATER')}
        onOpenSleepModal={() => setSelectedHabitForModal('SLEEP')}
        onOpenGoalModal={() => setIsGoalModalOpen(true)}
      />

      {/* 3. Habit Tracker: 6 Hábitos Diarios a Ancho Completo (3x2 simétrico sin huecos) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-black uppercase tracking-wider text-slate-800">
            Seguimiento de Hábitos (Lunes a Domingo)
          </span>
          <span className="text-xs text-slate-400 font-medium">
            Pulsa para registrar o actualizar tu día
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {habits.map((habit) => (
            <HabitoTrackerCard
              key={habit.habitType}
              habit={habit}
              onOpenModal={(type) =>
                type === 'ACTIVITY'
                  ? setIsActivityModalOpen(true)
                  : setSelectedHabitForModal(type)
              }
              onQuickWaterChange={async (newVal) => {
                await logHabit('WATER', newVal, 'vasos');
              }}
            />
          ))}
        </div>
      </div>

      {/* 4. Bloque Inferior Balanceado 50% / 50%: Meta Semanal vs. Historial de Actividades */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        <div className="lg:col-span-6">
          <MetaSemanalCard
            goal={activeGoal}
            onOpenGoalModal={() => setIsGoalModalOpen(true)}
            onOpenRecordActivity={() => setIsActivityModalOpen(true)}
          />
        </div>

        <div className="lg:col-span-6">
          <ActividadesHistorialCard
            activities={recentActivities}
            onOpenRecordModal={() => setIsActivityModalOpen(true)}
          />
        </div>
      </div>

      {/* 5. Nota de Salud Preventiva Homologada */}
      <div className="bg-white rounded-3xl border border-slate-100 p-4 shadow-2xs flex items-center gap-3 select-none">
        <div className="w-8 h-8 rounded-2xl bg-teal-50 border border-teal-100 text-teal-700 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <p className="text-xs text-slate-600 font-medium leading-relaxed">
          <strong className="text-slate-900 font-bold">Enfoque de Salud Preventiva:</strong> Tus hábitos diarios de descanso, hidratación y movimiento complementan tu historia clínica y apoyan tu bienestar fisiológico general. No sustituyen prescripciones ni diagnósticos facultativos.
        </p>
      </div>

      {/* Modales del Dominio */}
      <RegistrarActividadModal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        onSubmit={async (name, duration, intensity, notes) => {
          await recordActivity(name, duration, intensity, notes);
        }}
      />

      <RegistrarHabitoModal
        habitType={selectedHabitForModal}
        onClose={() => setSelectedHabitForModal(null)}
        onSubmit={async (type, val, unit, notes) => {
          await logHabit(type, val, unit, notes);
        }}
      />

      <CrearObjetivoModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        onSubmit={async (title, targetDays, habitType) => {
          await createGoal(title, targetDays, habitType);
        }}
      />
    </div>
  );
};

export default EstiloVidaPage;