// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/salud-materna/diario-sintomas/DiarioSintomasPage.tsx
// DESCRIPCIÓN: Orquestador limpio con integración del modal flotante de registro.
// =========================================================================

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../../../../../core/context/useAuth';
import { symptomDiaryService } from '../../../../../modules/maternal-health/services/symptom-diary.service';
import type {
  SymptomDiaryEntry,
  HomeMeasurementEntry,
  FetalMovementEntry,
  DoctorQuestionNote,
  SymptomItemRecord,
} from '../../../../../modules/maternal-health/types/maternal-health.types';

import {
  DiarioSintomasHeader,
  EstadoActualCard,
  RegistroSignosCasaCard,
  MovimientosFetalesCard,
  SignosAlarmaCard,
  ObservacionesDiarioCard,
  HistorialSintomas,
  ResumenParaConsultaCard,
} from './components/index';
import { RegistrarSintomasModal } from './components/RegistrarSintomasModal';

export const DiarioSintomasPage: React.FC = () => {
  const { user } = useAuth();
  const patientId = user?.id || 'paciente-demo';

  const [loading, setLoading] = useState(true);
  const [symptomEntries, setSymptomEntries] = useState<SymptomDiaryEntry[]>([]);
  const [measurements, setMeasurements] = useState<HomeMeasurementEntry[]>([]);
  const [fetalMovements, setFetalMovements] = useState<FetalMovementEntry[]>([]);
  const [questions, setQuestions] = useState<DoctorQuestionNote[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [symptoms, meas, fetal, quest] = await Promise.all([
        symptomDiaryService.getSymptomEntries(patientId),
        symptomDiaryService.getHomeMeasurements(patientId),
        symptomDiaryService.getFetalMovements(patientId),
        symptomDiaryService.getDoctorQuestions(patientId),
      ]);
      setSymptomEntries(symptoms);
      setMeasurements(meas);
      setFetalMovements(fetal);
      setQuestions(quest);
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    let isMounted = true;

    const executeLoad = async () => {
      try {
        const [symptoms, meas, fetal, quest] = await Promise.all([
          symptomDiaryService.getSymptomEntries(patientId),
          symptomDiaryService.getHomeMeasurements(patientId),
          symptomDiaryService.getFetalMovements(patientId),
          symptomDiaryService.getDoctorQuestions(patientId),
        ]);
        if (isMounted) {
          setSymptomEntries(symptoms);
          setMeasurements(meas);
          setFetalMovements(fetal);
          setQuestions(quest);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void executeLoad();

    return () => {
      isMounted = false;
    };
  }, [patientId]);

  const todayEntry = useMemo(() => {
    const todayStr = new Date().toDateString();
    return symptomEntries.find((e) => new Date(e.recordedAt).toDateString() === todayStr) || null;
  }, [symptomEntries]);

  const handleSaveSymptoms = async (data: { symptoms: SymptomItemRecord[]; notes?: string }) => {
    const created = await symptomDiaryService.saveSymptomEntry(patientId, data);
    setSymptomEntries((prev) => [created, ...prev]);
  };

  const handleSaveMeasurement = async (data: {
    weightKg?: number | null;
    systolic?: number | null;
    diastolic?: number | null;
    pulse?: number | null;
  }) => {
    const created = await symptomDiaryService.saveHomeMeasurement(patientId, data);
    setMeasurements((prev) => [created, ...prev]);
  };

  const handleRecordFetalMovement = async (count: number, notes?: string) => {
    const created = await symptomDiaryService.recordFetalMovement(patientId, count, notes);
    setFetalMovements((prev) => [created, ...prev]);
  };

  const handleAddQuestion = async (text: string) => {
    const created = await symptomDiaryService.addDoctorQuestion(patientId, text);
    setQuestions((prev) => [created, ...prev]);
  };

  const handleRemoveQuestion = async (id: string) => {
    await symptomDiaryService.removeDoctorQuestion(patientId, id);
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  return (
    <div className="w-full max-w-[1700px] mx-auto p-3 sm:p-4 space-y-4 select-none animate-in fade-in duration-200">
      <DiarioSintomasHeader
        lastUpdatedText={todayEntry ? 'Actualizado hoy' : 'Sin registro hoy'}
        onRefresh={() => {
          setLoading(true);
          void loadData();
        }}
        isLoading={loading}
      />

      <EstadoActualCard
        todayEntry={todayEntry}
        onOpenRegister={() => setIsModalOpen(true)}
        onViewHistory={() => {
          const el = document.getElementById('historial-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Botón rápido de acción para registrar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
        <div className="space-y-0.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Bitácora Diaria
          </p>
          <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
            ¿Quieres registrar nuevas molestias o síntomas?
          </h3>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-[#2B7A78] hover:bg-[#236866] text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer"
        >
          Registrar síntomas
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RegistroSignosCasaCard
          latestMeasurement={measurements[0] || null}
          onSave={handleSaveMeasurement}
        />
        <MovimientosFetalesCard
          latestMovement={fetalMovements[0] || null}
          onRecord={handleRecordFetalMovement}
        />
      </div>

      <SignosAlarmaCard />

      <ObservacionesDiarioCard
        questions={questions}
        onAddQuestion={handleAddQuestion}
        onRemoveQuestion={handleRemoveQuestion}
      />

      <ResumenParaConsultaCard
        entries={symptomEntries}
        measurements={measurements}
      />

      <div id="historial-section">
        <HistorialSintomas entries={symptomEntries} />
      </div>

      {/* Modal Flotante de Registro por Pasos */}
      <RegistrarSintomasModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSymptoms}
      />
    </div>
  );
};

export default DiarioSintomasPage;