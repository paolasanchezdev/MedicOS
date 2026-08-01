import React from "react";
import { impactStyles } from "../ImpactSection.styles";

export const ImpactHeader: React.FC = () => {
  const styles = impactStyles.header;

  return (
    <div className={styles.wrapper}>
      <div className={styles.badge}>
        <span className={styles.badgeDot} />
        Propósito & Transformación Clínica
      </div>
      <h2 className={styles.title}>
        Más que tecnología. Una forma de <br />
        acercar la atención médica.
      </h2>
      <p className={styles.description}>
        MedicOS está diseñado para optimizar el trabajo asistencial en contextos con conectividad limitada, ayudando a mantener la información organizada y facilitando la continuidad de la atención en comunidades donde cada recurso cuenta.
      </p>
    </div>
  );
};