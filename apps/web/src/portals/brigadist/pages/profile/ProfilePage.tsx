import React from 'react';
import { Settings } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-black text-slate-900">Configuración del Brigadista</h2>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Ajustes de cuenta y preferencias de sincronización offline.</p>
      </div>

      <div className="bg-white p-12 rounded-2xl border border-slate-200/80 text-center">
        <Settings className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <p className="text-sm font-bold text-slate-700">Ajustes del Sistema</p>
        <p className="text-xs text-slate-400 mt-1">Gestión de datos almacenados localmente y sesión.</p>
      </div>
    </div>
  );
};

export default ProfilePage;