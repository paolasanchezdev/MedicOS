// =========================================================================
// ARCHIVO: apps/web/src/shared/components/header/BuscadorHeader.tsx
// DESCRIPCIÓN: Barra de búsqueda visible en todos los tamaños de pantalla.
// =========================================================================

import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

export interface BuscadorHeaderProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (query: string) => void;
  className?: string;
}

export const BuscadorHeader: React.FC<BuscadorHeaderProps> = ({
  placeholder = 'Buscar...',
  value,
  onChange,
  onSubmit,
  className = '',
}) => {
  const [internalQuery, setInternalQuery] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const query = value !== undefined ? value : internalQuery;

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (value === undefined) {
      setInternalQuery(val);
    }
    if (onChange) {
      onChange(val);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed && onSubmit) {
      onSubmit(trimmed);
    }
  };

  const handleClear = () => {
    if (value === undefined) {
      setInternalQuery('');
    }
    if (onChange) {
      onChange('');
    }
    inputRef.current?.focus();
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      if (query) {
        handleClear();
      } else {
        inputRef.current?.blur();
      }
    }
  };

  const isMac =
    typeof window !== 'undefined' &&
    /Mac|iPod|iPhone|iPad/.test(navigator.platform);

  return (
    <form
      onSubmit={handleFormSubmit}
      className={`flex items-center gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-slate-50 border border-slate-200/70 w-full focus-within:bg-white focus-within:border-[#3f8880] focus-within:ring-2 focus-within:ring-[#3f8880]/15 transition-all ${className}`}
    >
      <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 shrink-0" />
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={handleTextChange}
        onKeyDown={handleInputKeyDown}
        placeholder={placeholder}
        className="bg-transparent border-none outline-none text-xs text-slate-800 placeholder:text-slate-400 w-full font-medium min-w-0"
      />
      {query ? (
        <button
          type="button"
          onClick={handleClear}
          className="p-0.5 rounded-full hover:bg-slate-200/60 text-slate-400 hover:text-slate-600 focus:outline-none shrink-0"
          aria-label="Limpiar búsqueda"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      ) : (
        <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-200/60 border border-slate-300/50 rounded select-none pointer-events-none shrink-0">
          {isMac ? '⌘K' : 'Ctrl+K'}
        </kbd>
      )}
    </form>
  );
};

export default BuscadorHeader;