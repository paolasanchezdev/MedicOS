// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/perfil/contactos-emergencia/ContactosEmergenciaPage.tsx
// DESCRIPCIÓN: Vista principal fluida con líneas nacionales de auxilio en posición
//              superior y directorio de contactos en formato vertical limpio.
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
    <div className="w-full space-y-6 pb-20 animate-in fade-in duration-150">
      {/* 1. Header Oficial Institucional */}
      <ContactosEmergenciaHeader
        onAddContact={() => setIsCreateModalOpen(true)}
      />

      {/* 2. Barra de Asistencia Rápida SOS */}
      <ServicioEmergenciaSOS primaryContact={primaryContact} />

      {/* 3. Líneas Médicas Nacionales 24/7 (Ubicación Prioritaria Superior) */}
      <LineasEmergenciaNacionales />

      {/* 4. Nota de Confidencialidad y Protección de Datos */}
      <ContactosEmergenciaInfoCard />

      {/* 5. Directorio de Contactos Personales en 3 Columnas Limpias */}
      <div className="w-full pt-1">
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
      </div>

      {/* 6. Modal para Crear / Editar Contacto */}
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
          deletingContact
            ? `${deletingContact.firstName} ${deletingContact.lastName}`.trim()
            : ''
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