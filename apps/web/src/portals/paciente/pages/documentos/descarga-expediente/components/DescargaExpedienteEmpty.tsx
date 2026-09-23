import React from 'react';
import { FolderOpen } from 'lucide-react';

export const DescargaExpedienteEmpty: React.FC = () => (
  <div className="w-full max-w-md mx-auto p-8 my-12 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-3 select-none">
    <FolderOpen className="w-10 h-10 text-slate-400 mx-auto" />
    <h3 className="text-base font-black text-slate-800">Expediente no encontrado</h3>
    <p className="text-xs text-slate-500">No se detectaron registros clínicos asociados a esta cuenta.</p>
  </div>
);

export default DescargaExpedienteEmpty;