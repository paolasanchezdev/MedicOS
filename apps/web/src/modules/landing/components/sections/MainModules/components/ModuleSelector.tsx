/* =========================================================================
   ARCHIVO:
   apps/web/src/modules/landing/components/sections/MainModules/components/ModuleSelector.tsx
   ========================================================================= */

import React from 'react';
import { type RoleId, MODULES_DATA } from '../data/modulesData';
import { mainModulesStyles } from '../MainModules.styles';

interface ModuleSelectorProps {
  activeRole: RoleId;
  onSelectRole: (role: RoleId) => void;
}

export const ModuleSelector: React.FC<ModuleSelectorProps> = ({
  activeRole,
  onSelectRole,
}) => {
  const roles: RoleId[] = ['brigadista', 'paciente', 'doctor'];

  const getRoleIcon = (role: RoleId) => {
    switch (role) {
      case 'brigadista':
        return (
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case 'paciente':
        return (
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 012-2h2a2 2 0 012 2v1m-6 0h6" />
          </svg>
        );
      case 'doctor':
        return (
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L5.6 15.13a2 2 0 00-1.022.547l-1.002 1.002A2 2 0 003 18.098V20a1 1 0 001 1h16a1 1 0 001-1v-1.902a2 2 0 00-.576-1.414l-1.002-1.002z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 11a4 4 0 100-8 4 4 0 000 8z" />
          </svg>
        );
    }
  };

  return (
    <div className={mainModulesStyles.selectorContainer}>
      {/* Contenedor Flotante / Tablist */}
      <div 
        className={mainModulesStyles.selectorList} 
        role="tablist" 
        aria-label="Selector de módulos de MedicOS"
      >
        {roles.map((role) => {
          const isActive = activeRole === role;
          const data = MODULES_DATA[role];
          const displayTitle = data.title.replace('Módulo de ', '');

          return (
            <button
              key={role}
              role="tab"
              aria-selected={isActive}
              aria-controls={`module-panel-${role}`}
              id={`module-tab-${role}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onSelectRole(role)}
              className={mainModulesStyles.selectorTab(isActive)}
            >
              {getRoleIcon(role)}
              <span className="truncate">{displayTitle}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};