/* =========================================================================
   ARCHIVO: MainModules.tsx
   ========================================================================= */

import React, { useState } from 'react';
import { type RoleId } from './data/modulesData';
import { ModuleSelector } from './components/ModuleSelector';
import { ModuleContent } from './components/ModuleContent';
import { FutureScopeNote } from './components/FutureScopeNote';
import { mainModulesStyles } from './MainModules.styles';

export const MainModules: React.FC = () => {
  const [activeRole, setActiveRole] = useState<RoleId>('brigadista');

  return (
    <section className={mainModulesStyles.section} id="modulos">
      <div className={mainModulesStyles.container}>
        {/* Encabezado Principal de la Sección */}
        <div className={mainModulesStyles.headerWrapper}>
          <span className={mainModulesStyles.eyebrow}>
            <span className={mainModulesStyles.eyebrowDot} />
            Ecosistema Integrado
          </span>
          
          <h2 className={mainModulesStyles.title}>
            Módulos Diseñados{' '}
            <span className={mainModulesStyles.titleHighlight}>
              para Cada Rol.
            </span>
          </h2>

          <p className={mainModulesStyles.description}>
            MedicOS conecta a todos los actores de la atención primaria con herramientas especializadas que garantizan la continuidad médica sin importar la conectividad.
          </p>
        </div>

        {/* Pestañas de Selección de Rol */}
        <ModuleSelector 
          activeRole={activeRole} 
          onSelectRole={setActiveRole} 
        />

        {/* Contenido Dinámico y Micro-interfaz UI con soporte de swipe */}
        <ModuleContent 
          activeRole={activeRole} 
          onSelectRole={setActiveRole}
        />

        {/* Alcance Futuro / Proyección Epidemiológica */}
        <FutureScopeNote />
      </div>
    </section>
  );
};