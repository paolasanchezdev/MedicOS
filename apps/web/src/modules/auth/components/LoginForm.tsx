// =========================================================================
// ARCHIVO: apps/web/src/modules/auth/components/LoginForm.tsx
// DESCRIPCIÓN: Formulario de Login con prevención de multi-clic y Turnstile blindado.
// =========================================================================

import React, { useState, useRef, useCallback } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';

interface LoginFormProps {
  loading?: boolean;
  onSwitchToRegister?: () => void;
  onSubmit?: (data: LoginFormData) => void;
}

export interface LoginFormData {
  email: string;
  password: string;
  turnstileToken: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({ 
  loading = false, 
  onSwitchToRegister, 
  onSubmit 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string>('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const turnstileRef = useRef<TurnstileInstance | null>(null);
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || '0x4AAAAAAD8UiAMMNgACfaXJ';

  const handleTurnstileSuccess = useCallback((token: string) => {
    setTurnstileToken(token);
  }, []);

  const handleTurnstileReset = useCallback(() => {
    setTurnstileToken('');
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;

    if (!turnstileToken) {
      alert('Por favor, espera a que se complete la verificación de seguridad anti-bot.');
      return;
    }

    const currentToken = turnstileToken;

    // Resetea el token local y el widget para el siguiente ciclo
    setTurnstileToken('');
    turnstileRef.current?.reset();

    if (onSubmit) {
      onSubmit({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        turnstileToken: currentToken,
      });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-6 text-center sm:text-left">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          Iniciar Sesión
        </h2>
        <p className="text-sm text-slate-700 font-medium mt-1">
          ¿No tienes cuenta?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-teal-700 font-bold hover:text-teal-800 underline focus:outline-hidden cursor-pointer ml-1"
          >
            Regístrate como paciente
          </button>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        {/* Correo Electrónico */}
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
            Correo Electrónico <span className="text-rose-600 font-bold">*</span>
          </label>
          <div className="relative">
            <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
            <input
              type="email"
              required
              disabled={loading}
              placeholder="ejemplo@medicos.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 focus:outline-hidden transition-all duration-200 disabled:opacity-60"
            />
          </div>
        </div>

        {/* Contraseña */}
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
            Contraseña <span className="text-rose-600 font-bold">*</span>
          </label>
          <div className="relative">
            <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              disabled={loading}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 focus:outline-hidden transition-all duration-200 disabled:opacity-60"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-900 focus:outline-hidden cursor-pointer"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Widget Turnstile */}
        <div className="flex justify-center py-1 min-h-[65px]">
          <Turnstile
            ref={turnstileRef}
            siteKey={siteKey}
            onSuccess={handleTurnstileSuccess}
            onExpire={handleTurnstileReset}
            onError={handleTurnstileReset}
          />
        </div>

        {/* Botón de Envío con Bloqueo de Carga */}
        <button
          type="submit"
          disabled={loading || !turnstileToken}
          className="w-full mt-2 py-3 px-4 bg-[#0e7490] hover:bg-[#0891b2] disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer active:scale-[0.99]"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Verificando credenciales...</span>
            </>
          ) : (
            <>
              <span>Entrar a la Plataforma</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
            </>
          )}
        </button>

        {/* Iniciar con Google */}
        <button
          type="button"
          disabled={loading}
          className="w-full py-3 px-4 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-sm rounded-xl transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer shadow-xs active:scale-[0.99] disabled:opacity-60"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Iniciar con Google</span>
        </button>

        <p className="text-xs text-slate-600 text-center pt-2 font-medium">
          © 2026 MedicOS. Acceso restringido para personal autorizado.
        </p>
      </form>
    </div>
  );
};

export default LoginForm;