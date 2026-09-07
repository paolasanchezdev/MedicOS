// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/components/onboarding/BienvenidaOnboardingModal.tsx
// DESCRIPCIÓN: Modal Liquid Glass con diseño responsivo, adaptación móvil
//              sin cortes de contenido y carnet final optimizado.
// =========================================================================

import React, { useState } from 'react';
import { 
  Sparkles, 
  AlertCircle, 
  QrCode, 
  FileText, 
  ShieldCheck, 
  HeartPulse 
} from 'lucide-react';
import { OnboardingPaso1 } from './OnboardingPaso1';
import { OnboardingPaso2 } from './OnboardingPaso2';
import { OnboardingPaso3 } from './OnboardingPaso3';
import { OnboardingSuccess } from './OnboardingSuccess';
import {
  patientsService,
  type PatientRecord,
  type OnboardingFormData,
} from '../../../../modules/patients';

interface BienvenidaOnboardingModalProps {
  patient: PatientRecord;
  onCompleted: (updated: PatientRecord) => void;
}

export const BienvenidaOnboardingModal: React.FC<BienvenidaOnboardingModalProps> = ({
  patient,
  onCompleted,
}) => {
  const [paso, setPaso] = useState<1 | 2 | 3>(1);
  const [direccion, setDireccion] = useState<'next' | 'prev'>('next');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [carnetGenerado, setCarnetGenerado] = useState<PatientRecord | null>(null);

  const [formData, setFormData] = useState<OnboardingFormData>({
    dateOfBirth: '',
    dui: patient.dui || '',
    sex: patient.sex && patient.sex !== 'OTHER' ? patient.sex : 'FEMALE',
    phone: patient.phone || '',
    department: 'La Paz',
    municipality: 'La Paz Centro',
    district: 'San Miguel Tepezontes',
    address: patient.address && !patient.address.toLowerCase().includes('pendiente')
      ? patient.address
      : '',
    bloodType: 'UNKNOWN',
    allergies: '',
    chronicDiseases: '',
    medication: '',
    observations: '',
    emergencyName: patient.emergencyName || '',
    emergencyPhone: patient.emergencyPhone || '',
    emergencyRelation: patient.emergencyRelation || 'Madre / Padre',
  });

  const handleFieldChange = (field: keyof OnboardingFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleStep1Next = () => {
    if (!formData.dateOfBirth) {
      setErrorMsg('Por favor ingresa tu fecha de nacimiento.');
      return;
    }
    setErrorMsg(null);
    setDireccion('next');
    setPaso(2);
  };

  const handleStep2Next = () => {
    if (!formData.address.trim()) {
      setErrorMsg('Por favor indica tu dirección exacta de residencia o comunidad.');
      return;
    }
    setErrorMsg(null);
    setDireccion('next');
    setPaso(3);
  };

  const handleBackTo1 = () => {
    setErrorMsg(null);
    setDireccion('prev');
    setPaso(1);
  };

  const handleBackTo2 = () => {
    setErrorMsg(null);
    setDireccion('prev');
    setPaso(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.dateOfBirth) {
      setErrorMsg('Por favor ingresa tu fecha de nacimiento.');
      return;
    }
    if (formData.dui && formData.dui.trim() !== '' && !/^\d{8}-\d{1}$/.test(formData.dui)) {
      setErrorMsg('El formato del DUI debe ser 00000000-0.');
      return;
    }
    if (!formData.address.trim()) {
      setErrorMsg('Por favor indica tu dirección de residencia o comunidad.');
      return;
    }

    setLoading(true);
    try {
      const direccionCompleta = formData.district
        ? `${formData.address.trim()}, Distrito ${formData.district.replace(/^Distrito\s+/i, '')}`
        : formData.address.trim();

      const updated = await patientsService.updateProfile({
        dateOfBirth: formData.dateOfBirth,
        dui: formData.dui.trim() || null,
        sex: formData.sex,
        phone: formData.phone.trim() || null,
        address: direccionCompleta,
        municipality: formData.municipality.trim(),
        department: formData.department.trim(),
        bloodType: formData.bloodType,
        allergies: formData.allergies.trim() || null,
        chronicDiseases: formData.chronicDiseases.trim() || null,
        medication: formData.medication.trim() || null,
        observations: formData.observations.trim() || null,
        emergencyName: formData.emergencyName.trim() || null,
        emergencyPhone: formData.emergencyPhone.trim() || null,
        emergencyRelation: formData.emergencyRelation.trim() || null,
      });

      setCarnetGenerado(updated);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al guardar la información.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const titulosPasos = {
    1: 'Identificación y Nacimiento',
    2: 'Territorio y Urgencias',
    3: 'Salud y Antecedentes Médicos',
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto animate-in fade-in duration-300">
      
      {/* Contenedor Liquid Glass responsivo */}
      <div
        className={`relative bg-white/90 backdrop-blur-3xl border border-white/70 shadow-[0_32px_90px_rgba(0,0,0,0.14),inset_0_1px_2px_rgba(255,255,255,0.9)] w-full my-auto animate-in zoom-in-98 duration-300 flex flex-col rounded-3xl transition-all overflow-hidden ${
          carnetGenerado ? 'max-w-2xl h-auto' : 'max-w-5xl h-auto max-h-[92dvh] lg:h-160'
        }`}
      >
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-linear-to-br from-medicos-cyan/20 to-medicos-teal/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-linear-to-tr from-medicos-teal/15 to-sky-300/20 rounded-full blur-3xl pointer-events-none" />

        {carnetGenerado ? (
          <OnboardingSuccess
            patient={carnetGenerado}
            onContinue={() => onCompleted(carnetGenerado)}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 w-full h-full relative z-10">
            
            {/* COLUMNA IZQUIERDA: Beneficios (visible en escritorio) */}
            <div className="hidden lg:flex lg:col-span-5 bg-linear-to-b from-white/50 via-medicos-canvas/35 to-white/60 backdrop-blur-xl p-7 sm:p-8 flex-col justify-between border-r border-white/60 h-full">
              <div className="space-y-5">
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/90 text-medicos-teal border border-white flex items-center justify-center shadow-[0_4px_16px_rgba(30,127,140,0.12)]">
                    <HeartPulse className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-medicos-teal uppercase tracking-wider block">
                      Portal del Paciente
                    </span>
                    <h2 className="text-sm font-black text-medicos-dark-blue">
                      MedicOS El Salvador
                    </h2>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-xl font-bold text-medicos-dark-blue tracking-tight">
                    ¡Hola, {patient.firstName}!
                  </h3>
                  <p className="text-xs sm:text-[13px] text-medicos-muted leading-relaxed">
                    Completa tu ficha para habilitar tu credencial clínica oficial y acceder a todos los servicios de la red territorial.
                  </p>
                </div>

                <div className="space-y-2.5 pt-1">
                  <div className="p-3 bg-white/60 hover:bg-white/80 backdrop-blur-md rounded-2xl border border-white/80 flex items-start gap-3 shadow-[0_8px_24px_rgba(30,127,140,0.05),inset_0_1px_1px_rgba(255,255,255,0.8)] transition-all">
                    <div className="p-2 rounded-xl bg-medicos-light-bg/80 text-medicos-teal shrink-0">
                      <QrCode className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-medicos-dark-blue">Carnet Digital con QR</h4>
                      <p className="text-xs text-medicos-muted leading-snug">Identificación y lectura rápida en brigadas comunitarias y clínicas.</p>
                    </div>
                  </div>

                  <div className="p-3 bg-white/60 hover:bg-white/80 backdrop-blur-md rounded-2xl border border-white/80 flex items-start gap-3 shadow-[0_8px_24px_rgba(30,127,140,0.05),inset_0_1px_1px_rgba(255,255,255,0.8)] transition-all">
                    <div className="p-2 rounded-xl bg-medicos-light-bg/80 text-medicos-teal shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-medicos-dark-blue">Expediente Clínico Único</h4>
                      <p className="text-xs text-medicos-muted leading-snug">Tus diagnósticos, consultas y recetas disponibles en un solo lugar.</p>
                    </div>
                  </div>

                  <div className="p-3 bg-white/60 hover:bg-white/80 backdrop-blur-md rounded-2xl border border-white/80 flex items-start gap-3 shadow-[0_8px_24px_rgba(30,127,140,0.05),inset_0_1px_1px_rgba(255,255,255,0.8)] transition-all">
                    <div className="p-2 rounded-xl bg-medicos-light-bg/80 text-medicos-teal shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-medicos-dark-blue">Protección en Emergencias</h4>
                      <p className="text-xs text-medicos-muted leading-snug">Alergias, grupo sanguíneo y contacto de urgencia siempre respaldados.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 text-xs font-medium text-medicos-muted border-t border-white/70 flex items-center justify-between">
                <span>Paso {paso} de 3 &bull; Activación</span>
                <span className="font-semibold text-medicos-teal">MedicOS 2026</span>
              </div>
            </div>

            {/* COLUMNA DERECHA: Formularios con Animación y Scroll Interno */}
            <div className="col-span-1 lg:col-span-7 p-5 sm:p-7 lg:p-8 flex flex-col justify-between bg-white/60 backdrop-blur-2xl h-full overflow-y-auto">
              <div className="space-y-3.5 flex flex-col h-full justify-between">
                
                {/* Cabecera Móvil Compacta (visible sólo en pantallas pequeñas) */}
                <div className="lg:hidden flex items-center justify-between pb-2.5 border-b border-white/70 shrink-0">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-white/90 text-medicos-teal border border-white flex items-center justify-center shadow-xs shrink-0">
                      <HeartPulse className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-medicos-teal uppercase tracking-wider block leading-tight">
                        Portal del Paciente
                      </span>
                      <h2 className="text-xs font-black text-medicos-dark-blue leading-tight">
                        MedicOS &bull; ¡Hola, {patient.firstName}!
                      </h2>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-medicos-teal bg-medicos-teal/10 px-2.5 py-0.5 rounded-full border border-medicos-teal/20">
                    Paso {paso} de 3
                  </span>
                </div>

                {/* Cabecera del Paso */}
                <div className="flex items-center justify-between pb-3 border-b border-white/70 shrink-0">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-medicos-teal">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Fase {paso} de 3</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-medicos-dark-blue tracking-tight">
                      {titulosPasos[paso]}
                    </h3>
                  </div>

                  {/* Barra de progreso */}
                  <div className="flex items-center gap-1.5 p-1 bg-white/60 backdrop-blur-sm rounded-full border border-white/80">
                    <span className={`w-7 h-1.5 rounded-full transition-all duration-300 ${paso >= 1 ? 'bg-medicos-teal shadow-[0_2px_8px_rgba(30,127,140,0.35)]' : 'bg-slate-200/70'}`} />
                    <span className={`w-7 h-1.5 rounded-full transition-all duration-300 ${paso >= 2 ? 'bg-medicos-teal shadow-[0_2px_8px_rgba(30,127,140,0.35)]' : 'bg-slate-200/70'}`} />
                    <span className={`w-7 h-1.5 rounded-full transition-all duration-300 ${paso >= 3 ? 'bg-medicos-teal shadow-[0_2px_8px_rgba(30,127,140,0.35)]' : 'bg-slate-200/70'}`} />
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-3 bg-rose-50/90 backdrop-blur-md border border-rose-200/80 rounded-xl text-xs text-rose-700 flex items-center gap-2 font-medium shrink-0 shadow-2xs">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Contenedor Animado con protección contra clipping vertical */}
                <div className="flex-1 flex flex-col justify-center overflow-x-hidden overflow-y-visible py-1">
                  <div
                    key={paso}
                    className={`h-full flex flex-col justify-between animate-in fade-in duration-300 ease-out ${
                      direccion === 'next' ? 'slide-in-from-right-6' : 'slide-in-from-left-6'
                    }`}
                  >
                    <form onSubmit={handleSubmit} className="h-full flex flex-col justify-between">
                      {paso === 1 && (
                        <OnboardingPaso1
                          formData={formData}
                          onChange={handleFieldChange}
                          onNext={handleStep1Next}
                        />
                      )}

                      {paso === 2 && (
                        <OnboardingPaso2
                          formData={formData}
                          onChange={handleFieldChange}
                          onBack={handleBackTo1}
                          onNext={handleStep2Next}
                        />
                      )}

                      {paso === 3 && (
                        <OnboardingPaso3
                          formData={formData}
                          loading={loading}
                          onChange={handleFieldChange}
                          onBack={handleBackTo2}
                        />
                      )}
                    </form>
                  </div>
                </div>
              </div>

              {/* Pie Derecho */}
              <div className="pt-3 text-center text-xs text-medicos-muted font-medium border-t border-white/70 shrink-0 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-medicos-teal" />
                <span>Registro Nominal Oficial &bull; República de El Salvador</span>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};