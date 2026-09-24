// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/perfil/contactos-emergencia/components/ContactosEmergenciaList.tsx
// DESCRIPCIÓN: Rejilla fluida de 3 columnas que llena el ancho de forma armónica.
// =========================================================================

import React from 'react';
import type { EmergencyContact } from '../../../../../../modules/patients/types/emergency-contacts.types.js';
import { ContactoEmergenciaCard } from './ContactoEmergenciaCard.js';

interface ContactosEmergenciaListProps {
  contacts: EmergencyContact[];
  onEdit: (contact: EmergencyContact) => void;
  onDelete: (contact: EmergencyContact) => void;
  onSetPrimary: (contact: EmergencyContact) => void;
}

export const ContactosEmergenciaList: React.FC<ContactosEmergenciaListProps> = ({
  contacts,
  onEdit,
  onDelete,
  onSetPrimary,
}) => {
  return (
    <div className="space-y-3.5 w-full">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
            Contactos Registrados
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-[#EBF6F5] text-[#105F68]">
            {contacts.length}
          </span>
        </div>
      </div>

      {/* Cuadrícula de 3 columnas que abarca todo el ancho sin dejar huecos vacíos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
        {contacts.map((contact) => (
          <ContactoEmergenciaCard
            key={contact.id}
            contact={contact}
            onEdit={onEdit}
            onDelete={onDelete}
            onSetPrimary={onSetPrimary}
          />
        ))}
      </div>
    </div>
  );
};

export default ContactosEmergenciaList;