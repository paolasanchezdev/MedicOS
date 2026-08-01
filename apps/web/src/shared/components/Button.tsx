// =========================================================================
// ARCHIVO: apps/web/src/core/components/Button.tsx
// DESCRIPCIÓN: Componente de botón interactivo y reutilizable.
//              Maneja variantes visuales integradas con la paleta de MedicOS,
//              un micro-efecto táctil (active:scale) y un estado de carga animado.
// =========================================================================

import React from 'react';

// =========================================================================
// INTERFAZ DE PROPIEDADES (Props)
// Extendemos todas las propiedades nativas que tiene un <button> común en HTML.
// =========================================================================
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // Define el estilo visual del botón (por defecto es 'primary')
  variant?: 'primary' | 'secondary' | 'danger';
  // Si es true, el botón se bloquea y muestra una animación de carga (spinner)
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  loading, 
  className = '', 
  ...props // Recolecta propiedades como onClick, type, form, etc.
}) => {
  
  // 1. Estilos base que comparten absolutamente todos los botones para mantener la consistencia
  const baseStyles = "w-full py-3 px-4 font-bold rounded-lg shadow-md transition-all duration-300 transform active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex justify-center items-center gap-2";
  
  // 2. Diccionario de variantes visuales que utiliza tus clases de Tailwind CSS
  const variants = {
    primary: "bg-medicos-teal hover:bg-medicos-dark-blue text-white",
    secondary: "bg-medicos-soft-blue hover:bg-medicos-cyan/40 text-medicos-teal border border-medicos-cyan/30",
    danger: "bg-red-500 hover:bg-red-600 text-white"
  };

  return (
    <button
      {...props}
      // Se deshabilita si está cargando o si el desarrollador lo deshabilitó manualmente
      disabled={loading || props.disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {loading ? (
        // Renderizado condicional: si está cargando, mostramos el círculo giratorio (spinner)
        <span className="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent"></span>
      ) : (
        // Si no está cargando, mostramos el texto o elementos internos del botón
        children
      )}
    </button>
  );
};