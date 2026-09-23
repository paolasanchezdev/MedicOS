// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/salud-materna/control-embarazo/ControlEmbarazoPage.tsx
// DESCRIPCIÓN: Orquestador panorámico clínico con acción contextual priorizada
//              al inicio para fomentar el registro activo de la paciente.
// =========================================================================

import React from 'react';
import { usePregnancyControl } from '../../../../../modules/maternal-health/hooks/usePregnancyControl.js';
import {
  ControlEmbarazoHeader,
  EmbarazoKpisGrid,
  EmbarazoResumenCard,
  ProgresoEmbarazoCard,
  EmbarazoAiSummaryCard,
  UltimoControlCard,
  ProximoControlCard,
  GraficoEvolucionClinica,
  EmbarazoTimeline,
  ExamenesEmbarazoCard,
  VacunasEmbarazoCard,
  RecomendacionesEmbarazoCard,
  ControlEmbarazoLoading,
  ControlEmbarazoEmpty,
  ControlEmbarazoError,
} from './components/index.js';
import { HeartHandshake, ChevronRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ControlEmbarazoPage: React.FC = () => {
  const navigate = useNavigate();
  const { data, loading, error, refetch } = usePregnancyControl();

  if (loading) {
    return (
      <div className="w-full max-w-[1700px] mx-auto p-3 sm:p-4 space-y-4 select-none">
        <ControlEmbarazoHeader
          patientName="Paciente"
          onRefresh={refetch}
          isLoading={true}
          hasActivePregnancy={false}
        />
        <ControlEmbarazoLoading />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="w-full max-w-[1700px] mx-auto p-3 sm:p-4 space-y-4 select-none">
        <ControlEmbarazoHeader
          patientName="Paciente"
          onRefresh={refetch}
          isLoading={false}
          hasActivePregnancy={false}
        />
        <ControlEmbarazoError
          message={error || 'No fue posible obtener el control de embarazo'}
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1700px] mx-auto p-3 sm:p-4 space-y-5 select-none animate-in fade-in duration-200">
      {/* 1. ENCABEZADO OFICIAL */}
      <ControlEmbarazoHeader
        patientName={data.patientName}
        onRefresh={refetch}
        isLoading={loading}
        hasActivePregnancy={data.hasActivePregnancy}
      />

      {/* ESTADO VACÍO (Sin embarazo activo en base de datos) */}
      {!data.hasActivePregnancy || !data.pregnancy ? (
        <ControlEmbarazoEmpty />
      ) : (
        <div className="space-y-5">
          {/* 2. KPIS CLÍNICOS PRINCIPALES (Presión, Peso, Frecuencia, Citas) */}
          <EmbarazoKpisGrid data={data} />

          {/* 3. RESUMEN GENERAL DE GESTACIÓN (Semanas, FPP, Desarrollo Fetal) */}
          <EmbarazoResumenCard pregnancy={data.pregnancy} />

          {/* 4. SÍNTESIS CLÍNICA ASISTIDA POR IA */}
          <EmbarazoAiSummaryCard aiInsight={data.aiInsight} />

          {/* 5. ACCIÓN PRIORIZADA: PARTICIPACIÓN ACTIVA EN EL DIARIO DE SÍNTOMAS */}
          <div className="group bg-linear-to-r from-teal-50/80 via-white to-emerald-50/40 rounded-2xl border border-teal-200/80 p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-teal-300 transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 select-none">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs shrink-0 mt-0.5">
                <HeartHandshake className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                    <span>Autocuidado y Registro Activo</span>
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] font-semibold text-slate-400 hidden sm:inline">
                    Diario personal
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                  ¿Cómo te has sentido hoy? Registra tus síntomas
                </h3>

                <p className="text-xs text-slate-600 font-medium max-w-2xl leading-relaxed">
                  Anota náuseas, cambios en tu cuerpo, movimientos de tu bebé o dudas del día a día para que tu médico las revise contigo en tu próxima cita prenatal.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/paciente/salud-materna/diario-sintomas')}
              className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition shadow-xs hover:shadow-md cursor-pointer group/btn"
            >
              <span>Ir al diario de síntomas</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
            </button>
          </div>

          {/* 6. REGLETA CONTINUA DE PROGRESO POR TRIMESTRES */}
          <ProgresoEmbarazoCard pregnancy={data.pregnancy} />

          {/* 7. CONTROLES CLÍNICOS: Último Control Atendido y Próximo Agendado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            <UltimoControlCard control={data.lastControl} />
            <ProximoControlCard appointment={data.nextAppointment} />
          </div>

          {/* 8. EVOLUCIÓN CLÍNICA: Curva interactiva de Peso y Presión Arterial */}
          <GraficoEvolucionClinica timeline={data.timeline} />

          {/* 9. TIMELINE CRONOLÓGICO: Consultas atendidas en expediente */}
          <EmbarazoTimeline timeline={data.timeline} />

          {/* 10. ESTUDIOS Y VACUNAS MATERNAS (Cuadrícula simétrica) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            <ExamenesEmbarazoCard summary={data.examsSummary} />
            <VacunasEmbarazoCard summary={data.vaccinesSummary} />
          </div>

          {/* 11. PLAN DE CUIDADO: Prescripciones y Suplementación */}
          <RecomendacionesEmbarazoCard indications={data.medicalIndications} />
        </div>
      )}
    </div>
  );
};

export default ControlEmbarazoPage;