// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/components/onboarding/OnboardingCarnetPreview.tsx
// DESCRIPCIÓN: Visualizador interactivo exclusivo con giro 3D para el Onboarding.
// =========================================================================

import React, { useState, useMemo } from 'react';
import {
  RotateCw,
  Sparkles,
  CreditCard,
  Droplet,
  User,
  MapPin,
  FileText,
  PhoneCall,
  ShieldAlert,
  Calendar,
  Home,
  Phone,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import type { OnboardingFormData } from '../../../../modules/patients';

interface OnboardingCarnetPreviewProps {
  formData: OnboardingFormData;
  fullName: string;
}

function formatBloodType(bt?: string): string {
  if (!bt) return 'O+';
  const map: Record<string, string> = {
    'O_POSITIVE': 'O+',
    'O_NEGATIVE': 'O-',
    'A_POSITIVE': 'A+',
    'A_NEGATIVE': 'A-',
    'B_POSITIVE': 'B+',
    'B_NEGATIVE': 'B-',
    'AB_POSITIVE': 'AB+',
    'AB_NEGATIVE': 'AB-',
    'UNKNOWN': 'Por asignar',
  };
  return map[bt] || bt;
}

function formatSex(s?: string): string {
  if (!s) return 'Femenino';
  if (s === 'FEMALE') return 'Femenino';
  if (s === 'MALE') return 'Masculino';
  return 'Otro';
}

function formatDate(d?: string): string {
  if (!d) return 'Por registrar';
  try {
    const [y, m, day] = d.split('-');
    if (y && m && day) return `${day}/${m}/${y}`;
    const dateObj = new Date(d);
    if (isNaN(dateObj.getTime())) return d;
    return `${String(dateObj.getUTCDate()).padStart(2, '0')}/${String(dateObj.getUTCMonth() + 1).padStart(2, '0')}/${dateObj.getUTCFullYear()}`;
  } catch {
    return d;
  }
}

function generateQRCodeMatrix(text: string): boolean[][] {
  const size = 25;
  const matrix: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));
  const reserved: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  const addFinderPattern = (row: number, col: number) => {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const nr = row + r;
        const nc = col + c;
        if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
          reserved[nr][nc] = true;
          if (r >= 0 && r <= 6 && c >= 0 && c <= 6) {
            matrix[nr][nc] = (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4));
          } else {
            matrix[nr][nc] = false;
          }
        }
      }
    }
  };

  addFinderPattern(0, 0);
  addFinderPattern(0, size - 7);
  addFinderPattern(size - 7, 0);

  for (let i = 8; i < size - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    reserved[6][i] = true;
    matrix[i][6] = i % 2 === 0;
    reserved[i][6] = true;
  }

  const alignR = 18;
  const alignC = 18;
  for (let r = -2; r <= 2; r++) {
    for (let c = -2; c <= 2; c++) {
      reserved[alignR + r][alignC + c] = true;
      matrix[alignR + r][alignC + c] = (Math.abs(r) === 2 || Math.abs(c) === 2 || (r === 0 && c === 0));
    }
  }

  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }

  const bitStream: boolean[] = [];
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    for (let b = 7; b >= 0; b--) {
      bitStream.push(((code >> b) & 1) === 1);
    }
  }

  while (bitStream.length < 320) {
    hash = Math.imul(hash ^ (hash >>> 16), 0x45d9f3b);
    bitStream.push((hash & 1) === 1);
  }

  let bitIdx = 0;
  for (let col = size - 1; col > 0; col -= 2) {
    if (col === 6) col--;
    for (let r = 0; r < size; r++) {
      const row = ((col + 1) / 2) % 2 === 0 ? size - 1 - r : r;
      for (let c = 0; c < 2; c++) {
        const currCol = col - c;
        if (!reserved[row][currCol]) {
          matrix[row][currCol] = bitStream[bitIdx % bitStream.length];
          bitIdx++;
        }
      }
    }
  }

  return matrix;
}

