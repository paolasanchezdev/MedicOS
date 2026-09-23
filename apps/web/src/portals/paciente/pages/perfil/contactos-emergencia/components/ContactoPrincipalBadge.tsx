// =========================================================================
// ARCHIVO: ContactoPrincipalBadge.tsx
// DESCRIPCIÓN: Distintivo discreto de contacto principal (sin colores de alarma).
// =========================================================================

import React from 'react';

interface ContactoPrincipalBadgeProps {
  className?: string;
}

export const ContactoPrincipalBadge: React.FC<ContactoPrincipalBadgeProps> = ({ className = '' }) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EEF7F8] text-[#166E7A] border border-[#D3E8EC] text-xs font-semibold select-none ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[#166E7A]" />
      <span>Principal</span>
    </span>
  );
};

export default ContactoPrincipalBadge;