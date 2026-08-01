// =========================================================================
// COMPONENTE: FloatingIcon.tsx
// DESCRIPCIÓN: Ícono 3D genérico con animación suave de rotación y flotación.
//              Ubicado en core/components por ser reutilizable globalmente.
// =========================================================================

import React from 'react';

interface FloatingIconProps {
  src: string;
  alt: string;
}

export const FloatingIcon: React.FC<FloatingIconProps> = ({ src, alt }) => {
  return (
    // Usamos la animación 'float-rotate' definida en index.css
    <div className="animate-float-rotate transition-transform duration-500 hover:scale-105">
      <img src={src} alt={alt} className="w-full h-auto drop-shadow-2xl" />
    </div>
  );
};