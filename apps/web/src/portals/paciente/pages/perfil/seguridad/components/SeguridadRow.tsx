// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/perfil/seguridad/components/SeguridadRow.tsx
// DESCRIPCIÓN: Fila estándar de seguridad con ícono squircle y acción lateral.
// =========================================================================

import React from 'react';

interface SeguridadRowProps {
  title: string;
  description?: string;
  icon?: React.ElementType;
  iconColor?: string;
  iconBg?: string;
  children: React.ReactNode;
  onClick?: () => void;
  clickable?: boolean;
}

export const SeguridadRow: React.FC<SeguridadRowProps> = ({
  title,
  description,
  icon: Icon,
  iconColor = 'text-[#166E7A]',
  iconBg = 'bg-[#EEF7F8]',
  children,
  onClick,
  clickable = false,
}) => {
  const Component = clickable ? 'button' : 'div';

  return (
    <Component
      type={clickable ? 'button' : undefined}
      onClick={clickable ? onClick : undefined}
      className={`w-full min-h-17 px-4 sm:px-5 py-3.5 flex items-center justify-between gap-4 text-left transition-colors ${
        clickable ? 'hover:bg-slate-50/70 cursor-pointer' : 'bg-white'
      }`}
    >
      <div className="flex items-center gap-3.5 min-w-0 pr-2">
        {Icon ? (
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${iconBg} ${iconColor}`}
          >
            <Icon className="w-4.5 h-4.5 stroke-[2.2]" />
          </div>
        ) : null}

        <div className="min-w-0">
          <h4 className="text-sm font-bold text-slate-800 tracking-tight">
            {title}
          </h4>
          {description ? (
            <p className="text-xs text-slate-400 font-normal leading-relaxed mt-0.5 truncate">
              {description}
            </p>
          ) : null}
        </div>
      </div>

      <div className="shrink-0 flex items-center">
        {children}
      </div>
    </Component>
  );
};

export default SeguridadRow;