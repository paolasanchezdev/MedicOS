/**
 * ProblemSection.tsx
 * 
 * Sección "El Desafío" con soporte de Carrusel táctil (Swipe) en Móvil y Tablet (< lg),
 * y despliegue continuo de 3 columnas en Desktop (>= lg).
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import { problemData } from "../../../data/landingData";
import { ProblemSectionStyles as styles } from "./ProblemSection.styles";

const FALLBACK_IMAGES = [
  "/desafio1.png",
  "/desafio2.png", 
  "/desafio3.png"
];

export interface ProblemItem {
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
}

export const ProblemSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  const timerRef = useRef<number | null>(null);
  const rawItems = problemData as ProblemItem[];

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % rawItems.length);
  }, [rawItems.length]);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + rawItems.length) % rawItems.length);
  }, [rawItems.length]);

  const resetAutoplay = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (isPaused || !rawItems.length) return;

    timerRef.current = window.setInterval(() => {
      nextSlide();
    }, 4500);
  }, [isPaused, rawItems.length, nextSlide]);

  useEffect(() => {
    resetAutoplay();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetAutoplay]);

  const handleSelectDot = (index: number) => {
    setActiveIndex(index);
    resetAutoplay();
  };

  /* Soporte de gestos táctiles (Swipe para iPads y Móviles) */
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 50) {
      nextSlide();
    } else if (distance < -50) {
      prevSlide();
    }
    setTouchStart(null);
    setTouchEnd(null);
    resetAutoplay();
  };

  return (
    <section
      id="desafio"
      aria-labelledby="problem-section-title"
      className={styles.section}
    >
      <div aria-hidden="true" className={styles.topTransition} />
      <div aria-hidden="true" className={styles.ambientGlow} />
      <div aria-hidden="true" className={styles.ambientGlowSecondary} />
      <div aria-hidden="true" className={styles.surfaceAccent} />

      <div className={styles.container}>
        
        {/* COLUMNA IZQUIERDA */}
        <header className={styles.leftColumn}>
          <span className={styles.badge}>
            <span aria-hidden="true" className={styles.badgeDot} />
            El desafío
          </span>

          <h2 id="problem-section-title" className={styles.title}>
            La atención médica no siempre llega donde más se necesita.
          </h2>

          <p className={styles.description}>
            Las brigadas médicas enfrentan comunidades donde la conectividad,
            los registros manuales y la falta de continuidad clínica dificultan
            la atención de calidad.
          </p>

          <div className={styles.contextLine}>
            <span aria-hidden="true" className={styles.contextLineIndicator} />
            <span className={styles.contextLineText}>
              Una realidad que requiere nuevas herramientas.
            </span>
          </div>

          <div className={styles.closingMessage}>
            Cada uno de estos obstáculos limita la continuidad de la atención
            y consume tiempo vital que debería estar dedicado a las personas.
          </div>
        </header>

        {/* COLUMNA DERECHA */}
        <div
          className={styles.rightColumn}
          aria-label="Factores del desafío de salud comunitaria"
        >
          <div className={styles.carouselWrapper}>
            
            <div
              className={styles.gridContainer}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {rawItems.map((item, index) => {
                const formattedIndex = String(index + 1).padStart(2, "0");
                const imageUrl = item.image || FALLBACK_IMAGES[index];
                const isActive = activeIndex === index;

                return (
                  <article
                    key={`${item.title}-${index}`}
                    aria-hidden={!isActive ? "true" : undefined}
                    className={`
                      ${styles.challengeItem} 
                      transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
                      ${
                        isActive
                          ? "opacity-100 z-10 pointer-events-auto scale-100 translate-x-0 lg:relative lg:opacity-100 lg:z-auto lg:scale-100 lg:translate-x-0"
                          : "opacity-0 z-0 pointer-events-none scale-95 translate-x-4 lg:relative lg:opacity-100 lg:z-auto lg:pointer-events-auto lg:scale-100 lg:translate-x-0"
                      }
                    `}
                  >
                    <div className={styles.itemContent}>
                      <span className={styles.itemBadge}>
                        Desafío {formattedIndex}
                      </span>

                      <h3 className={styles.itemTitle}>{item.title}</h3>

                      <p className={styles.itemDescription}>
                        {item.description}
                      </p>
                    </div>

                    <div className={styles.imageWrapper}>
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={item.imageAlt || item.title}
                          className={styles.cardImage}
                          loading="lazy"
                        />
                      ) : (
                        <div className={styles.imagePlaceholder}>
                          <svg
                            className="size-6 stroke-current fill-none"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span className="text-[10px] font-semibold tracking-wide">
                            Evidencia Visual
                          </span>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>

            {/* PUNTOS DE NAVEGACIÓN EN MÓVIL Y TABLET (< lg) */}
            <div className={styles.dotsContainer}>
              {rawItems.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSelectDot(index)}
                  className={styles.dot(activeIndex === index)}
                  aria-label={`Ir al desafío ${index + 1}`}
                  aria-current={activeIndex === index ? "true" : undefined}
                />
              ))}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default ProblemSection;