// =========================================================================
// ARCHIVO: apps/web/src/modules/patients/hooks/useEmergencyContacts.ts
// DESCRIPCIÓN: Hook de dominio para gestionar contactos de emergencia,
//              unicidad del contacto principal, estados de carga y modales.
// =========================================================================

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../../../core/context/useAuth.js';
import { patientsService } from '../services/patients.service';
import type {
  EmergencyContact,
  CreateEmergencyContactDto,
  UpdateEmergencyContactDto,
} from '../types/emergency-contacts.types';

export function useEmergencyContacts() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [mutating, setMutating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Estados de control de modales
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);
  const [deletingContact, setDeletingContact] = useState<EmergencyContact | null>(null);
  const [contactPendingPrimary, setContactPendingPrimary] = useState<EmergencyContact | null>(null);

  const notifySuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  const fetchContacts = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await patientsService.getEmergencyContacts();
      setContacts(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al cargar los contactos de emergencia';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      await Promise.resolve();
      if (!isMounted) return;
      await fetchContacts();
    };
    void load();
    return () => {
      isMounted = false;
    };
  }, [fetchContacts]);

  const primaryContact = useMemo(() => {
    return contacts.find((c) => c.isPrimary && c.isActive) || null;
  }, [contacts]);

  const secondaryContacts = useMemo(() => {
    return contacts.filter((c) => !c.isPrimary || !c.isActive);
  }, [contacts]);

  const createContact = async (dto: CreateEmergencyContactDto): Promise<boolean> => {
    setMutating(true);
    setError(null);
    try {
      const created = await patientsService.createEmergencyContact(dto);
      setContacts((prev) => {
        if (created.isPrimary) {
          return [created, ...prev.map((c) => ({ ...c, isPrimary: false }))];
        }
        return [...prev, created];
      });
      setIsCreateModalOpen(false);
      notifySuccess('Contacto de emergencia agregado correctamente.');
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'No fue posible registrar el contacto.';
      setError(msg);
      return false;
    } finally {
      setMutating(false);
    }
  };

  const updateContact = async (contactId: string, dto: UpdateEmergencyContactDto): Promise<boolean> => {
    setMutating(true);
    setError(null);
    try {
      const updated = await patientsService.updateEmergencyContact(contactId, dto);
      setContacts((prev) => {
        if (updated.isPrimary) {
          return [
            updated,
            ...prev
              .filter((c) => c.id !== contactId)
              .map((c) => ({ ...c, isPrimary: false })),
          ];
        }
        return prev.map((c) => (c.id === contactId ? updated : c));
      });
      setEditingContact(null);
      notifySuccess('Contacto de emergencia actualizado.');
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al actualizar el contacto.';
      setError(msg);
      return false;
    } finally {
      setMutating(false);
    }
  };

  const deleteContact = async (contactId: string): Promise<boolean> => {
    setMutating(true);
    setError(null);
    try {
      await patientsService.deleteEmergencyContact(contactId);
      await fetchContacts();
      setDeletingContact(null);
      notifySuccess('Contacto de emergencia eliminado.');
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'No fue posible eliminar el contacto.';
      setError(msg);
      return false;
    } finally {
      setMutating(false);
    }
  };

  const setPrimary = async (contactId: string): Promise<boolean> => {
    setMutating(true);
    setError(null);
    try {
      const updated = await patientsService.setPrimaryEmergencyContact(contactId);
      setContacts((prev) => [
        updated,
        ...prev
          .filter((c) => c.id !== contactId)
          .map((c) => ({ ...c, isPrimary: false })),
      ]);
      setContactPendingPrimary(null);
      notifySuccess(`${updated.firstName} ha sido establecido como contacto principal.`);
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al cambiar el contacto principal.';
      setError(msg);
      return false;
    } finally {
      setMutating(false);
    }
  };

  return {
    contacts,
    primaryContact,
    secondaryContacts,
    loading,
    mutating,
    error,
    successMessage,
    isCreateModalOpen,
    editingContact,
    deletingContact,
    contactPendingPrimary,
    setIsCreateModalOpen,
    setEditingContact,
    setDeletingContact,
    setContactPendingPrimary,
    createContact,
    updateContact,
    deleteContact,
    setPrimary,
    refetch: fetchContacts,
  };
}