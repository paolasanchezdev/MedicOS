import React from 'react';
import { Shield } from 'lucide-react';

export const BrigadePage: React.FC = () => {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-black text-slate-900">Información de la Jornada</h2>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Detalles de la ubicación y equipo asignado.</p>
      </div>

      <div className="bg-white p-12 rounded-2xl border border-slate-200/80 text-center">
        <Shield className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <p className="text-sm font-bold text-slate-700">Detalles de la Brigada</p>
        <p className="text-xs text-slate-400 mt-1">Ubicación, personal médico y logística activa.</p>
      </div>
    </div>
  );
};

export default BrigadePage;