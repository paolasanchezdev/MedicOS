import React from "react";
import { AI_SECTION_DATA } from "../data/aiSectionData";
import { aiSupportStyles } from "../AiSupportSection.styles";

export const AiHeader: React.FC = () => {
  const { header } = AI_SECTION_DATA;

  return (
    <div className={aiSupportStyles.headerWrapper}>
      <div>
        <span className={aiSupportStyles.eyebrowBadge}>
          <span className={aiSupportStyles.eyebrowDot} />
          {header.eyebrow}
        </span>
      </div>
      <h2 className={aiSupportStyles.titleMain}>
        {header.titleMain}{" "}
        <span className={aiSupportStyles.titleAccent}>
          {header.titleHighlight}
        </span>
      </h2>
      <p className={aiSupportStyles.description}>
        {header.description}
      </p>
    </div>
  );
};