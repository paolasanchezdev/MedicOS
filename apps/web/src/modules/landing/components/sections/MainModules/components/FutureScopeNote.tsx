/* =========================================================================
   ARCHIVO:
   apps/web/src/modules/landing/components/sections/MainModules/components/FutureScopeNote.tsx
   ========================================================================= */

import React from 'react';
import { FUTURE_SCOPE_DATA } from '../data/modulesData';
import { mainModulesStyles } from '../MainModules.styles';

export const FutureScopeNote: React.FC = () => {
  return (
    <div className={mainModulesStyles.futureNoteContainer}>
      {/* Título y Badge agrupados */}
      <div className="flex flex-col sm:flex-row items-center gap-2.5 shrink-0 text-center sm:text-left">
        <span className={mainModulesStyles.futureNoteBadge}>
          {FUTURE_SCOPE_DATA.badge}
        </span>
        <h4 className={mainModulesStyles.futureNoteTitle}>
          {FUTURE_SCOPE_DATA.title}
        </h4>
      </div>

      {/* Descripción técnica de la proyección */}
      <p className={mainModulesStyles.futureNoteText}>
        {FUTURE_SCOPE_DATA.description}
      </p>
    </div>
  );
};