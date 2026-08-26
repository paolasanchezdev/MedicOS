// =========================================================================
// ARCHIVO: apps/web/src/portals/medico/pages/consultas/nueva/components/FormularioConsultaClinica.tsx
// DESCRIPCIÓN: Orquestador del carrusel con Motor de Inferencia Heurística y Explicabilidad CDSS.
// =========================================================================

import React, { useState, useMemo } from 'react';
import { ArrowLeft, ArrowRight, Save, Loader2, CheckCircle2 } from 'lucide-react';
import { CarruselPasosHeader } from './CarruselPasosHeader';
import { SoporteInferenciaCard } from './SoporteInferenciaCard';
import { PasoAnamnesisExamen } from './PasoAnamnesisExamen';
import { PasoDiagnosticoCIE } from './PasoDiagnosticoCIE';
import { PasoPrescripcionReceta } from './PasoPrescripcionReceta';
import { PasoPlanCierre } from './PasoPlanCierre';
import { validateVitals, evaluateClinicalInference } from '../utils/clinicalEngine';
import type { PrescripcionItem } from './PrescripcionMedicamentos';
import type { PatientOrigin } from './ColaAtencionDual';

export interface ClinicalFormState {
  chiefComplaint: string;
  physicalExam: string;
  diagnosisCode: string;
  diagnosisDesc: string;
  nonPharmPlan: string;
  warningSigns: string;
  followUpDate: string;
  systolic: number | '';
  diastolic: number | '';
  heartRate: number | '';
  respiratoryRate: number | '';
  temperature: number | '';
  oxygenSat: number | '';
}

export interface FormularioConsultaClinicaProps {
  patientSymptoms: string[];
  patientAllergies?: string | null;
  data: ClinicalFormState;
  prescriptionItems: PrescripcionItem[];
  origin: PatientOrigin;
  hasPreviousVitals: boolean;
  onChange: (field: keyof ClinicalFormState, value: string | number | '') => void;
  onAddPrescription: () => void;
  onRemovePrescription: (id: string) => void;
  onUpdatePrescription: (id: string, field: keyof PrescripcionItem, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSaving: boolean;
  successMessage: boolean;
  disabled: boolean;
}

export const FormularioConsultaClinica: React.FC<FormularioConsultaClinicaProps> = ({
  patientSymptoms,
  patientAllergies,
  data,
  prescriptionItems,
  origin,
  hasPreviousVitals,
  onChange,
  onAddPrescription,
  onRemovePrescription,
  onUpdatePrescription,
  onSubmit,
  isSaving,
  successMessage,
  disabled,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [maxAccessibleStep, setMaxAccessibleStep] = useState<number>(1);

  // Inferencia Heurística con Scoring y Parser de Negaciones
  const inference = useMemo(() => {
    return evaluateClinicalInference(
      data.chiefComplaint,
      patientSymptoms,
      {
        systolic: data.systolic,
        diastolic: data.diastolic,
        heartRate: data.heartRate,
        respiratoryRate: data.respiratoryRate,
        temperature: data.temperature,
        oxygenSat: data.oxygenSat,
      },
      prescriptionItems,
      patientAllergies
    );
  }, [data, patientSymptoms, prescriptionItems, patientAllergies]);

  const vitalsAudit = useMemo(() => {
    return validateVitals(
      data.systolic,
      data.diastolic,
      data.heartRate,
      data.respiratoryRate,
      data.temperature,
      data.oxygenSat
    );
  }, [data.systolic, data.diastolic, data.heartRate, data.respiratoryRate, data.temperature, data.oxygenSat]);

  const canGoNextFromStep1 = data.chiefComplaint.trim().length > 0 && !vitalsAudit.hasErrors;
  const canGoNextFromStep2 = data.diagnosisDesc.trim().length > 0;

  const handleNext = () => {
    if (currentStep === 1) {
      if (vitalsAudit.hasErrors) {
        alert('Por favor verifica las constantes vitales con lecturas inválidas antes de continuar.');
        return;
      }
      if (!data.chiefComplaint.trim()) {
        alert('Por favor complete la anamnesis o motivo de consulta.');
        return;
      }
    }
    if (currentStep === 2 && !canGoNextFromStep2) {
      alert('Por favor seleccione o escriba el diagnóstico principal.');
      return;
    }

    const next = currentStep + 1;
    setCurrentStep(next);
    setMaxAccessibleStep((prev) => Math.max(prev, next));
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  return (
    <form onSubmit={onSubmit} className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-7 shadow-2xs space-y-6">
      {/* 1. Header del Carrusel de Pasos */}
      <CarruselPasosHeader
        currentStep={currentStep}
        onSelectStep={(step) => setCurrentStep(step)}
        maxAccessibleStep={maxAccessibleStep}
      />

      {/* 2. Tarjeta Explicable de Inferencia Heurística */}
      <SoporteInferenciaCard inference={inference} />

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-emerald-800 text-xs sm:text-sm font-bold animate-in fade-in">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          <span>Consulta guardada exitosamente en el expediente clínico.</span>
        </div>
      )}

      {/* 3. Pasos del Flujo */}
      <div className="min-h-75">
        {currentStep === 1 && (
          <PasoAnamnesisExamen
            data={data}
            origin={origin}
            hasPreviousVitals={hasPreviousVitals}
            onChange={onChange}
            disabled={disabled}
          />
        )}

        {currentStep === 2 && (
          <PasoDiagnosticoCIE
            data={data}
            onChange={onChange}
            disabled={disabled}
          />
        )}

        {currentStep === 3 && (
          <PasoPrescripcionReceta
            items={prescriptionItems}
            pharmacologicalAlerts={inference.pharmacologicalAlerts}
            onAddItem={onAddPrescription}
            onRemoveItem={onRemovePrescription}
            onUpdateItem={onUpdatePrescription}
            disabled={disabled}
          />
        )}

        {currentStep === 4 && (
          <PasoPlanCierre
            data={data}
            prescriptionItems={prescriptionItems}
            onChange={onChange}
            disabled={disabled}
          />
        )}
      </div>

      {/* 4. Navegación Inferior */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
        <div>
          {currentStep > 1 ? (
            <button
              type="button"
              disabled={disabled || isSaving}
              onClick={handlePrev}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <ArrowLeft size={14} />
              <span>Paso Anterior</span>
            </button>
          ) : (
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">
              Paso 1 de 4: Anamnesis y Examen Físico
            </span>
          )}
        </div>

        <div className="w-full sm:w-auto">
          {currentStep < 4 ? (
            <button
              type="button"
              disabled={
                disabled ||
                (currentStep === 1 && !canGoNextFromStep1) ||
                (currentStep === 2 && !canGoNextFromStep2)
              }
              onClick={handleNext}
              className="w-full sm:w-auto px-6 py-2.5 bg-[#0e7490] hover:bg-[#0891b2] disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              <span>
                {currentStep === 1 && 'Continuar a Diagnóstico'}
                {currentStep === 2 && 'Continuar a Prescripción'}
                {currentStep === 3 && 'Continuar a Plan & Cierre'}
              </span>
              <ArrowRight size={14} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={disabled || isSaving || vitalsAudit.hasErrors}
              className="w-full sm:w-auto px-8 py-3 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              {isSaving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Guardando en Expediente...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Finalizar Consulta y Guardar Expediente</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default FormularioConsultaClinica;