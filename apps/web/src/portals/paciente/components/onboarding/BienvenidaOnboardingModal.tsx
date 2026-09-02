// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/components/onboarding/BienvenidaOnboardingModal.tsx
// DESCRIPCIÓN: Modal de Onboarding con dimensiones fijas estrictas y doble vista simétrica.
// =========================================================================

import React, { useState } from 'react';
import { Sparkles, AlertCircle, QrCode, Shield, Heart } from 'lucide-react';
import { OnboardingPaso1 } from './OnboardingPaso1';
import { OnboardingPaso2 } from './OnboardingPaso2';
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
  const [paso, setPaso] = useState<1 | 2>(1);
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
    address: patient.address && !patient.address.toLowerCase().includes('pendiente')
      ? patient.address
      : '',
    bloodType: 'UNKNOWN',
    allergies: '',
    emergencyName: patient.emergencyName || '',
    emergencyPhone: patient.emergencyPhone || '',
    emergencyRelation: patient.emergencyRelation || 'Madre / Padre',
  });

  const handleFieldChange = (field: keyof OnboardingFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    if (!formData.dateOfBirth) {
      setErrorMsg('Por favor ingresa tu fecha de nacimiento.');
      return;
    }
    setErrorMsg(null);
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
      const updated = await patientsService.updateProfile({
        dateOfBirth: formData.dateOfBirth,
        dui: formData.dui.trim() || null,
        sex: formData.sex,
        phone: formData.phone.trim() || null,
        address: formData.address.trim(),
        municipality: formData.municipality.trim(),
        department: formData.department.trim(),
        bloodType: formData.bloodType,
        allergies: formData.allergies.trim() || null,
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

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-300">
      {/* Contenedor con tamaño fijo estricto h-[660px] */}
      <div className="bg-white/95 backdrop-blur-3xl rounded-4xl border border-white/40 shadow-[0_32px_120px_rgba(0,0,0,0.15)] max-w-5xl w-full h-[660px] overflow-hidden my-auto animate-in zoom-in-95 duration-400 flex flex-col">
        
        {carnetGenerado ? (
          <OnboardingSuccess
            patient={carnetGenerado}
            onContinue={() => onCompleted(carnetGenerado)}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 w-full h-full">
            
            {/* COLUMNA IZQUIERDA: Panel Fijo */}
            <div className="lg:col-span-5 bg-slate-50/70 p-8 sm:p-10 flex flex-col justify-between border-r border-slate-100 h-full">
              <div className="space-y-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-[#0071E3] flex items-center justify-center shadow-xs">
                  <Sparkles className="w-6 h-6" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
                    Hola, {patient.firstName}.
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                    Configura tu expediente médico digital en MedicOS para acceder a tus consultas y carnet oficial.
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-200/60">
                  <div className="flex items-start gap-3">
                    <div className="p-1 rounded-full bg-blue-50 text-[#0071E3] shrink-0 mt-0.5">
                      <QrCode className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-800">Carnet con QR Dinámico</h4>
                      <p className="text-[11px] text-slate-500">Identificación rápida en brigadas.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-1 rounded-full bg-blue-50 text-[#0071E3] shrink-0 mt-0.5">
                      <Heart className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-800">Historial Protegido</h4>
                      <p className="text-[11px] text-slate-500">Alergias y datos de emergencia a la mano.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-1 rounded-full bg-blue-50 text-[#0071E3] shrink-0 mt-0.5">
                      <Shield className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-800">Privacidad Garantizada</h4>
                      <p className="text-[11px] text-slate-500">Cifrado de grado médico nacional.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 text-[11px] font-medium text-slate-400">
                Paso {paso} de 2 &bull; Configuración Inicial
              </div>
            </div>

            {/* COLUMNA DERECHA: Formulario con Altura Fija */}
            <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-between bg-white h-full overflow-hidden">
              <div className="space-y-4 flex flex-col h-full">
                
                {/* Cabecera fija */}
                <div className="flex items-center justify-between shrink-0">
                  <div>
                    <span className="text-[11px] font-semibold text-[#0071E3] uppercase tracking-wider block">
                      Configuración de Ficha
                    </span>
                    <h3 className="text-lg font-semibold text-slate-900 tracking-tight">
                      {paso === 1 ? 'Identificación Personal' : 'Ubicación y Urgencias'}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className={`w-6 h-1.5 rounded-full transition-all ${paso === 1 ? 'bg-[#0071E3]' : 'bg-slate-200'}`} />
                    <span className={`w-6 h-1.5 rounded-full transition-all ${paso === 2 ? 'bg-[#0071E3]' : 'bg-slate-200'}`} />
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-3 bg-rose-50/80 border border-rose-200/80 rounded-2xl text-xs text-rose-700 flex items-center gap-2 font-medium shrink-0">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Contenedor del formulario */}
                <div className="flex-1 overflow-y-auto pr-1">
                  <form id="onboarding-form" onSubmit={handleSubmit} className="h-full flex flex-col justify-between">
                    {paso === 1 ? (
                      <OnboardingPaso1
                        formData={formData}
                        onChange={handleFieldChange}
                        onNext={handleNextStep}
                      />
                    ) : (
                      <OnboardingPaso2
                        formData={formData}
                        loading={loading}
                        onChange={handleFieldChange}
                        onBack={() => setPaso(1)}
                      />
                    )}
                  </form>
                </div>
              </div>

              <div className="pt-3 text-center text-[11px] text-slate-400 font-medium shrink-0 border-t border-slate-100">
                MedicOS &bull; Sistema Seguro de Salud
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};