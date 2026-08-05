// =========================================================================
// ARCHIVO: apps/web/src/modules/auth/pages/Login.tsx
// DESCRIPCIÓN: Página principal de Autenticación (Login / Registro de Pacientes)
// =========================================================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { LoginBanner } from '../components/LoginBanner';
import { LoginForm, type LoginFormData } from '../components/LoginForm';
import { RegisterForm, type RegisterFormData } from '../components/RegisterForm';
import { authService } from '../services/auth.service';

export const Login: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Redirección directa según el rol del usuario a los portales reales
  const redirectByUserRole = (role?: string) => {
    const userRole = role?.toUpperCase();
    console.log("Rol detectado para redirección:", userRole);

    switch (userRole) {
      case 'ADMIN':
        window.location.href = '/admin/dashboard/resumen';
        break;
      case 'BRIGADIST':
      case 'BRIGADISTA':
        window.location.href = '/brigadista';
        break;
      case 'DOCTOR':
        window.location.href = '/doctor';
        break;
      case 'AUTHORITY':
      case 'AUTORIDAD':
        window.location.href = '/autoridad';
        break;
      case 'PATIENT':
      case 'PACIENTE':
      default:
        window.location.href = '/paciente/dashboard/resumen';
        break;
    }
  };

  // 1. INICIO DE SESIÓN
  const handleLoginSubmit = async (data: LoginFormData, e?: { preventDefault?: () => void }) => {
    if (e?.preventDefault) {
      e.preventDefault();
    }

    console.log("1. Intentando iniciar sesión con:", data.email);
    setLoading(true);
    setError(null);

    try {
      console.log("2. Enviando petición a authService.login...");
      const response = await authService.login(data.email, data.password, data.turnstileToken);
      console.log("3. Respuesta completa del servidor:", response);
      
      if (response?.token) {
        localStorage.setItem('token', response.token);
      }
      if (response?.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('role', response.user.role);
      }

      redirectByUserRole(response?.user?.role);

    } catch (err: unknown) {
      console.error('❌ ERROR CRÍTICO DETALLADO:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Credenciales incorrectas o problemas de conexión.');
      }
    } finally {
      setLoading(false);
    }
  };

  // 2. REGISTRO DE PACIENTE
  const handleRegisterSubmit = async (data: RegisterFormData, e?: { preventDefault?: () => void }) => {
    if (e?.preventDefault) {
      e.preventDefault();
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const payload = {
        ...data,
        email: data.email || (data as unknown as Record<string, string>).correo || (data as unknown as Record<string, string>).correoElectronico,
        password: data.password || (data as unknown as Record<string, string>).contrasena || (data as unknown as Record<string, string>).contraseña,
        primerNombre: data.primerNombre || (data as unknown as Record<string, string>).firstName,
        segundoNombre: data.segundoNombre || '',
        primerApellido: data.primerApellido || (data as unknown as Record<string, string>).lastName,
        segundoApellido: data.segundoApellido || '',
        firstName: data.primerNombre,
        lastName: data.primerApellido,
        telefono: data.telefono,
        phone: data.telefono,
        turnstileToken: data.turnstileToken,
        turnstile_token: data.turnstileToken,
        'cf-turnstile-response': data.turnstileToken,
      };

      console.log("📦 Enviando payload de registro al backend:", payload);

      const regResponse = await authService.registerPatient(
        payload as unknown as Record<string, string>
      );

      let loggedUser = regResponse?.user;

      if (!loggedUser) {
        try {
          const loginResponse = await authService.login(payload.email, payload.password);
          if (loginResponse?.token) {
            localStorage.setItem('token', loginResponse.token);
          }
          if (loginResponse?.user) {
            loggedUser = loginResponse.user;
          }
        } catch (loginErr) {
          console.warn("Auto-login no completado automáticamente, se solicitará ingresar manual:", loginErr);
        }
      }

      if (loggedUser) {
        localStorage.setItem('user', JSON.stringify(loggedUser));
        localStorage.setItem('role', loggedUser.role || 'PATIENT');
      }

      setSuccessMessage('¡Cuenta registrada exitosamente! Redirigiendo...');

      setTimeout(() => {
        if (loggedUser) {
          redirectByUserRole(loggedUser.role);
        } else {
          setSuccessMessage(null);
          setMode('login');
        }
      }, 1800);

    } catch (err: unknown) {
      console.error('Error durante el registro:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('No se pudo completar el registro. Inténtalo de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 h-screen w-screen overflow-hidden bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center select-none p-4 sm:p-6 lg:p-8"
      style={{
        backgroundImage: `url('/bg-medicos.png')`,
      }}
    >
      <header className="absolute top-6 left-6 right-6 lg:top-8 lg:left-12 lg:right-12 z-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-2xl bg-white/85 backdrop-blur-md border border-white/90 shadow-md flex items-center justify-center p-2.5 transition-transform duration-200 group-hover:scale-105">
            <img 
              src="/logo-sinNombre.png" 
              alt="MedicOS Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <span className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-slate-900 block leading-none">
              Medic<span className="text-[#0e7490]">OS</span>
            </span>
            <span className="text-[10px] sm:text-xs font-semibold text-slate-500 tracking-wide block mt-1">
              Sistema de Gestión en Salud
            </span>
          </div>
        </Link>

        <Link 
          to="/" 
          className="flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl bg-white/80 backdrop-blur-md border border-white/80 shadow-sm text-slate-700 hover:text-[#0e7490] hover:bg-white text-xs font-semibold transition-all duration-200 active:scale-95"
        >
          <ArrowLeft size={16} />
          <span className="hidden sm:inline">Volver al inicio</span>
          <span className="sm:hidden">Volver</span>
        </Link>
      </header>

      <main className="w-full max-w-5xl bg-white rounded-[28px] overflow-hidden grid grid-cols-1 lg:grid-cols-12 z-10 border border-white/80 shadow-[0_32px_64px_-12px_rgba(15,23,42,0.22)] my-auto">
        <div className="lg:col-span-5 h-full">
          <LoginBanner mode={mode} />
        </div>

        <div className="lg:col-span-7 relative bg-white flex flex-col justify-center overflow-hidden">
          <div 
            className="flex w-[200%] transition-transform duration-500 ease-in-out"
            style={{
              transform: mode === 'register' ? 'translateX(-50%)' : 'translateX(0%)'
            }}
          >
            <div className="w-1/2 shrink-0 p-6 sm:p-8 lg:p-10 max-h-[75vh] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {error && mode === 'login' && (
                <div className="p-3 mb-4 text-xs font-bold text-rose-700 bg-rose-100 rounded-xl text-center border border-rose-200">
                  {error}
                </div>
              )}
              {loading && mode === 'login' && (
                <div className="p-2 mb-3 text-xs font-bold text-teal-700 text-center animate-pulse">
                  Verificando credenciales e ingresando...
                </div>
              )}
              <LoginForm 
                onSwitchToRegister={() => { setError(null); setSuccessMessage(null); setMode('register'); }} 
                onSubmit={handleLoginSubmit}
              />
            </div>

            <div className="w-1/2 shrink-0 p-6 sm:p-8 lg:p-10 max-h-[75vh] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {successMessage && (
                <div className="p-3.5 mb-4 text-xs font-bold text-emerald-800 bg-emerald-50 rounded-2xl text-center border border-emerald-200 flex items-center justify-center gap-2 shadow-sm animate-fade-in">
                  <CheckCircle2 size={18} className="text-emerald-600 animate-bounce" />
                  <span>{successMessage}</span>
                </div>
              )}

              {error && mode === 'register' && (
                <div className="p-3 mb-4 text-xs font-bold text-rose-700 bg-rose-100 rounded-xl text-center border border-rose-200">
                  {error}
                </div>
              )}

              {loading && mode === 'register' && !successMessage && (
                <div className="p-2 mb-3 text-xs font-bold text-teal-700 text-center animate-pulse">
                  Creando cuenta e ingresando...
                </div>
              )}

              <RegisterForm 
                onSwitchToLogin={() => { setError(null); setSuccessMessage(null); setMode('login'); }} 
                onSubmit={handleRegisterSubmit}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;