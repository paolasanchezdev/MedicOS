// ARCHIVO: apps/web/src/portals/admin/pages/usuarios/roles/RolesPage.tsx
// DESCRIPCIÓN: Página orquestadora de Control de Roles RBAC modularizada y adaptada al tema MedicOS.

import React, { useEffect, useMemo, useState } from 'react';
import { usersService } from '@/modules/users/services/users.service';
import type { User } from '@/modules/users/types/user.types';
import { ROLE_LABELS, type UserRoleType } from '@/core/permissions/roles';

import { RoleStatsCards } from './components/RoleStatsCards';
import { RoleAssignmentTable } from './components/RoleAssignmentTable';
import { RoleMatrixTable } from './components/RoleMatrixTable';
import { ConfirmRoleModal } from './components/ConfirmRoleModal';

export const RolesPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Filtros y Navegación Interna
  const [activeTab, setActiveTab] = useState<'assignment' | 'matrix'>('assignment');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  // Modal de confirmación
  const [pendingChange, setPendingChange] = useState<{
    user: User;
    newRole: UserRoleType;
  } | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Carga inicial de datos
  useEffect(() => {
    let isMounted = true;
    const loadUsers = async () => {
      try {
        const data = await usersService.getUsers();
        if (isMounted) {
          setUsers(Array.isArray(data) ? data : []);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const msg = err instanceof Error ? err.message : 'Error al cargar los usuarios';
          setError(msg);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleRefresh = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await usersService.getUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al actualizar datos';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Métricas con validación defensiva de Arreglo
  const roleCounts = useMemo(() => {
    const counts: Record<string, number> = {
      ADMIN: 0,
      DOCTOR: 0,
      BRIGADISTA: 0,
      AUTHORITY: 0,
      PATIENT: 0,
    };
    const userList = Array.isArray(users) ? users : [];
    userList.forEach((u) => {
      if (counts[u.role] !== undefined) {
        counts[u.role] += 1;
      }
    });
    return counts;
  }, [users]);

  // Lista de usuarios filtrada
  const filteredUsers = useMemo(() => {
    const userList = Array.isArray(users) ? users : [];
    return userList.filter((u) => {
      const fullName = `${u.firstName ?? ''} ${u.lastName ?? ''}`.toLowerCase();
      const email = (u.email ?? '').toLowerCase();
      const matchesSearch =
        email.includes(searchQuery.toLowerCase()) ||
        fullName.includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  const handleConfirmRoleChange = async () => {
    if (!pendingChange) return;
    setIsUpdating(true);
    setError(null);
    try {
      await usersService.updateUserRole({
        userId: pendingChange.user.id,
        role: pendingChange.newRole,
      });

      setUsers((prev) => {
        const prevList = Array.isArray(prev) ? prev : [];
        return prevList.map((u) =>
          u.id === pendingChange.user.id ? { ...u, role: pendingChange.newRole } : u
        );
      });

      setSuccessMsg(
        `Rol de ${pendingChange.user.firstName} ${pendingChange.user.lastName} actualizado a ${ROLE_LABELS[pendingChange.newRole]}.`
      );
      setPendingChange(null);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al actualizar el rol';
      setError(msg);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header de la Página */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Control de Roles y Permisos RBAC</h1>
          <p className="text-sm text-slate-500 mt-1">
            Gestión de perfiles de acceso y matriz de capacidades técnicas en MedicOS.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 rounded-lg transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? 'Cargando...' : 'Actualizar Datos'}
        </button>
      </div>

      {/* Alertas */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm flex justify-between items-center shadow-xs">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="font-bold ml-4 cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex justify-between items-center shadow-xs">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg(null)} className="font-bold ml-4 cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* Componente 1: Tarjetas de Resumen de Roles */}
      <RoleStatsCards counts={roleCounts} />

      {/* Navegación por Pestañas */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('assignment')}
            className={`py-3 px-1 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'assignment'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            Asignación Directa de Roles ({Array.isArray(users) ? users.length : 0})
          </button>
          <button
            onClick={() => setActiveTab('matrix')}
            className={`py-3 px-1 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'matrix'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            Matriz de Permisos por Rol
          </button>
        </nav>
      </div>

      {/* Vistas según Tab seleccionado */}
      {activeTab === 'assignment' ? (
        <RoleAssignmentTable
          users={filteredUsers}
          isLoading={isLoading}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          onSelectRoleChange={(user, newRole) => setPendingChange({ user, newRole })}
        />
      ) : (
        <RoleMatrixTable />
      )}

      {/* Modal de Confirmación */}
      {pendingChange && (
        <ConfirmRoleModal
          user={pendingChange.user}
          newRole={pendingChange.newRole}
          isUpdating={isUpdating}
          onConfirm={handleConfirmRoleChange}
          onCancel={() => setPendingChange(null)}
        />
      )}
    </div>
  );
};