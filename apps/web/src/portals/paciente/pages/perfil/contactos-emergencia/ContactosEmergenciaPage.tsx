// =========================================================================
// ARCHIVO: ContactosEmergenciaPage.tsx
// DESCRIPCIÓN: Vista minimalista, limpia y aireada de Contactos de Emergencia.
// =========================================================================

import React from 'react';
import { useEmergencyContacts } from '../../../../../modules/patients/hooks/useEmergencyContacts.js';
import type { EmergencyContact } from '../../../../../modules/patients/types/emergency-contacts.types.js';
import {
  ContactosEmergenciaHeader,
  ServicioEmergenciaSOS,
  ContactosEmergenciaInfoCard,
  ContactosEmergenciaLoading,
  ContactosEmergenciaError,
  ContactosEmergenciaEmpty,
  ContactosEmergenciaList,
  ContactoEmergenciaModal,
  EliminarContactoModal,
  LineasEmergenciaNacionales,
} from './components/index.js';

export const ContactosEmergenciaPage: React.FC = () => {
  const {
    contacts,
    primaryContact,
    loading,
    mutating,
    error,
    isCreateModalOpen,
    editingContact,
    deletingContact,
    setIsCreateModalOpen,
    setEditingContact,
    setDeletingContact,
    createContact,
    updateContact,
    deleteContact,
    setPrimary,
    refetch,
  } = useEmergencyContacts();

  return (
    <div className="w-full space-y-4 pb-16 animate-in fade-in duration-150">
      {/* 1. Header Minimalista */}
      <ContactosEmergenciaHeader
        onAddContact={() => setIsCreateModalOpen(true)}
      />

      {/* 2. Acceso Rápido SOS */}
      <ServicioEmergenciaSOS primaryContact={primaryContact} />

      {/* 3. Micro-Banner de Privacidad */}
      <ContactosEmergenciaInfoCard />

      {/* 4. Lista de Contactos en Cuadrícula Limpia de 2 Columnas */}
      {loading ? (
        <ContactosEmergenciaLoading />
      ) : error ? (
        <ContactosEmergenciaError onRetry={refetch} />
      ) : contacts.length === 0 ? (
        <ContactosEmergenciaEmpty
          onAddContact={() => setIsCreateModalOpen(true)}
        />
      ) : (
        <ContactosEmergenciaList
          contacts={contacts}
          onEdit={(c: EmergencyContact) => setEditingContact(c)}
          onDelete={(c: EmergencyContact) => setDeletingContact(c)}
          onSetPrimary={(c: EmergencyContact) => void setPrimary(c.id)}
        />
      )}

      {/* 5. Líneas Médicas Nacionales 24/7 */}
      <LineasEmergenciaNacionales />

      {/* 6. Modal para Agregar o Editar Contacto */}
      <ContactoEmergenciaModal
        isOpen={isCreateModalOpen || Boolean(editingContact)}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingContact(null);
        }}
        contactToEdit={editingContact}
        hasExistingPrimary={Boolean(primaryContact)}
        saving={mutating}
        onSave={async (data) => {
          if (editingContact) {
            return updateContact(editingContact.id, data);
          }
          return createContact(data);
        }}
      />

      {/* 7. Modal de Confirmación de Eliminación */}
      <EliminarContactoModal
        isOpen={Boolean(deletingContact)}
        onClose={() => setDeletingContact(null)}
        contactName={
          deletingContact ? `${deletingContact.firstName} ${deletingContact.lastName}` : ''
        }
        loading={mutating}
        onConfirm={async () => {
          if (deletingContact) {
            await deleteContact(deletingContact.id);
          }
        }}
      />
    </div>
  );
};

export default ContactosEmergenciaPage;