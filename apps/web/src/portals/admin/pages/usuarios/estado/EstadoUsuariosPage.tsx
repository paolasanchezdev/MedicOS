import React, { useState, useMemo } from 'react';
import { RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useUsers } from '../../../../../modules/users/hooks/useUsers';
import { usersService } from '../../../../../modules/users/services/users.service';
import type { User, UserStatus } from '../../../../../modules/users/types/user.types';
import { UserStatusModal } from '../../../../../modules/users/components/UserStatusModal';
import { UserStatusMetrics } from './components/UserStatusMetrics';
import { UserStatusFilters } from './components/UserStatusFilters';
import { UserStatusTable } from './components/UserStatusTable';

export const EstadoUsuariosPage: React.FC = () => {
  const {
    users,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    selectedRoleFilter,
    setSelectedRoleFilter,
    refreshUsers,
    getFullName,
  } = useUsers();

  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');

  // Estados del Modal y Notificaciones
  const [targetUser, setTargetUser] = useState<User | null>(null);
  const [targetStatus, setTargetStatus] = useState<UserStatus | 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const roleLabels: Record<string, string> = {
    ADMIN: 'Administrador',
    AUTHORITY: 'Autoridad de Salud',
    DOCTOR: 'Médico',
    BRIGADISTA: 'Brigadista',
    PATIENT: 'Paciente',
  };

  const metrics = useMemo(() => {
    const total = users.length;
    let active = 0;
    let inactive = 0;
    let suspended = 0;

    users.forEach((user) => {
      const status = user.status?.toUpperCase() || 'ACTIVE';
      if (status === 'ACTIVE') active++;
      else if (status === 'INACTIVE') inactive++;
      else if (status === 'SUSPENDED') suspended++;
      else active++;
    });

    return { total, active, inactive, suspended };
  }, [users]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const userStatus = (user.status || 'ACTIVE').toUpperCase();
      return (
        selectedStatusFilter === 'ALL' ||
        userStatus === selectedStatusFilter.toUpperCase()
      );
    });
  }, [users, selectedStatusFilter]);

  const handleRequestStatusChange = (
    user: User,
    newStatus: UserStatus | 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
  ) => {
    setTargetUser(user);
    setTargetStatus(newStatus);
    setIsModalOpen(true);
    setActionError(null);
  };

  const handleCloseModal = () => {
    if (isSubmitting) return;
    setIsModalOpen(false);
    setTargetUser(null);
    setTargetStatus(null);
  };

  const handleConfirmStatusChange = async () => {
    if (!targetUser || !targetStatus) return;

    try {
      setIsSubmitting(true);
      setActionError(null);

      await usersService.updateUserStatus({
        userId: targetUser.id,
        status: targetStatus as 'ACTIVE' | 'INACTIVE' | 'SUSPENDED',
      });

      const statusLabels: Record<string, string> = {
        ACTIVE: 'activada',
        INACTIVE: 'inactivada',
        SUSPENDED: 'suspendida',
      };

      setSuccessMessage(
        `La cuenta de ${getFullName(targetUser)} ha sido ${statusLabels[targetStatus] || 'actualizada'} con éxito.`
      );

      await refreshUsers();
      handleCloseModal();

      setTimeout(() => {
        setSuccessMessage(null);
      }, 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al actualizar el estado del usuario';
      setActionError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-medicos-dark-blue tracking-tight">
            Estado y Monitoreo de Cuentas
          </h1>
          <p className="text-sm text-medicos-muted mt-1">
            Supervisión y administración en tiempo real del estado operativo de los usuarios.
          </p>
        </div>
        <button
          onClick={refreshUsers}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 shadow-xs"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Actualizar Datos
        </button>
      </div>

      <UserStatusMetrics metrics={metrics} />

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {(error || actionError) && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm flex items-center gap-2 animate-in fade-in duration-200">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>{actionError || error}</span>
        </div>
      )}

      <UserStatusFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedStatusFilter={selectedStatusFilter}
        onStatusFilterChange={setSelectedStatusFilter}
        selectedRoleFilter={selectedRoleFilter}
        onRoleFilterChange={setSelectedRoleFilter}
      />

      <UserStatusTable
        users={filteredUsers}
        loading={loading}
        getFullName={getFullName}
        roleLabels={roleLabels}
        onRequestStatusChange={handleRequestStatusChange}
      />

      <UserStatusModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmStatusChange}
        user={targetUser}
        targetStatus={targetStatus}
        isSubmitting={isSubmitting}
        getFullName={getFullName}
      />
    </div>
  );
};