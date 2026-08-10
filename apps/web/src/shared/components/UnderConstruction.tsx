import React from 'react';
import { useLocation } from 'react-router-dom';
import { Wrench, HardHat, ArrowLeft } from 'lucide-react';

interface UnderConstructionProps {
  title: string;
  category?: string;
  description?: string;
}

export const UnderConstruction: React.FC<UnderConstructionProps> = ({
  title,
  category = 'Módulo MedicOS',
  description = 'Esta sección se encuentra actualmente en fase de desarrollo activo.'
}) => {
  const location = useLocation();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center animate-[fade-in-up_0.5s_ease-out]">
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-2xl bg-medicos-light-bg border border-medicos-soft-border flex items-center justify-center text-medicos-teal shadow-sm">
          <HardHat size={40} className="animate-bounce" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-lg bg-medicos-cyan/20 border border-medicos-soft-border flex items-center justify-center text-medicos-teal">
          <Wrench size={18} />
        </div>
      </div>

      <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-medicos-light-bg text-medicos-teal border border-medicos-soft-border mb-3">
        {category}
      </span>

      <h1 className="text-2xl md:text-3xl font-bold text-medicos-dark-blue mb-2">
        {title}
      </h1>

      <p className="text-medicos-muted max-w-md mb-6 text-sm leading-relaxed">
        {description}
      </p>

      <div className="bg-white border border-medicos-soft-border rounded-lg px-4 py-2 text-xs font-mono text-medicos-teal mb-6 flex items-center gap-2 shadow-sm">
        <span className="text-medicos-muted">Ruta activa:</span>
        <span className="font-semibold">{location.pathname}</span>
      </div>

      <button
        onClick={() => window.history.back()}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-medicos-teal hover:bg-[#115761] text-white text-sm font-medium transition-colors shadow-sm cursor-pointer"
      >
        <ArrowLeft size={16} />
        Regresar
      </button>
    </div>
  );
};