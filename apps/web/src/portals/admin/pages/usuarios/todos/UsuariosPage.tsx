// ARCHIVO: apps/web/src/portals/admin/pages/usuarios/todos/UsuariosPage.tsx
// DESCRIPCIÓN: Vista principal de gestión integral de usuarios refactorizada y modularizada.

import React, { useState } from 'react';
import { useUsers } from '@/modules/users/hooks/useUsers';
import { UserRoleModal } from '@/modules/users/components/UserRoleModal';
import { CreateUserModal } from '@/modules/users/components/CreateUserModal';
import { EditCredentialsModal } from '@/modules/users/components/EditCredentialsModal';
import { DeleteUserModal } from '@/modules/users/components/DeleteUserModal';

import { UserHeaderSection } from './components/UserHeaderSection';
import { UserFilterBar } from './components/UserFilterBar';
import { UserTable } from './components/UserTable';

import type {
  CreateUserInput,
  UpdateCredentialsInput,
  UpdateUserRoleInput,
} from '@/modules/users/schemas/user.schemas';

export const UsuariosPage: React.FC = () => {
  const {
    users,
    totalUsersCount,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    selectedRoleFilter,
    setSelectedRoleFilter,
    selectedUser,
    isCreateModalOpen,
    isRoleModalOpen,
    isCredentialsModalOpen,
    isDeleteModalOpen,
    isSubmitting,
    openCreateModal,
    closeCreateModal,
    openRoleModal,
    closeRoleModal,
    openCredentialsModal,
    closeCredentialsModal,
    openDeleteModal,
    closeDeleteModal,
    handleCreateUser,
    handleUpdateRole,
    handleUpdateCredentials,
    handleDeleteUser,
    getFullName,
  } = useUsers();

  // Estado para alertas flotantes (Toasts)
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: 'success' | 'error';
  } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const onUserCreated = async (data: CreateUserInput) => {
    const res = await handleCreateUser(data);
    if (res) {
      showToast('Usuario creado exitosamente');
    }
    return res;
  };

  const onRoleUpdated = async (payload: UpdateUserRoleInput) => {
    const res = await handleUpdateRole(payload);
    if (res) {
      showToast('Rol de usuario actualizado');
    }
    return res;
  };

  const onCredentialsUpdated = async (payload: UpdateCredentialsInput) => {
    const res = await handleUpdateCredentials(payload);
    if (res) {
      showToast('Credenciales actualizadas exitosamente');
    }
    return res;
  };

  const onUserDeleted = async (userId: string) => {
    const res = await handleDeleteUser(userId);
    if (res) {
      showToast('Acceso de usuario revocado');
    }
    return res;
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto font-sans relative">
      {/* Toast Alert Flotante */}
      {toastMessage && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-2xl shadow-xl text-xs font-bold border flex items-center space-x-2 transition-all transform translate-y-0 ${
            toastMessage.type === 'success'
              ? 'bg-teal-600 text-white border-teal-500'
              : 'bg-red-600 text-white border-red-500'
          }`}
        >
          <span>{toastMessage.type === 'success' ? '✓' : '✕'}</span>
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Encabezado de la página */}
      <UserHeaderSection
        totalCount={totalUsersCount ?? 0}
        onOpenCreate={openCreateModal}
      />

      {/* Alerta de Error */}
      {error && (
        <div className="p-4 bg-red-50/80 border border-red-200 text-red-700 rounded-xl text-xs font-medium">
          <span className="font-bold">Error:</span> {error}
        </div>
      )}

      {/* Barra de Filtros */}
      <UserFilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedRoleFilter={selectedRoleFilter}
        setSelectedRoleFilter={setSelectedRoleFilter}
      />

      {/* Tabla Principal */}
      <UserTable
        users={users}
        loading={loading}
        getFullName={getFullName}
        onOpenRoleModal={openRoleModal}
        onOpenCredentialsModal={openCredentialsModal}
        onOpenDeleteModal={openDeleteModal}
      />

      {/* Modales del CRUD */}
      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        onSubmit={onUserCreated}
        isSubmitting={isSubmitting}
      />

      <UserRoleModal
        isOpen={isRoleModalOpen}
        onClose={closeRoleModal}
        user={selectedUser}
        onSubmit={onRoleUpdated}
        isSubmitting={isSubmitting}
      />

      <EditCredentialsModal
        isOpen={isCredentialsModalOpen}
        onClose={closeCredentialsModal}
        user={selectedUser}
        onSubmit={onCredentialsUpdated}
        isSubmitting={isSubmitting}
      />

      <DeleteUserModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        user={selectedUser}
        onConfirm={onUserDeleted}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};