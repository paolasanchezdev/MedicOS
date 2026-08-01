// =========================================================================
// ARCHIVO: apps/web/src/core/auth/components/RegisterForm.tsx
// DESCRIPCIÓN: Formulario de registro con verificación Anti-Bot (Turnstile) integrada.
// =========================================================================

import React, { useState } from 'react';
import { User, Mail, Lock, Phone, CreditCard, Eye, EyeOff, ArrowRight } from 'lucide-react';
// 🚀 NUEVO: Importamos el componente de Turnstile (Asegúrate de que esta importación coincida con la que usas en tu Login)
import { Turnstile } from '@marsidev/react-turnstile';

interface RegisterFormProps {
  onSwitchToLogin?: () => void;
  onSubmit?: (data: RegisterFormData) => void;
}

export interface RegisterFormData {
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  dui: string;
  telefono: string;
  email: string;
  password: string;
  turnstileToken: string; // 🚀 NUEVO: Agregamos el token a la interfaz
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin, onSubmit }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<RegisterFormData>({
    primerNombre: '',
    segundoNombre: '',
    primerApellido: '',
    segundoApellido: '',
    dui: '',
    telefono: '',
    email: '',
    password: '',
    turnstileToken: '', // 🚀 NUEVO: Inicializamos el token vacío
  });

  // AUTO-FORMATO PARA EL DUI (00000000-0)
  const handleDuiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 9) value = value.slice(0, 9);
    
    if (value.length > 8) {
      value = `${value.slice(0, 8)}-${value.slice(8)}`;
    }
    
    setFormData((prev) => ({ ...prev, dui: value }));
  };

  // AUTO-FORMATO PARA EL TELÉFONO (0000-0000)
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 8) value = value.slice(0, 8);

    if (value.length > 4) {
      value = `${value.slice(0, 4)}-${value.slice(4)}`;
    }

    setFormData((prev) => ({ ...prev, telefono: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 🚀 NUEVO: Validamos que el usuario haya resuelto el Turnstile antes de enviar
    if (!formData.turnstileToken) {
      alert('Por favor, completa la verificación de seguridad (Anti-Bot).');
      return;
    }

    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* TÍTULO Y SUBTÍTULO */}
      <div className="mb-4 text-center sm:text-left">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          Crear Cuenta
        </h2>
        <p className="text-sm text-slate-700 font-medium mt-1">
          ¿Ya tienes cuenta?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-teal-700 font-bold hover:text-teal-800 underline focus:outline-hidden cursor-pointer ml-1"
          >
            Inicia Sesión
          </button>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 text-left">
        
        {/* NOMBRES SEPARADOS */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
              Primer Nombre <span className="text-rose-600 font-bold">*</span>
            </label>
            <div className="relative">
              <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
              <input
                type="text"
                required
                placeholder="María"
                value={formData.primerNombre}
                onChange={(e) => setFormData({ ...formData, primerNombre: e.target.value })}
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 focus:outline-hidden transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
              Segundo Nombre
            </label>
            <div className="relative">
              <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
              <input
                type="text"
                placeholder="Alejandra"
                value={formData.segundoNombre}
                onChange={(e) => setFormData({ ...formData, segundoNombre: e.target.value })}
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 focus:outline-hidden transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {/* APELLIDOS SEPARADOS */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
              Primer Apellido <span className="text-rose-600 font-bold">*</span>
            </label>
            <div className="relative">
              <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
              <input
                type="text"
                required
                placeholder="González"
                value={formData.primerApellido}
                onChange={(e) => setFormData({ ...formData, primerApellido: e.target.value })}
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 focus:outline-hidden transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
              Segundo Apellido <span className="text-rose-600 font-bold">*</span>
            </label>
            <div className="relative">
              <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
              <input
                type="text"
                required
                placeholder="Perez"
                value={formData.segundoApellido}
                onChange={(e) => setFormData({ ...formData, segundoApellido: e.target.value })}
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 focus:outline-hidden transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {/* DUI Y TELÉFONO */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
              DUI <span className="text-rose-600 font-bold">*</span>
            </label>
            <div className="relative">
              <CreditCard size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
              <input
                type="text"
                required
                placeholder="00000000-0"
                value={formData.dui}
                onChange={handleDuiChange}
                maxLength={10}
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 focus:outline-hidden transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
              Teléfono <span className="text-rose-600 font-bold">*</span>
            </label>
            <div className="relative">
              <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
              <input
                type="tel"
                required
                placeholder="7000-0000"
                value={formData.telefono}
                onChange={handlePhoneChange}
                maxLength={9}
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 focus:outline-hidden transition-all duration-200"
              />
            </div>
          </div>
        </div>

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
              className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 focus:outline-hidden transition-all duration-200"
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
              minLength={6}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 focus:outline-hidden transition-all duration-200"
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

        {/* 🚀 NUEVO: WIDGET DE CLOUDFLARE TURNSTILE */}
        <div className="flex justify-center my-3">
          <Turnstile
            // Cambia esto si tienes la llave guardada en otra variable de entorno
            siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY || '0x4AAAAAAD8UiAMMNgACfaXJ'} 
            onSuccess={(token) => setFormData((prev) => ({ ...prev, turnstileToken: token }))}
            onError={() => setFormData((prev) => ({ ...prev, turnstileToken: '' }))}
            onExpire={() => setFormData((prev) => ({ ...prev, turnstileToken: '' }))}
          />
        </div>

        {/* BOTÓN DE REGISTRO */}
        <button
          type="submit"
          className="w-full mt-3 py-3 px-4 bg-[#0e7490] hover:bg-[#0891b2] text-white font-bold text-sm rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer active:scale-[0.99]"
        >
          <span>Registrarse</span>
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
        </button>

        {/* AVISO LEGAL */}
        <p className="text-xs text-slate-600 text-center pt-1 font-medium">
          Al registrarte aceptas los Términos de Servicio y Privacidad de MedicOS.
        </p>

      </form>
    </div>
  );
};