export const OnboardingCarnetPreview: React.FC<OnboardingCarnetPreviewProps> = ({
  formData,
  fullName,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const cleanDui = formData.dui ? formData.dui.replace(/\D/g, '') : '';
  const numExpediente = cleanDui.length >= 4
    ? `EXP-2026-${cleanDui.slice(-4)}`
    : 'EXP-2026-NUEVO';

  const qrMatrix = useMemo(() => {
    return generateQRCodeMatrix(`https://medicos.gob.sv/expediente/${numExpediente}`);
  }, [numExpediente]);

  const qrSize = qrMatrix.length;
  const cellSize = 95 / qrSize;

  const distritoLimpio = formData.district || formData.municipality || 'San Miguel Tepezontes';

  return (
    <div className="flex flex-col justify-between h-full space-y-3 select-none">
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-medicos-light-bg border border-medicos-soft-border text-medicos-teal text-[11px] font-bold">
          <Sparkles className="w-3.5 h-3.5 text-medicos-teal" />
          <span>Credencial Territorial MedicOS</span>
        </div>

        <button
          type="button"
          onClick={() => setIsFlipped(!isFlipped)}
          className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-medicos-teal hover:text-medicos-dark-blue bg-white rounded-lg border border-medicos-soft-border shadow-2xs transition active:scale-95 cursor-pointer"
        >
          <RotateCw className={`w-3.5 h-3.5 transition-transform duration-500 ${isFlipped ? 'rotate-180' : ''}`} />
          <span>{isFlipped ? 'Ver Frontal' : 'Giro 3D'}</span>
        </button>
      </div>

      {/* Contenedor con Perspectiva 3D */}
      <div 
        className="w-full aspect-[1.586/1] relative select-none cursor-pointer group"
        style={{ perspective: '1400px' }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div
          className={`w-full h-full relative transition-transform duration-700 rounded-2xl shadow-xl ${
            isFlipped ? 'transform-[rotateY(180deg)]' : ''
          }`}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* CARA FRONTAL */}
          <div className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden backface-hidden border border-medicos-soft-border bg-[#F3F9FA] p-3 sm:p-3.5 flex flex-col justify-between text-slate-800 font-sans">
            {/* Header */}
            <div className="bg-white rounded-xl px-3 py-1.5 flex items-center justify-between shadow-2xs border border-slate-100">
              <div className="flex items-center gap-2">
                <img src="/logo-sinNombre.png" alt="MedicOS" className="w-7 h-7 object-contain" />
                <div className="flex flex-col">
                  <span className="text-sm font-black text-medicos-dark-blue leading-none tracking-tight">
                    Medic<span className="text-medicos-teal">OS</span>
                  </span>
                  <span className="text-[8px] font-semibold text-medicos-muted">
                    Sistema de Salud Territorial
                  </span>
                </div>
              </div>

              <div className="bg-medicos-teal text-white px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-2xs">
                <CreditCard className="w-3.5 h-3.5 text-white" />
                <span className="text-[9px] font-extrabold tracking-wider uppercase">
                  Carnet Paciente
                </span>
              </div>
            </div>

            {/* Cuerpo */}
            <div className="flex-1 flex items-center justify-between gap-3 px-1 py-1">
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full p-1 bg-linear-to-tr from-medicos-teal to-medicos-cyan shadow-xs flex items-center justify-center shrink-0">
                <div className="w-full h-full rounded-full overflow-hidden bg-medicos-canvas flex items-center justify-center text-medicos-teal">
                  <User className="w-10 h-10" />
                </div>
              </div>

              <div className="flex-1 min-w-0 flex flex-col justify-center space-y-1">
                <h4 className="text-xs sm:text-sm font-extrabold text-medicos-dark-blue truncate leading-tight">
                  {fullName || 'Nombre del Paciente'}
                </h4>

                <div className="space-y-0.5 text-[10px]">
                  <div className="flex items-center gap-1.5 truncate">
                    <User className="w-3 h-3 text-medicos-teal shrink-0" />
                    <span className="font-bold text-medicos-teal">Sexo:</span>
                    <span className="text-slate-700 font-medium">{formatSex(formData.sex)}</span>
                  </div>

                  <div className="flex items-center gap-1.5 truncate">
                    <FileText className="w-3 h-3 text-medicos-teal shrink-0" />
                    <span className="font-bold text-medicos-teal">Expediente:</span>
                    <span className="font-mono font-bold text-slate-800">{numExpediente}</span>
                  </div>

                  <div className="flex items-center gap-1.5 truncate">
                    <Droplet className="w-3 h-3 text-medicos-teal fill-medicos-teal shrink-0" />
                    <span className="font-bold text-medicos-teal">Sangre:</span>
                    <span className="font-bold text-rose-700">{formatBloodType(formData.bloodType)}</span>
                  </div>

                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3 h-3 text-medicos-teal shrink-0" />
                    <span className="font-bold text-medicos-teal">DUI:</span>
                    <span className="font-mono font-medium text-slate-700">{formData.dui || '00000000-0'}</span>
                  </div>
                </div>
              </div>

              {/* QR */}
              <div className="bg-white rounded-xl p-1.5 border border-slate-200 shadow-2xs flex flex-col items-center justify-between shrink-0">
                <svg width={75} height={75} viewBox="0 0 95 95" className="block">
                  {qrMatrix.map((row, rIdx) =>
                    row.map((isDark, cIdx) =>
                      isDark ? (
                        <rect
                          key={`${rIdx}-${cIdx}`}
                          x={cIdx * cellSize}
                          y={rIdx * cellSize}
                          width={cellSize + 0.2}
                          height={cellSize + 0.2}
                          fill="#20343A"
                        />
                      ) : null
                    )
                  )}
                </svg>
                <span className="text-[7px] font-mono text-medicos-teal font-bold uppercase mt-0.5">
                  Ver Ficha
                </span>
              </div>
            </div>

            {/* Módulos Inferiores con Distrito Limpio */}
            <div className="bg-white rounded-xl px-2 py-1.5 grid grid-cols-3 divide-x divide-slate-100 shadow-2xs border border-slate-100 items-center text-[9px]">
              <div className="flex items-center gap-1.5 px-1 truncate">
                <Calendar className="w-3.5 h-3.5 text-medicos-teal shrink-0" />
                <div className="flex flex-col truncate">
                  <span className="text-[7px] font-bold text-slate-400">Nacimiento</span>
                  <span className="font-bold text-medicos-dark-blue truncate">{formatDate(formData.dateOfBirth)}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 px-1 truncate">
                <Home className="w-3.5 h-3.5 text-medicos-teal shrink-0" />
                <div className="flex flex-col truncate">
                  <span className="text-[7px] font-bold text-slate-400">Distrito</span>
                  <span className="font-bold text-medicos-dark-blue truncate" title={distritoLimpio}>
                    {distritoLimpio}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 px-1 truncate">
                <Phone className="w-3.5 h-3.5 text-medicos-teal shrink-0" />
                <div className="flex flex-col truncate">
                  <span className="text-[7px] font-bold text-slate-400">Teléfono</span>
                  <span className="font-bold text-medicos-dark-blue truncate">{formData.phone || 'Sin tel.'}</span>
                </div>
              </div>
            </div>

            {/* Pie */}
            <div className="bg-medicos-teal text-white px-3 py-1 rounded-lg flex items-center justify-between text-[8px]">
              <span className="italic">Tu salud, nuestra prioridad</span>
              <span className="font-black">MedicOS 2026</span>
            </div>
          </div>

          {/* CARA TRASERA */}
          <div className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden backface-hidden transform-[rotateY(180deg)] border border-medicos-soft-border bg-[#F3F9FA] p-3 sm:p-3.5 flex flex-col justify-between text-slate-800 font-sans">
            <div className="bg-white rounded-xl px-3 py-1.5 flex items-center justify-between shadow-2xs border border-slate-100">
              <span className="text-xs font-black text-medicos-dark-blue">INFORMACIÓN MÉDICA &bull; EMERGENCIA</span>
              <ShieldCheck className="w-4 h-4 text-medicos-teal" />
            </div>

            <div className="grid grid-cols-2 gap-2 my-1">
              <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-2xs space-y-1 text-[9px]">
                <div className="flex items-center gap-1.5 text-medicos-teal font-bold pb-1 border-b border-slate-100">
                  <PhoneCall className="w-3 h-3" />
                  <span>Contacto de Urgencia</span>
                </div>
                <p className="text-slate-800 font-bold truncate">{formData.emergencyName || 'Por asignar'}</p>
                <p className="text-slate-500 truncate">{formData.emergencyRelation || 'Familiar'}</p>
                <p className="text-medicos-teal font-mono font-bold truncate">{formData.emergencyPhone || 'Sin teléfono'}</p>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-2xs space-y-1 text-[9px]">
                <div className="flex items-center gap-1.5 text-medicos-dark-blue font-bold pb-1 border-b border-slate-100">
                  <ShieldAlert className="w-3 h-3 text-medicos-teal" />
                  <span>Alergias Conocidas</span>
                </div>
                <p className="text-slate-700 italic line-clamp-3 leading-snug">
                  {formData.allergies || 'Sin alergias medicamentosas registradas.'}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-2 border border-slate-100 shadow-2xs flex items-center gap-2 text-[9px]">
              <Lock className="w-4 h-4 text-medicos-teal shrink-0" />
              <span className="text-slate-600 leading-tight">
                Documento personal emitido por el sistema MedicOS. Válido en toda la red nacional de brigadas.
              </span>
            </div>

            <div className="bg-medicos-dark-blue text-white px-3 py-1 rounded-lg flex items-center justify-between text-[8px]">
              <span>Validación territorial en línea</span>
              <span className="font-bold">El Salvador &bull; 2026</span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-center text-[10px] text-slate-400 font-medium">
        💡 Haz clic sobre el carnet o usa el botón superior para voltear en 3D.
      </p>
    </div>
  );
};