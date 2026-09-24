// =========================================================================
// ARCHIVO: PreferenciaToggle.tsx
// DESCRIPCIÓN: Switch estilo iOS minimalista con color #166E7A.
// =========================================================================

import React from 'react';

interface PreferenciaToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
}

export const PreferenciaToggle: React.FC<PreferenciaToggleProps> = ({
  checked,
  onChange,
  disabled = false,
  label,
}) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-hidden cursor-pointer ${
        disabled
          ? 'opacity-40 cursor-not-allowed bg-slate-200'
          : checked
          ? 'bg-[#166E7A]'
          : 'bg-[#D3E8EC]'
      }`}
      title={label || (checked ? 'Desactivar' : 'Activar')}
    >
      <span
        className={`inline-block h-5.5 w-5.5 transform rounded-full bg-white shadow-xs transition-transform duration-200 ${
          checked ? 'translate-x-5.5' : 'translate-x-1'
        }`}
      />
    </button>
  );
};

export default PreferenciaToggle;