// =========================================================================
// ARCHIVO: PreferenciasPacientePage.tsx
// DESCRIPCIÓN: Vista principal de preferencias conectada a modules/patients
//              con estilo Apple Settings / iOS y auto-guardado reactivo.
// =========================================================================

import React from 'react';
import { RotateCcw } from 'lucide-react';
import { usePatientPreferences } from '../../../../../modules/patients/hooks/usePatientPreferences.js';
import {
  PreferenciasHeader,
  NotificacionesPreferenciasCard,
  AparienciaPreferenciasCard,
  AccesibilidadPreferenciasCard,
  ComunicacionPreferenciasCard,
  PreferenciasResetModal,
  PreferenciasLoading,
  PreferenciasError,
} from './components/index.js';

export const PreferenciasPacientePage: React.FC = () => {
  const {
    preferences,
    loading,
    error,
    saveStatus,
    isResetModalOpen,
    setIsResetModalOpen,
    updatePreference,
    resetPreferences,
    refetch,
  } = usePatientPreferences();

  if (loading) {
    return (
      <div className="w-full space-y-6 pb-20 animate-in fade-in duration-150">
        <PreferenciasLoading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full space-y-6 pb-20 animate-in fade-in duration-150">
        <PreferenciasError onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 pb-20 animate-in fade-in duration-150">
      {/* 1. Header Oficial Institucional con Micro-Indicador */}
      <PreferenciasHeader saveStatus={saveStatus} />

      {/* 2. Sección: Notificaciones y Canales */}
      <section>
        <NotificacionesPreferenciasCard
          preferences={preferences}
          onUpdate={updatePreference}
        />
      </section>

      {/* 3. Sección: Apariencia Visual */}
      <section>
        <AparienciaPreferenciasCard
          preferences={preferences}
          onUpdate={updatePreference}
        />
      </section>

      {/* 4. Sección: Accesibilidad y Movimiento */}
      <section>
        <AccesibilidadPreferenciasCard
          preferences={preferences}
          onUpdate={updatePreference}
        />
      </section>

      {/* 5. Sección: Comunicaciones del Sistema */}
      <section>
        <ComunicacionPreferenciasCard
          preferences={preferences}
          onUpdate={updatePreference}
        />
      </section>

      {/* 6. Botón Secundario Discreto: Restablecer valores */}
      <section className="pt-2 flex justify-center">
        <button
          type="button"
          onClick={() => setIsResetModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-[#166E7A] hover:bg-[#EEF7F8] transition cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restablecer preferencias a valores predeterminados</span>
        </button>
      </section>

      {/* 7. Modal de Confirmación para Restaurar */}
      <PreferenciasResetModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={resetPreferences}
      />
    </div>
  );
};

export default PreferenciasPacientePage;