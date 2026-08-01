/* =========================================================================
   ARCHIVO:
   apps/web/src/modules/landing/components/sections/MainModules/components/ModuleContent.tsx
   ========================================================================= */

import React, { useState } from 'react';
import { type RoleId, MODULES_DATA } from '../data/modulesData';
import { ModuleShowcase } from './ModuleShowcase';
import { mainModulesStyles } from '../MainModules.styles';

interface ModuleContentProps {
  activeRole: RoleId;
  onSelectRole?: (role: RoleId) => void;
}

export const ModuleContent: React.FC<ModuleContentProps> = ({ activeRole, onSelectRole }) => {
  const data = MODULES_DATA[activeRole];
  const roles: RoleId[] = ['brigadista', 'paciente', 'doctor'];

  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  // Distancia mínima en píxeles para detectar swipe
  const minSwipeDistance = 40;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchStartY(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartX || !touchStartY || !onSelectRole) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const distanceX = touchStartX - touchEndX;
    const distanceY = Math.abs(touchStartY - touchEndY);

    // Movimiento predominantemente horizontal que supera el umbral
    if (Math.abs(distanceX) > minSwipeDistance && Math.abs(distanceX) > distanceY) {
      const currentIndex = roles.indexOf(activeRole);

      if (distanceX > 0) {
        // Deslizar a la izquierda -> Siguiente rol
        const nextIndex = (currentIndex + 1) % roles.length;
        onSelectRole(roles[nextIndex]);
      } else {
        // Deslizar a la derecha -> Rol anterior
        const prevIndex = (currentIndex - 1 + roles.length) % roles.length;
        onSelectRole(roles[prevIndex]);
      }
    }

    setTouchStartX(null);
    setTouchStartY(null);
  };

  return (
    <div
      key={activeRole}
      role="tabpanel"
      id={`module-panel-${activeRole}`}
      aria-labelledby={`module-tab-${activeRole}`}
      tabIndex={0}
      className={`${mainModulesStyles.grid} animate-[fadeSlide_400ms_cubic-bezier(0.16,1,0.3,1)_forwards] outline-none`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Columna Izquierda: Información del Rol */}
      <div className={mainModulesStyles.infoColumn}>
        <div className="w-full flex flex-col items-center lg:items-start">
          <span className={`${mainModulesStyles.badgeBase} ${mainModulesStyles.roleBadge(activeRole)}`}>
            {data.roleBadge}
          </span>
          
          <h3 className={mainModulesStyles.roleTitle}>{data.title}</h3>
          <p className={mainModulesStyles.roleSubtitle}>{data.subtitle}</p>
          <p className={mainModulesStyles.roleDescription}>{data.description}</p>

          <ul className={mainModulesStyles.featureList}>
            {data.features.map((feature) => (
              <li key={feature.id} className={mainModulesStyles.featureItem}>
                <span className={mainModulesStyles.featureIconWrapper}>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <div className="text-xs sm:text-sm leading-relaxed">
                  <span className="font-bold text-slate-900">{feature.label}: </span>
                  <span className="text-slate-600">{feature.description}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Indicador Técnico */}
        <div className={mainModulesStyles.techIndicatorContainer}>
          <div className={mainModulesStyles.techIndicator}>
            <span className={mainModulesStyles.pulseDot} />
            <span>{data.techIndicator}</span>
          </div>
        </div>
      </div>

      {/* Columna Derecha: Showcase Gráfico UI */}
      <div className={mainModulesStyles.showcaseColumn}>
        <ModuleShowcase activeRole={activeRole} />
      </div>
    </div>
  );
};