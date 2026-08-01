/**
 * LandingPage.tsx
 */

import React, { useState } from "react";

// Layout
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";

// UI Components
import { DemoModal } from "./components/ui/DemoModal/DemoModal";

// Secciones
import Hero from "./components/sections/Hero/Hero";
import { ProblemSection } from "./components/sections/ProblemSection/ProblemSection";
import { SolutionSection } from "./components/sections/SolutionSection/SolutionSection";
import { HowItWorks } from "./components/sections/HowItWorks/HowItWorks";
import { MainModules } from "./components/sections/MainModules/MainModules";
import { AiSupportSection } from "./components/sections/AiSupportSection";
import { ImpactSection } from "./components/sections/ImpactSection/ImpactSection";
import { CommunityDedicationSection } from "./components/sections/CommunityDedicationSection";

export const LandingPage: React.FC = () => {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <div className="min-h-screen bg-medicos-canvas text-slate-100 overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      <Header />

      <main>
        {/* Hero */}
        <Hero
          onDemo={() => setDemoOpen(true)}
        />

        {/* Problema / El Desafío */}
        <ProblemSection />

        {/* Solución */}
        <SolutionSection />

        {/* Flujo de Operación */}
        <HowItWorks />

        {/* Módulos Principales (Roles) */}
        <MainModules />

        {/* Capacidad Transversal: Inteligencia Artificial */}
        <AiSupportSection />

        {/* Impacto */}
        <ImpactSection
          onDemo={() => setDemoOpen(true)}
        />

        {/* Dedicatoria Humana / Cierre Emocional */}
        <CommunityDedicationSection />
      </main>

      <Footer />

      {/* Modal de demostración */}
      <DemoModal
        open={demoOpen}
        onClose={() => setDemoOpen(false)}
      />
    </div>
  );
};

export default LandingPage;