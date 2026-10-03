import React from 'react';

import { ArrowLeft, Check, Clock, Sparkles } from 'lucide-react';

interface UnderConstructionProps {
  title: string;
  category?: string;
  description?: string;
}

const stagger = (seconds: number): React.CSSProperties => ({
  animationDelay: `${seconds}s`,
});

const depth = (factor: number): React.CSSProperties =>
  ({ '--uc-f': factor } as React.CSSProperties);

const PARTICLES: ReadonlyArray<
  readonly [number, number, number, number]
> = [
  [118, 330, 0, 5.4],
  [196, 300, 1.4, 6.2],
  [352, 322, 2.6, 5.8],
  [446, 304, 0.8, 6.6],
  [296, 352, 3.4, 6.0],
  [64, 214, 2.0, 6.8],
  [500, 214, 4.0, 6.4],
];

type StepState = 'done' | 'current' | 'next';

interface TimelineStep {
  id: string;
  label: string;
  srLabel: string;
  state: StepState;
}

const STEPS: ReadonlyArray<TimelineStep> = [
  {
    id: 'planned',
    label: 'Planificado',
    srLabel: 'completado',
    state: 'done',
  },
  {
    id: 'preparing',
    label: 'En preparación',
    srLabel: 'en curso',
    state: 'current',
  },
  {
    id: 'available',
    label: 'Disponible',
    srLabel: 'pendiente',
    state: 'next',
  },
];

