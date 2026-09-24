// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/perfil/datos-personales/components/IdentificacionMedicOSCard.tsx
// DESCRIPCIÓN: Tarjeta de entrada oficial en Datos Personales que muestra la
//              identidad básica y dispara el Carnet MedicOS Oficial con QR.
// =========================================================================

import React from 'react';
import { IdCard, QrCode, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import type { PatientPersonalDataProfile } from '../../../../../../modules/patients/types/patient-personal-data.types.js';

interface IdentificacionMedicOSCardProps {
  profile: PatientPersonalDataProfile;
  onOpenIdentificacionModal?: () => void;
}

export const IdentificacionMedicOSCard: React.FC<IdentificacionMedicOSCardProps> = ({
  profile,
  onOpenIdentificacionModal,
}) => {
  const cleanDui = profile.dui && profile.dui !== 'Sin registrar' ? profile.dui : 'DUI pendiente';

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 sm:p-6 select-none transition-all hover:border-slate-300">
      {/* Cabecera de la Sección */}
      <div className="w-full flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#166E7A] border border-teal-200/70 flex items-center justify-center">
            <IdCard className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 tracking-tight">
              Identificación MedicOS
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">
              Carnet nominal oficial para atención médica y brigadas.
            </p>
          </div>
        </div>

        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          <span>Activo</span>
        </span>
      </div>

      {/* Contenido Modular: Resumen + Botón de Apertura */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#F8FCFC] border border-[#D9EFF1] rounded-2xl p-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-white border border-[#C5E6E9] shadow-2xs flex items-center justify-center shrink-0 text-[#166E7A]">
            <QrCode className="w-6 h-6" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-extrabold text-slate-900 truncate">
                {profile.fullName || `${profile.firstName} ${profile.lastName}`}
              </h4>
              <ShieldCheck className="w-3.5 h-3.5 text-[#166E7A] shrink-0" />
            </div>

            <p className="text-xs text-slate-500 font-mono mt-0.5">
              ID MedicOS: <span className="font-bold text-[#166E7A]">{profile.medicosId}</span>
            </p>
            <p className="text-[11px] text-slate-400 font-mono">
              {cleanDui} • {profile.municipality || 'El Salvador'}
            </p>
          </div>
        </div>

        {/* Botón Principal: Ver Carnet */}
        <button
          type="button"
          onClick={onOpenIdentificacionModal}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#166E7A] hover:bg-[#105F68] text-white text-xs font-bold rounded-xl shadow-xs transition active:scale-95 cursor-pointer shrink-0"
        >
          <span>Ver carnet</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default IdentificacionMedicOSCard;