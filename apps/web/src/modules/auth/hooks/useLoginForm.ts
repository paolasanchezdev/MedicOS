// =========================================================================
// ARCHIVO: apps/web/src/core/auth/hooks/useLoginForm.ts
// DESCRIPCIÓN: Lógica para formulario, autenticación Google y QR.
// =========================================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../core/context/useAuth';
import { apiClient } from '../../../services/api/apiClient';

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

export const useLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await apiClient<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      login(data.token, data.user);

      const userRole = data.user?.role?.toUpperCase();
      if (userRole === 'ADMIN') {
        navigate('/admin/dashboard/resumen');
      } else if (userRole === 'BRIGADIST' || userRole === 'BRIGADISTA') {
        navigate('/brigadista');
      } else if (userRole === 'DOCTOR') {
        navigate('/doctor');
      } else if (userRole === 'AUTHORITY' || userRole === 'AUTORIDAD') {
        navigate('/autoridad');
      } else {
        navigate('/paciente/dashboard/resumen');
      }
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
      window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/auth/google`;
    } catch {
      setError('No se pudo conectar con el servicio de Google.');
      setGoogleLoading(false);
    }
  };

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    toggleShowPassword,
    loading,
    googleLoading,
    error,
    handleLogin,
    handleGoogleLogin,
  };
};