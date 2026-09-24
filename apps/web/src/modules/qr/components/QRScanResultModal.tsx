// =========================================================================
// ARCHIVO: apps/web/src/modules/qr/components/QRScanResultModal.tsx
// DESCRIPCIÓN: Modal de visualización rápida del paciente verificado por QR
//              con navegación directa hacia expediente o consulta según rol.
// =========================================================================

import React from 'react';
import { 
  X, 
  CheckCircle2, 
  User, 
  FileText, 
  MapPin, 
  Droplet, 
  PhoneCall, 
  ShieldAlert, 
  Activity, 
  ArrowRight,
  Stethoscope
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { ResolvedPatientQRData } from '../types/qr.types.js';

interface QRScanResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: ResolvedPatientQRData | null;
  scannerRole?: string;
}

export const QRScanResultModal: React.FC<QRScanResultModalProps> = ({
  isOpen,
  onClose,
  patient,
  scannerRole = 'DOCTOR',
}) => {
  const navigate = useNavigate();

  if (!isOpen || !patient) return null;

  const isDoctor = scannerRole === 'DOCTOR' || scannerRole === 'ADMIN';

  const handleIrAExpediente = () => {
    onClose();
    if (isDoctor) {
      navigate(`/medico/pacientes/detalle?id=${patient.id}`);
    } else {
      navigate(`/brigadista/pacientes/expediente?id=${patient.id}`);
    }
  };

  const handleIniciarAtencion = () => {
    onClose();
    if (isDoctor) {
      navigate(`/medico/consultas/nueva?patientId=${patient.id}`);
    } else {
      navigate(`/brigadista/atencion/nueva?patientId=${patient.id}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150 select-none">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Cabecera de Verificación */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-emerald-50/70 shrink-0">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="text-xs font-black text-emerald-950 uppercase tracking-wider">
                Paciente Identificado con Éxito
              </h3>
              <p className="text-[10px] text-emerald-700 font-medium">
                Auditoría registrada en base de datos PostgreSQL
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cuerpo del Resumen */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Tarjeta de Identidad */}
          <div className="flex items-center gap-4 bg-[#F8FCFC] border border-[#D9EFF1] p-3.5 rounded-2xl">
            <div className="w-14 h-14 rounded-2xl bg-white border border-[#C5E6E9] shadow-2xs flex items-center justify-center text-[#166E7A] shrink-0 font-black text-xl">
              <User className="w-7 h-7" />
            </div>

            <div className="min-w-0 flex-1">
              <h4 className="text-base font-extrabold text-slate-900 truncate">
                {patient.fullName}
              </h4>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 font-mono mt-0.5">
                <span className="font-bold text-[#166E7A]">{patient.expediente}</span>
                <span>•</span>
                <span>DUI: {patient.dui || 'Sin DUI'}</span>
                <span>•</span>
                <span className="font-sans">{patient.sex === 'MALE' ? 'Masculino' : patient.sex === 'FEMALE' ? 'Femenino' : 'Otro'}</span>
              </div>
            </div>
          </div>

          {/* Datos Rápidos */}
          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Tipo Sanguíneo
              </span>
              <span className="font-extrabold text-rose-700 text-sm flex items-center gap-1">
                <Droplet className="w-4 h-4 fill-rose-600 text-rose-600" />
                {patient.bloodType}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Dirección / Ubicación
              </span>
              <p className="text-slate-700 font-medium truncate flex items-center gap-1" title={patient.address}>
                <MapPin className="w-3.5 h-3.5 text-[#166E7A] shrink-0" />
                {patient.address}
              </p>
            </div>
          </div>

          {/* Contacto de Emergencia */}
          {patient.emergencyContact && (
            <div className="p-3.5 bg-teal-50/50 border border-teal-200/70 rounded-2xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal-100/70 text-[#166E7A] flex items-center justify-center shrink-0">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Contacto de Urgencia</span>
                  <p className="font-bold text-slate-800">
                    {patient.emergencyContact.name} ({patient.emergencyContact.relationship})
                  </p>
                </div>
              </div>
              <a
                href={`tel:${patient.emergencyContact.phone}`}
                className="px-3 py-1 bg-white border border-teal-300 rounded-lg text-xs font-bold text-[#166E7A] hover:bg-teal-50 transition"
              >
                {patient.emergencyContact.phone}
              </a>
            </div>
          )}

          {/* Información Clínica Autorizada */}
          <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2 text-xs">
            <div className="flex items-center gap-1.5 text-slate-700 font-bold border-b border-slate-200/70 pb-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Alergias y Condiciones Crónicas</span>
            </div>

            <p className="text-slate-600 text-xs">
              <strong>Alergias:</strong> {patient.healthSummary.allergies || 'Ninguna reportada'}
            </p>
            <p className="text-slate-600 text-xs">
              <strong>Crónicas:</strong> {patient.healthSummary.chronicDiseases || 'Ninguna registrada'}
            </p>

            {isDoctor && patient.healthSummary.medication && (
              <p className="text-slate-600 text-xs border-t border-slate-200/60 pt-1.5">
                <strong>Medicación Habitual:</strong> {patient.healthSummary.medication}
              </p>
            )}
          </div>

          {/* Últimos Signos Vitales (Si existen) */}
          {patient.lastVitalSigns && (
            <div className="p-3 bg-white border border-slate-200 rounded-2xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#166E7A]" />
                <span className="font-bold text-slate-700">Últimos Signos Vitales</span>
              </div>
              <span className="font-mono text-slate-600">
                PA: {patient.lastVitalSigns.systolic}/{patient.lastVitalSigns.diastolic} mmHg • SpO2: {patient.lastVitalSigns.oxygenSat}%
              </span>
            </div>
          )}
        </div>

        {/* Acciones del Médico / Brigadista */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleIrAExpediente}
            className="px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4 text-slate-500" />
            <span>Ver Expediente</span>
          </button>

          <button
            type="button"
            onClick={handleIniciarAtencion}
            className="px-5 py-2.5 bg-[#166E7A] hover:bg-[#105F68] text-white text-xs font-bold rounded-xl shadow-xs transition active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            <Stethoscope className="w-4 h-4" />
            <span>{isDoctor ? 'Iniciar Consulta' : 'Nueva Atención'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};