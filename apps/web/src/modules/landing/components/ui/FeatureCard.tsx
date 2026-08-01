// =========================================================================
// COMPONENTE: FeatureCard.tsx (Versión Premium — Design System MedicOS)
// DESCRIPCIÓN: Tarjeta de función individual. Fondo blanco, icono con fondo
//              suave institucional (medicos-light-bg / medicos-soft-blue),
//              elevación en hover con isolate para evitar solapamientos.
// =========================================================================

import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  /** Índice de la tarjeta para alternar el color del fondo del ícono */
  index?: number;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon: IconComponent,
  index = 0,
}) => {
  // Alterna entre los dos fondos suaves institucionales para los iconos
  const iconBg = index % 2 === 0 ? 'bg-medicos-light-bg' : 'bg-medicos-soft-blue';

  return (
    /*
      - 'isolate' crea un contexto de apilamiento propio, evitando que la
        sombra elevada de la tarjeta se filtre visualmente sobre sus vecinas.
      - 'hover:z-10' asegura que la tarjeta activa quede encima en el eje Z.
    */
    <div
      className={`
        isolate w-full h-full relative hover:z-10
        p-8 bg-white rounded-2xl
        border border-medicos-soft-blue/40
        shadow-sm
        hover:shadow-xl hover:shadow-medicos-teal/10
        hover:-translate-y-2
        transition-all duration-300 ease-out
        group flex flex-col text-left
        cursor-default
      `}
    >
      {/* Acento de fondo en hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: 'radial-gradient(circle at 20% 20%, #EAF7FB 0%, transparent 65%)' }}
      />

      <div className="relative z-10">
        {/* Ícono con fondo suave alternado */}
        <div
          className={`w-12 h-12 ${iconBg} rounded-xl mb-6 flex items-center justify-center group-hover:bg-medicos-teal transition-all duration-300 shrink-0`}
        >
          <IconComponent className="w-5 h-5 text-medicos-teal group-hover:text-white transition-colors duration-300" />
        </div>

        {/* Título */}
        <h3 className="text-base font-bold text-medicos-dark-blue mb-3 leading-snug">
          {title}
        </h3>

        {/* Descripción */}
        <p className="text-slate-400 text-sm leading-relaxed font-medium">
          {description}
        </p>
      </div>
    </div>
  );
};