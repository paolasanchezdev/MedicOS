/* ==========================================================================
   AiHumanControl.tsx
   ========================================================================== */
import React from "react";
import { AI_SECTION_DATA } from "../data/aiSectionData";
import { aiSupportStyles } from "../AiSupportSection.styles";

export const AiHumanControl: React.FC = () => {
  const { humanControlBanner } = AI_SECTION_DATA;

  return (
    <div className={aiSupportStyles.humanControlWrapper}>
      {/* Luz ambiental sutil */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className={aiSupportStyles.humanControlContent}>
        <div className={aiSupportStyles.humanControlTextGroup}>
          <div className="flex items-center gap-2">
            <span className={aiSupportStyles.humanControlBadge}>
              {humanControlBanner.badge}
            </span>
          </div>

          <h2 className={aiSupportStyles.humanControlTitle}>
            {humanControlBanner.title}
          </h2>

          <p className={aiSupportStyles.humanControlDescription}>
            {humanControlBanner.description}
          </p>
        </div>

        <div className={aiSupportStyles.humanControlQuote}>
          <div className="text-3xl text-teal-400 mb-1 leading-none font-serif">“</div>
          <p className="text-teal-50 font-medium text-sm sm:text-base italic leading-relaxed">
            {humanControlBanner.quote.replace(/"/g, "")}
          </p>
          <div className="mt-4 flex items-center gap-2 pt-2 border-t border-teal-800/80">
            <div className="w-4 h-0.5 bg-teal-400 rounded-full" />
            <span className="text-[10px] font-mono font-bold uppercase text-teal-300 tracking-wider">
              Compromiso Clínico
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};