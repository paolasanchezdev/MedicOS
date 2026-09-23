import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface DescargaExpedienteErrorProps {
  message: string;
  onRetry: () => void;
}

export const DescargaExpedienteError: React.FC<DescargaExpedienteErrorProps> = ({ message, onRetry }) => (
  <div className="w-full max-w-xl mx-auto p-8 my-12 bg-rose-50 border border-rose-200 rounded-2xl text-center space-y-4 select-none">
    <AlertCircle className="w-10 h-10 text-rose-600 mx-auto" />
    <h3 className="text-base font-black text-rose-900">Error al cargar el expediente clínico</h3>
    <p className="text-xs text-rose-700 font-medium">{message}</p>
    <button
      type="button"
      onClick={onRetry}
      className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition cursor-pointer"
    >
      <RotateCcw className="w-3.5 h-3.5" />
      <span>Reintentar conexión</span>
    </button>
  </div>
);

export default DescargaExpedienteError;