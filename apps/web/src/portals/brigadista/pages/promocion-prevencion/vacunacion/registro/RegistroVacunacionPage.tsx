// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/promocion-prevencion/vacunacion/registro/RegistroVacunacionPage.tsx
// DESCRIPCIÓN: Orquestador del registro de vacunación con pantalla de éxito
//              institucional, resumen del biológico aplicado y acciones de navegación.
// =========================================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useVaccinationHistory,
  useCreateVaccination,
  type NuevaVacunacionFormState,
  type VaccineCatalogItem,
  type AdministrationRoute,
  type AnatomicalSite,
} from '../../../../../../modules/vaccinations';
import type { PatientRecord } from '../../../../../../modules/patients';
import {
  VacunacionHeader,
  VacunacionPasosBar,
  VacunacionPacienteCard,
  VacunaSeleccionCard,
  VacunacionAplicacionCard,
  VacunacionObservacionesCard,
  VacunacionResumenCard,
} from './components';
import {
  AlertCircle,
  CheckCircle2,
  Syringe,
  User,
  Barcode,
  Layers,
  ArrowRight,
  RotateCcw,
  ShieldCheck,
  Clock,
} from 'lucide-react';

const INITIAL_FORM_STATE: NuevaVacunacionFormState = {
  patient: null,
  selectedVaccine: null,
  doseNumber: 1,
  lotNumber: '',
  expirationDate: '',
  administrationRoute: 'INTRAMUSCULAR',
  anatomicalSite: 'DELTOIDES_IZQUIERDO',
  administeredDate: new Date().toISOString().slice(0, 10),
  administeredTime: new Date().toTimeString().slice(0, 5),
  adverseReactions: '',
  observations: '',
};

