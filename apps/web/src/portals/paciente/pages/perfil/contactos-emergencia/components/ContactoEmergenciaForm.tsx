// =========================================================================
// ARCHIVO: ContactoEmergenciaForm.tsx
// DESCRIPCIÓN: Formulario limpio con validaciones en línea campo por campo.
// =========================================================================

import React, { useState } from 'react';
import { 
  type EmergencyContact, 
  type CreateEmergencyContactDto, 
  type EmergencyRelationship,
  EMERGENCY_RELATIONSHIPS 
} from '../../../../../../modules/patients/types/emergency-contacts.types.js';

interface ContactoEmergenciaFormProps {
  contactToEdit?: EmergencyContact | null;
  hasExistingPrimary: boolean;
  onSave: (data: CreateEmergencyContactDto) => Promise<boolean>;
  onClose: () => void;
  saving: boolean;
}

export const ContactoEmergenciaForm: React.FC<ContactoEmergenciaFormProps> = ({
  contactToEdit,
  hasExistingPrimary,
  onSave,
  onClose,
  saving,
}) => {
  const isEditing = Boolean(contactToEdit);

  const [firstName, setFirstName] = useState(contactToEdit?.firstName || '');
  const [lastName, setLastName] = useState(contactToEdit?.lastName || '');
  const [relationship, setRelationship] = useState<EmergencyRelationship>(
    contactToEdit?.relationship || 'MADRE'
  );
  const [customRelation, setCustomRelation] = useState(contactToEdit?.customRelation || '');
  const [primaryPhone, setPrimaryPhone] = useState(contactToEdit?.primaryPhone || '');
  const [secondaryPhone, setSecondaryPhone] = useState(contactToEdit?.secondaryPhone || '');
  const [email, setEmail] = useState(contactToEdit?.email || '');
  const [isPrimary, setIsPrimary] = useState(
    contactToEdit ? contactToEdit.isPrimary : !hasExistingPrimary
  );

  // Errores en línea por campo
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!firstName.trim()) errs.firstName = 'Ingresa el nombre.';
    if (!lastName.trim()) errs.lastName = 'Ingresa el apellido.';
    if (!primaryPhone.trim()) {
      errs.primaryPhone = 'Ingresa el número de teléfono principal.';
    } else if (primaryPhone.replace(/\D/g, '').length < 8) {
      errs.primaryPhone = 'Ingresa un número de teléfono válido (mínimo 8 dígitos).';
    }
    if (relationship === 'OTRO' && !customRelation.trim()) {
      errs.customRelation = 'Especifica la relación de parentesco o amistad.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload: CreateEmergencyContactDto = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      relationship,
      customRelation: relationship === 'OTRO' ? customRelation.trim() : null,
      primaryPhone: primaryPhone.trim(),
      secondaryPhone: secondaryPhone.trim() || null,
      email: email.trim().toLowerCase() || null,
      isPrimary,
      isActive: true,
    };

    const ok = await onSave(payload);
    if (ok) onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-[13px]">
      {/* Nombres y Apellidos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label htmlFor="firstName" className="font-semibold text-[#1A282D] block mb-1">
            Nombre(s)
          </label>
          <input
            id="firstName"
            type="text"
            placeholder="María"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={`w-full px-3.5 py-2.5 bg-white border rounded-[10px] text-[#1A282D] font-medium outline-none focus:border-[#166E7A] focus:ring-1 focus:ring-[#166E7A] transition ${
              errors.firstName ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
            }`}
          />
          {errors.firstName && (
            <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.firstName}</p>
          )}
        </div>

        <div>
          <label htmlFor="lastName" className="font-semibold text-[#1A282D] block mb-1">
            Apellidos
          </label>
          <input
            id="lastName"
            type="text"
            placeholder="Sánchez"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className={`w-full px-3.5 py-2.5 bg-white border rounded-[10px] text-[#1A282D] font-medium outline-none focus:border-[#166E7A] focus:ring-1 focus:ring-[#166E7A] transition ${
              errors.lastName ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
            }`}
          />
          {errors.lastName && (
            <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.lastName}</p>
          )}
        </div>
      </div>

      {/* Relación / Parentesco */}
      <div>
        <label htmlFor="relationship" className="font-semibold text-[#1A282D] block mb-1">
          Relación
        </label>
        <select
          id="relationship"
          value={relationship}
          onChange={(e) => setRelationship(e.target.value as EmergencyRelationship)}
          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-[10px] text-[#1A282D] font-medium outline-none focus:border-[#166E7A] cursor-pointer"
        >
          {EMERGENCY_RELATIONSHIPS.map((rel) => (
            <option key={rel.value} value={rel.value}>
              {rel.label}
            </option>
          ))}
        </select>
      </div>

      {/* Campo Condicional "Otro" */}
      {relationship === 'OTRO' && (
        <div className="animate-in fade-in duration-100">
          <label htmlFor="customRelation" className="font-semibold text-[#166E7A] block mb-1">
            Especifica la relación
          </label>
          <input
            id="customRelation"
            type="text"
            placeholder="Ej. Vecina, Padrino, Cuidador..."
            value={customRelation}
            onChange={(e) => setCustomRelation(e.target.value)}
            className={`w-full px-3.5 py-2.5 bg-[#EEF7F8]/40 border rounded-[10px] text-[#1A282D] font-medium outline-none focus:border-[#166E7A] ${
              errors.customRelation ? 'border-rose-400' : 'border-[#D3E8EC]'
            }`}
          />
          {errors.customRelation && (
            <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.customRelation}</p>
          )}
        </div>
      )}

      {/* Teléfono Principal */}
      <div>
        <label htmlFor="primaryPhone" className="font-semibold text-[#1A282D] block mb-1">
          Teléfono principal
        </label>
        <input
          id="primaryPhone"
          type="tel"
          placeholder="+503 7XXX-XXXX"
          value={primaryPhone}
          onChange={(e) => setPrimaryPhone(e.target.value)}
          className={`w-full px-3.5 py-2.5 bg-white border rounded-[10px] text-[#1A282D] font-mono font-medium outline-none focus:border-[#166E7A] ${
            errors.primaryPhone ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
          }`}
        />
        {errors.primaryPhone && (
          <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.primaryPhone}</p>
        )}
      </div>

      {/* Teléfono Alternativo (Opcional) */}
      <div>
        <label htmlFor="secondaryPhone" className="font-semibold text-[#1A282D] block mb-1">
          Teléfono alternativo <span className="text-[#52656C] font-normal">(opcional)</span>
        </label>
        <input
          id="secondaryPhone"
          type="tel"
          placeholder="+503 2XXX-XXXX"
          value={secondaryPhone}
          onChange={(e) => setSecondaryPhone(e.target.value)}
          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-[10px] text-[#1A282D] font-mono font-medium outline-none focus:border-[#166E7A]"
        />
      </div>

      {/* Correo Electrónico (Opcional) */}
      <div>
        <label htmlFor="email" className="font-semibold text-[#1A282D] block mb-1">
          Correo electrónico <span className="text-[#52656C] font-normal">(opcional)</span>
        </label>
        <input
          id="email"
          type="email"
          placeholder="maria@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-[10px] text-[#1A282D] font-medium outline-none focus:border-[#166E7A]"
        />
      </div>

      {/* Checkbox de Contacto Principal */}
      <div className="pt-2">
        <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isPrimary}
            onChange={(e) => setIsPrimary(e.target.checked)}
            className="w-4 h-4 rounded text-[#166E7A] focus:ring-[#166E7A] border-slate-300 mt-0.5 cursor-pointer accent-[#166E7A]"
          />
          <div className="space-y-0.5">
            <span className="font-semibold text-[#1A282D] block">
              Establecer como contacto principal
            </span>
            <p className="text-[11px] text-[#52656C] leading-snug">
              Este contacto será priorizado en tus atenciones de salud.
            </p>
            {isPrimary && hasExistingPrimary && (!contactToEdit || !contactToEdit.isPrimary) && (
              <p className="text-[11px] text-slate-600 bg-white border border-slate-200 rounded-lg p-2 mt-2 leading-relaxed">
                Ya tienes un contacto principal. Al establecer este contacto como principal, el anterior dejará de serlo.
              </p>
            )}
          </div>
        </label>
      </div>

      {/* Botones de Acción */}
      <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
        <button
          type="button"
          disabled={saving}
          onClick={onClose}
          className="h-10 px-4 rounded-[10px] bg-slate-100 hover:bg-slate-200 text-[#1A282D] font-semibold text-xs transition cursor-pointer"
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={saving}
          className="h-10 px-5 rounded-[10px] bg-[#166E7A] hover:bg-[#125862] text-white font-semibold text-xs transition cursor-pointer disabled:opacity-50"
        >
          {saving ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Guardar contacto'}
        </button>
      </div>
    </form>
  );
};

export default ContactoEmergenciaForm;