const ILLUSTRATION_CSS = `
  @keyframes uc-text-in {
    from {
      opacity: 0;
      transform: translateY(10px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes uc-in-up {
    from {
      opacity: 0;
      transform: translateY(24px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes uc-in-left {
    from {
      opacity: 0;
      transform: translateX(-24px);
    }

    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes uc-in-right {
    from {
      opacity: 0;
      transform: translateX(24px);
    }

    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes uc-in-fade {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  @keyframes uc-float {
    0%,
    100% {
      transform: translateY(0);
    }

    50% {
      transform: translateY(-7px);
    }
  }

  @keyframes uc-flow {
    to {
      stroke-dashoffset: -18;
    }
  }

  @keyframes uc-march {
    to {
      stroke-dashoffset: -22;
    }
  }

  @keyframes uc-spin {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes uc-ring {
    0% {
      transform: scale(0.8);
      opacity: 0.5;
    }

    100% {
      transform: scale(1.06);
      opacity: 0;
    }
  }

  @keyframes uc-twinkle {
    0%,
    100% {
      opacity: 0.15;
      transform: scale(0.6);
    }

    50% {
      opacity: 0.9;
      transform: scale(1);
    }
  }

  @keyframes uc-ecg {
    0% {
      stroke-dashoffset: 100;
    }

    55%,
    85% {
      stroke-dashoffset: 0;
    }

    100% {
      stroke-dashoffset: -100;
    }
  }

  @keyframes uc-check {
    0% {
      stroke-dashoffset: 100;
    }

    35%,
    85% {
      stroke-dashoffset: 0;
    }

    100% {
      stroke-dashoffset: -100;
    }
  }

  @keyframes uc-draw {
    from {
      stroke-dashoffset: 100;
    }

    to {
      stroke-dashoffset: 0;
    }
  }

  @keyframes uc-bar {
    0%,
    100% {
      transform: scaleY(0.5);
    }

    50% {
      transform: scaleY(1);
    }
  }

  @keyframes uc-build {
    0% {
      transform: scaleY(0.05);
      opacity: 0.9;
    }

    70% {
      transform: scaleY(1);
      opacity: 0.9;
    }

    100% {
      transform: scaleY(1);
      opacity: 0;
    }
  }

  @keyframes uc-grow {
    0%,
    100% {
      transform: scaleX(0.25);
    }

    50% {
      transform: scaleX(1);
    }
  }

  @keyframes uc-blink {
    0%,
    100% {
      opacity: 0.9;
    }

    50% {
      opacity: 0.25;
    }
  }

  @keyframes uc-pulse {
    0%,
    100% {
      transform: scale(1);
      opacity: 0.92;
    }

    50% {
      transform: scale(1.1);
      opacity: 1;
    }
  }

  @keyframes uc-bob {
    0%,
    100% {
      transform: translateY(0) rotate(0deg);
    }

    50% {
      transform: translateY(-4px) rotate(-3deg);
    }
  }

  @keyframes uc-wrench {
    0%,
    100% {
      transform: rotate(-16deg);
    }

    50% {
      transform: rotate(16deg);
    }
  }

  @keyframes uc-arm {
    0%,
    100% {
      transform: rotate(0deg);
    }

    50% {
      transform: rotate(-6deg);
    }
  }

  @keyframes uc-breathe {
    0%,
    100% {
      transform: translateY(0);
    }

    50% {
      transform: translateY(-1.6px);
    }
  }

  @keyframes uc-wave {
    0%,
    34%,
    100% {
      transform: rotate(0deg);
    }

    8% {
      transform: rotate(-18deg);
    }

    16% {
      transform: rotate(-2deg);
    }

    24% {
      transform: rotate(-18deg);
    }
  }

  @keyframes uc-rise {
    0% {
      transform: translateY(0) scale(0.6);
      opacity: 0;
    }

    20% {
      opacity: 0.9;
    }

    100% {
      transform: translateY(-70px) scale(1);
      opacity: 0;
    }
  }

  @keyframes uc-scan {
    0% {
      transform: scale(0.6);
      opacity: 0.9;
    }

    80%,
    100% {
      transform: scale(1.7);
      opacity: 0;
    }
  }

  @keyframes uc-progress {
    0% {
      transform: translateX(-110%);
    }

    100% {
      transform: translateX(280%);
    }
  }

  @keyframes uc-ping {
    0% {
      transform: scale(1);
      opacity: 0.7;
    }

    75%,
    100% {
      transform: scale(2.4);
      opacity: 0;
    }
  }

  @keyframes uc-soft-ping {
    0% {
      transform: scale(1);
      opacity: 0.45;
    }

    70%,
    100% {
      transform: scale(2.1);
      opacity: 0;
    }
  }

  @keyframes uc-twinkle-soft {
    0%,
    100% {
      opacity: 0.2;
    }

    50% {
      opacity: 0.8;
    }
  }

  @keyframes uc-dash-x {
    to {
      background-position: 8px 0;
    }
  }

  @keyframes uc-dash-y {
    to {
      background-position: 0 8px;
    }
  }

  /*
   * La ilustración permanece estable.
   * No existe parallax ni tilt dependiente del cursor.
   * Las animaciones internas continúan funcionando normalmente.
   */
  .uc-par {
    transform: none;
  }

  .uc-tilt {
    transform: none;
  }

  .uc-stage {
    isolation: isolate;
  }

  .uc-ring,
  .uc-spin,
  .uc-twinkle,
  .uc-pulse,
  .uc-scan,
  .uc-rise {
    transform-box: fill-box;
    transform-origin: center;
  }

  .uc-bar,
  .uc-bob,
  .uc-build {
    transform-box: fill-box;
    transform-origin: 50% 100%;
  }

  .uc-grow {
    transform-box: fill-box;
    transform-origin: 0 50%;
  }

  .uc-wrench {
    transform-box: view-box;
    transform-origin: 0 0;
  }

  .uc-arm,
  .uc-wave {
    transform-box: view-box;
  }

  .uc-arm {
    transform-origin: -22px -88px;
  }

  .uc-wave {
    transform-origin: 22px -88px;
  }

  .uc-ecg,
  .uc-check {
    stroke-dasharray: 100;
    stroke-dashoffset: 0;
  }

  .uc-draw {
    stroke-dasharray: 100;
    stroke-dashoffset: 100;
  }

  .uc-text-in {
    animation: uc-text-in 0.55s ease-out both;
  }

  .uc-in-up {
    animation:
      uc-in-up 0.75s cubic-bezier(0.2, 0.7, 0.2, 1) both;
  }

  .uc-in-left {
    animation:
      uc-in-left 0.75s cubic-bezier(0.2, 0.7, 0.2, 1) both;
  }

  .uc-in-right {
    animation:
      uc-in-right 0.75s cubic-bezier(0.2, 0.7, 0.2, 1) both;
  }

  .uc-in-fade {
    animation: uc-in-fade 0.8s ease-out both;
  }

  .uc-float {
    animation: uc-float 6s ease-in-out infinite;
  }

  .uc-flow {
    animation: uc-flow 1.6s linear infinite;
  }

  .uc-flow-slow {
    animation: uc-flow 7s linear infinite;
  }

  .uc-march {
    animation: uc-march 3s linear infinite;
  }

  .uc-spin {
    animation: uc-spin 70s linear infinite;
  }

  .uc-ring {
    animation: uc-ring 5s ease-out infinite;
  }

  .uc-twinkle {
    animation: uc-twinkle 3.2s ease-in-out infinite;
  }

  .uc-ecg {
    animation: uc-ecg 3.2s ease-in-out infinite;
  }

  .uc-check {
    animation: uc-check 3.6s ease-in-out infinite;
  }

  .uc-draw {
    animation: uc-draw 0.9s ease-out forwards;
  }

  .uc-bar {
    animation: uc-bar 2.6s ease-in-out infinite;
  }

  .uc-build {
    animation: uc-build 3.4s ease-in-out infinite;
  }

  .uc-grow {
    animation: uc-grow 3.2s ease-in-out infinite;
  }

  .uc-blink {
    animation: uc-blink 1.4s ease-in-out infinite;
  }

  .uc-pulse {
    animation: uc-pulse 2.8s ease-in-out infinite;
  }

  .uc-bob {
    animation: uc-bob 3.6s ease-in-out infinite;
  }

  .uc-wrench {
    animation: uc-wrench 2.2s ease-in-out infinite;
  }

  .uc-arm {
    animation: uc-arm 3.4s ease-in-out infinite;
  }

  .uc-breathe {
    animation: uc-breathe 3.8s ease-in-out infinite;
  }

  .uc-wave {
    animation: uc-wave 5.5s ease-in-out infinite;
  }

  .uc-rise {
    animation: uc-rise 4.5s ease-out infinite;
  }

  .uc-scan {
    animation: uc-scan 2.6s ease-out infinite;
  }

  .uc-progress {
    animation: uc-progress 2.4s ease-in-out infinite;
  }

  .uc-ping {
    animation:
      uc-ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
  }

  .uc-soft-ping {
    animation:
      uc-soft-ping 3.4s ease-out infinite;
  }

  .uc-twinkle-soft {
    animation:
      uc-twinkle-soft 4.2s ease-in-out infinite;
  }

  .uc-dash-x {
    background-image:
      linear-gradient(
        90deg,
        rgba(72, 189, 205, 0.8) 50%,
        transparent 50%
      );
    background-size: 8px 100%;
    animation: uc-dash-x 1.1s linear infinite;
  }

  .uc-dash-y {
    background-image:
      linear-gradient(
        180deg,
        rgba(72, 189, 205, 0.8) 50%,
        transparent 50%
      );
    background-size: 100% 8px;
    animation: uc-dash-y 1.1s linear infinite;
  }

  .uc-rise,
  .uc-twinkle,
  .uc-scan {
    animation-fill-mode: backwards;
  }

  @media (prefers-reduced-motion: reduce) {
    .uc-root *,
    .uc-root *::before,
    .uc-root *::after {
      animation: none !important;
    }

    .uc-draw {
      stroke-dashoffset: 0 !important;
    }

    .uc-par,
    .uc-tilt {
      transform: none !important;
      transition: none !important;
    }
  }
`;

