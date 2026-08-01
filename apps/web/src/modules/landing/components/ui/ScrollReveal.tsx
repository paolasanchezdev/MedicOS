// =========================================================================
// COMPONENTE: ScrollReveal.tsx
// DESCRIPCIÓN: Wrapper de animación fade-in-up que se activa cuando el
//              elemento entra en el viewport. Usa IntersectionObserver nativo
//              — sin dependencias externas.
// =========================================================================

import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  /** Contenido a revelar */
  children: React.ReactNode;
  /** Delay en ms antes de iniciar la animación (útil para stagger) */
  delay?: number;
  /** Clases Tailwind adicionales en el wrapper */
  className?: string;
  /** Umbral de intersección (0–1). Default: 0.12 */
  threshold?: number;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  delay = 0,
  className = '',
  threshold = 0.12,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect(); // Solo dispara una vez
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0px)' : 'translateY(28px)',
        transition: `opacity 0.75s ease-out ${delay}ms, transform 0.75s ease-out ${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
