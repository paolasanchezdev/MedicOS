/* ==========================================================================
   AiSupportSection.tsx
   ========================================================================== */

import React from "react";
import { aiSupportStyles } from "./AiSupportSection.styles";
import { AiCapabilities } from "./components/AiCapabilities";
import { AiDataFlowPipeline } from "./components/AiDataFlowPipeline";
import { AiHumanControl } from "./components/AiHumanControl";

export const AiSupportSection: React.FC = () => {
  return (
    <section className={aiSupportStyles.section}>
      {/* Resplandor ambiental de fondo ajustado para responsividad */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-linear-to-tr from-teal-200/40 via-cyan-200/30 to-sky-100/20 blur-[120px] rounded-full" />
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-teal-300/25 blur-[120px] rounded-full" />
        <div className="absolute bottom-10 -right-40 w-96 h-96 bg-cyan-200/30 blur-[140px] rounded-full" />
      </div>

      <div className={aiSupportStyles.container}>
        {/* Encabezado */}
        <div className={aiSupportStyles.headerWrapper}>
          <div className={aiSupportStyles.eyebrowBadge}>
            <span className={aiSupportStyles.eyebrowDot} />
            INTELIGENCIA QUE APOYA
          </div>
          
          <h2 className={aiSupportStyles.titleMain}>
            La tecnología ayuda a interpretar la información.{" "}
            <span className={aiSupportStyles.titleAccent}>
              La decisión sigue siendo humana.
            </span>
          </h2>

          <p className={aiSupportStyles.description}>
            MedicOS incorpora inteligencia artificial como una herramienta de apoyo para
            validar los registros, identificar posibles inconsistencias y facilitar el análisis de la
            información disponible en campo.
          </p>
        </div>

        {/* Componentes de la Sección */}
        <AiDataFlowPipeline />
        <AiCapabilities />
        <AiHumanControl />
      </div>
    </section>
  );
};

export default AiSupportSection;