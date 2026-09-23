// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/perfil/datos-personales/components/CredencialDigitalModal.tsx
// DESCRIPCIÓN: Modal con la credencial digital oficial del paciente (iOS Wallet Pass).
// =========================================================================

import React from 'react';
import { X, QrCode, ShieldCheck, User, Building } from 'lucide-react';
import type { PatientPersonalDataProfile } from '../../../../../../modules/patients/types/patient-personal-data.types.js';

interface CredencialDigitalModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: PatientPersonalDataProfile;
  displayName: string;
}

export const CredencialDigitalModal: React.FC<CredencialDigitalModalProps> = ({
  isOpen,
  onClose,
  profile,
  displayName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150 select-none">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
        {/* Cabecera del Modal */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#1c5752]" />
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Credencial Digital MedicOS
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tarjeta Tipo Carnet Digital Oficial */}
        <div className="p-5">
          <div className="bg-linear-to-br from-[#1c5752] to-[#123835] rounded-3xl p-6 text-white shadow-lg space-y-4 border border-[#164743]">
            {/* Header del Carnet */}
            <div className="flex items-center justify-between border-b border-white/20 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center font-black text-xs">
                  M
                </div>
                <span className="font-black text-sm tracking-tight">MedicOS El Salvador</span>
              </div>
              <span className="text-[10px] font-mono uppercase bg-white/15 px-2 py-0.5 rounded-full border border-white/20">
                Oficial
              </span>
            </div>

            {/* Datos del Paciente */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/30 overflow-hidden flex items-center justify-center shrink-0">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-teal-200" />
                )}
              </div>
              <div className="min-w-0">
                <h4 className="text-base font-black truncate">{displayName}</h4>
                <p className="text-xs text-teal-100 font-mono">DUI: {profile.dui}</p>
                <p className="text-[11px] text-teal-200 font-semibold mt-0.5 flex items-center gap-1">
                  <Building className="w-3 h-3" /> {profile.municipality}
                </p>
              </div>
            </div>

            {/* Código QR y Datos Institucionales */}
            <div className="pt-3 border-t border-white/20 flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-teal-200 block uppercase font-mono">Código Digital</span>
                <span className="text-sm font-mono font-black">{profile.medicosId}</span>
              </div>

              <div className="w-14 h-14 bg-white rounded-xl p-1.5 flex items-center justify-center shadow-xs">
                <QrCode className="w-full h-full text-slate-900" />
              </div>
            </div>
          </div>
        </div>

        {/* Pie Informativo */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center text-[11px] text-slate-400">
          Válido para brigadas territoriales y establecimientos de la Red MedicOS.
        </div>
      </div>
    </div>
  );
};

export default CredencialDigitalModal;