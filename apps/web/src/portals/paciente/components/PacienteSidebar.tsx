import React from 'react';
import { NavLink } from 'react-router-dom';
import { X } from 'lucide-react';
import { PACIENTE_NAVIGATION } from '../navigation/paciente.navigation';

interface PacienteSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PacienteSidebar: React.FC<PacienteSidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Backdrop para móviles */}
      {isOpen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Contenedor del Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-72 bg-white border-r border-slate-200/80 flex flex-col
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo / Encabezado */}
        <div className="h-16 px-6 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black shadow-xs">
              M
            </div>
            <div>
              <span className="text-base font-black tracking-tight text-slate-900">MedicOS</span>
              <span className="block text-[10px] font-bold text-teal-600 uppercase tracking-widest">Portal Paciente</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lista de Navegación basada en PACIENTE_NAVIGATION */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 custom-scrollbar">
          {PACIENTE_NAVIGATION.map((group, idx) => (
            <div key={idx} className="space-y-1.5">
              <p className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                {group.groupName}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item, itemIdx) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={itemIdx}
                      to={item.path}
                      onClick={onClose}
                      className={({ isActive }) => `
                        flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all
                        ${isActive 
                          ? 'bg-slate-900 text-white shadow-xs font-extrabold' 
                          : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                        }
                      `}
                    >
                      {({ isActive }) => (
                        <>
                          <Icon className={`w-4 h-4 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                          <span className="truncate">{item.label}</span>
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer del Sidebar */}
        <div className="p-4 border-t border-slate-100">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-slate-800 truncate">Sistema Clínico</p>
              <p className="text-[10px] text-slate-500 truncate">Conectado a Base de Datos</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};