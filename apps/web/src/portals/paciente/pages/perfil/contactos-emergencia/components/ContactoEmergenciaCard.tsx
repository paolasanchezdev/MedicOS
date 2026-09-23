// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/perfil/contactos-emergencia/components/ContactoEmergenciaCard.tsx
// DESCRIPCIÓN: Tarjeta de contacto minimalista, limpia, con marcación directa y sin imports no utilizados.
// =========================================================================

import React, { useState } from 'react';
import { 
  PhoneCall, 
  Phone, 
  Mail, 
  Pencil, 
  Trash2, 
  Copy, 
  Check 
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

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 p-4 sm:p-4.5 shadow-2xs hover:shadow-xs transition-all duration-150 flex flex-col justify-between">
      <div>
        {/* Fila Superior: Avatar + Nombre + Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Avatar circular suave */}
            <div className="w-10 h-10 rounded-full bg-[#EEF7F8] text-[#166E7A] font-bold text-xs flex items-center justify-center shrink-0">
              {initials}
            </div>

            <div className="min-w-0">
              <h3 className="text-sm sm:text-[15px] font-bold text-slate-800 tracking-tight truncate">
                {fullName}
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                {relationLabel}
              </p>
            </div>
          </div>

          {/* Badge Principal o Acción Rápida */}
          {contact.isPrimary ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#EEF7F8] text-[#166E7A] border border-[#D3E8EC] shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#166E7A]" />
              <span>Principal</span>
            </span>
          ) : (
            <button
              type="button"
              onClick={() => onSetPrimary(contact)}
              className="text-[11px] font-medium text-slate-400 hover:text-[#166E7A] transition cursor-pointer shrink-0"
              title="Establecer como contacto principal"
            >
              Hacer principal
            </button>
          )}
        </div>

        {/* Fila de Contacto (Teléfono y Correo limpios) */}
        <div className="mt-3 pt-2.5 border-t border-slate-100/80 space-y-1.5 text-xs text-slate-600">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="font-mono font-semibold text-slate-800 text-xs">
                {contact.primaryPhone}
              </span>
              {contact.secondaryPhone ? (
                <span className="text-slate-400 font-mono text-[11px] truncate">
                  · {contact.secondaryPhone}
                </span>
              ) : null}
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="p-1 text-slate-400 hover:text-slate-600 transition cursor-pointer"
              title="Copiar teléfono"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-3" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {contact.email ? (
            <div className="flex items-center gap-2 text-slate-400 text-[11px]">
              <Mail className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{contact.email}</span>
            </div>
          ) : null}
        </div>
      </div>

      {/* Botones de Acción Limpios */}
      <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
        <a
          href={`tel:${cleanPhone}`}
          className="h-8 px-3 rounded-lg bg-[#EEF7F8] hover:bg-[#DDF0F2] text-[#166E7A] text-xs font-semibold inline-flex items-center gap-1.5 transition cursor-pointer"
        >
          <PhoneCall className="w-3 h-3 stroke-[2.5]" />
          <span>Llamar</span>
        </a>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(contact)}
            className="h-8 px-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium transition cursor-pointer"
          >
            <Pencil className="w-3 h-3 inline mr-1 text-slate-400" />
            Editar
          </button>

          <button
            type="button"
            onClick={() => onDelete(contact)}
            className="h-8 w-8 rounded-lg border border-slate-200 hover:bg-rose-50 hover:border-rose-200 text-slate-400 hover:text-rose-600 flex items-center justify-center transition cursor-pointer"
            title="Eliminar contacto"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactoEmergenciaCard;