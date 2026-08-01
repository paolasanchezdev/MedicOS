// apps/web/src/app/router/protectedRoutes.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../core/context/useAuth';

interface ProtectedRouteProps {
  allowedRoles?: string[];
  redirectPath?: string;
  children?: React.ReactNode;
}

// Mapa de ruta principal según el rol del usuario en MedicOS
const ROLE_HOME_MAP: Record<string, string> = {
  ADMIN: '/admin/dashboard/resumen',
  PATIENT: '/paciente/dashboard/resumen',
  PACIENTE: '/paciente/dashboard/resumen',
  BRIGADIST: '/brigadista/dashboard',
  BRIGADISTA: '/brigadista/dashboard',
  DOCTOR: '/doctor/dashboard',
  AUTHORITY: '/autoridad/dashboard',
  AUTORIDAD: '/autoridad/dashboard',
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  redirectPath = '/login',
  children,
}) => {
  const { user, isAuthenticated } = useAuth();

  // 1. Si no hay sesión activa, va al Login
  if (!isAuthenticated || !user) {
    return <Navigate to={redirectPath} replace />;
  }

  // 2. Validación de roles
  if (allowedRoles && allowedRoles.length > 0) {
    const hasRole = allowedRoles.some(
      (role) => role.toUpperCase() === user.role?.toUpperCase()
    );

    if (!hasRole) {
      const userRoleKey = user.role?.toUpperCase();
      const defaultHome = ROLE_HOME_MAP[userRoleKey] || redirectPath;
      return <Navigate to={defaultHome} replace />;
    }
  }

  // 3. Si todo está correcto, renderiza la ruta o hijos
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;