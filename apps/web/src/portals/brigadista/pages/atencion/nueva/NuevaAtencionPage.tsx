// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/atencion/nueva/NuevaAtencionPage.tsx
// DESCRIPCIÓN: Orquestador general de Nueva Atención Comunitaria con persistencia de borrador en localStorage y ciclo de vida de guardado completo.
// =========================================================================

import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserSearch,
  X,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Calendar,
  Phone,
  FileText,
  ShieldCheck,
  User,
  HeartPulse,
  Droplet,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../../../../../core/context/useAuth';
import { useCreateAttention } from '../../../../../modules/atencion/hooks/useCreateAttention';
import type { NuevaAtencionFormState } from '../../../../../modules/atencion/types/atencion.types';
import type { PatientRecord } from '../../../../../modules/patients/types/patient.types';
import { useSearchPatients } from '../../../../../modules/patients/hooks/useSearchPatients';

import {
  AtencionHeader,
  AtencionPacienteCard,
  AtencionMotivoCard,
  AtencionValoracionTabs,
  AtencionObservacionesCard,
  AtencionAccionesCard,
  AtencionEducacionCard,
  AtencionSeguimientoReferenciaCard,
  AtencionResumenCard,
  AtencionNavegacion,
  AtencionGuardarModal,
  type GuardarModalEstado,
} from './components';

const DRAFT_STORAGE_KEY = 'medicos_draft_nueva_atencion_brigadista';

const INITIAL_FORM_STATE: NuevaAtencionFormState = {
  patient: null,
  motivoCategoria: '',
  motivoDescripcion: '',
  evaluacion: {
    signosVitales: { systolic: '', diastolic: '', heartRate: '', temperature: '', oxygenSat: '', weight: '', height: '' },
    sintomas: { fiebre: false, tos: false, dolorCabeza: false, dificultadRespiratoria: false, diarrea: false, vomitos: false, mareos: false, dolorAbdominal: false, dolorGeneral: false, otro: false, otroDetalle: '', evolucionDias: '' },
    observacionesClinicas: '',
    condicionVivienda: '',
  },
  acciones: { tomaSignos: false, primerosAuxilios: false, curacionBasica: false, orientacionSanitaria: false, educacionHigiene: false, educacionNutricion: false, educacionDengue: false, educacionSignosAlarma: false, adherenciaTratamiento: false, apoyoVacunacion: false, otraAccion: false, otraAccionDetalle: '', recomendacionesGenerales: '' },
  seguimiento: { requiereSeguimiento: false, fechaSeguimiento: '', motivoSeguimiento: '', requiereReferencia: false, prioridadReferencia: 'MEDIUM', establecimientoDestinoId: '', establecimientoDestinoNombre: '', motivoReferencia: '', observacionesReferencia: '' },
};

function formatBloodType(bt?: string): string {
  if (!bt) return 'O+';
  const map: Record<string, string> = {
    O_POSITIVE: 'O+',
    O_NEGATIVE: 'O-',
    A_POSITIVE: 'A+',
    A_NEGATIVE: 'A-',
    B_POSITIVE: 'B+',
    B_NEGATIVE: 'B-',
    AB_POSITIVE: 'AB+',
    AB_NEGATIVE: 'AB-',
    UNKNOWN: 'O+',
  };
  return map[bt] || bt;
}

export const NuevaAtencionPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createAttention, isLoading, error: mutationError } = useCreateAttention();
  const { executeSearch, results, loading: loadingSearch } = useSearchPatients();

  // 1. Inicialización de Estado con soporte para Restauración de Borrador Local
  const [formData, setFormData] = useState<NuevaAtencionFormState>(() => {
    try {
      const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed?.formData) return parsed.formData;
      }
    } catch {
      // Ignorar fallo de parseo
    }
    return INITIAL_FORM_STATE;
  });

  const [currentStep, setCurrentStep] = useState<number>(() => {
    try {
      const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (typeof parsed?.currentStep === 'number') return parsed.currentStep;
      }
    } catch {
      // Ignorar fallo de parseo
    }
    return 1;
  });

  const [completedSteps, setCompletedSteps] = useState<number[]>(() => {
    try {
      const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (Array.isArray(parsed?.completedSteps)) return parsed.completedSteps;
      }
    } catch {
      // Ignorar fallo de parseo
    }
    return [];
  });

  const [nuevoAntecedente, setNuevoAntecedente] = useState<string>(() => {
    try {
      const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (typeof parsed?.nuevoAntecedente === 'string') return parsed.nuevoAntecedente;
      }
    } catch {
      // Ignorar fallo de parseo
    }
    return '';
  });

  const [esEmbarazada, setEsEmbarazada] = useState<boolean>(() => {
    try {
      const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (typeof parsed?.esEmbarazada === 'boolean') return parsed.esEmbarazada;
      }
    } catch {
      // Ignorar fallo de parseo
    }
    return false;
  });

  const [semanasGestacion, setSemanasGestacion] = useState<string>(() => {
    try {
      const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (typeof parsed?.semanasGestacion === 'string') return parsed.semanasGestacion;
      }
    } catch {
      // Ignorar fallo de parseo
    }
    return '';
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalEstado, setModalEstado] = useState<GuardarModalEstado>('CONFIRMAR');
  const [showCancelModal, setShowCancelModal] = useState(false);

  // 2. Persistencia Automática del Borrador en cada cambio
  useEffect(() => {
    try {
      const payload = {
        formData,
        currentStep,
        completedSteps,
        nuevoAntecedente,
        esEmbarazada,
        semanasGestacion,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Fallo de cuota de almacenamiento
    }
  }, [formData, currentStep, completedSteps, nuevoAntecedente, esEmbarazada, semanasGestacion]);

  const clearLocalDraft = () => {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {
      // Ignorar error
    }
  };

  const handleSelectPatient = (selected: PatientRecord) => {
    setFormData((prev) => ({ ...prev, patient: selected }));
    setShowSearchModal(false);
    if (!completedSteps.includes(1)) {
      setCompletedSteps((prev) => [...prev, 1]);
    }
    setValidationErrors((prev) => ({ ...prev, paciente: undefined }));
  };

  const validateStep = (step: number): boolean => {
    const errors: Record<string, string | undefined> = {};
    if (step === 1 && !formData.patient) {
      errors.paciente = 'Debes seleccionar una persona del padrón para continuar.';
    }
    if (step === 2 && !formData.motivoCategoria) {
      errors.motivoCategoria = 'Selecciona el motivo de atención.';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;
    if (!completedSteps.includes(currentStep)) setCompletedSteps((prev) => [...prev, currentStep]);
    if (currentStep < 8) setCurrentStep((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const handleGoToStep = (step: number) => {
    setCurrentStep(step);
    setValidationErrors({});
  };

  const handleConfirmarGuardar = async () => {
    try {
      setModalEstado('GUARDANDO');
      await createAttention(formData, { brigadeId: null, workSessionId: null, doctorId: user?.id });
      clearLocalDraft();
      setModalEstado('EXITO');
    } catch {
      setModalEstado('ERROR');
    }
  };

  const handleIniciarNuevaAtencion = () => {
    clearLocalDraft();
    setFormData(INITIAL_FORM_STATE);
    setCurrentStep(1);
    setCompletedSteps([]);
    setNuevoAntecedente('');
    setEsEmbarazada(false);
    setSemanasGestacion('');
    setIsModalOpen(false);
    setModalEstado('CONFIRMAR');
  };

  const handleConfirmarCancelacion = () => {
    clearLocalDraft();
    setFormData(INITIAL_FORM_STATE);
    setShowCancelModal(false);
    navigate('/brigadista/dashboard/resumen');
  };

  const pacienteNombre = formData.patient
    ? `${formData.patient.firstName} ${formData.patient.lastName}`.trim()
    : 'Persona no seleccionada';

  const direccionLimpiaPaso1 = useMemo(() => {
    if (!formData.patient?.address) return 'Comunidad no registrada';
    const partes = formData.patient.address.split(',').map((p) => p.trim()).filter(Boolean);
    return partes.filter((item, index) => partes.indexOf(item) === index).join(', ');
  }, [formData.patient]);

  const cleanDui = (formData.patient?.dui || '').replace(/\D/g, '');
  const expedienteNo = formData.patient?.clinicalRecord?.id
    ? `EXP-2026-${formData.patient.clinicalRecord.id.slice(0, 4).toUpperCase()}`
    : cleanDui
    ? `EXP-2026-${cleanDui.slice(-4)}`
    : 'EXP-2026-0001';

  return (
    <div className="w-full max-w-[1700px] mx-auto p-3 sm:p-4 space-y-3 animate-in fade-in duration-200">
      {/* 1. Header Oficial */}
      <AtencionHeader
        pacienteNombre={formData.patient ? pacienteNombre : undefined}
        pacienteDui={formData.patient?.dui || undefined}
        pasoActual={currentStep}
        totalPasos={8}
        onRegresar={() => navigate('/brigadista/dashboard/resumen')}
        onCancelar={() => setShowCancelModal(true)}
      />

      {/* 2. Barra de Navegación Compacta */}
      <AtencionNavegacion
        currentStep={currentStep}
        totalSteps={8}
        isLoading={isLoading}
        canContinue={Boolean(formData.patient || currentStep > 1)}
        completedSteps={completedSteps}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onGoToStep={handleGoToStep}
        onSubmit={() => {
          setModalEstado('CONFIRMAR');
          setIsModalOpen(true);
        }}
      />

      {mutationError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-xs font-semibold text-red-700">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{mutationError}</span>
        </div>
      )}

      {/* 3. Grid Principal con items-stretch para alinear las alturas */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch">
        {/* Contenido Izquierda */}
        <div className="flex-1 w-full flex flex-col">
          {/* PASO 1: Identificación */}
          {currentStep === 1 && (
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/70 p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:border-slate-300 transition-all duration-200 h-full flex flex-col justify-between space-y-3.5">
              <div className="space-y-3">
                <div className="flex items-center gap-3.5 border-b border-slate-100 pb-3">
                  <div className="w-11 h-11 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-700 shadow-2xs shrink-0">
                    <UserSearch className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-700 block">
                      Paso 1 de 8 • Identificación Inicial
                    </span>
                    <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                      Identificación de la Persona
                    </h2>
                  </div>
                </div>

                {validationErrors.paciente && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-xs sm:text-sm text-red-700 font-semibold shadow-2xs">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{validationErrors.paciente}</span>
                  </div>
                )}
              </div>

              {formData.patient ? (
                <div className="flex-1 flex flex-col justify-between space-y-3">
                  <div className="p-4 bg-teal-50/90 border border-teal-200/90 rounded-2xl flex items-center justify-between shadow-2xs">
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-xl bg-[#2B7A78] text-white flex items-center justify-center shrink-0 shadow-xs">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-800 block">
                          Persona Verificada en Padrón Comunitario
                        </span>
                        <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                          {formData.patient.firstName} {formData.patient.lastName}
                        </h3>
                        <p className="text-xs text-slate-600 font-medium mt-0.5">
                          Expediente territorial activo para registro de atención comunitaria
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold bg-white text-teal-900 px-3.5 py-1.5 rounded-xl border border-teal-200 shadow-2xs">
                      {formData.patient.dui ? `DUI: ${formData.patient.dui}` : 'Sin DUI'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 transition-all duration-200 shadow-2xs space-y-1">
                      <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                        <span className="flex items-center gap-1.5 text-slate-700 font-bold">
                          <User className="w-4 h-4 text-teal-600" /> Demografía
                        </span>
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                      <p className="text-sm font-extrabold text-slate-900">
                        {formData.patient.sex === 'FEMALE' ? 'Femenino' : 'Masculino'}
                      </p>
                      <p className="text-xs text-slate-500 font-medium">
                        Nac: {formData.patient.dateOfBirth ? String(formData.patient.dateOfBirth).slice(0, 10) : 'No registrada'}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 transition-all duration-200 shadow-2xs space-y-1">
                      <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                        <span className="flex items-center gap-1.5 text-slate-700 font-bold">
                          <Phone className="w-4 h-4 text-teal-600" /> Contacto
                        </span>
                        <HeartPulse className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                      <p className="text-sm font-extrabold text-slate-900 truncate">
                        {formData.patient.phone || 'Sin teléfono'}
                      </p>
                      <p className="text-xs text-slate-500 font-medium truncate">
                        Población comunitaria
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 transition-all duration-200 shadow-2xs space-y-1">
                      <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                        <span className="flex items-center gap-1.5 text-slate-700 font-bold">
                          <FileText className="w-4 h-4 text-teal-600" /> Expediente
                        </span>
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <p className="text-sm font-extrabold text-emerald-700">
                        Habilitado
                      </p>
                      <p className="text-xs text-slate-500 font-mono truncate font-medium">
                        {expedienteNo}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 transition-all duration-200 shadow-2xs space-y-1">
                      <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                        <span className="flex items-center gap-1.5 text-slate-700 font-bold">
                          <Droplet className="w-4 h-4 text-rose-600" /> Grupo Sanguíneo
                        </span>
                      </div>
                      <p className="text-sm font-extrabold text-slate-900">
                        {formatBloodType(formData.patient.clinicalRecord?.bloodType)}
                      </p>
                      <p className="text-xs text-slate-500 font-medium">
                        Factor verificado en ficha
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 transition-all duration-200 shadow-2xs space-y-1">
                      <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                        <span className="flex items-center gap-1.5 text-slate-700 font-bold">
                          <ShieldAlert className="w-4 h-4 text-amber-600" /> Alertas Clínicas
                        </span>
                      </div>
                      <p className="text-sm font-extrabold text-slate-900 truncate">
                        {formData.patient.clinicalRecord?.familyHistory ? 'Registradas' : 'Sin Alertas'}
                      </p>
                      <p className="text-xs text-slate-500 font-medium truncate">
                        {formData.patient.clinicalRecord?.familyHistory || 'Ninguna alergia previa'}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 transition-all duration-200 shadow-2xs space-y-1">
                      <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                        <span className="flex items-center gap-1.5 text-slate-700 font-bold">
                          <MapPin className="w-4 h-4 text-indigo-600" /> Jurisdicción
                        </span>
                      </div>
                      <p className="text-sm font-extrabold text-slate-900">
                        Comunitaria
                      </p>
                      <p className="text-xs text-slate-500 font-medium truncate">
                        Sector nominal activo
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/70 flex items-start gap-3 shadow-2xs">
                    <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        Comunidad y Residencia Registrada
                      </span>
                      <p className="text-xs sm:text-sm text-slate-800 font-semibold leading-relaxed truncate mt-0.5">
                        {direccionLimpiaPaso1}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <span className="text-[11px] text-slate-400 order-2 sm:order-1">
                      Los datos clínicos y acciones se registrarán en el expediente nominal de esta persona.
                    </span>
                    <div className="flex items-center gap-2.5 w-full sm:w-auto order-1 sm:order-2 justify-end">
                      <button
                        type="button"
                        onClick={() => setShowSearchModal(true)}
                        className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl transition cursor-pointer shadow-2xs"
                      >
                        Seleccionar Otra
                      </button>
                      <button
                        type="button"
                        onClick={handleNext}
                        className="px-5 py-2 bg-[#2B7A78] hover:bg-[#236866] text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5 active:scale-95"
                      >
                        <span>Continuar al Motivo</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center py-16 space-y-4 bg-slate-50/80 border-2 border-dashed border-slate-200 rounded-2xl p-6">
                  <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto border border-teal-100 shadow-2xs">
                    <UserSearch className="w-7 h-7" />
                  </div>
                  <div className="space-y-1 max-w-md mx-auto text-center">
                    <h3 className="text-sm font-bold text-slate-800">Busca a la persona en el padrón comunitario</h3>
                    <p className="text-xs text-slate-500">
                      Selecciona a una persona registrada para cargar automáticamente su carnet digital y expediente nominal.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowSearchModal(true)}
                    className="px-6 py-2.5 bg-[#2B7A78] hover:bg-[#236866] text-white text-xs font-bold rounded-xl shadow-sm transition cursor-pointer active:scale-95"
                  >
                    Buscar en Padrón Comunitario
                  </button>
                </div>
              )}
            </div>
          )}

          {/* PASO 2: Motivo */}
          {currentStep === 2 && (
            <div className="h-full flex flex-col">
              <AtencionMotivoCard
                motivoCategoria={formData.motivoCategoria}
                motivoDescripcion={formData.motivoDescripcion}
                error={validationErrors.motivoCategoria}
                onChangeCategoria={(cat) => setFormData((prev) => ({ ...prev, motivoCategoria: cat }))}
                onChangeDescripcion={(desc) => setFormData((prev) => ({ ...prev, motivoDescripcion: desc }))}
              />
            </div>
          )}

          {/* PASO 3: Valoración */}
          {currentStep === 3 && (
            <div className="h-full flex flex-col">
              <AtencionValoracionTabs
                patient={formData.patient}
                signosVitales={formData.evaluacion.signosVitales}
                sintomas={formData.evaluacion.sintomas}
                nuevoAntecedente={nuevoAntecedente}
                esEmbarazada={esEmbarazada}
                semanasGestacion={semanasGestacion}
                onChangeSigno={(field, val) => {
                  setFormData((prev) => ({
                    ...prev,
                    evaluacion: { ...prev.evaluacion, signosVitales: { ...prev.evaluacion.signosVitales, [field]: val } },
                  }));
                }}
                onChangeSintoma={(field, val) => {
                  setFormData((prev) => ({
                    ...prev,
                    evaluacion: { ...prev.evaluacion, sintomas: { ...prev.evaluacion.sintomas, [field]: val } },
                  }));
                }}
                onChangeNuevoAntecedente={setNuevoAntecedente}
                onChangeEmbarazo={(emb, sem) => {
                  setEsEmbarazada(emb);
                  setSemanasGestacion(sem);
                }}
              />
            </div>
          )}

          {/* PASO 4: Observaciones */}
          {currentStep === 4 && (
            <div className="h-full flex flex-col">
              <AtencionObservacionesCard
                observacionesGenerales={formData.evaluacion.observacionesClinicas}
                condicionVivienda={formData.evaluacion.condicionVivienda}
                onChangeObservaciones={(field, val) => {
                  setFormData((prev) => ({ ...prev, evaluacion: { ...prev.evaluacion, [field]: val } }));
                }}
              />
            </div>
          )}

          {/* PASO 5: Acciones */}
          {currentStep === 5 && (
            <div className="h-full flex flex-col">
              <AtencionAccionesCard
                acciones={formData.acciones}
                onChangeAccion={(field, val) => {
                  setFormData((prev) => ({ ...prev, acciones: { ...prev.acciones, [field]: val } }));
                }}
              />
            </div>
          )}

          {/* PASO 6: Educación */}
          {currentStep === 6 && (
            <div className="h-full flex flex-col">
              <AtencionEducacionCard
                acciones={formData.acciones}
                onChangeEducacion={(field, val) => {
                  setFormData((prev) => ({ ...prev, acciones: { ...prev.acciones, [field]: val } }));
                }}
              />
            </div>
          )}

          {/* PASO 7: Seguimiento y Referencia */}
          {currentStep === 7 && (
            <div className="h-full flex flex-col">
              <AtencionSeguimientoReferenciaCard
                seguimiento={formData.seguimiento}
                onChangeSeguimiento={(field, val) => {
                  setFormData((prev) => ({ ...prev, seguimiento: { ...prev.seguimiento, [field]: val } }));
                }}
              />
            </div>
          )}

          {/* PASO 8: Resumen */}
          {currentStep === 8 && (
            <div className="h-full flex flex-col">
              <AtencionResumenCard
                formData={formData}
                onEditStep={handleGoToStep}
                onGuardar={() => {
                  setModalEstado('CONFIRMAR');
                  setIsModalOpen(true);
                }}
                isLoading={isLoading}
              />
            </div>
          )}
        </div>

        {/* Columna Derecha: Carnet Digital Persistente */}
        <div className="w-full lg:w-85 xl:w-95 shrink-0 flex flex-col">
          <AtencionPacienteCard
            patient={formData.patient}
            onChangePatient={() => setShowSearchModal(true)}
            pasoActualIndex={currentStep - 1}
          />
        </div>
      </div>

      {/* Modal Búsqueda de Personas */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Seleccionar Persona del Padrón</h3>
              <button
                type="button"
                onClick={() => setShowSearchModal(false)}
                className="p-1 hover:bg-slate-100 rounded-xl text-slate-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Buscar por Nombre o DUI..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && executeSearch(searchTerm)}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:ring-1 focus:ring-teal-500"
              />
              <button
                type="button"
                onClick={() => executeSearch(searchTerm)}
                disabled={loadingSearch}
                className="px-4 py-2 bg-[#2B7A78] hover:bg-[#236866] text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                {loadingSearch ? 'Buscando...' : 'Buscar'}
              </button>
            </div>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {results.map((p) => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => handleSelectPatient(p)}
                  className="w-full p-3 bg-slate-50 hover:bg-teal-50 border border-slate-200 rounded-xl text-left transition flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      {p.firstName} {p.lastName}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-mono">DUI: {p.dui || 'Sin DUI'}</p>
                  </div>
                  <span className="text-[10px] font-bold text-teal-700 bg-teal-100 px-2 py-1 rounded-md">
                    Seleccionar
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal Cancelar */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">¿Deseas cancelar esta atención?</h3>
            <p className="text-xs text-slate-500">
              Se descartará el borrador registrado sin modificar el expediente nominal.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Continuar Editando
              </button>
              <button
                type="button"
                onClick={handleConfirmarCancelacion}
                className="flex-1 py-2 bg-rose-600 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Sí, Descartar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Guardado */}
      <AtencionGuardarModal
        isOpen={isModalOpen}
        estado={modalEstado}
        pacienteNombre={pacienteNombre}
        mensajeError={mutationError}
        onClose={() => setIsModalOpen(false)}
        onConfirmarGuardar={handleConfirmarGuardar}
        onVerExpediente={() => {
          clearLocalDraft();
          navigate('/brigadista/pacientes/expediente');
        }}
        onNuevaAtencion={handleIniciarNuevaAtencion}
      />
    </div>
  );
};

export default NuevaAtencionPage;