// =========================================================================
// ARCHIVO: ContactoEmergenciaModal.tsx
// DESCRIPCIÓN: Modal unificado para agregar o editar contacto.
// =========================================================================

import React from 'react';
import { X } from 'lucide-react';
import type { 
  EmergencyContact, 
  CreateEmergencyContactDto 
} from '../../../../../../modules/patients/types/emergency-contacts.types.js';
import { ContactoEmergenciaForm } from './ContactoEmergenciaForm.js';

interface ContactoEmergenciaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateEmergencyContactDto) => Promise<boolean>;
  contactToEdit?: EmergencyContact | null;
  hasExistingPrimary: boolean;
  saving: boolean;
}

export const ContactoEmergenciaModal: React.FC<ContactoEmergenciaModalProps> = ({
  isOpen,
  onClose,
  onSave,
  contactToEdit,
  hasExistingPrimary,
  saving,
}) => {
  if (!isOpen) return null;

  const isEditing = Boolean(contactToEdit);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-lg w-full shadow-xl border border-slate-200 overflow-hidden my-8 scale-98 animate-in zoom-in-98 duration-150"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Cabecera del Modal */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 id="modal-title" className="text-base font-semibold text-[#1A282D]">
            {isEditing ? 'Editar contacto' : 'Agregar contacto de emergencia'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Formulario */}
        <ContactoEmergenciaForm
          key={contactToEdit?.id ?? 'create-contact'}
          contactToEdit={contactToEdit}
          hasExistingPrimary={hasExistingPrimary}
          onSave={onSave}
          onClose={onClose}
          saving={saving}
        />
      </div>
    </div>
  );
};

export default ContactoEmergenciaModal;