// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/educacion-ia/consejos-personalizados/components/ArticulosSugeridosBanner.tsx
// DESCRIPCIÓN: Conexión formativa entre Consejos Personalizados y Artículos Educativos.
// =========================================================================

import React from 'react';
import { BookOpen, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ArticulosSugeridosBanner: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="group bg-linear-to-r from-slate-900 via-slate-800 to-teal-950 rounded-2xl border border-slate-700/60 p-5 sm:p-6 text-white shadow-sm hover:shadow-md transition-all duration-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 select-none">
      <div className="space-y-1.5 max-w-2xl">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[11px] font-bold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Biblioteca de Salud MedicOS</span>
        </div>

        <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
          Aprende a profundidad con nuestros Artículos Educativos
        </h3>

        <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
          Complementa tus consejos diarios con guías validadas sobre esquemas preventivos de vacunación, hidratación en clima cálido y preparación para tus consultas clínicas.
        </p>
      </div>

      <button
        type="button"
        onClick={() => navigate('/paciente/educacion-ia/articulos')}
        className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm group/btn"
      >
        <span>Explorar artículos</span>
        <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
      </button>
    </div>
  );
};

export default ArticulosSugeridosBanner;