const PreparationIllustration: React.FC = () => (
  <svg
    viewBox="0 0 560 480"
    role="img"
    aria-label="Ilustración de un módulo MedicOS en preparación"
    className="uc-svg mx-auto block h-auto w-full max-w-140"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern
        id="uc-dots"
        width="18"
        height="18"
        patternUnits="userSpaceOnUse"
      >
        <circle
          cx="2"
          cy="2"
          r="1.3"
          fill="#48BDCD"
          opacity="0.35"
        />
      </pattern>

      <linearGradient
        id="uc-platform"
        x1="0"
        y1="0"
        x2="0"
        y2="1"
      >
        <stop offset="0" stopColor="#FFFFFF" />
        <stop offset="1" stopColor="#EEF7F8" />
      </linearGradient>

      <linearGradient
        id="uc-face-l"
        x1="0"
        y1="0"
        x2="1"
        y2="1"
      >
        <stop offset="0" stopColor="#FFFFFF" />
        <stop offset="1" stopColor="#EEF7F8" />
      </linearGradient>

      <linearGradient
        id="uc-face-r"
        x1="0"
        y1="0"
        x2="0"
        y2="1"
      >
        <stop offset="0" stopColor="#166E7A" />
        <stop offset="1" stopColor="#115761" />
      </linearGradient>
    </defs>

    {/* Fondo */}
    <g className="uc-par" style={depth(2)}>
      <circle
        cx="280"
        cy="240"
        r="215"
        fill="#EEF7F8"
      />

      <circle
        cx="280"
        cy="240"
        r="215"
        fill="url(#uc-dots)"
        opacity="0.7"
      />

      <circle
        className="uc-ring"
        cx="280"
        cy="240"
        r="215"
        fill="none"
        stroke="#48BDCD"
        strokeWidth="1.5"
      />

      <circle
        className="uc-ring"
        style={stagger(2.5)}
        cx="280"
        cy="240"
        r="215"
        fill="none"
        stroke="#48BDCD"
        strokeWidth="1.5"
      />

      <circle
        className="uc-spin"
        cx="280"
        cy="240"
        r="226"
        fill="none"
        stroke="#48BDCD"
        strokeWidth="1.4"
        strokeDasharray="2 10"
        strokeLinecap="round"
        opacity="0.55"
      />

      <g fill="#48BDCD">
        {PARTICLES.map(([x, y, delay, duration]) => (
          <circle
            key={`${x}-${y}`}
            className="uc-rise"
            style={{
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
            }}
            cx={x}
            cy={y}
            r="2.2"
            opacity="0.7"
          />
        ))}
      </g>

      <g fill="#48BDCD">
        <g className="uc-twinkle">
          <rect
            x="66"
            y="268"
            width="4"
            height="14"
            rx="2"
          />
          <rect
            x="61"
            y="273"
            width="14"
            height="4"
            rx="2"
          />
        </g>

        <g
          className="uc-twinkle"
          style={stagger(1.1)}
        >
          <rect
            x="498"
            y="262"
            width="4"
            height="12"
            rx="2"
          />
          <rect
            x="494"
            y="266"
            width="12"
            height="4"
            rx="2"
          />
        </g>

        <g
          className="uc-twinkle"
          style={stagger(2)}
        >
          <rect
            x="298"
            y="84"
            width="3"
            height="10"
            rx="1.5"
          />
          <rect
            x="294.5"
            y="87.5"
            width="10"
            height="3"
            rx="1.5"
          />
        </g>
      </g>
    </g>

    {/* Plataforma y módulo */}
    <g className="uc-par" style={depth(4)}>
      <g
        className="uc-in-fade"
        style={stagger(0.1)}
      >
        <ellipse
          cx="280"
          cy="462"
          rx="175"
          ry="9"
          fill="#1A282D"
          opacity="0.06"
        />

        <polygon
          points="100,350 280,430 280,446 100,366"
          fill="#48BDCD"
          opacity="0.45"
        />

        <polygon
          points="280,430 460,350 460,366 280,446"
          fill="#166E7A"
          opacity="0.6"
        />

        <polygon
          points="280,270 460,350 280,430 100,350"
          fill="url(#uc-platform)"
          stroke="#48BDCD"
          strokeWidth="1.5"
          strokeOpacity="0.8"
          strokeLinejoin="round"
        />

        <g
          stroke="#48BDCD"
          strokeWidth="1"
          opacity="0.28"
        >
          <line x1="235" y1="290" x2="415" y2="370" />
          <line x1="190" y1="310" x2="370" y2="390" />
          <line x1="145" y1="330" x2="325" y2="410" />
          <line x1="325" y1="290" x2="145" y2="370" />
          <line x1="370" y1="310" x2="190" y2="390" />
          <line x1="415" y1="330" x2="235" y2="410" />
        </g>

        <polygon
          className="uc-march"
          points="280,284 436,350 280,418 124,350"
          fill="none"
          stroke="#48BDCD"
          strokeWidth="1.2"
          strokeDasharray="5 6"
          opacity="0.55"
        />

        <g
          stroke="#166E7A"
          strokeWidth="1.2"
          opacity="0.7"
          strokeLinecap="round"
        >
          <line
            x1="92"
            y1="384"
            x2="272"
            y2="464"
          />

          <line
            x1="94"
            y1="378"
            x2="90"
            y2="390"
          />

          <line
            x1="274"
            y1="458"
            x2="270"
            y2="470"
          />
        </g>

        <g transform="translate(182 424) rotate(24)">
          <rect
            x="-11"
            y="-4.5"
            width="22"
            height="9"
            rx="3"
            fill="#FFFFFF"
            stroke="#166E7A"
            strokeWidth="1"
          />

          <rect
            className="uc-blink"
            x="-6"
            y="-1.2"
            width="12"
            height="2.4"
            rx="1.2"
            fill="#48BDCD"
          />
        </g>
      </g>

      <polygon
        points="280,372 350,337 394,358 324,396"
        fill="#166E7A"
        opacity="0.1"
      />

      {/* Blueprint */}
      <g
        className="uc-in-fade"
        style={stagger(0.35)}
      >
        <polygon
          points="125,352 165,332 205,352 165,372"
          fill="#166E7A"
        />

        <g
          stroke="#FFFFFF"
          strokeOpacity="0.35"
          strokeWidth="1"
        >
          <line
            x1="145"
            y1="342"
            x2="185"
            y2="362"
          />
          <line
            x1="145"
            y1="362"
            x2="185"
            y2="342"
          />
        </g>

        <ellipse
          cx="165"
          cy="352"
          rx="11"
          ry="5.5"
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity="0.75"
          strokeWidth="1.5"
        />

        <ellipse
          className="uc-scan"
          cx="165"
          cy="352"
          rx="11"
          ry="5.5"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="1.5"
        />

        <g transform="translate(206 380) rotate(26)">
          <g className="uc-wrench">
            <rect
              x="0"
              y="-3.5"
              width="46"
              height="7"
              rx="3.5"
              fill="#52656C"
            />

            <circle
              cx="0"
              cy="0"
              r="8"
              fill="#52656C"
            />

            <rect
              x="-11"
              y="-3"
              width="9"
              height="6"
              fill="#FFFFFF"
            />
          </g>
        </g>
      </g>

      {/* Módulo central */}
      <g
        className="uc-in-up"
        style={stagger(0.2)}
      >
        <polygon
          points="280,370 210,335 210,225 280,260"
          fill="url(#uc-face-l)"
          stroke="#48BDCD"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        <polygon
          points="280,370 350,335 350,225 280,260"
          fill="url(#uc-face-r)"
        />

        <polygon
          points="280,260 350,225 280,190 210,225"
          fill="#48BDCD"
        />

        <polygon
          points="280,260 350,225 280,190 210,225"
          fill="#FFFFFF"
          opacity="0.12"
        />

        <polyline
          points="210,225 280,190 350,225"
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity="0.6"
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        <line
          x1="280"
          y1="260"
          x2="280"
          y2="370"
          stroke="#FFFFFF"
          strokeOpacity="0.35"
          strokeWidth="1.2"
        />

        {/* Cruz */}
        <g transform="matrix(1 -0.5 0 1 280 370)">
          <g className="uc-pulse">
            <rect
              x="27"
              y="-75"
              width="16"
              height="40"
              rx="3"
              fill="#FFFFFF"
            />

            <rect
              x="15"
              y="-63"
              width="40"
              height="16"
              rx="3"
              fill="#FFFFFF"
            />
          </g>
        </g>

        {/* Panel */}
        <g transform="matrix(1 0.5 0 1 280 370)">
          <rect
            x="-58"
            y="-95"
            width="46"
            height="64"
            rx="3"
            fill="#EEF7F8"
            stroke="#166E7A"
            strokeWidth="1.5"
            strokeDasharray="5 4"
          />

          <rect
            className="uc-grow"
            x="-50"
            y="-82"
            width="30"
            height="5"
            rx="2.5"
            fill="#48BDCD"
          />

          <rect
            className="uc-grow"
            style={stagger(0.4)}
            x="-50"
            y="-70"
            width="22"
            height="5"
            rx="2.5"
            fill="#48BDCD"
            opacity="0.6"
          />

          <rect
            className="uc-grow"
            style={stagger(0.8)}
            x="-50"
            y="-58"
            width="26"
            height="5"
            rx="2.5"
            fill="#48BDCD"
            opacity="0.6"
          />

          <rect
            className="uc-blink"
            x="-50"
            y="-44"
            width="14"
            height="8"
            rx="2"
            fill="#166E7A"
          />
        </g>

        {/* Casco */}
        <g className="uc-bob">
          <ellipse
            cx="280"
            cy="225"
            rx="26"
            ry="5"
            fill="#166E7A"
          />

          <path
            d="M262 224 A18 18 0 0 1 298 224 Z"
            fill="#FFFFFF"
            stroke="#166E7A"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          <rect
            x="277"
            y="208"
            width="6"
            height="16"
            rx="2"
            fill="#166E7A"
          />
        </g>
      </g>

      {/* Cruces flotantes */}
      <g>
        <g
          className="uc-rise"
          style={stagger(0)}
          fill="#48BDCD"
        >
          <rect
            x="227"
            y="212.5"
            width="10"
            height="3"
            rx="1.5"
          />
          <rect
            x="230.5"
            y="209"
            width="3"
            height="10"
            rx="1.5"
          />
        </g>

        <g
          className="uc-rise"
          style={stagger(1.1)}
          fill="#166E7A"
        >
          <rect
            x="257"
            y="194.5"
            width="10"
            height="3"
            rx="1.5"
          />
          <rect
            x="260.5"
            y="191"
            width="3"
            height="10"
            rx="1.5"
          />
        </g>

        <g
          className="uc-rise"
          style={stagger(2.2)}
          fill="#48BDCD"
        >
          <rect
            x="291"
            y="202.5"
            width="10"
            height="3"
            rx="1.5"
          />
          <rect
            x="294.5"
            y="199"
            width="3"
            height="10"
            rx="1.5"
          />
        </g>

        <g
          className="uc-rise"
          style={stagger(3.3)}
          fill="#166E7A"
        >
          <rect
            x="321"
            y="218.5"
            width="10"
            height="3"
            rx="1.5"
          />
          <rect
            x="324.5"
            y="215"
            width="3"
            height="10"
            rx="1.5"
          />
        </g>
      </g>
    </g>

    {/* Ubicación y seguridad */}
    <g className="uc-par" style={depth(6)}>
      <g transform="translate(86 270)">
        <g
          className="uc-in-fade"
          style={stagger(0.8)}
        >
          <ellipse
            className="uc-scan"
            cx="0"
            cy="36"
            rx="14"
            ry="5"
            fill="none"
            stroke="#166E7A"
            strokeWidth="1.5"
          />

          <ellipse
            cx="0"
            cy="36"
            rx="8"
            ry="3"
            fill="#166E7A"
            opacity="0.22"
          />

          <g
            className="uc-float"
            style={stagger(0.5)}
          >
            <path
              d="M0 -22 C-12 -22 -20 -13 -20 -3 C-20 11 0 28 0 28 C0 28 20 11 20 -3 C20 -13 12 -22 0 -22 Z"
              fill="#166E7A"
            />

            <circle
              cx="0"
              cy="-3"
              r="8"
              fill="#FFFFFF"
            />

            <circle
              cx="0"
              cy="-3"
              r="3.2"
              fill="#48BDCD"
            />
          </g>
        </g>
      </g>

      <g transform="translate(488 264)">
        <g
          className="uc-in-fade"
          style={stagger(0.95)}
        >
          <g
            className="uc-float"
            style={stagger(1.6)}
          >
            <path
              d="M0 -24 L19 -16 V2 C19 15 9 23 0 28 C-9 23 -19 15 -19 2 V-16 Z"
              fill="#FFFFFF"
              stroke="#166E7A"
              strokeWidth="2"
              strokeLinejoin="round"
            />

            <path
              d="M0 -15 L11 -10 V2 C11 9 6 14 0 17 Z"
              fill="#EEF7F8"
            />

            <path
              className="uc-check"
              pathLength={100}
              d="M-8 1 L-2 8 L9 -6"
              fill="none"
              stroke="#166E7A"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </g>
      </g>
    </g>

    {/* Personal sanitario */}
    <g className="uc-par" style={depth(7)}>
      <g
        className="uc-in-right"
        style={stagger(0.3)}
      >
        <g
          transform="translate(398 374) scale(0.78)"
        >
          <ellipse
            cx="0"
            cy="2"
            rx="34"
            ry="6"
            fill="#1A282D"
            opacity="0.12"
          />

          <rect
            x="-16"
            y="-42"
            width="14"
            height="42"
            rx="5"
            fill="#1A282D"
          />

          <rect
            x="2"
            y="-42"
            width="14"
            height="42"
            rx="5"
            fill="#1A282D"
          />

          <ellipse
            cx="-10"
            cy="1"
            rx="10"
            ry="4"
            fill="#52656C"
          />

          <ellipse
            cx="10"
            cy="1"
            rx="10"
            ry="4"
            fill="#52656C"
          />

          <g className="uc-breathe">
            <g className="uc-wave">
              <line
                x1="22"
                y1="-88"
                x2="30"
                y2="-48"
                stroke="#166E7A"
                strokeWidth="15"
                strokeLinecap="round"
              />

              <line
                x1="22"
                y1="-88"
                x2="30"
                y2="-48"
                stroke="#FFFFFF"
                strokeWidth="11"
                strokeLinecap="round"
              />

              <circle
                cx="30"
                cy="-45"
                r="5"
                fill="#D9A98A"
              />
            </g>

            <rect
              x="-26"
              y="-98"
              width="52"
              height="68"
              rx="18"
              fill="#FFFFFF"
              stroke="#166E7A"
              strokeWidth="2"
            />

            <path
              d="M-9 -98 L0 -76 L9 -98 Z"
              fill="#166E7A"
            />

            <rect
              x="8"
              y="-62"
              width="10"
              height="9"
              rx="2"
              fill="none"
              stroke="#48BDCD"
              strokeWidth="1.5"
            />

            <path
              d="M-10 -96 Q0 -60 10 -96"
              fill="none"
              stroke="#1A282D"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            <circle
              cx="0"
              cy="-64"
              r="4.5"
              fill="#48BDCD"
            />

            <circle
              cx="0"
              cy="-114"
              r="15"
              fill="#D9A98A"
            />

            <path
              d="M-15 -116 A15 15 0 0 1 15 -116 Q0 -126 -15 -116 Z"
              fill="#1A282D"
            />

            <circle
              cx="11"
              cy="-128"
              r="6"
              fill="#1A282D"
            />

            <g className="uc-arm">
              <line
                x1="-22"
                y1="-88"
                x2="-32"
                y2="-54"
                stroke="#166E7A"
                strokeWidth="15"
                strokeLinecap="round"
              />

              <line
                x1="-22"
                y1="-88"
                x2="-32"
                y2="-54"
                stroke="#FFFFFF"
                strokeWidth="11"
                strokeLinecap="round"
              />

              <rect
                x="-58"
                y="-72"
                width="30"
                height="40"
                rx="4"
                fill="#FFFFFF"
                stroke="#166E7A"
                strokeWidth="2"
              />

              <rect
                x="-50"
                y="-76"
                width="14"
                height="7"
                rx="2"
                fill="#166E7A"
              />

              <rect
                x="-53"
                y="-60"
                width="20"
                height="3.5"
                rx="1.75"
                fill="#48BDCD"
                opacity="0.65"
              />

              <rect
                x="-53"
                y="-52"
                width="14"
                height="3.5"
                rx="1.75"
                fill="#48BDCD"
                opacity="0.65"
              />

              <path
                className="uc-check"
                pathLength={100}
                d="M-53 -42 L-48 -37 L-39 -46"
                fill="none"
                stroke="#166E7A"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <circle
                cx="-32"
                cy="-52"
                r="5"
                fill="#D9A98A"
              />
            </g>
          </g>
        </g>
      </g>
    </g>

    {/* Tarjetas flotantes */}
    <g
      className="uc-par uc-par-cards"
      style={depth(9)}
    >
      <g
        fill="none"
        stroke="#48BDCD"
        strokeWidth="1.5"
        strokeDasharray="4 5"
        opacity="0.85"
      >
        <path
          className="uc-flow"
          d="M150 186 C 170 210, 190 218, 214 224"
        />

        <path
          className="uc-flow"
          d="M430 170 C 420 200, 384 212, 348 226"
        />
      </g>

      <circle
        className="uc-blink"
        cx="214"
        cy="224"
        r="3.5"
        fill="#166E7A"
      />

      <circle
        className="uc-blink"
        style={stagger(0.7)}
        cx="348"
        cy="226"
        r="3.5"
        fill="#166E7A"
      />

      {/* Registro clínico */}
      <g
        className="uc-in-left"
        style={stagger(0.45)}
      >
        <g className="uc-float">
          <rect
            x="52"
            y="124"
            width="140"
            height="78"
            rx="14"
            fill="#1A282D"
            opacity="0.05"
          />

          <rect
            x="48"
            y="118"
            width="140"
            height="78"
            rx="14"
            fill="#FFFFFF"
            stroke="#48BDCD"
            strokeWidth="1.5"
            strokeOpacity="0.6"
          />

          <circle
            cx="72"
            cy="140"
            r="11"
            fill="#EEF7F8"
          />

          <rect
            x="70"
            y="134"
            width="4"
            height="12"
            rx="1.5"
            fill="#166E7A"
          />

          <rect
            x="66"
            y="138"
            width="12"
            height="4"
            rx="1.5"
            fill="#166E7A"
          />

          <rect
            x="92"
            y="134"
            width="62"
            height="6"
            rx="3"
            fill="#166E7A"
            opacity="0.85"
          />

          <rect
            x="92"
            y="146"
            width="40"
            height="5"
            rx="2.5"
            fill="#48BDCD"
            opacity="0.55"
          />

          <polyline
            points="64,178 92,178 100,166 108,188 118,160 126,178 172,178"
            fill="none"
            stroke="#48BDCD"
            strokeOpacity="0.25"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <polyline
            className="uc-ecg"
            pathLength={100}
            points="64,178 92,178 100,166 108,188 118,160 126,178 172,178"
            fill="none"
            stroke="#166E7A"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </g>

      {/* Indicadores */}
      <g
        className="uc-in-right"
        style={stagger(0.6)}
      >
        <g
          className="uc-float"
          style={stagger(1.2)}
        >
          <rect
            x="396"
            y="102"
            width="124"
            height="84"
            rx="14"
            fill="#1A282D"
            opacity="0.05"
          />

          <rect
            x="392"
            y="96"
            width="124"
            height="84"
            rx="14"
            fill="#FFFFFF"
            stroke="#48BDCD"
            strokeWidth="1.5"
            strokeOpacity="0.6"
          />

          <rect
            x="410"
            y="110"
            width="44"
            height="6"
            rx="3"
            fill="#52656C"
            opacity="0.4"
          />

          <g className="uc-pulse">
            <circle
              cx="496"
              cy="116"
              r="9"
              fill="#166E7A"
            />

            <path
              d="M491 116 L495 120 L501 112"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          <rect
            className="uc-bar"
            x="410"
            y="138"
            width="12"
            height="22"
            rx="3"
            fill="#48BDCD"
            opacity="0.5"
          />

          <rect
            className="uc-bar"
            style={stagger(0.5)}
            x="428"
            y="126"
            width="12"
            height="34"
            rx="3"
            fill="#48BDCD"
          />

          <rect
            className="uc-bar"
            style={stagger(1)}
            x="446"
            y="132"
            width="12"
            height="28"
            rx="3"
            fill="#48BDCD"
            opacity="0.7"
          />

          <rect
            x="464"
            y="118"
            width="12"
            height="42"
            rx="3"
            fill="none"
            stroke="#166E7A"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />

          <rect
            className="uc-build"
            x="464"
            y="118"
            width="12"
            height="42"
            rx="3"
            fill="#166E7A"
          />
        </g>
      </g>
    </g>
  </svg>
);

