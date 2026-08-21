//apps/web/src/modules/users/hooks/useUsers.ts
import { useState, useEffect, useCallback, useMemo } from 'react';
import { usersService } from '../services/users.service';
import type { User } from '../types/user.types';
import type {
  CreateUserInput,
  UpdateCredentialsInput,
  UpdateUserRoleInput,
  UserRoleInput,
} from '../schemas/user.schemas';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('ALL');

  // Estados para Modales
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState<boolean>(false);
  const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Helper para construir el nombre completo
  const getFullName = (user: User): string => {
    if (user.firstName || user.lastName) {
      return `${user.firstName || ''} ${user.lastName || ''}`.trim();
    }
    return user.name || 'Usuario sin nombre';
  };

  // Normalizador defensivo de respuesta HTTP
  const normalizeUsers = (data: unknown): User[] => {
    if (Array.isArray(data)) return data;
    if (data && typeof data === 'object') {
      const obj = data as Record<string, unknown>;
      if (Array.isArray(obj.data)) return obj.data as User[];
      if (Array.isArray(obj.users)) return obj.users as User[];
    }
    return [];
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const responseData = await usersService.getUsers();
      setUsers(normalizeUsers(responseData));
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Error al obtener la lista de usuarios.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isSubscribed = true;

    async function loadInitialUsers() {
      try {
        const responseData = await usersService.getUsers();
        if (isSubscribed) {
          setUsers(normalizeUsers(responseData));
          setError(null);
        }
      } catch (err: unknown) {
        if (isSubscribed) {
          const errorMessage =
            err instanceof Error
              ? err.message
              : 'Error al obtener la lista de usuarios.';
          setError(errorMessage);
        }
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    }

    loadInitialUsers();

    return () => {
      isSubscribed = false;
    };
  }, []);

  // Lista de usuarios filtrada
  const filteredUsers = useMemo(() => {
    if (!Array.isArray(users)) return [];

    return users.filter((user) => {
      const fullName = getFullName(user).toLowerCase();
      const email = (user.email || '').toLowerCase();
      const search = searchTerm.toLowerCase();

      const matchesSearch = fullName.includes(search) || email.includes(search);
      const matchesRole =
        selectedRoleFilter === 'ALL' ||
        user.role?.toUpperCase() === selectedRoleFilter.toUpperCase();

      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, selectedRoleFilter]);

  // Manejadores de Apertura y Cierre de Modales
  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);

  const openRoleModal = (user: User) => {
    setSelectedUser(user);
    setIsRoleModalOpen(true);
  };
  const closeRoleModal = () => {
    setSelectedUser(null);
    setIsRoleModalOpen(false);
  };

  const openCredentialsModal = (user: User) => {
    setSelectedUser(user);
    setIsCredentialsModalOpen(true);
  };
  const closeCredentialsModal = () => {
    setSelectedUser(null);
    setIsCredentialsModalOpen(false);
  };

  const openDeleteModal = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };
  const closeDeleteModal = () => {
    setSelectedUser(null);
    setIsDeleteModalOpen(false);
  };

  // Acciones del CRUD
  const handleCreateUser = async (data: CreateUserInput): Promise<boolean> => {
    setIsSubmitting(true);
    setError(null);
    try {
      await usersService.createUser(data);
      await fetchUsers();
      closeCreateModal();
      return true;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error al crear el usuario.';
      setError(errorMessage);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateRole = async (payload: UpdateUserRoleInput): Promise<boolean> => {
    setIsSubmitting(true);
    setError(null);
    try {
      await usersService.updateUserRole(payload);
      await fetchUsers();
      closeRoleModal();
      return true;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error al actualizar el rol.';
      setError(errorMessage);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateRoles = async (payload: UserRoleInput): Promise<boolean> => {
    if (payload.role) {
      return handleUpdateRole({ userId: payload.userId, role: payload.role });
    }
    return false;
  };

  const handleUpdateCredentials = async (payload: UpdateCredentialsInput): Promise<boolean> => {
    setIsSubmitting(true);
    setError(null);
    try {
      await usersService.updateUserCredentials(payload);
      await fetchUsers();
      closeCredentialsModal();
      return true;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error al actualizar las credenciales.';
      setError(errorMessage);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (userId: string): Promise<boolean> => {
    setIsSubmitting(true);
    setError(null);
    try {
      await usersService.deleteUser(userId);
      await fetchUsers();
      closeDeleteModal();
      return true;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error al revocar el usuario.';
      setError(errorMessage);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    users: filteredUsers,
    totalUsersCount: Array.isArray(users) ? users.length : 0,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    selectedRoleFilter,
    setSelectedRoleFilter,
    selectedUser,
    // Alias de compatibilidad
    isModalOpen: isRoleModalOpen,
    handleUpdateRoles,
    // Modales y Acciones
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
    refreshUsers: fetchUsers,
    getFullName,
  };
}