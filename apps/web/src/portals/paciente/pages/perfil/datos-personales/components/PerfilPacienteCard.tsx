// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/perfil/datos-personales/components/PerfilPacienteCard.tsx
// DESCRIPCIÓN: Card principal de perfil con marco suave, badges estilizados,
//              foto con anillo y botones de acción tipo pastilla.
// =========================================================================

import React from 'react';
import { Camera, User, CheckCircle2, Pencil, QrCode, Shield, Sparkles } from 'lucide-react';
import type { PatientPersonalDataProfile } from '../../../../../../modules/patients/types/patient-personal-data.types.js';

interface PerfilPacienteCardProps {
  profile: PatientPersonalDataProfile;
  displayName: string;
  onOpenPhotoModal: () => void;
  onTriggerEditPersonal: () => void;
  onOpenIdentificacionModal: () => void;
}

export const PerfilPacienteCard: React.FC<PerfilPacienteCardProps> = ({
  profile,
  displayName,
  onOpenPhotoModal,
  onTriggerEditPersonal,
  onOpenIdentificacionModal,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_2px_14px_rgba(0,0,0,0.03)] p-5 sm:p-6 select-none relative overflow-hidden">
      {/* Detalle ambiental tenue en esquina */}
      <div className="absolute top-0 right-0 w-64 h-32 bg-linear-to-bl from-teal-50/60 to-transparent pointer-events-none rounded-bl-full" />

      <div className="relative flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5">
        {/* Lado Izquierdo: Foto con Anillo de Estado + Identidad */}
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          {/* Avatar con doble marco y botón cámara */}
          <div className="relative group shrink-0">
            <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full p-1 bg-linear-to-tr from-[#1c5752] via-teal-400 to-emerald-300 shadow-sm flex items-center justify-center">
              <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center border-2 border-white">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-10 h-10 text-slate-300" />
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenPhotoModal}
              title="Cambiar foto de perfil"
              className="absolute bottom-0 right-0 p-2 rounded-full bg-[#1c5752] hover:bg-[#164743] text-white shadow-md border-2 border-white transition-all active:scale-95 cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Nombre, Rol e Identificadores */}
          <div className="space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {displayName}
              </h2>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/80 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Perfil actualizado
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-0.5 text-xs">
              <span className="inline-flex items-center gap-1 font-semibold text-slate-500">
                <Shield className="w-3.5 h-3.5 text-[#1c5752]" />
                Paciente Territorial
              </span>
              <span className="text-slate-300">·</span>
              <span className="font-mono text-[11.5px] font-bold text-[#1c5752] bg-teal-50/80 px-2.5 py-0.5 rounded-lg border border-teal-200/70">
                ID: {profile.medicosId}
              </span>
            </div>

            <p className="text-[11px] text-slate-400 font-medium pt-0.5 flex items-center justify-center sm:justify-start gap-1">
              <Sparkles className="w-3 h-3 text-teal-600" />
              Sincronizado con la Red Oficial MedicOS 2026
            </p>
          </div>
        </div>

        {/* Lado Derecho: Acciones Estilizadas */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto shrink-0">
          <button
            type="button"
            onClick={onOpenPhotoModal}
            className="flex-1 sm:flex-none px-4 py-2 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200/90 shadow-2xs transition active:scale-95 cursor-pointer"
          >
            Cambiar foto
          </button>

          <button
            type="button"
            onClick={onTriggerEditPersonal}
            className="flex-1 sm:flex-none px-4 py-2 rounded-2xl bg-[#1c5752] hover:bg-[#164743] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs active:scale-95 cursor-pointer"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>Editar perfil</span>
          </button>

          <button
            type="button"
            onClick={onOpenIdentificacionModal}
            title="Ver credencial digital"
            className="p-2 rounded-2xl bg-teal-50 hover:bg-teal-100/70 text-[#1c5752] border border-teal-200 transition active:scale-95 cursor-pointer hidden sm:flex items-center justify-center"
          >
            <QrCode className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PerfilPacienteCard;