interface StageNodeProps {
  className: string;
  delay?: number;
}

const StageNode: React.FC<StageNodeProps> = ({
  className,
  delay = 0,
}) => (
  <span
    aria-hidden="true"
    className={`absolute flex h-2 w-2 ${className}`}
  >
    <span
      className="uc-soft-ping absolute inline-flex h-full w-full rounded-full bg-medicos-cyan"
      style={stagger(delay)}
    />

    <span className="relative inline-flex h-2 w-2 rounded-full bg-medicos-teal" />
  </span>
);

interface MiniCrossProps {
  className: string;
  delay?: number;
}

const MiniCross: React.FC<MiniCrossProps> = ({
  className,
  delay = 0,
}) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 10 10"
    className={`uc-twinkle-soft absolute h-2.5 w-2.5 text-medicos-cyan ${className}`}
    style={stagger(delay)}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
  >
    <path d="M5 1v8M1 5h8" />
  </svg>
);

interface StepMarkerProps {
  state: StepState;
}

const StepMarker: React.FC<StepMarkerProps> = ({
  state,
}) => {
  if (state === 'done') {
    return (
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-medicos-soft-border bg-medicos-light-bg text-medicos-teal">
        <Check
          size={14}
          strokeWidth={3}
          aria-hidden="true"
        />
      </span>
    );
  }

  if (state === 'current') {
    return (
      <span className="relative grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 border-medicos-teal bg-white text-medicos-teal shadow-sm">
        <Clock
          size={14}
          aria-hidden="true"
        />

        <span
          aria-hidden="true"
          className="uc-ping absolute inset-0 rounded-full border border-medicos-cyan"
        />
      </span>
    );
  }

  return (
    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-dashed border-medicos-cyan bg-white text-medicos-muted">
      <Sparkles
        size={14}
        aria-hidden="true"
      />
    </span>
  );
};

