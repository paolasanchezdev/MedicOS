// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/perfil/contactos-emergencia/components/ContactoEmergenciaCard.tsx
// DESCRIPCIÓN: Tarjeta de contacto con botón 'Llamar' coloreado y estético.
// =========================================================================

import React, { useState } from 'react';
import { 
  PhoneCall, 
  Mail, 
  Pencil, 
  Trash2, 
  Copy, 
  Check, 
  Star
} from 'lucide-react';
import type { 
  EmergencyContact, 
  EmergencyRelationship 
} from '../../../../../../modules/patients/types/emergency-contacts.types.js';

interface ContactoEmergenciaCardProps {
  contact: EmergencyContact;
  onEdit: (contact: EmergencyContact) => void;
  onDelete: (contact: EmergencyContact) => void;
  onSetPrimary: (contact: EmergencyContact) => void;
}

function formatRelationDisplay(rel: EmergencyRelationship, custom?: string | null): string {
  if (rel === 'OTRO' && custom?.trim()) {
    return custom.trim();
  }
  const map: Record<EmergencyRelationship, string> = {
    MADRE: 'Madre',
    PADRE: 'Padre',
    HIJO_A: 'Hijo/a',
    HERMANO_A: 'Hermano/a',
    CONYUGE: 'Cónyuge',
    PAREJA: 'Pareja',
    ABUELO_A: 'Abuelo/a',
    TUTOR_A: 'Tutor/a legal',
    FAMILIAR: 'Familiar',
    AMIGO_A: 'Amistad de confianza',
    OTRO: 'Otro',
  };
  return map[rel] || 'Familiar';
}

export const ContactoEmergenciaCard: React.FC<ContactoEmergenciaCardProps> = ({
  contact,
  onEdit,
  onDelete,
  onSetPrimary,
}) => {
  const [copied, setCopied] = useState(false);

  const fullName = `${contact.firstName} ${contact.lastName}`.trim();
  const relationLabel = formatRelationDisplay(contact.relationship, contact.customRelation);
  const cleanPhone = contact.primaryPhone.replace(/\s+/g, '');
  const initials = `${contact.firstName[0] || ''}${contact.lastName[0] || ''}`.toUpperCase();

  const handleCopy = () => {
    void navigator.clipboard.writeText(contact.primaryPhone);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const isPrimary = contact.isPrimary;

  return (
    <div
      className={`rounded-2xl bg-white transition-all duration-200 flex flex-col justify-between overflow-hidden group ${
        isPrimary
          ? 'border border-slate-300 shadow-[0_6px_20px_rgba(0,0,0,0.06)] ring-1 ring-slate-200'
          : 'border border-slate-200/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:border-slate-300 hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)]'
      }`}
    >
      {/* Cuerpo Superior y Central */}
      <div className="p-6 flex flex-col items-center text-center">
        
        {/* Barra Superior Discreta */}
        <div className="w-full flex items-center justify-between mb-1">
          <button
            type="button"
            onClick={() => onSetPrimary(contact)}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition cursor-pointer ${
              isPrimary
                ? 'text-amber-500'
                : 'text-slate-300 hover:text-slate-500 hover:bg-slate-50'
            }`}
            title={isPrimary ? 'Contacto principal' : 'Marcar como principal'}
          >
            <Star className={`w-4 h-4 ${isPrimary ? 'fill-amber-400' : ''}`} />
          </button>

          <div className="flex items-center gap-1">
            {isPrimary ? (
              <span className="w-5 h-5 rounded-full border border-[#105F68] text-[#105F68] flex items-center justify-center bg-teal-50/50">
                <Check className="w-3 h-3 stroke-3" />
              </span>
            ) : null}

            <button
              type="button"
              onClick={() => onDelete(contact)}
              className="w-7 h-7 rounded-full text-slate-300 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition cursor-pointer"
              title="Eliminar contacto"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Avatar Circular */}
        <div className="relative my-2">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center text-lg font-bold tracking-wider ${
              isPrimary
                ? 'bg-[#EBF6F5] text-[#105F68] ring-2 ring-[#105F68]/30'
                : 'bg-slate-50 text-slate-700 border border-slate-200/80'
            }`}
          >
            {initials}
          </div>
        </div>

        {/* Nombre y Parentesco */}
        <h3 className="text-sm font-bold text-slate-900 tracking-tight mt-1 uppercase truncate max-w-full px-2">
          {fullName}
        </h3>

        <p className="text-xs text-slate-400 font-medium mt-0.5">
          {relationLabel}
        </p>

        {/* Número Telefónico Limpio con Copiado */}
        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-50 border border-slate-100">
          <span className="font-mono text-xs font-semibold text-slate-700">
            {contact.primaryPhone}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="text-slate-400 hover:text-slate-700 transition cursor-pointer"
            title="Copiar teléfono"
          >
            {copied ? (
              <Check className="w-3 h-3 text-emerald-600 stroke-3" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </button>
        </div>

        {contact.secondaryPhone ? (
          <p className="mt-1.5 text-[11px] font-mono text-slate-400">
            Alt: {contact.secondaryPhone}
          </p>
        ) : null}

        {contact.email ? (
          <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-400 truncate max-w-full">
            <Mail className="w-3 h-3 shrink-0" />
            <span className="truncate">{contact.email}</span>
          </div>
        ) : null}
      </div>

      {/* Pie Dividido con Botón 'Llamar' Coloreado */}
      <div className="border-t border-slate-100 grid grid-cols-2 divide-x divide-slate-100 bg-white">
        <button
          type="button"
          onClick={() => onEdit(contact)}
          className="py-3 text-[11px] font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-50/80 transition flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
        >
          <Pencil className="w-3 h-3 text-slate-400" />
          <span>Editar</span>
        </button>

        <a
          href={`tel:${cleanPhone}`}
          className={`py-3 text-[11px] uppercase tracking-wider font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            isPrimary
              ? 'bg-[#105F68] text-white hover:bg-[#0c4b52]'
              : 'bg-[#EBF6F5] text-[#105F68] hover:bg-[#105F68] hover:text-white'
          }`}
        >
          <PhoneCall className="w-3 h-3" />
          <span>Llamar</span>
        </a>
      </div>
    </div>
  );
};

export default ContactoEmergenciaCard;