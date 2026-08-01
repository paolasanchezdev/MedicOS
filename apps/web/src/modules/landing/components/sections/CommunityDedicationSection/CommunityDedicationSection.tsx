import React from "react";
import { communityDedicationStyles } from "./CommunityDedicationSection.styles";
import { ScrollReveal } from "../../../components/ui/ScrollReveal";

export const CommunityDedicationSection: React.FC = () => {
  const styles = communityDedicationStyles;

  return (
    <section className={styles.section} id="reconocimiento">
      <div className={styles.glowOverlay} aria-hidden="true" />
      <div className={styles.container}>
        <ScrollReveal>
          <div className={styles.wrapper}>
            <div>
              <span className={styles.badge}>
                <span className={styles.badgeDot} />
                Reconocimiento
              </span>
            </div>

            <h2 className={styles.title}>
              Para quienes llevan la salud hasta{" "}
              <span className={styles.titleGradient}>donde más se necesita.</span>
            </h2>

            <div className={styles.divider} aria-hidden="true" />

            <p className={styles.description}>
              A los promotores, brigadistas y profesionales de la salud que recorren caminos difíciles, enfrentan las distancias y llevan atención a cada comunidad. MedicOS es una herramienta para acompañar su labor, pero son ustedes <span className={styles.accentText}>quienes hacen posible que la salud llegue más lejos</span>.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};