export const UnderConstruction: React.FC<
  UnderConstructionProps
> = ({
  title,
  category = 'Módulo MedicOS',
  description = 'Esta sección se encuentra actualmente en preparación.',
}) => {
  return (
    <section
      aria-labelledby="under-construction-heading"
      className="uc-root relative flex min-h-[64vh] w-full items-center justify-center overflow-hidden px-4 py-8 sm:px-6 sm:py-10 lg:px-8"
    >
      <style>{ILLUSTRATION_CSS}</style>

      {/* Fondo general */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 18% 50%, rgba(72,189,205,0.08), transparent 30%), radial-gradient(circle at 82% 42%, rgba(22,110,122,0.06), transparent 30%)',
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-10"
        style={{
          backgroundImage:
            'radial-gradient(rgba(72, 189, 205, 0.2) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
          WebkitMaskImage:
            'radial-gradient(ellipse at center, #000 12%, transparent 72%)',
          maskImage:
            'radial-gradient(ellipse at center, #000 12%, transparent 72%)',
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-1/4 h-80 w-80 rounded-full bg-medicos-cyan/5 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-1/4 h-80 w-80 rounded-full bg-medicos-teal/5 blur-3xl"
      />

      <div className="relative z-10 mx-auto grid w-full max-w-295-cols-1 items-center gap-7 lg:grid-cols-[1.12fr_0.88fr] lg:gap-14">
        {/* ============================================================
            ILUSTRACIÓN
        ============================================================= */}
        <div className="relative min-w-0">
          {/* Identidad superior */}
          <div
            className="uc-text-in mb-3 flex items-center justify-between px-1 sm:px-2"
            style={stagger(0.05)}
          >
            <div className="flex items-center gap-2.5">
              <span className="h-5 w-0.5 rounded-full bg-medicos-cyan" />

              <div className="leading-none">
                <p className="text-[11px] font-bold tracking-[0.3em] text-medicos-teal">
                  MEDICOS
                </p>

                <p className="mt-1 text-[8px] font-medium uppercase tracking-[0.14em] text-medicos-muted">
                  Sistema inteligente para brigadas médicas
                </p>
              </div>
            </div>

            <div className="hidden items-center gap-2 sm:flex">
              <span className="relative flex h-2 w-2">
                <span className="uc-soft-ping absolute inset-0 rounded-full bg-medicos-cyan" />
                <span className="relative h-2 w-2 rounded-full bg-medicos-teal" />
              </span>

              <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-medicos-muted">
                Preparación activa
              </span>
            </div>
          </div>

          <div className="uc-stage group relative overflow-hidden rounded-[28px] border border-medicos-soft-border bg-white/90 px-2 pb-3 pt-2 shadow-[0_24px_60px_-34px_rgba(22,110,122,0.35)] backdrop-blur-sm sm:px-5 sm:pb-5 sm:pt-4">
            {/* Retícula */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-5"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(72,189,205,0.075) 1px, transparent 1px), linear-gradient(90deg, rgba(72,189,205,0.075) 1px, transparent 1px)',
                backgroundSize: '30px 30px',
                WebkitMaskImage:
                  'radial-gradient(ellipse at center, #000 20%, transparent 76%)',
                maskImage:
                  'radial-gradient(ellipse at center, #000 20%, transparent 76%)',
              }}
            />

            {/* Halo */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 transition-opacity duration-700"
              style={{
                background:
                  'radial-gradient(circle at 50% 50%, rgba(72,189,205,0.13), rgba(72,189,205,0.035) 48%, transparent 72%)',
              }}
            />

            {/* Líneas técnicas */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
            >
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="h-full w-full"
              >
                <g
                  stroke="#48BDCD"
                  strokeOpacity="0.22"
                  strokeWidth="1"
                  strokeDasharray="3 7"
                  fill="none"
                >
                  <line
                    className="uc-flow-slow"
                    x1="5"
                    y1="22"
                    x2="95"
                    y2="22"
                    vectorEffect="non-scaling-stroke"
                  />

                  <line
                    className="uc-flow-slow"
                    x1="5"
                    y1="82"
                    x2="95"
                    y2="82"
                    vectorEffect="non-scaling-stroke"
                  />

                  <line
                    className="uc-flow-slow"
                    x1="10"
                    y1="5"
                    x2="10"
                    y2="95"
                    vectorEffect="non-scaling-stroke"
                  />

                  <line
                    className="uc-flow-slow"
                    x1="90"
                    y1="5"
                    x2="90"
                    y2="95"
                    vectorEffect="non-scaling-stroke"
                  />
                </g>
              </svg>
            </div>

            {/* Marcas de registro */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-3 h-3 w-3 rounded-tl border-l border-t border-medicos-cyan"
            />

            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-3 h-3 w-3 rounded-tr border-r border-t border-medicos-cyan"
            />

            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-3 left-3 h-3 w-3 rounded-bl border-b border-l border-medicos-cyan"
            />

            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 rounded-br border-b border-r border-medicos-cyan"
            />

            {/* Ilustración */}
            <div className="relative z-10">
              <PreparationIllustration />
            </div>

            {/* Microdetalles */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
            >
              <StageNode
                className="left-[6%] top-[28%]"
              />

              <StageNode
                className="right-[6%] top-[59%]"
                delay={1.4}
              />

              <StageNode
                className="bottom-[8%] left-[42%] hidden sm:flex"
                delay={2.4}
              />

              <MiniCross
                className="bottom-[24%] left-[15%]"
                delay={0.6}
              />

              <MiniCross
                className="right-[16%] top-[21%]"
                delay={2}
              />

              <MiniCross
                className="left-[34%] top-[15%] hidden sm:block"
                delay={3.2}
              />

              <div className="absolute bottom-5 right-7 hidden grid-cols-3 gap-1 sm:grid">
                <span className="h-1 w-1 rounded-full bg-medicos-cyan opacity-90" />
                <span className="h-1 w-1 rounded-full bg-medicos-cyan opacity-50" />
                <span className="h-1 w-1 rounded-full bg-medicos-cyan opacity-30" />
                <span className="h-1 w-1 rounded-full bg-medicos-cyan opacity-50" />
                <span className="h-1 w-1 rounded-full bg-medicos-teal opacity-80" />
                <span className="h-1 w-1 rounded-full bg-medicos-cyan opacity-30" />
              </div>
            </div>

            {/* Regla técnica */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-5 left-7 hidden items-center gap-2 sm:flex"
            >
              <span
                className="h-1.5 w-24 border-b border-medicos-cyan/50"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(90deg, rgba(22,110,122,0.35) 0 1px, transparent 1px 8px)',
                }}
              />

              <span className="h-1 w-1 rounded-full bg-medicos-teal/70" />
            </div>

            {/* Indicador inferior */}
            <div
              aria-hidden="true"
              className="absolute bottom-5 right-7 hidden items-center gap-2 sm:flex"
            >
              <span className="text-[8px] font-semibold uppercase tracking-[0.18em] text-medicos-muted">
                Módulo
              </span>

              <span className="h-px w-7 bg-medicos-cyan/50" />

              <span className="text-[8px] font-bold tracking-[0.12em] text-medicos-teal">
                PREP
              </span>
            </div>
          </div>
        </div>

        {/* ============================================================
            CONTENIDO
        ============================================================= */}
        <div className="relative flex min-w-0 flex-col items-center text-center lg:items-start lg:pl-2 lg:text-left">
          {/* Línea decorativa */}
          <div
            aria-hidden="true"
            className="absolute -left-7 top-1/2 hidden h-28 w-px -translate-y-1/2 bg-linear-to-b from-transparent via-medicos-cyan/40 to-transparent lg:block"
          />

          {/* Categoría */}
          <div
            className="uc-text-in mb-5 flex flex-wrap items-center justify-center gap-2 lg:justify-start"
            style={stagger(0.1)}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-medicos-soft-border bg-medicos-light-bg px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-medicos-teal">
              <span
                aria-hidden="true"
                className="relative flex h-1.5 w-1.5"
              >
                <span className="uc-soft-ping absolute inset-0 rounded-full bg-medicos-cyan" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-medicos-teal" />
              </span>

              {category}
            </span>

            <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-medicos-muted">
              Próxima versión
            </span>
          </div>

          {/* Título principal */}
          <h1
            id="under-construction-heading"
            className="uc-text-in max-w-xl text-3xl font-bold leading-[1.08] tracking-tight text-medicos-dark-blue sm:text-4xl lg:text-[2.85rem]"
            style={stagger(0.16)}
          >
            Estamos preparando

            <span className="relative ml-2 inline-block">
              esta sección

              <svg
                aria-hidden="true"
                viewBox="0 0 120 10"
                preserveAspectRatio="none"
                className="absolute -bottom-2 left-0 h-2 w-full text-medicos-cyan"
                fill="none"
              >
                <path
                  className="uc-draw"
                  style={stagger(0.9)}
                  pathLength={100}
                  d="M2 6 C25 1, 45 9, 68 4 S105 3, 118 6"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          {/* Nombre de la sección */}
          <div
            className="uc-text-in mt-5 flex items-start gap-3"
            style={stagger(0.22)}
          >
            <span className="mt-1 h-9 w-0.5 shrink-0 rounded-full bg-medicos-cyan" />

            <div>
              <p className="text-left text-base font-bold leading-snug text-medicos-teal sm:text-lg">
                {title}
              </p>

              <p className="mt-1 max-w-md text-left text-xs uppercase tracking-[0.12em] text-medicos-muted">
                Funcionalidad en desarrollo
              </p>
            </div>
          </div>

          {/* Descripción */}
          <p
            className="uc-text-in mt-5 max-w-lg text-sm leading-7 text-medicos-muted sm:text-[15px]"
            style={stagger(0.28)}
          >
            {description}
          </p>

          {/* Estado */}
          <div
            className="uc-text-in mt-6 w-full max-w-lg border-y border-medicos-soft-border py-4"
            style={stagger(0.34)}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-medicos-light-bg text-medicos-teal ring-1 ring-medicos-soft-border">
                  <Clock
                    size={16}
                    aria-hidden="true"
                  />
                </span>

                <div className="text-left">
                  <p className="text-[9px] font-bold uppercase tracking-[0.17em] text-medicos-muted">
                    Estado del módulo
                  </p>

                  <p className="mt-0.5 text-sm font-bold text-medicos-dark-blue">
                    En preparación
                  </p>
                </div>
              </div>

              <span className="hidden items-center gap-2 sm:flex">
                <span className="relative flex h-2 w-2">
                  <span className="uc-soft-ping absolute inset-0 rounded-full bg-medicos-cyan" />

                  <span className="relative h-2 w-2 rounded-full bg-medicos-teal" />
                </span>

                <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-medicos-teal">
                  Activo
                </span>
              </span>
            </div>

            <div
              aria-hidden="true"
              className="relative mt-3 h-1 overflow-hidden rounded-full bg-medicos-light-bg"
            >
              <span className="uc-progress absolute inset-y-0 left-0 w-2/5 rounded-full bg-medicos-cyan" />
            </div>
          </div>

          {/* Timeline */}
          <ol
            aria-label="Etapas del módulo"
            className="uc-text-in mt-6 flex w-full max-w-lg flex-col text-left sm:flex-row"
            style={stagger(0.4)}
          >
            {STEPS.map((step, index) => {
              const isLast = index === STEPS.length - 1;
              const isCurrent = step.state === 'current';
              const connectorSolid = step.state === 'done';

              return (
                <li
                  key={step.id}
                  aria-current={
                    isCurrent ? 'step' : undefined
                  }
                  className={`relative flex flex-row items-center gap-3 sm:flex-1 sm:flex-col sm:items-start sm:gap-2 ${
                    isLast ? '' : 'pb-6 sm:pb-0'
                  }`}
                >
                  <StepMarker state={step.state} />

                  <span
                    className={`whitespace-nowrap text-[10px] font-bold uppercase tracking-widest ${
                      isCurrent
                        ? 'text-medicos-teal'
                        : 'text-medicos-muted'
                    }`}
                  >
                    {step.label}

                    <span className="sr-only">
                      , {step.srLabel}
                    </span>
                  </span>

                  {!isLast && (
                    <>
                      <span
                        aria-hidden="true"
                        className={`absolute bottom-1 left-3.75 top-8 w-px rounded-full sm:hidden ${
                          connectorSolid
                            ? 'bg-medicos-cyan'
                            : 'uc-dash-y'
                        }`}
                      />

                      <span
                        aria-hidden="true"
                        className={`absolute left-8 top-4 hidden h-px sm:block ${
                          connectorSolid
                            ? 'bg-medicos-cyan'
                            : 'uc-dash-x'
                        }`}
                        style={{
                          width: 'calc(100% - 32px)',
                        }}
                      />
                    </>
                  )}
                </li>
              );
            })}
          </ol>

          {/* Acción */}
          <button
            type="button"
            onClick={() => window.history.back()}
            className="uc-text-in group mt-7 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-medicos-soft-border bg-white px-4 py-2.5 text-sm font-semibold text-medicos-teal shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-medicos-cyan hover:bg-medicos-light-bg hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medicos-cyan focus-visible:ring-offset-2"
            style={stagger(0.46)}
          >
            <ArrowLeft
              size={16}
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:-translate-x-0.5"
            />

            Regresar
          </button>
        </div>
      </div>
    </section>
  );
};

export default UnderConstruction;