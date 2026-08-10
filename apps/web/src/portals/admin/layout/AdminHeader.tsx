import React from 'react';
import { Bell, User, LogOut } from 'lucide-react';

export const AdminHeader: React.FC = () => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
          Sistema Operativo
        </span>
      </div>

      <div className="flex items-center space-x-4">
        <button className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
          <Bell className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 border-l border-slate-200 pl-4">
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-semibold text-sm">
            <User className="w-4 h-4" />
          </div>
          <div className="text-sm">
            <p className="font-semibold text-slate-800 leading-none">Administrador</p>
            <p className="text-xs text-slate-500 mt-0.5">admin@medicos.gob.sv</p>
          </div>
          <button title="Cerrar sesión" className="p-2 text-slate-400 hover:text-rose-600 rounded-lg transition-colors ml-2">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};