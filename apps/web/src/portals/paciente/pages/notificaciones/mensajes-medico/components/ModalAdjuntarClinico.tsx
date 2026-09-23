// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/notificaciones/mensajes-medico/components/ModalAdjuntarClinico.tsx
// DESCRIPCIÓN: Modal para seleccionar y adjuntar referencias clínicas reales
//              (Diario de Síntomas o Resultados de Laboratorio) sin duplicar texto.
// =========================================================================

import React, { useState, useEffect } from 'react';
import { X, Activity, TestTube2, AlertTriangle, ArrowRight, RotateCw } from 'lucide-react';
import { symptomDiaryService } from '../../../../../../modules/maternal-health/services/symptom-diary.service.js';
import { laboratoryService } from '../../../../../../modules/laboratory/services/laboratory.service.js';
import type { SymptomDiaryEntry } from '../../../../../../modules/maternal-health/types/maternal-health.types.js';
import type { LaboratoryStudy } from '../../../../../../modules/laboratory/types/laboratory.types.js';
import type { ClinicalMessagePayload, ClinicalMessageType } from '../../../../../../modules/clinical-messages/types/clinical-messages.types.js';

interface ModalAdjuntarClinicoProps {
  isOpen: boolean;
  onClose: () => void;
  onAttach: (type: ClinicalMessageType, content: string, payload: ClinicalMessagePayload) => void;
  patientId: string;
}

export const ModalAdjuntarClinico: React.FC<ModalAdjuntarClinicoProps> = ({
  isOpen,
  onClose,
  onAttach,
  patientId,
}) => {
  const [activeTab, setActiveTab] = useState<'symptoms' | 'lab'>('symptoms');
  const [symptomsList, setSymptomsList] = useState<SymptomDiaryEntry[]>([]);
  const [labsList, setLabsList] = useState<LaboratoryStudy[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;

    Promise.all([
      symptomDiaryService.getSymptomEntries(patientId),
      laboratoryService.getMyLaboratoryResults().catch(() => []),
    ])
      .then(([symptoms, labs]) => {
        if (!isMounted) return;
        setSymptomsList(symptoms);
        setLabsList(labs);
        setLoading(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, patientId]);

  if (!isOpen) return null;

  const handleCloseModal = () => {
    setLoading(true);
    onClose();
  };

  const handleSelectSymptom = (entry: SymptomDiaryEntry) => {
    const isWarning = entry.symptoms.some((s) => s.intensity === 'INTENSA');
    const symptomNames = entry.symptoms.map((s) => s.name).join(', ');

    onAttach(
      'CLINICAL_SYMPTOM',
      `Adjunto registro de síntomas del diario (${symptomNames}) para su valoración clínica.`,
      {
        symptoms: entry.symptoms.map((s) => ({
          name: s.name,
          intensity: s.intensity,
          onset: s.onset,
        })),
        isWarningSign: isWarning,
        warningSignTitle: isWarning ? 'Síntoma de alta intensidad' : undefined,
        notes: entry.notes || undefined,
      }
    );
    handleCloseModal();
  };

  const handleSelectLab = (study: LaboratoryStudy) => {
    const analytesSummary = study.analytes
      ? study.analytes.map((a) => `${a.name}: ${a.value} ${a.unit}`).join(' · ')
      : undefined;

    onAttach(
      'CLINICAL_LAB',
      `Adjunto el resultado de laboratorio oficial "${study.name}" (${study.code}) para su revisión.`,
      {
        labStudyId: study.id,
        labStudyCode: study.code,
        labStudyName: study.name,
        labAnalytesSummary: analytesSummary,
      }
    );
    handleCloseModal();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]">
        {/* Cabecera del Modal */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-sm font-black text-slate-900">Adjuntar Información Clínica</h3>
            <p className="text-xs text-slate-500 font-medium">
              Comparte datos estructurados registrados en tu expediente con tu médico.
            </p>
          </div>
          <button
            type="button"
            onClick={handleCloseModal}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pestañas de Selección */}
        <div className="flex border-b border-slate-100 p-2 gap-2 bg-slate-50/50">
          <button
            type="button"
            onClick={() => setActiveTab('symptoms')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'symptoms'
                ? 'bg-[#1c5752] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Diario de Síntomas ({symptomsList.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('lab')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'lab'
                ? 'bg-[#1c5752] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            <TestTube2 className="w-3.5 h-3.5" />
            <span>Laboratorio ({labsList.length})</span>
          </button>
        </div>

        {/* Lista de Registros */}
        <div className="p-4 overflow-y-auto flex-1 space-y-2.5">
          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400 space-y-2">
              <RotateCw className="w-5 h-5 animate-spin text-[#1c5752] mx-auto" />
              <p>Consultando registros clínicos...</p>
            </div>
          ) : activeTab === 'symptoms' ? (
            symptomsList.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No tienes registros recientes en tu Diario de Síntomas.
              </div>
            ) : (
              symptomsList.map((entry) => {
                const hasIntense = entry.symptoms.some((s) => s.intensity === 'INTENSA');
                return (
                  <div
                    key={entry.id}
                    onClick={() => handleSelectSymptom(entry)}
                    className="p-3.5 rounded-2xl border border-slate-200 hover:border-teal-300 hover:bg-teal-50/40 transition cursor-pointer flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">
                          {entry.symptoms.map((s) => s.name).join(', ')}
                        </span>
                        {hasIntense && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9.5px] font-bold bg-rose-100 text-rose-800">
                            <AlertTriangle className="w-3 h-3" /> Intensa
                          </span>
                        )}
                      </div>
                      <span className="text-[10.5px] font-mono text-slate-400 block">
                        Registrado el{' '}
                        {new Date(entry.recordedAt).toLocaleDateString('es-SV', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                  </div>
                );
              })
            )
          ) : labsList.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No tienes estudios de laboratorio recientes para adjuntar.
            </div>
          ) : (
            labsList.map((lab) => (
              <div
                key={lab.id}
                onClick={() => handleSelectLab(lab)}
                className="p-3.5 rounded-2xl border border-slate-200 hover:border-teal-300 hover:bg-teal-50/40 transition cursor-pointer flex items-center justify-between gap-3 shadow-2xs"
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{lab.name}</span>
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                      {lab.code}
                    </span>
                  </div>
                  <span className="text-[10.5px] font-mono text-slate-400 block">
                    {lab.establishmentName} ·{' '}
                    {new Date(lab.performedAt).toLocaleDateString('es-SV', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalAdjuntarClinico;