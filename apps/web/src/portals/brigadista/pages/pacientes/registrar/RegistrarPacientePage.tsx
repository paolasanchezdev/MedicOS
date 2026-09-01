// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/pacientes/registrar/RegistrarPacientePage.tsx
// DESCRIPCIÓN: Página de registro con panel lateral enfocado en validación en vivo y estado del sistema.
// =========================================================================

import React, { useState, useEffect } from 'react';
import { useCreatePatient } from '../../../../../modules/patients';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Wifi, 
  WifiOff, 
  ShieldAlert,
  Check
} from 'lucide-react';
import {
  RegistrarPacienteHeader,
  PasoIndicador,
  PasoNavegacion,
  DatosIdentificacionCard,
  CuentaMedicOSCard,
  ContactoPacienteCard,
  InformacionMedicaCard,
  ContactoEmergenciaCard,
  ConfirmacionRegistroCard,
  PacienteRegistradoCard,
} from './components';

export const RegistrarPacientePage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [stepError, setStepError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const {
    formData,
    setField,
    errors,
    loading,
    generalError,
    createdPatient,
    checkingDui,
    duiAvailability,
    checkingEmail,
    emailAvailability,
    submitPatient,
    resetForm,
  } = useCreatePatient();

  const validateCurrentStep = (): boolean => {
    setStepError(null);

    if (currentStep === 1) {
      if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.dateOfBirth) {
        setStepError('Por favor completa los nombres, apellidos y fecha de nacimiento.');
        return false;
      }
      if (formData.dui.trim()) {
        const duiRegex = /^\d{8}-\d{1}$/;
        if (!duiRegex.test(formData.dui.trim())) {
          setStepError('El DUI debe tener el formato 00000000-0.');
          return false;
        }
        if (duiAvailability && !duiAvailability.available) {
          setStepError('El DUI ingresado ya pertenece a un paciente registrado.');
          return false;
        }
      }
    }

    if (currentStep === 2) {
      if (!formData.email.trim()) {
        setStepError('El correo electrónico es obligatorio para la cuenta del paciente.');
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        setStepError('El formato del correo electrónico no es válido.');
        return false;
      }
      if (emailAvailability === false) {
        setStepError('Este correo electrónico ya está en uso.');
        return false;
      }
      if (!formData.password || formData.password.length < 6) {
        setStepError('La contraseña debe tener al menos 6 caracteres.');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setStepError('Las contraseñas no coinciden.');
        return false;
      }
    }

    if (currentStep === 3) {
      if (!formData.address.trim()) {
        setStepError('La dirección de residencia es obligatoria.');
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const handlePrev = () => {
    setStepError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleReset = () => {
    setCurrentStep(1);
    setStepError(null);
    resetForm();
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200">
      {/* 1. Encabezado */}
      <RegistrarPacienteHeader />

      {/* 2. Si el paciente ya fue creado */}
      {createdPatient ? (
        <div className="w-full max-w-5xl mx-auto">
          <PacienteRegistradoCard
            patient={createdPatient}
            formData={formData}
            onReset={handleReset}
          />
        </div>
      ) : (
        /* 3. Layout de Dos Columnas: Formulario izq. + Panel de Validación der. */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* COLUMNA IZQUIERDA: Stepper y Formularios */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-5">
            <PasoIndicador
              currentStep={currentStep}
              onSelectStep={(step) => {
                setStepError(null);
                setCurrentStep(step);
              }}
            />

            {stepError && (
              <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{stepError}</span>
              </div>
            )}

            <div className="transition-all duration-200">
              {currentStep === 1 && (
                <DatosIdentificacionCard
                  formData={formData}
                  setField={setField}
                  errors={errors}
                  checkingDui={checkingDui}
                  duiAvailability={duiAvailability}
                />
              )}

              {currentStep === 2 && (
                <CuentaMedicOSCard
                  formData={formData}
                  setField={setField}
                  errors={errors}
                  checkingEmail={checkingEmail}
                  emailAvailability={emailAvailability}
                />
              )}

              {currentStep === 3 && (
                <ContactoPacienteCard
                  formData={formData}
                  setField={setField}
                  errors={errors}
                />
              )}

              {currentStep === 4 && (
                <InformacionMedicaCard
                  formData={formData}
                  setField={setField}
                />
              )}

              {currentStep === 5 && (
                <div className="space-y-5">
                  <ContactoEmergenciaCard
                    formData={formData}
                    setField={setField}
                  />
                  <ConfirmacionRegistroCard
                    formData={formData}
                    setField={setField}
                    errors={errors}
                    generalError={generalError}
                  />
                </div>
              )}
            </div>

            <PasoNavegacion
              currentStep={currentStep}
              totalSteps={5}
              loading={loading}
              canSubmit={formData.confirmed}
              onPrev={handlePrev}
              onNext={handleNext}
              onSubmit={() => void submitPatient()}
            />
          </div>

          {/* COLUMNA DERECHA: Panel de Validación Fijo en Vivo */}
          <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-6 space-y-4">
            
            {/* 1. Progreso de Pasos Compacto */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                <h3 className="text-xs font-black text-[#003356] uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#00838F]" />
                  <span>Progreso de Registro</span>
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-teal-50 text-[#00838F] rounded-md border border-teal-100">
                  Paso {currentStep} de 5
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {[
                  { num: 1, label: 'Identificación Personal' },
                  { num: 2, label: 'Credenciales y Cuenta' },
                  { num: 3, label: 'Contacto y Ubicación' },
                  { num: 4, label: 'Antecedentes Médicos' },
                  { num: 5, label: 'Emergencia y Cierre' },
                ].map((s) => {
                  const isDone = s.num < currentStep;
                  const isAct = s.num === currentStep;

                  return (
                    <div 
                      key={s.num}
                      className={`flex items-center justify-between p-2 rounded-xl transition-all ${
                        isAct 
                          ? 'bg-teal-50/80 border border-teal-200 text-[#003356] font-bold' 
                          : isDone 
                          ? 'text-slate-700 bg-slate-50/50' 
                          : 'text-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                          isDone ? 'bg-emerald-100 text-emerald-700' : isAct ? 'bg-[#00838F] text-white' : 'bg-slate-200 text-slate-500'
                        }`}>
                          {isDone ? <Check className="w-2.5 h-2.5 stroke-3" /> : s.num}
                        </div>
                        <span className="text-xs">{s.label}</span>
                      </div>
                      <span className="text-[10px] font-semibold">
                        {isDone ? '✓' : isAct ? '●' : '○'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Centro de Validación en Tiempo Real */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3">
              <h4 className="text-xs font-black text-[#003356] uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#00838F]" />
                <span>Validaciones Activas</span>
              </h4>

              <div className="space-y-2.5 text-xs">
                {/* Validación DUI */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="font-semibold text-slate-700">Disponibilidad de DUI:</span>
                  {checkingDui ? (
                    <span className="text-[10px] text-teal-600 font-bold animate-pulse">Verificando...</span>
                  ) : formData.dui.trim().length === 10 ? (
                    duiAvailability?.available ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Válido / Libre
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-rose-700 font-bold text-[11px]">
                        <XCircle className="w-3.5 h-3.5" /> Ya registrado
                      </span>
                    )
                  ) : (
                    <span className="text-[10px] text-slate-400 font-medium">Pendiente de ingresar</span>
                  )}
                </div>

                {/* Validación Correo */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="font-semibold text-slate-700">Correo Electrónico:</span>
                  {checkingEmail ? (
                    <span className="text-[10px] text-teal-600 font-bold animate-pulse">Verificando...</span>
                  ) : formData.email.trim() ? (
                    emailAvailability ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Disponible
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-rose-700 font-bold text-[11px]">
                        <XCircle className="w-3.5 h-3.5" /> En uso
                      </span>
                    )
                  ) : (
                    <span className="text-[10px] text-slate-400 font-medium">Pendiente de ingresar</span>
                  )}
                </div>

                {/* Requisito de Campos Obligatorios */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="font-semibold text-slate-700">Paso Actual ({currentStep}):</span>
                  {currentStep === 1 ? (
                    formData.firstName && formData.lastName && formData.dateOfBirth ? (
                      <span className="text-emerald-700 font-bold text-[11px]">✓ Completo</span>
                    ) : (
                      <span className="text-amber-700 font-bold text-[11px]">⚠ Datos incompletos</span>
                    )
                  ) : currentStep === 2 ? (
                    formData.email && formData.password ? (
                      <span className="text-emerald-700 font-bold text-[11px]">✓ Completo</span>
                    ) : (
                      <span className="text-amber-700 font-bold text-[11px]">⚠ Faltan credenciales</span>
                    )
                  ) : (
                    <span className="text-teal-700 font-bold text-[11px]">En proceso</span>
                  )}
                </div>
              </div>
            </div>

            {/* 3. Estado de Conectividad (Offline-First) */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3">
              <h4 className="text-xs font-black text-[#003356] uppercase tracking-wider pb-2 border-b border-slate-100">
                Sincronización Local
              </h4>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2">
                    {isOnline ? (
                      <Wifi className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <WifiOff className="w-4 h-4 text-amber-600" />
                    )}
                    <span className="font-bold text-slate-700">Estado de Red</span>
                  </div>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                    isOnline ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {isOnline ? '● Conectado' : '📴 Offline'}
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {isOnline 
                    ? 'Sincronización activa con la base de datos central de MedicOS.' 
                    : 'Modo offline activado: Los registros se almacenarán de forma segura en la estación local.'}
                </p>
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
};

export default RegistrarPacientePage;