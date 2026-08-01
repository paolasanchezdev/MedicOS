// =========================================================================
// ARCHIVO: apps/web/src/modules/auth/pages/Register.tsx
// =========================================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RegisterForm, type RegisterFormData } from '../../../core/auth/components/RegisterForm';
import { authService } from '../../../core/auth/auth.service';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleRegisterSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    setError(null);

    try {
      // 🚀 Petición real al backend enviando los datos del formulario
      const response = await authService.registerPatient(data as unknown as Record<string, string>);

      // Tipado explícito para evaluar la respuesta sin usar 'any'
      const res = response as unknown as { success?: boolean; ok?: boolean; message?: string };

      if (res.success || res.ok) {
        alert('¡Usuario registrado con éxito!');
        navigate('/login');
      } else {
        setError(res.message || 'Ocurrió un error al registrar');
      }
    } catch (err: unknown) {
      console.error('Error al registrar:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('No se pudo conectar con el servidor');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <div className="p-3 mb-3 text-sm text-rose-700 bg-rose-100 rounded-xl text-center font-medium">
          {error}
        </div>
      )}
      {loading && (
        <div className="p-2 mb-2 text-sm text-teal-700 text-center font-semibold animate-pulse">
          Guardando en la base de datos...
        </div>
      )}
      <RegisterForm 
        onSwitchToLogin={() => navigate('/login')} 
        onSubmit={handleRegisterSubmit}
      />
    </div>
  );
};