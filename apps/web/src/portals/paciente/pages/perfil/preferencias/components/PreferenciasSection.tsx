// =========================================================================
// ARCHIVO: PreferenciasSection.tsx
// DESCRIPCIÓN: Superficie agrupada estilo Apple Settings (borde fino #D3E8EC).
// =========================================================================

import React from 'react';

interface PreferenciasSectionProps {
  title?: string;
  description?: string;
  footerNote?: string;
  children: React.ReactNode;
}

export const PreferenciasSection: React.FC<PreferenciasSectionProps> = ({
  title,
  description,
  footerNote,
  children,
}) => {
  return (
    <div className="space-y-2 w-full">
      {title ? (
        <div className="px-1 space-y-0.5">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
            {title}
          </h3>
          {description ? (
            <p className="text-xs text-slate-400 font-normal">{description}</p>
          ) : null}
        </div>
      ) : null}

      <div className="rounded-2xl bg-white border border-[#D3E8EC] overflow-hidden divide-y divide-[#D3E8EC] shadow-2xs">
        {children}
      </div>

      {footerNote ? (
        <p className="px-2 text-[11px] text-slate-400 leading-snug">
          {footerNote}
        </p>
      ) : null}
    </div>
  );
};

export default PreferenciasSection;