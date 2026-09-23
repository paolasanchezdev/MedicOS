import React from 'react';

export const DescargaExpedienteLoading: React.FC = () => (
  <div className="w-full max-w-[1700px] mx-auto p-4 space-y-5 animate-pulse select-none">
    <div className="h-36 bg-[#1c5752]/30 rounded-3xl"></div>
    <div className="h-28 bg-slate-200 rounded-2xl"></div>
    <div className="h-44 bg-slate-200 rounded-2xl"></div>
    <div className="h-64 bg-slate-200 rounded-2xl"></div>
  </div>
);

export default DescargaExpedienteLoading;