import React from 'react';
import { Users, UserPlus, Search } from 'lucide-react';

export const PatientsPage: React.FC = () => {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900">Gestión de Pacientes</h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Registro y censo de la comunidad activa.</p>
        </div>
        <button type="button" className="flex items-center gap-2 px-4 py-2 bg-teal-700 text-white text-xs font-bold rounded-xl shadow-2xs hover:bg-teal-800 transition-all">
          <UserPlus className="w-4 h-4" />
          <span>Nuevo Paciente</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input type="text" placeholder="Buscar por DUI, nombre o código..." className="w-full text-xs outline-none text-slate-700 placeholder:text-slate-400" />
      </div>

      <div className="bg-white p-12 rounded-2xl border border-slate-200/80 text-center">
        <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <p className="text-sm font-bold text-slate-700">Módulo de Pacientes en Campo</p>
        <p className="text-xs text-slate-400 mt-1">Aquí listaremos las fichas de filiación y censos locales.</p>
      </div>
    </div>
  );
};

export default PatientsPage;