export const RegistroVacunacionPage: React.FC = () => {
  const navigate = useNavigate();
  const { catalog } = useVaccinationHistory();
  const { createVaccination, isLoading, error, syncStatus } = useCreateVaccination();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<NuevaVacunacionFormState>(INITIAL_FORM_STATE);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

  const handleSelectPatient = (patient: PatientRecord | null) => {
    setFormData((prev) => ({ ...prev, patient }));
  };

  const handleSelectVaccine = (vaccine: VaccineCatalogItem) => {
    setFormData((prev) => ({
      ...prev,
      selectedVaccine: vaccine,
      doseNumber: vaccine.doseNumber || 1,
      administrationRoute: vaccine.route,
      anatomicalSite: vaccine.anatomicalSiteDefault,
    }));
  };

  const canAdvance = (): boolean => {
    if (currentStep === 1) return Boolean(formData.patient && formData.selectedVaccine);
    if (currentStep === 2) return Boolean(formData.lotNumber.trim() && formData.expirationDate);
    return true;
  };

  const handleSubmit = async () => {
    try {
      await createVaccination(formData);
      setSaveSuccess(true);
    } catch {
      // Error gestionado por el hook
    }
  };

  const handleResetForNew = () => {
    setFormData(INITIAL_FORM_STATE);
    setCurrentStep(1);
    setSaveSuccess(false);
  };

  // Pantalla de Confirmación Exitosa Rediseñada
  if (saveSuccess) {
    const pacienteNombre = formData.patient
      ? `${formData.patient.firstName} ${formData.patient.lastName}`
      : 'Persona Vacunada';

    return (
      <div className="w-full space-y-4 animate-in fade-in duration-200 max-w-[1700px] mx-auto">
        <VacunacionHeader isOnline={isOnline} />

        <div className="max-w-2xl mx-auto bg-white/90 backdrop-blur-xl rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)] space-y-6">
          {/* 1. Header de Éxito */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 flex items-center justify-center mx-auto shadow-2xs">
              <CheckCircle2 className="w-9 h-9 stroke-2" />
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                Registro Oficial Completado
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                ¡Inmunización Registrada con Éxito!
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
                {syncStatus === 'SYNCED'
                  ? 'La dosis ha sido asentada y sincronizada directamente en la base de datos nominal de MedicOS.'
                  : 'La dosis ha sido guardada de forma segura en la cola local (Outbox) y se sincronizará automáticamente.'}
              </p>
            </div>
          </div>

          {/* 2. Tarjeta Resumen del Comprobante */}
          <div className="bg-slate-50/80 rounded-xl border border-slate-200/80 p-4 sm:p-5 space-y-3.5 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-700" />
                Resumen de Inmunización Aplicada
              </span>
              <span className="text-[11px] font-mono font-bold text-teal-900 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-md">
                MINSAL 2026
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Persona */}
              <div className="p-3 bg-white rounded-lg border border-slate-200/70 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                  <User className="w-3 h-3 text-slate-400" /> Persona Vacunada
                </span>
                <p className="font-extrabold text-slate-900 truncate">{pacienteNombre}</p>
                <p className="text-[11px] text-slate-500 font-mono">
                  DUI: {formData.patient?.dui || 'No registrado'}
                </p>
              </div>

              {/* Biológico */}
              <div className="p-3 bg-white rounded-lg border border-slate-200/70 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                  <Syringe className="w-3 h-3 text-teal-600" /> Biológico y Dosis
                </span>
                <p className="font-extrabold text-slate-900 truncate">
                  {formData.selectedVaccine?.name}
                </p>
                <p className="text-[11px] font-bold text-teal-800">
                  Dosis {formData.doseNumber} de {formData.selectedVaccine?.totalDoses || 1}
                </p>
              </div>

              {/* Lote y Vencimiento */}
              <div className="p-3 bg-white rounded-lg border border-slate-200/70 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                  <Barcode className="w-3 h-3 text-slate-400" /> Trazabilidad de Lote
                </span>
                <p className="font-mono font-bold text-slate-900 uppercase truncate">
                  {formData.lotNumber || 'Sin lote'}
                </p>
                <p className="text-[11px] text-slate-500">
                  Vence: {formData.expirationDate || 'N/A'}
                </p>
              </div>

              {/* Vía, Sitio y Horario */}
              <div className="p-3 bg-white rounded-lg border border-slate-200/70 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                  <Layers className="w-3 h-3 text-slate-400" /> Vía y Horario
                </span>
                <p className="font-semibold text-slate-900 truncate">
                  {formData.administrationRoute} • {formData.anatomicalSite}
                </p>
                <p className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {formData.administeredDate} a las {formData.administeredTime}
                </p>
              </div>
            </div>
          </div>

          {/* 3. Acciones Rápidas de Navegación */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleResetForNew}
              className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl border border-slate-200 hover:border-teal-400 bg-white hover:bg-teal-50/60 text-slate-700 hover:text-teal-900 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer shadow-2xs active:scale-98"
            >
              <RotateCcw className="w-4 h-4 text-teal-700" />
              <span>Registrar Otra Vacuna</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/brigadista/promocion-prevencion/vacunacion/resumen')}
              className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl bg-[#2B7A78] hover:bg-[#236866] text-white text-xs font-extrabold flex items-center justify-center gap-2 transition cursor-pointer shadow-2xs active:scale-98"
            >
              <span>Ir al Resumen de Vacunación</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-2.5 animate-in fade-in duration-200 max-w-[1700px] mx-auto">
      {/* 1. Header Institucional */}
      <VacunacionHeader isOnline={isOnline} />

      {/* 2. Barra Unificada de Pasos y Navegación */}
      <VacunacionPasosBar
        currentStep={currentStep}
        totalSteps={4}
        canAdvance={canAdvance()}
        isLoading={isLoading}
        onPrev={() => setCurrentStep((p) => Math.max(1, p - 1))}
        onNext={() => setCurrentStep((p) => Math.min(4, p + 1))}
        onSubmit={handleSubmit}
      />

      {/* 3. Alerta de Error si ocurre */}
      {error && (
        <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-2xs">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 4. Distribución Principal con Altura Sincronizada */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
        {/* Columna Izquierda: Ficha del Paciente */}
        <div className="lg:col-span-4 flex flex-col">
          <VacunacionPacienteCard
            selectedPatient={formData.patient}
            onSelectPatient={handleSelectPatient}
          />
        </div>

        {/* Columna Derecha: Paso Activo */}
        <div className="lg:col-span-8 flex flex-col">
          {currentStep === 1 && (
            <VacunaSeleccionCard
              catalog={catalog}
              selectedVaccine={formData.selectedVaccine}
              doseNumber={formData.doseNumber}
              onSelectVaccine={handleSelectVaccine}
              onDoseChange={(doseNumber) => setFormData((prev) => ({ ...prev, doseNumber }))}
            />
          )}

          {currentStep === 2 && (
            <VacunacionAplicacionCard
              lotNumber={formData.lotNumber}
              onLotChange={(lotNumber) => setFormData((prev) => ({ ...prev, lotNumber }))}
              expirationDate={formData.expirationDate}
              onExpirationChange={(expirationDate) =>
                setFormData((prev) => ({ ...prev, expirationDate }))
              }
              administrationRoute={formData.administrationRoute}
              onRouteChange={(administrationRoute: AdministrationRoute) =>
                setFormData((prev) => ({ ...prev, administrationRoute }))
              }
              anatomicalSite={formData.anatomicalSite}
              onSiteChange={(anatomicalSite: AnatomicalSite) =>
                setFormData((prev) => ({ ...prev, anatomicalSite }))
              }
              administeredDate={formData.administeredDate}
              onAdministeredDateChange={(administeredDate) =>
                setFormData((prev) => ({ ...prev, administeredDate }))
              }
              administeredTime={formData.administeredTime}
              onAdministeredTimeChange={(administeredTime) =>
                setFormData((prev) => ({ ...prev, administeredTime }))
              }
            />
          )}

          {currentStep === 3 && (
            <VacunacionObservacionesCard
              adverseReactions={formData.adverseReactions}
              onAdverseReactionsChange={(adverseReactions) =>
                setFormData((prev) => ({ ...prev, adverseReactions }))
              }
              observations={formData.observations}
              onObservationsChange={(observations) =>
                setFormData((prev) => ({ ...prev, observations }))
              }
            />
          )}

          {currentStep === 4 && <VacunacionResumenCard formData={formData} />}
        </div>
      </div>
    </div>
  );
};

export default RegistroVacunacionPage;