// =========================================================================
// ARCHIVO: apps/web/src/core/auth/components/LoginForm.tsx
// DESCRIPCIÓN: Formulario de Login con protección anti-bot Cloudflare Turnstile.
// =========================================================================

import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Turnstile } from '@marsidev/react-turnstile'; // 👈 1. Importamos el componente Turnstile

interface LoginFormProps {
  onSwitchToRegister?: () => void;
  onSubmit?: (data: LoginFormData) => void;
}

export interface LoginFormData {
  email: string;
  password: string;
  turnstileToken: string; // 👈 2. Añadimos el token al tipo de datos enviados
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister, onSubmit }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string>(''); // Estado para almacenar el token
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Obtenemos la llave pública desde las variables de entorno de Vite
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || '0x4AAAAAAD8UiAMMNgACfaXJ';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verificación rápida en cliente
    if (!turnstileToken) {
      alert('Por favor, espera a que se complete la verificación de seguridad anti-bot.');
      return;
    }

    if (onSubmit) {
      onSubmit({
        ...formData,
        turnstileToken, // 👈 3. Incluimos el token en la petición
      });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* TÍTULO Y SUBTÍTULO (Centrado en móviles, alineado a la izquierda en pantallas grandes) */}
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
        
        {/* CORREO ELECTRÓNICO */}
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
            Correo Electrónico <span className="text-rose-600 font-bold">*</span>
          </label>
          <div className="relative">
            <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
            <input
              type="email"
              required
              placeholder="ejemplo@medicos.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 focus:outline-hidden transition-all duration-200"
            />
          </div>
        </div>

        {/* CONTRASEÑA */}
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
            Contraseña <span className="text-rose-600 font-bold">*</span>
          </label>
          <div className="relative">
            <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 focus:outline-hidden transition-all duration-200"
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

        {/* 🆕 WIDGET ANTI-BOT TURNSTILE DE CLOUDFLARE */}
        <div className="flex justify-center py-1">
          <Turnstile
            siteKey={siteKey}
            onSuccess={(token) => setTurnstileToken(token)}
            onExpire={() => setTurnstileToken('')}
            onError={() => setTurnstileToken('')}
          />
        </div>

        {/* BOTÓN ENTRAR A LA PLATAFORMA */}
        <button
          type="submit"
          disabled={!turnstileToken}
          className="w-full mt-2 py-3 px-4 bg-[#0e7490] hover:bg-[#0891b2] disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer active:scale-[0.99]"
        >
          <span>Entrar a la Plataforma</span>
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
        </button>

        {/* BOTÓN INICIAR CON GOOGLE */}
        <button
          type="button"
          className="w-full py-3 px-4 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-sm rounded-xl transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer shadow-xs active:scale-[0.99]"
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

        {/* PIE DE PÁGINA */}
        <p className="text-xs text-slate-600 text-center pt-2 font-medium">
          © 2026 MedicOS. Acceso restringido para personal autorizado.
        </p>

      </form>
    </div>
  );
};