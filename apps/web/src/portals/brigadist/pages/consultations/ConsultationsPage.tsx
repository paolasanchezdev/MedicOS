import React from 'react';
import { ClipboardList } from 'lucide-react';

export const ConsultationsPage: React.FC = () => {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-black text-slate-900">Consultas Médicas</h2>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Historial y toma de signos vitales en triaje.</p>
      </div>

      <div className="bg-white p-12 rounded-2xl border border-slate-200/80 text-center">
        <ClipboardList className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <p className="text-sm font-bold text-slate-700">Registro de Consultas y Triaje</p>
        <p className="text-xs text-slate-400 mt-1">Aquí se llenarán las fichas médicas de atención rápida.</p>
      </div>
    </div>
  );
};

export default ConsultationsPage;