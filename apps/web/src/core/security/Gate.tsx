// ARCHIVO: apps/web/src/core/security/Gate.tsx

import React from 'react';
import { useAuth } from '../context/useAuth';
import {
  permissionManager,
  UserRole,
  type UserRoleType,
  type AppPermissionType,
} from '../permissions/roles';

interface GateProps {
  permission: AppPermissionType;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Normaliza y mapea roles provenientes de la API a los tipos oficiales de UserRole.
 */
const normalizeRole = (role: string): UserRoleType | null => {
  const upperRole = role?.toUpperCase();

  if (upperRole === UserRole.ADMIN) return UserRole.ADMIN;
  if (upperRole === UserRole.PACIENTE || upperRole === 'PATIENT' || upperRole === 'PACIENTE') return UserRole.PACIENTE;
  if (upperRole === UserRole.BRIGADISTA || upperRole === 'BRIGADIST') return UserRole.BRIGADISTA;
  if (upperRole === UserRole.DOCTOR) return UserRole.DOCTOR;
  if (upperRole === UserRole.AUTORIDADES_DE_SALUD || upperRole === 'AUTORIDAD_SALUD' || upperRole === 'AUTHORITY') return UserRole.AUTORIDADES_DE_SALUD;

  return null;
};

export const Gate: React.FC<GateProps> = ({ permission, children, fallback = null }) => {
  const { user } = useAuth();

  if (!user || !user.role) {
    return <>{fallback}</>;
  }

  const normalizedRole = normalizeRole(user.role);

  if (!normalizedRole) {
    console.warn(`[Gate]: El usuario tiene un rol desconocido o deshabilitado: "${user.role}"`);
    return <>{fallback}</>;
  }

  const hasAccess = permissionManager.hasPermission(normalizedRole, permission);

  return hasAccess ? <>{children}</> : <>{fallback}</>;
};