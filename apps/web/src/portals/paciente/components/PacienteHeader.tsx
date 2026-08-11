import React from 'react';
import { Menu, Bell, Search, ShieldCheck } from 'lucide-react';

interface PacienteHeaderProps {
  onOpenSidebar: () => void;
}

export const PacienteHeader: React.FC<PacienteHeaderProps> = ({ onOpenSidebar }) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between shrink-0 sticky top-0 z-30">
      
      {/* Botón menú móvil y buscador */}
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Abrir menú"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/80 w-64 md:w-80">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input 
            type="text" 
            placeholder="Buscar en expediente, citas, recetas..." 
            className="bg-transparent border-none outline-none text-xs text-slate-700 placeholder:text-slate-400 w-full font-medium"
          />
        </div>
      </div>

      {/* Acciones derecha: Seguridad, Notificaciones y Perfil */}
      <div className="flex items-center gap-3">
        
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 border border-teal-100 text-[11px] font-bold">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          <span>Expediente Encriptado</span>
        </div>

        <button className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors border border-slate-200/60">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal-600"></span>
        </button>

        <div className="w-px h-6 bg-slate-200 mx-1"></div>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
            PS
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-black text-slate-900 leading-tight">Karla Sánchez</p>
            <p className="text-[10px] text-slate-500 font-semibold">Paciente</p>
          </div>
        </div>

      </div>
    </header>
  );
};