import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type TouchEvent,
} from "react";

/**
 * Posición normalizada del mouse
 * utilizada para efectos parallax
 */
export interface MousePosition {
  x: number;
  y: number;
}

/**
 * Estructura de widgets flotantes del Hero
 */
export interface FloatingWidget {
  id: string;
  title: string;
  value: string;
  position:
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right";
}

export function useHeroInteractions() {

  /*
  |--------------------------------------------------------------------------
  | Referencia principal del Hero
  |--------------------------------------------------------------------------
  */

  const containerRef = useRef<HTMLDivElement>(null);

  /*
  |--------------------------------------------------------------------------
  | Estado del carrusel Dashboard
  |--------------------------------------------------------------------------
  */

  const TOTAL_SLIDES = 4;

  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  /*
  |--------------------------------------------------------------------------
  | Navegación del carrusel
  |--------------------------------------------------------------------------
  */

  const nextSlide = () => {
    setActiveSlide(current => (current + 1) % TOTAL_SLIDES);
  };

  const prevSlide = () => {
    setActiveSlide(current => (current === 0 ? TOTAL_SLIDES - 1 : current - 1));
  };

  const goToSlide = (index: number) => {
    setActiveSlide(index);
  };

  /*
  |--------------------------------------------------------------------------
  | Control hover
  |--------------------------------------------------------------------------
  */

  const pauseHero = () => {
    setIsPaused(true);
  };

  const resumeHero = () => {
    setIsPaused(false);
  };

  /*
  |--------------------------------------------------------------------------
  | Auto play del dashboard
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (isPaused) return;

    const timer = window.setInterval(() => {
      nextSlide();
    }, 5000);

    return () => {
      window.clearInterval(timer);
    };
  }, [isPaused]);

  /*
  |--------------------------------------------------------------------------
  | Mouse Parallax
  |--------------------------------------------------------------------------
  */

  const [mousePos, setMousePos] = useState<MousePosition>({
    x: 0,
    y: 0,
  });

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    const bounds = element.getBoundingClientRect();

    const mouseX = (event.clientX - bounds.left) / bounds.width;
    const mouseY = (event.clientY - bounds.top) / bounds.height;

    setMousePos({
      x: (mouseX - 0.5) * 2,
      y: (mouseY - 0.5) * 2,
    });
  };

  const handleMouseLeave = () => {
    setMousePos({
      x: 0,
      y: 0,
    });
  };

  /*
  |--------------------------------------------------------------------------
  | Touch / Swipe Gestures para móviles
  |--------------------------------------------------------------------------
  */

  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const minSwipeDistance = 50;

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    setTouchStartX(event.targetTouches[0].clientX);
    setTouchStartY(event.targetTouches[0].clientY);
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStartX === null || touchStartY === null) return;

    const touchEndX = event.changedTouches[0].clientX;
    const touchEndY = event.changedTouches[0].clientY;

    const distanceX = touchStartX - touchEndX;
    const distanceY = Math.abs(touchStartY - touchEndY);

    // Valida que sea un movimiento horizontal limpio y supere el umbral mínimo
    if (Math.abs(distanceX) > minSwipeDistance && Math.abs(distanceX) > distanceY) {
      if (distanceX > 0) {
        nextSlide(); // Deslizar izquierda -> Siguiente diapositiva
      } else {
        prevSlide(); // Deslizar derecha -> Diapositiva anterior
      }
    }

    setTouchStartX(null);
    setTouchStartY(null);
  };

  /*
  |--------------------------------------------------------------------------
  | Widgets holográficos
  |--------------------------------------------------------------------------
  */

  const widgets: FloatingWidget[] = [
    {
      id: "offline",
      title: "Modo Offline",
      value: "Activo",
      position: "top-left",
    },
    {
      id: "ai",
      title: "IA Analizando",
      value: "Disponible",
      position: "top-right",
    },
    {
      id: "security",
      title: "Datos protegidos",
      value: "Cifrado",
      position: "bottom-left",
    },
    {
      id: "sync",
      title: "Sincronización",
      value: "Lista",
      position: "bottom-right",
    },
  ];

  /*
  |--------------------------------------------------------------------------
  | API pública del Hero
  |--------------------------------------------------------------------------
  */

  return {
    containerRef,
    activeSlide,
    setActiveSlide,
    nextSlide,
    prevSlide,
    goToSlide,
    isPaused,
    setIsPaused,
    pauseHero,
    resumeHero,
    mousePos,
    handleMouseMove,
    handleMouseLeave,
    handleTouchStart,
    handleTouchEnd,
    widgets,
  };
}