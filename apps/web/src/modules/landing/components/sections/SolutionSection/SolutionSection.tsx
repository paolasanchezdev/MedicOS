/**
 * SolutionSection.tsx
 * 
 * Sección "La Solución" con arquitectura Offline-First.
 * Grid responsivo en Desktop con ScrollReveal y carrusel táctil en Móvil.
 */

import React, { useState } from "react";
import { ScrollReveal } from "../../../components/ui/ScrollReveal";
import { SolutionSectionStyles as styles } from "./SolutionSection.styles";

/* Definición directa de los datos de los actores de la solución */
const solutionActors = [
  {
    id: "brigadista",
    role: "Brigadista",
    title: "Captura ágil e ininterrumpida",
    description:
      "Registra consultas, signos vitales y entregas de medicamento directamente en la estación local, sin depender de acceso a Internet.",
    tag: "Operación en campo",
    image: "/solucion1.png",
  },
  {
    id: "paciente",
    role: "Paciente",
    title: "Identificación digital con código QR",
    description:
      "Acceso inmediato a su expediente único local. Garantiza continuidad clínica y evita la duplicación de fichas médicas.",
    tag: "Ficha médica única",
    image: "/solucion2.png",
  },
  {
    id: "doctor",
    role: "Doctor / Especialista",
    title: "Historial clínico y asistencia inteligente",
    description:
      "Consulta antecedentes confiables, evalúa la evolución del paciente y recibe apoyo con alertas de triaje y diagnósticos preeliminares.",
    tag: "Soporte clínico",
    image: "/solucion3.webp",
  },
];

