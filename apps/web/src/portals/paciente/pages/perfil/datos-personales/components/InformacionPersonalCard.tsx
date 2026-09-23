// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/perfil/datos-personales/components/InformacionPersonalCard.tsx
// DESCRIPCIÓN: Card de información personal con visualización y edición directa
//              de DUI salvadoreño (########-#) y Grupo Sanguíneo oficial,
//              sin cascading renders ni useEffect (100% React Compiler / React 19).
// =========================================================================

import React, { useState } from 'react';
import { Pencil, X, Check, User, Calendar, Heart, Flag, IdCard, Users2, Droplet, ShieldCheck } from 'lucide-react';
import type {
  PatientPersonalDataProfile,
  UpdatePersonalIdentityDto,
  CivilStatus,
} from '../../../../../../modules/patients/types/patient-personal-data.types.js';
import type { Sex } from '../../../../../../modules/patients/types/patient.types.js';

interface InformacionPersonalCardProps {
  profile: PatientPersonalDataProfile;
  isEditing: boolean;
  saving: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSave: (dto: UpdatePersonalIdentityDto) => Promise<boolean>;
}

interface InformacionPersonalFormProps {
  profile: PatientPersonalDataProfile;
  saving: boolean;
  onCancel: () => void;
  onSave: (dto: UpdatePersonalIdentityDto) => Promise<boolean>;
}

const formatSexLabel = (sex: Sex) => {
  switch (sex) {
    case 'MALE':
      return 'Masculino';
    case 'FEMALE':
      return 'Femenino';
    default:
      return 'Otro';
  }
};

const formatCivilStatusLabel = (cs: CivilStatus) => {
  switch (cs) {
    case 'CASADO':
      return 'Casado(a)';
    case 'DIVORCIADO':
      return 'Divorciado(a)';
    case 'VIUDO':
      return 'Viudo(a)';
    case 'UNION_LIBRE':
      return 'Unión libre';
    default:
      return 'Soltero(a)';
  }
};

const formatBloodTypeDisplay = (bt?: string | null) => {
  if (!bt || bt === 'UNKNOWN' || bt === 'Sin determinar' || bt === 'No determinado') {
    return 'Sin determinar';
  }
  const map: Record<string, string> = {
    O_POSITIVE: 'O Positivo (O+)',
    'O+': 'O Positivo (O+)',
    O_NEGATIVE: 'O Negativo (O-)',
    'O-': 'O Negativo (O-)',
    A_POSITIVE: 'A Positivo (A+)',
    'A+': 'A Positivo (A+)',
    A_NEGATIVE: 'A Negativo (A-)',
    'A-': 'A Negativo (A-)',
    B_POSITIVE: 'B Positivo (B+)',
    'B+': 'B Positivo (B+)',
    B_NEGATIVE: 'B Negativo (B-)',
    'B-': 'B Negativo (B-)',
    AB_POSITIVE: 'AB Positivo (AB+)',
    'AB+': 'AB Positivo (AB+)',
    AB_NEGATIVE: 'AB Negativo (AB-)',
    'AB-': 'AB Negativo (AB-)',
  };
  return map[bt] || bt;
};

/**
 * Subcomponente de Formulario: Se monta con estado inicial fresco al entrar en edición,
 * eliminando la necesidad de useEffect para sincronizar props con state.
 */
const InformacionPersonalForm: React.FC<InformacionPersonalFormProps> = ({
  profile,
  saving,
  onCancel,
  onSave,
}) => {
  const [formData, setFormData] = useState<UpdatePersonalIdentityDto>(() => ({
    firstName: profile.firstName,
    lastName: profile.lastName,
    preferredName: profile.preferredName || '',
    dateOfBirth: profile.dateOfBirth,
    sex: profile.sex,
    civilStatus: profile.civilStatus,
    nationality: profile.nationality,
    dui: profile.dui === 'Sin registrar' ? '' : profile.dui,
    bloodType: profile.health?.bloodType || 'UNKNOWN',
  }));

  const handleDuiInput = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 9);
    if (raw.length > 8) {
      setFormData((prev) => ({ ...prev, dui: `${raw.slice(0, 8)}-${raw.slice(8)}` }));
    } else {
      setFormData((prev) => ({ ...prev, dui: raw }));
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-3 animate-in fade-in duration-150 text-xs">
      {/* DUI y Grupo Sanguíneo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3 rounded-2xl bg-teal-50/40 border border-teal-100">
        <div>
          <label className="text-[11px] font-bold text-[#1c5752] block mb-1">
            DUI (Documento Único de Identidad)
          </label>
          <input
            type="text"
            placeholder="00000000-0"
            maxLength={10}
            value={formData.dui || ''}
            onChange={(e) => handleDuiInput(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-teal-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1c5752]/20 focus:border-[#1c5752] font-mono font-bold text-slate-900"
          />
        </div>

        <div>
          <label className="text-[11px] font-bold text-[#1c5752] block mb-1">
            Grupo Sanguíneo y Factor Rh
          </label>
          <select
            value={formData.bloodType || 'UNKNOWN'}
            onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
            className="w-full px-3 py-2 bg-white border border-teal-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1c5752]/20 focus:border-[#1c5752] font-bold text-slate-900 cursor-pointer"
          >
            <option value="UNKNOWN">Pendiente de determinación</option>
            <option value="O_POSITIVE">O Positivo (O+)</option>
            <option value="O_NEGATIVE">O Negativo (O-)</option>
            <option value="A_POSITIVE">A Positivo (A+)</option>
            <option value="A_NEGATIVE">A Negativo (A-)</option>
            <option value="B_POSITIVE">B Positivo (B+)</option>
            <option value="B_NEGATIVE">B Negativo (B-)</option>
            <option value="AB_POSITIVE">AB Positivo (AB+)</option>
            <option value="AB_NEGATIVE">AB Negativo (AB-)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div>
          <label className="text-[11px] font-bold text-slate-700 block mb-1">Nombres</label>
          <input
            type="text"
            required
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1c5752]/20 focus:border-[#1c5752] focus:bg-white"
          />
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-700 block mb-1">Apellidos</label>
          <input
            type="text"
            required
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1c5752]/20 focus:border-[#1c5752] focus:bg-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div>
          <label className="text-[11px] font-bold text-slate-700 block mb-1">Fecha de nacimiento</label>
          <input
            type="date"
            required
            value={formData.dateOfBirth}
            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1c5752]/20 focus:border-[#1c5752] focus:bg-white font-mono"
          />
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-700 block mb-1">Sexo</label>
          <select
            value={formData.sex}
            onChange={(e) => setFormData({ ...formData, sex: e.target.value as Sex })}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1c5752]/20 focus:border-[#1c5752] focus:bg-white cursor-pointer"
          >
            <option value="FEMALE">Femenino</option>
            <option value="MALE">Masculino</option>
            <option value="OTHER">Otro</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div>
          <label className="text-[11px] font-bold text-slate-700 block mb-1">Estado civil</label>
          <select
            value={formData.civilStatus}
            onChange={(e) => setFormData({ ...formData, civilStatus: e.target.value as CivilStatus })}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1c5752]/20 focus:border-[#1c5752] focus:bg-white cursor-pointer"
          >
            <option value="SOLTERO">Soltero(a)</option>
            <option value="CASADO">Casado(a)</option>
            <option value="UNION_LIBRE">Unión libre</option>
            <option value="DIVORCIADO">Divorciado(a)</option>
            <option value="VIUDO">Viudo(a)</option>
          </select>
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-700 block mb-1">Nacionalidad</label>
          <input
            type="text"
            value={formData.nationality}
            onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1c5752]/20 focus:border-[#1c5752] focus:bg-white"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
        <button
          type="button"
          disabled={saving}
          onClick={onCancel}
          className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
          <span>Cancelar</span>
        </button>

        <button
          type="submit"
          disabled={saving}
          className="px-4 py-1.5 rounded-xl bg-[#1c5752] hover:bg-[#164743] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
        >
          <Check className="w-3.5 h-3.5" />
          <span>{saving ? 'Guardando en BD...' : 'Guardar Cambios'}</span>
        </button>
      </div>
    </form>
  );
};

export const InformacionPersonalCard: React.FC<InformacionPersonalCardProps> = ({
  profile,
  isEditing,
  saving,
  onStartEdit,
  onCancelEdit,
  onSave,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_2px_14px_rgba(0,0,0,0.03)] p-5 sm:p-6 select-none flex flex-col justify-between h-full">
      <div>
        {/* Cabecera con Pastilla de Icono */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#1c5752] border border-teal-200/70 flex items-center justify-center">
              <IdCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 tracking-tight">
                Información personal
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">
                Identidad legal, documento civil y grupo sanguíneo.
              </p>
            </div>
          </div>

          {!isEditing ? (
            <button
              type="button"
              onClick={onStartEdit}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-teal-50 text-slate-600 hover:text-[#1c5752] border border-slate-200/80 text-xs font-bold transition cursor-pointer active:scale-95"
            >
              <Pencil className="w-3 h-3" />
              <span>Editar</span>
            </button>
          ) : (
            <span className="text-[11px] font-bold text-[#1c5752] bg-teal-50 px-2.5 py-0.5 rounded-lg border border-teal-200/80">
              Modo edición
            </span>
          )}
        </div>

        {/* RENDER CONDICIONAL: MODO EDICIÓN VS MODO LECTURA */}
        {isEditing ? (
          <InformacionPersonalForm
            profile={profile}
            saving={saving}
            onCancel={onCancelEdit}
            onSave={onSave}
          />
        ) : (
          /* MODO LECTURA */
          <div className="space-y-2 text-xs">
            {/* DUI */}
            <div className="p-2.5 rounded-2xl bg-teal-50/60 border border-teal-200/80 flex items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-2 text-[#1c5752]">
                <div className="w-6 h-6 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <span className="font-bold">DUI Registrado</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-slate-900 text-sm">
                  {profile.dui}
                </span>
                {profile.dui && profile.dui !== 'Sin registrar' ? (
                  <span className="text-[9.5px] font-bold text-teal-800 bg-teal-100/80 px-2 py-0.5 rounded-md border border-teal-200">
                    Oficial
                  </span>
                ) : (
                  <span className="text-[9.5px] font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-md border border-amber-200">
                    Pendiente
                  </span>
                )}
              </div>
            </div>

            {/* Grupo Sanguíneo */}
            <div className="p-2.5 rounded-2xl bg-rose-50/60 border border-rose-200/80 flex items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-2 text-rose-700">
                <div className="w-6 h-6 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0">
                  <Droplet className="w-3.5 h-3.5" />
                </div>
                <span className="font-bold">Grupo Sanguíneo</span>
              </div>
              <span className="font-bold text-rose-950 font-mono text-xs bg-white px-2.5 py-0.5 rounded-lg border border-rose-200">
                {formatBloodTypeDisplay(profile.health?.bloodType)}
              </span>
            </div>

            {/* Nombres */}
            <div className="p-2.5 rounded-2xl bg-slate-50/75 border border-slate-150 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-slate-500">
                <div className="w-6 h-6 rounded-lg bg-teal-100/70 text-[#1c5752] flex items-center justify-center shrink-0">
                  <User className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold">Nombres</span>
              </div>
              <span className="font-bold text-slate-900 text-right">{profile.firstName}</span>
            </div>

            {/* Apellidos */}
            <div className="p-2.5 rounded-2xl bg-slate-50/75 border border-slate-150 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-slate-500">
                <div className="w-6 h-6 rounded-lg bg-teal-100/70 text-[#1c5752] flex items-center justify-center shrink-0">
                  <User className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold">Apellidos</span>
              </div>
              <span className="font-bold text-slate-900 text-right">{profile.lastName}</span>
            </div>

            {/* Fecha de Nacimiento */}
            <div className="p-2.5 rounded-2xl bg-slate-50/75 border border-slate-150 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-slate-500">
                <div className="w-6 h-6 rounded-lg bg-sky-100/80 text-sky-700 flex items-center justify-center shrink-0">
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold">Fecha de nacimiento</span>
              </div>
              <span className="font-mono font-bold text-slate-900 text-right">
                {profile.dateOfBirth
                  ? new Date(profile.dateOfBirth + 'T00:00:00').toLocaleDateString('es-SV', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })
                  : 'No registrada'}
              </span>
            </div>

            {/* Sexo */}
            <div className="p-2.5 rounded-2xl bg-slate-50/75 border border-slate-150 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-slate-500">
                <div className="w-6 h-6 rounded-lg bg-indigo-100/80 text-indigo-700 flex items-center justify-center shrink-0">
                  <Users2 className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold">Sexo</span>
              </div>
              <span className="font-bold text-slate-900 text-right">{formatSexLabel(profile.sex)}</span>
            </div>

            {/* Estado Civil */}
            <div className="p-2.5 rounded-2xl bg-slate-50/75 border border-slate-150 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-slate-500">
                <div className="w-6 h-6 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                  <Heart className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold">Estado civil</span>
              </div>
              <span className="font-bold text-slate-900 text-right">{formatCivilStatusLabel(profile.civilStatus)}</span>
            </div>

            {/* Nacionalidad */}
            <div className="p-2.5 rounded-2xl bg-slate-50/75 border border-slate-150 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-slate-500">
                <div className="w-6 h-6 rounded-lg bg-emerald-100/80 text-emerald-700 flex items-center justify-center shrink-0">
                  <Flag className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold">Nacionalidad</span>
              </div>
              <span className="font-bold text-slate-900 text-right">{profile.nationality}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InformacionPersonalCard;