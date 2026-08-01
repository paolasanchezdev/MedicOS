/* ==========================================================================
   AiDataFlowPipeline.tsx
   ========================================================================== */

import React, { useState } from "react";
import { AI_SECTION_DATA, type DataFlowNode } from "../data/aiSectionData";
import { aiSupportStyles } from "../AiSupportSection.styles";

interface PipelineCardProps {
  node: DataFlowNode;
}

function PipelineCard({ node }: PipelineCardProps) {
  const [coords, setCoords] = useState({ x: 0, y: 0, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      opacity: 1,
    });
  };

  const handleMouseLeave = () => {
    setCoords((prev) => ({ ...prev, opacity: 0 }));
  };

  const isAiStep = node.badgeType === "ai";
  const isDoctorStep = node.badgeType === "doctor";

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={aiSupportStyles.nodeCard}
    >
      {/* Destello sutil interactivo */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 rounded-3xl z-0"
        style={{
          opacity: coords.opacity,
          background: `radial-gradient(300px circle at ${coords.x}px ${coords.y}px, rgba(20, 184, 166, 0.15), transparent 70%)`,
        }}
      />

      <div className="relative z-10 flex flex-col justify-between h-full">
        <div>
          {/* Header con número y Badge */}
          <div className={aiSupportStyles.nodeStepHeader}>
            <span className={aiSupportStyles.nodeStepNumber}>
              {node.stepNumber}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[10px] font-bold font-mono uppercase border ${aiSupportStyles.nodeBadge(
                node.badgeType
              )}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isAiStep
                    ? "bg-teal-500 animate-pulse"
                    : isDoctorStep
                    ? "bg-emerald-500"
                    : "bg-cyan-500"
                }`}
              />
              {node.badgeText}
            </span>
          </div>

          {/* Imagen / Ícono */}
          <div className={aiSupportStyles.nodeImageWrapper}>
            <img
              src={node.imageSrc}
              alt={node.title}
              className="w-full h-full object-contain p-1 group-hover:scale-110 transition-transform duration-300"
            />
          </div>

          {/* Textos */}
          <div className="space-y-1 mb-2">
            <h3 className={aiSupportStyles.nodeTitle}>{node.title}</h3>
            <p className={aiSupportStyles.nodeSubtitle}>{node.subtitle}</p>
          </div>

          <p className={aiSupportStyles.nodeDescription}>{node.description}</p>
        </div>

        {/* Ejemplo Inferior */}
        {node.exampleText && (
          <div className={aiSupportStyles.nodeExampleBox}>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[9px] uppercase font-bold text-teal-800/70 tracking-wider font-mono">
                {isAiStep ? "Proceso IA" : isDoctorStep ? "Acción Humana" : "Entrada"}
              </span>
            </div>
            <p className="text-slate-600 font-medium">{node.exampleText}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export const AiDataFlowPipeline: React.FC = () => {
  const { pipelineNodes } = AI_SECTION_DATA;

  /* Estados para el carrusel en móvil */
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % pipelineNodes.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + pipelineNodes.length) % pipelineNodes.length);
  };

  /* Soporte para Swipe táctil en celulares */
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 40) {
      nextSlide();
    } else if (distance < -40) {
      prevSlide();
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <div className={aiSupportStyles.pipelineContainer}>
      <div className={aiSupportStyles.pipelineHeader}>
        <p className={aiSupportStyles.pipelineTitle}>
          • Flujo Transversal de la Información •
        </p>
      </div>

      {/* 🔴 VISTA TABLET Y DESKTOP (2 Cols en Tablet md:, 4 Cols en Desktop lg:) */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 items-stretch">
        {pipelineNodes.map((node: DataFlowNode) => (
          <PipelineCard key={node.id} node={node} />
        ))}
      </div>

      {/* 🔴 VISTA MÓVIL (Carrusel deslizable solo en < md) */}
      <div className="block md:hidden w-full">
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="w-full min-h-85 flex items-center justify-center transition-all duration-300"
        >
          <PipelineCard node={pipelineNodes[activeIndex]} />
        </div>

        {/* Indicadores de Puntos (Dots) centrados sin flechas */}
        <div className="flex items-center justify-center pt-4 px-2">
          <div className="flex items-center gap-2">
            {pipelineNodes.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                type="button"
                className={`transition-all duration-300 rounded-full ${
                  idx === activeIndex
                    ? "w-6 h-2 bg-teal-600"
                    : "w-2 h-2 bg-teal-200 hover:bg-teal-300"
                }`}
                aria-label={`Ver tarjeta ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiDataFlowPipeline;