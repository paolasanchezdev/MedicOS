// =========================================================================
// ARCHIVO: ContactosEmergenciaList.tsx
// DESCRIPCIÓN: Organiza los contactos en una cuadrícula amplia de 2 columnas
//              aprovechando todo el ancho de la pantalla sin huecos vacíos.
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
    <div className="w-full space-y-3.5 pt-1">
      {/* Título de la sección */}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[#52656C]">
          Contactos registrados · {contacts.length}
        </h2>
      </div>

      {/* Grid de 2 columnas a todo lo ancho */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 w-full">
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