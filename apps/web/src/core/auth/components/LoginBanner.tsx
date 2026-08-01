// =========================================================================
// ARCHIVO: apps/web/src/core/auth/components/LoginBanner.tsx
// DESCRIPCIÓN: Panel lateral con transiciones ultraligeras, fluidas y orgánicas.
// =========================================================================

import React from 'react';
import { ShieldCheck, Calendar, FileText, HeartPulse, QrCode } from 'lucide-react';

interface LoginBannerProps {
  mode: 'login' | 'register';
}

export const LoginBanner: React.FC<LoginBannerProps> = ({ mode }) => {
  return (
    <div className="hidden lg:flex lg:col-span-5 relative flex-col justify-between p-6 lg:p-8 bg-[#283342] text-left select-none overflow-hidden border-r border-white/5 h-full">
      
      {/* ESPACIO SUPERIOR / HEADER LIMPIO */}
      <div className="h-4 z-10">
        {mode === 'register' && (
          <span className="text-xs font-bold text-teal-400 tracking-wider uppercase">
            Medic<span className="text-white">OS</span>
          </span>
        )}
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="relative my-auto py-1">
        
        {/* ========================================== */}
        {/* VISTA 1: LOGIN (CÓDIGO QR)                 */}
        {/* ========================================== */}
        <div 
          className={`transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col items-center text-center ${
            mode === 'login' 
              ? 'opacity-100 scale-100 translate-y-0 relative z-10' 
              : 'opacity-0 scale-95 -translate-y-2 absolute inset-0 pointer-events-none'
          }`}
        >
          {/* Tarjeta Blanca del QR compacta */}
          <div className="w-40 h-40 lg:w-44 lg:h-44 bg-white rounded-[28px] p-4 shadow-xl mb-4 flex items-center justify-center">
            
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* 1. MARCADOR SUPERIOR IZQUIERDO */}
              <rect x="6" y="6" width="28" height="28" rx="8" fill="none" stroke="#0f172a" strokeWidth="5" />
              <rect x="13.5" y="13.5" width="13" height="13" rx="4" fill="#0f172a" />

              {/* 2. MARCADOR SUPERIOR DERECHO */}
              <rect x="66" y="6" width="28" height="28" rx="8" fill="none" stroke="#0f172a" strokeWidth="5" />
              <rect x="73.5" y="13.5" width="13" height="13" rx="4" fill="#0f172a" />

              {/* 3. MARCADOR INFERIOR IZQUIERDO */}
              <rect x="6" y="66" width="28" height="28" rx="8" fill="none" stroke="#0f172a" strokeWidth="5" />
              <rect x="13.5" y="73.5" width="13" height="13" rx="4" fill="#0f172a" />

              {/* 4. BADGE CENTRAL CON 'M' */}
              <rect x="38" y="38" width="24" height="24" rx="7" fill="#0e7490" />
              <text 
                x="50" 
                y="55" 
                textAnchor="middle" 
                fill="white" 
                fontSize="14" 
                fontWeight="900" 
                fontFamily="system-ui, sans-serif"
              >
                M
              </text>

              {/* 5. CONECTORES EN CRUZ */}
              <rect x="47" y="28" width="6" height="8" rx="3" fill="#0f172a" />
              <rect x="47" y="64" width="6" height="8" rx="3" fill="#0f172a" />
              <rect x="28" y="47" width="8" height="6" rx="3" fill="#0f172a" />
              <rect x="64" y="47" width="8" height="6" rx="3" fill="#0f172a" />

              {/* 6. PUNTOS Y MÓDULOS */}
              <circle cx="50" cy="11" r="3.5" fill="#0f172a" />
              <circle cx="50" cy="20" r="3.5" fill="#0f172a" />

              <circle cx="20" cy="43" r="3.5" fill="#0f172a" />
              <circle cx="20" cy="52" r="3.5" fill="#0f172a" />

              <circle cx="80" cy="43" r="3.5" fill="#0f172a" />
              <circle cx="80" cy="52" r="3.5" fill="#0f172a" />

              <path 
                d="M 66 68 H 82 A 6 6 0 0 1 88 74 V 86" 
                fill="none" 
                stroke="#0f172a" 
                strokeWidth="5" 
                strokeLinecap="round" 
              />
              <circle cx="70" cy="83" r="3.5" fill="#0f172a" />
            </svg>

          </div>

          {/* TÍTULO CON ÍCONO */}
          <div className="flex items-center gap-2 mb-1">
            <QrCode size={15} className="text-slate-300" />
            <h3 className="text-sm lg:text-base font-bold text-white tracking-tight">
              Inicia sesión con código QR
            </h3>
          </div>

          {/* DESCRIPCIÓN */}
          <p className="text-[11px] lg:text-xs text-slate-300 leading-relaxed max-w-60 font-normal">
            Escanea este código desde la App Móvil de <span className="text-teal-400 font-semibold">MedicOS</span> para entrar al instante sin contraseña.
          </p>
        </div>

        {/* ========================================== */}
        {/* VISTA 2: REGISTRO (BENEFICIOS PACIENTE)    */}
        {/* ========================================== */}
        <div 
          className={`transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            mode === 'register' 
              ? 'opacity-100 scale-100 translate-y-0 relative z-10' 
              : 'opacity-0 scale-95 translate-y-2 absolute inset-0 pointer-events-none'
          }`}
        >
          <span className="text-[10px] font-bold text-teal-400 tracking-widest uppercase block mb-1">
            Portal del Paciente
          </span>
          <h3 className="text-base lg:text-lg font-bold text-white tracking-tight mb-4">
            Tu Salud en un Solo Lugar
          </h3>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-white/10 text-teal-300 border border-white/10 shrink-0">
                <Calendar size={16} />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Citas en Línea</h4>
                <p className="text-[11px] text-slate-300 leading-normal font-normal">
                  Agenda y gestiona tus consultas de forma rápida.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-white/10 text-teal-300 border border-white/10 shrink-0">
                <FileText size={16} />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Historial y Recetas</h4>
                <p className="text-[11px] text-slate-300 leading-normal font-normal">
                  Acceso inmediato a tu expediente médico digital.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-white/10 text-teal-300 border border-white/10 shrink-0">
                <HeartPulse size={16} />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Carnet Digital</h4>
                <p className="text-[11px] text-slate-300 leading-normal font-normal">
                  Obtén tu QR de identificación al registrarte.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* FOOTER */}
      <div className="pt-3 border-t border-white/10 z-10">
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-300 font-normal">
          <ShieldCheck size={14} className="text-teal-400 shrink-0" />
          <span>Conexión cifrada de extremo a extremo</span>
        </div>
      </div>

    </div>
  );
};