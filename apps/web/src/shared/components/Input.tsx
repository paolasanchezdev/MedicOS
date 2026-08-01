// =========================================================================
// ARCHIVO: apps/web/src/core/components/Input.tsx
// DESCRIPCIÓN: Componente de Input reutilizable y accesible para formularios.
//              Soporta etiquetas (labels) animadas, íconos integrados en el lateral,
//              y estados de error personalizados utilizando clases de Tailwind.
// =========================================================================

import React from 'react';

// =========================================================================
// INTERFAZ DE PROPIEDADES (Props)
// Extendemos todas las propiedades nativas de un input de HTML (onChange, value, placeholder, etc.)
// =========================================================================
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // El título o etiqueta que se muestra arriba del campo
  label: string;
  // Ícono opcional (usualmente de lucide-react) que se posiciona a la izquierda del input
  icon?: React.ReactNode;
  // Mensaje de error opcional que cambia el borde a rojo y se muestra debajo del campo
  error?: string;
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  icon, 
  error, 
  className = '', 
  ...props // Recolecta cualquier otra propiedad nativa (type, required, placeholder, value, etc.)
}) => {
  return (
    // Contenedor principal del input con espaciado vertical controlado
    <div className="flex flex-col gap-1.5 w-full">
      
      {/* Etiqueta del campo: Estilo formal en mayúsculas, tamaño compacto y semi-opaco */}
      <label className="text-xs font-bold uppercase tracking-wider text-medicos-dark-blue/80">
        {label}
      </label>
      
      {/* Contenedor relativo que permite posicionar el ícono de forma absoluta */}
      <div className="relative flex items-center">
        {icon && (
          // Ícono posicionado de forma absoluta a la izquierda con color gris neutro
          <span className="absolute left-3 text-gray-400">
            {icon}
          </span>
        )}
        
        {/* Campo de entrada de datos nativo */}
        <input
          {...props} // Inyectamos todas las propiedades nativas aquí
          className={`
            w-full py-2.5 ${icon ? 'pl-10' : 'pl-4'} pr-10 
            bg-gray-50 border rounded-lg text-sm text-medicos-dark-blue placeholder-gray-400 
            focus:outline-none focus:border-medicos-cyan focus:bg-white focus:ring-2 focus:ring-medicos-cyan/20
            transition-all duration-200
            /* Si hay un error, el borde se vuelve rojo. Si no, usa el color gris suave por defecto */
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200'}
            /* Permite concatenar clases adicionales externas si es necesario */
            ${className}
          `}
        />
      </div>
      
      {/* Renderizado condicional del mensaje de error abajo del input */}
      {error && (
        <span className="text-xs text-red-500 mt-1 font-semibold">{error}</span>
      )}
    </div>
  );
};