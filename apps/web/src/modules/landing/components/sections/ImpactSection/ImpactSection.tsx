import React from "react";
import { ImpactHeader } from "./components/ImpactHeader";
import { ImpactGrid } from "./components/ImpactGrid";
import { impactStyles } from "./ImpactSection.styles";

interface ImpactSectionProps {
  onDemo?: () => void;
}

export const ImpactSection: React.FC<ImpactSectionProps> = ({ onDemo }) => {
  return (
    <section id="impacto" className={impactStyles.section}>
      <div className={impactStyles.container}>
        <ImpactHeader />
        <ImpactGrid onDemo={onDemo} />
      </div>
    </section>
  );
};