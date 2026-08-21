// =========================================================================
// ARCHIVO: apps/web/src/modules/auth/hooks/useLoginForm.ts
// DESCRIPCIÓN: Hook de autenticación con redirección a /resumen para brigadista.
// =========================================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../core/context/useAuth';
import { authService } from '../services/auth.service';
import type { LoginFormData } from '../components/LoginForm';

const ROLE_REDIRECT_MAP: Record<string, string> = {
  ADMIN: '/admin/dashboard/resumen',
  BRIGADISTA: '/brigadista/dashboard/resumen',
  DOCTOR: '/medico/dashboard/resumen',
  AUTORIDAD: '/autoridad/dashboard/resumen',
  AUTHORITY: '/autoridad/dashboard/resumen',
  PATIENT: '/paciente/dashboard/resumen',
  PACIENTE: '/paciente/dashboard/resumen',
};

export const useLoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (formData: LoginFormData) => {
    setError('');
    setLoading(true);

    try {
      const data = await authService.login(formData.email, formData.password, formData.turnstileToken);
      login(data.token, data.user);

      const userRole = data.user?.role?.toUpperCase() || '';
      const targetPath = ROLE_REDIRECT_MAP[userRole] || '/paciente/dashboard/resumen';

      navigate(targetPath, { replace: true });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocurrió un error inesperado al iniciar sesión.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError('');
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      window.location.href = `${apiUrl}/auth/google`;
    } catch {
      setError('No se pudo conectar con el servicio de Google.');
      setGoogleLoading(false);
    }
  };

  return {
    loading,
    googleLoading,
    error,
    handleLogin,
    handleGoogleLogin,
  };
};