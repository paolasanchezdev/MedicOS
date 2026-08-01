/**
 * HeroBackground.tsx
 * Fondo interactivo con red de nodos dinámicos densa y efecto de proximidad al cursor.
 */

import { useEffect, useRef } from "react";
import type { MousePosition } from "./useHeroInteractions";

interface HeroBackgroundProps {
  mousePos: MousePosition;
}

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export default function HeroBackground({ mousePos }: HeroBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Efecto Parallax suave para los blobs de luz basados en mousePos
  const offsetX = mousePos.x * 25;
  const offsetY = mousePos.y * 25;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    // Sincronizar dimensiones reales del canvas con su contenedor
    const updateSize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    // Observer por si cambia el layout
    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    // Crear más nodos aleatorios para una red densa y rica visualmente
    const nodes: Node[] = Array.from({ length: 75 }, () => ({
      x: Math.random() * (canvas.width || 1200),
      y: Math.random() * (canvas.height || 800),
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      radius: Math.random() * 2 + 1.2,
    }));

    let cursorX = canvas.width / 2;
    let cursorY = canvas.height / 2;

    const handleWindowMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      cursorX = e.clientX - rect.left;
      cursorY = e.clientY - rect.top;
    };
    window.addEventListener("mousemove", handleWindowMouseMove);

    // Bucle de renderizado de la red
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;

      // Actualizar y dibujar cada nodo
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        node.x += node.vx;
        node.y += node.vy;

        // Rebote en los bordes
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        // Dibujar el punto del nodo
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(13, 148, 136, 0.65)"; // Tono teal más destacado
        ctx.fill();

        // Conectar nodos cercanos entre sí con mayor radio de enlace
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 155) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            const alpha = (1 - dist / 155) * 0.32;
            ctx.strokeStyle = `rgba(13, 148, 136, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // Conexión interactiva con el cursor
        const mouseDx = node.x - cursorX;
        const mouseDy = node.y - cursorY;
        const mouseDist = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);

        if (mouseDist < 180) {
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(cursorX, cursorY);
          const cursorAlpha = (1 - mouseDist / 180) * 0.5;
          ctx.strokeStyle = `rgba(6, 182, 212, ${cursorAlpha})`; // Tono cyan brillante hacia el cursor
          ctx.lineWidth = 1.25;
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", updateSize);
      window.removeEventListener("mousemove", handleWindowMouseMove);
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden select-none z-0">
      {/* Canvas interactivo de nodos y redes */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* Blob Superior Izquierdo Cyan */}
      <div
        className="
          absolute
          -left-20
          -top-20
          size-125
          rounded-full
          bg-cyan-400/20
          blur-[100px]
          transition-transform
          duration-1000
          ease-out
          will-change-transform
        "
        style={{
          transform: `translate3d(${offsetX}px, ${offsetY}px, 0)`,
        }}
      />

      {/* Blob Central Derecho Teal */}
      <div
        className="
          absolute
          right-[-10%]
          top-1/3
          size-130
          rounded-full
          bg-teal-500/18
          blur-[120px]
          transition-transform
          duration-1000
          ease-out
          will-change-transform
        "
        style={{
          transform: `translate3d(${-offsetX}px, ${offsetY}px, 0)`,
        }}
      />

      {/* Blob Inferior Izquierdo sutil */}
      <div
        className="
          absolute
          left-1/4
          bottom-[-10%]
          size-110
          rounded-full
          bg-emerald-400/12
          blur-[110px]
          transition-transform
          duration-1000
          ease-out
          will-change-transform
        "
        style={{
          transform: `translate3d(${offsetX * 0.5}px, ${-offsetY * 0.5}px, 0)`,
        }}
      />
    </div>
  );
}