export const SolutionSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [imageError, setImageError] = useState<Record<string, boolean>>({});

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % solutionActors.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + solutionActors.length) % solutionActors.length);
  };

  /* Gestos táctiles (Swipe en celulares) */
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 50) {
      nextSlide();
    } else if (distance < -50) {
      prevSlide();
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  const handleImageError = (id: string) => {
    setImageError((prev) => ({ ...prev, [id]: true }));
  };

  const currentActor = solutionActors[activeIndex];

  return (
    <section
      id="solucion"
      aria-labelledby="solution-section-title"
      className={styles.section}
    >
      <div aria-hidden="true" className={styles.topTransition} />
      <div aria-hidden="true" className={styles.ambientGlow} />
      <div aria-hidden="true" className={styles.ambientGlowSecondary} />

      <div className={styles.container}>
        {/* ================================================================
            1. ENCABEZADO NARRATIVO
            ================================================================ */}
        <header className={styles.header}>
          <span className={styles.badge}>
            <span aria-hidden="true" className={styles.badgeDot} />
            La solución
          </span>

          <h2 id="solution-section-title" className={styles.title}>
            Una plataforma diseñada para llevar continuidad médica donde la
            conectividad no llega.
          </h2>

          <p className={styles.description}>
            MedicOS transforma la gestión de las brigadas médicas mediante una
            arquitectura <strong>Offline First</strong> que permite registrar,
            consultar y proteger la información clínica incluso sin conexión a
            Internet.
          </p>
        </header>

        {/* ================================================================
            2. DIAGRAMA DE FLUJO Y TRÍADA DE ACTORES
            ================================================================ */}
        <div className={styles.architectureHub}>
          {/* Nodo Estación Central MedicOS */}
          <div className={styles.stationCard}>
            <div className="flex items-center gap-3">
              <div className={styles.stationPulse}>
                <span className={styles.stationPulsePing} />
                <span className={styles.stationPulseDot} />
              </div>
              <div>
                <h3 className={styles.stationTitle}>MedicOS Station</h3>
                <p className={styles.stationSub}>Base de datos local cifrada</p>
              </div>
            </div>
            <span className={styles.stationStatus}>Offline First</span>
          </div>

          {/* Conector Táctico del Diagrama */}
          <div className={styles.flowConnector} aria-hidden="true">
            <div className={styles.flowLine} />
            <span className={styles.flowBadge}>Red Local Atendida</span>
            <div className={styles.flowLine} />
          </div>

          {/* VISTA DESKTOP Y TABLET (Grid de 3 columnas desde md:) */}
          <div className={styles.actorsGrid}>
            {solutionActors.map((actor) => (
              <ScrollReveal key={actor.id} className="h-full flex flex-col">
                <article className={styles.actorCard}>
                  <div className="flex flex-col">
                    <div className={styles.actorHeader}>
                      <span className={styles.actorRoleBadge}>
                        {actor.role}
                      </span>
                    </div>

                    <span className={styles.actorTag}>{actor.tag}</span>

                    <h4 className={styles.actorTitle}>{actor.title}</h4>

                    <p className={styles.actorDescription}>
                      {actor.description}
                    </p>
                  </div>

                  {actor.image && !imageError[actor.id] ? (
                    <div className={styles.imageWrapper}>
                      <img
                        src={actor.image}
                        alt={actor.title}
                        className={styles.cardImage}
                        loading="lazy"
                        onError={() => handleImageError(actor.id)}
                      />
                    </div>
                  ) : (
                    <div className={styles.imageWrapper}>
                      <div className="flex flex-col items-center justify-center gap-1.5 text-medicos-teal/50 p-2 text-center">
                        <svg
                          className="size-6 stroke-current fill-none"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                        <span className="text-[10px] font-semibold uppercase tracking-wider">
                          Módulo Activo
                        </span>
                      </div>
                    </div>
                  )}
                </article>
              </ScrollReveal>
            ))}
          </div>

          {/* VISTA MÓVIL (Carrusel deslizable únicamente en < md) */}
          <div className={styles.carouselWrapper}>
            <div
              className={styles.carouselCardContainer}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <article
                key={currentActor.id}
                className={`${styles.actorCard} animate-fadeIn duration-300`}
              >
                <div className="flex flex-col">
                  <div className={styles.actorHeader}>
                    <span className={styles.actorRoleBadge}>
                      {currentActor.role}
                    </span>
                  </div>

                  <span className={styles.actorTag}>
                    {currentActor.tag}
                  </span>

                  <h4 className={styles.actorTitle}>
                    {currentActor.title}
                  </h4>

                  <p className={styles.actorDescription}>
                    {currentActor.description}
                  </p>
                </div>

                {currentActor.image && !imageError[currentActor.id] ? (
                  <div className={styles.imageWrapper}>
                    <img
                      src={currentActor.image}
                      alt={currentActor.title}
                      className={styles.cardImage}
                      loading="lazy"
                      onError={() => handleImageError(currentActor.id)}
                    />
                  </div>
                ) : (
                  <div className={styles.imageWrapper}>
                    <div className="flex flex-col items-center justify-center gap-1.5 text-medicos-teal/50 p-2 text-center">
                      <svg
                        className="size-6 stroke-current fill-none"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                      <span className="text-[10px] font-semibold uppercase tracking-wider">
                        Módulo Activo
                      </span>
                    </div>
                  </div>
                )}
              </article>
            </div>

            {/* Navegación y puntos (Dots) */}
            <div className={styles.carouselControls}>
              <button
                type="button"
                onClick={prevSlide}
                className={styles.carouselBtn}
                aria-label="Tarjeta anterior"
              >
                <svg
                  className="size-5 stroke-current fill-none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <div className={styles.carouselDots}>
                {solutionActors.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    className={`${styles.carouselDot} ${
                      idx === activeIndex
                        ? styles.carouselDotActive
                        : styles.carouselDotInactive
                    }`}
                    aria-label={`Ver tarjeta ${idx + 1}`}
                    aria-current={idx === activeIndex ? "true" : undefined}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={nextSlide}
                className={styles.carouselBtn}
                aria-label="Tarjeta siguiente"
              >
                <svg
                  className="size-5 stroke-current fill-none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* ================================================================
            3. BARRA TRANSVERSAL DE SINCRONIZACIÓN
            ================================================================ */}
        <div className={styles.syncBar}>
          <div className={styles.syncLeft}>
            <div className={styles.syncIcon}>
              <svg
                className="size-4 stroke-current fill-none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </div>
            <p className={styles.syncText}>
              <span className={styles.syncHighlight}>
                Sincronización Transversal Automática:
              </span>{" "}
              Los datos guardados localmente se replican automáticamente con la
              nube central al detectar conectividad.
            </p>
          </div>

          <span className={styles.syncBadge}>
            <span className="size-1.5 rounded-full bg-medicos-teal animate-pulse" />
            Flujo Continuo
          </span>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;