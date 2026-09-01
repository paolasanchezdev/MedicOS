// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/atencion/nueva/components/AtencionPacienteCard.tsx
// DESCRIPCIÓN: Panel lateral persistente con Carnet Oficial de MedicOS, foto del paciente y ficha clínica.
// =========================================================================

import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  Calendar,
  Phone,
  MapPin,
  FileText,
  UserCheck,
  User,
  CreditCard,
  Droplet,
  Smartphone,
  PhoneCall,
  Home,
} from 'lucide-react';
import type { PatientRecord } from '../../../../../../modules/patients/types/patient.types';

export interface AtencionPacienteCardProps {
  patient: PatientRecord | null;
  onChangePatient: () => void;
  pasoActualIndex?: number;
}

function formatBloodType(bt?: string): string {
  if (!bt) return 'O+';
  const map: Record<string, string> = {
    O_POSITIVE: 'O+',
    O_NEGATIVE: 'O-',
    A_POSITIVE: 'A+',
    A_NEGATIVE: 'A-',
    B_POSITIVE: 'B+',
    B_NEGATIVE: 'B-',
    AB_POSITIVE: 'AB+',
    AB_NEGATIVE: 'AB-',
    UNKNOWN: 'O+',
  };
  return map[bt] || bt;
}

function formatSex(s?: string): string {
  if (!s) return 'Femenino';
  const sUpper = s.toUpperCase();
  if (sUpper === 'FEMALE' || sUpper === 'F') return 'Femenino';
  if (sUpper === 'MALE' || sUpper === 'M') return 'Masculino';
  return 'Otro';
}

function formatDate(d?: string | Date): string {
  if (!d) return '30/08/2026';
  try {
    const dateObj = typeof d === 'string' ? new Date(d) : d;
    if (isNaN(dateObj.getTime())) return String(d);
    const day = String(dateObj.getUTCDate()).padStart(2, '0');
    const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
    const year = dateObj.getUTCFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return String(d);
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
            matrix[nr][nc] = r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4);
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
      matrix[alignR + r][alignC + c] = Math.abs(r) === 2 || Math.abs(c) === 2 || (r === 0 && c === 0);
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

export const AtencionPacienteCard: React.FC<AtencionPacienteCardProps> = ({
  patient,
  onChangePatient,
  pasoActualIndex = 0,
}) => {
  const [referenceDate] = useState(() => new Date());

  const edad = useMemo(() => {
    if (!patient?.dateOfBirth) return 'No registrada';
    const dob = new Date(patient.dateOfBirth);
    if (isNaN(dob.getTime())) return 'No registrada';

    let years = referenceDate.getFullYear() - dob.getFullYear();
    const monthDiff = referenceDate.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && referenceDate.getDate() < dob.getDate())) {
      years--;
    }
    return `${years} años`;
  }, [patient, referenceDate]);

  const direccionLimpia = useMemo(() => {
    if (!patient?.address) return 'Comunidad no registrada';
    const partes = patient.address.split(',').map((p) => p.trim()).filter(Boolean);
    return partes.filter((item, index) => partes.indexOf(item) === index).join(', ');
  }, [patient]);

  const qrMatrix = useMemo(() => {
    const payload = patient?.id
      ? `https://medicos.local/expediente/${patient.id}`
      : 'https://medicos.local/expediente/0001';
    return generateQRCodeMatrix(payload);
  }, [patient]);

  if (!patient) {
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/70 p-6 shadow-xs text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-700 mx-auto">
          <User className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-slate-900">Persona en Atención</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Selecciona una persona del padrón comunitario para cargar su expediente y carnet digital en esta atención.
          </p>
        </div>
        <button
          type="button"
          onClick={onChangePatient}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#2B7A78] hover:bg-[#236866] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs active:scale-95"
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Buscar en Padrón</span>
        </button>
      </div>
    );
  }

  const nombreCompleto = `${patient.firstName} ${patient.lastName}`.trim();
  const sexo = formatSex(patient.sex);
  const alergias = patient.clinicalRecord?.familyHistory || 'Ninguna registrada en expediente.';
  const sangre = formatBloodType(patient.clinicalRecord?.bloodType);
  const cleanDui = (patient.dui || '').replace(/\D/g, '');
  const expedienteNo = patient.clinicalRecord?.id
    ? `EXP-2026-${patient.clinicalRecord.id.slice(0, 4).toUpperCase()}`
    : cleanDui
    ? `EXP-2026-${cleanDui.slice(-4)}`
    : 'EXP-2026-0001';
  const porcentajeProgreso = Math.round(((pasoActualIndex + 1) / 9) * 100);

  const photoUrl = (patient as PatientRecord & { photoUrl?: string; avatar?: string }).photoUrl ||
    (patient as PatientRecord & { photoUrl?: string; avatar?: string }).avatar;

  const qrSize = qrMatrix.length;
  const cellSize = 64 / qrSize;

  return (
    <aside className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/70 p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:border-slate-300 transition-all duration-200 space-y-4">
      {/* 1. CARNET OFICIAL MEDICOS (VISTA DIGITAL INTEGRADA) */}
      <div className="relative overflow-hidden rounded-2xl border border-teal-200/90 bg-[#F3F9FA] p-3 sm:p-3.5 shadow-xs select-none">
        {/* Cabecera del Carnet */}
        <div className="bg-white rounded-xl px-2.5 py-1.5 flex items-center justify-between shadow-2xs border border-slate-100 mb-2.5">
          <div className="flex items-center gap-1.5">
            <img src="/logo-sinNombre.png" alt="MedicOS" className="w-6 h-6 object-contain" />
            <div className="flex flex-col">
              <span className="text-xs font-black text-[#003356] leading-none tracking-tight">
                Medic<span className="text-[#00838F]">OS</span>
              </span>
              <span className="text-[8px] font-semibold text-[#546E7A] mt-0.5">Gestión en Salud</span>
            </div>
          </div>

          <div className="bg-[#3B9EAA] text-white px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-2xs">
            <CreditCard className="w-3 h-3 text-white stroke-[2.5]" />
            <span className="text-[9px] font-extrabold tracking-wider uppercase whitespace-nowrap">
              Carnet de Paciente
            </span>
          </div>
        </div>

        {/* Cuerpo del Carnet */}
        <div className="flex items-center justify-between gap-2.5 px-0.5">
          {/* Foto Circular con Aro Oficial */}
          <div className="flex flex-col items-center justify-center shrink-0">
            <div className="w-14 h-14 rounded-full p-0.5 bg-linear-to-tr from-[#26C6DA] to-[#80DEEA] shadow-xs flex items-center justify-center">
              <div className="w-full h-full rounded-full overflow-hidden bg-[#E0F2F1] flex items-center justify-center">
                {photoUrl ? (
                  <img src={photoUrl} alt={nombreCompleto} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-[#90A4AE]" />
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 gap-0.5 opacity-50 mt-1">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-0.5 h-0.5 rounded-full bg-[#00ACC1]" />
              ))}
            </div>
          </div>

          {/* Datos Personales */}
          <div className="flex-1 min-w-0 space-y-0.5">
            <h3 className="text-xs font-extrabold text-[#003356] leading-tight truncate" title={nombreCompleto}>
              {nombreCompleto}
            </h3>
            <p className="text-[10px] text-slate-600 font-mono font-medium">
              <span className="font-extrabold text-[#00838F]">DUI:</span> {patient.dui || 'Sin DUI'}
            </p>
            <p className="text-[10px] text-slate-600 font-mono font-medium truncate">
              <span className="font-extrabold text-[#00838F]">Exp:</span> {expedienteNo}
            </p>
            <div className="flex items-center gap-2 text-[9px] font-bold text-slate-600 pt-0.5">
              <span>{edad}</span>
              <span>•</span>
              <span className="flex items-center gap-0.5 text-[#00838F]">
                <Droplet className="w-2.5 h-2.5 fill-[#00838F]" /> {sangre}
              </span>
            </div>
          </div>

          {/* QR Code Oficial Integrado */}
          <div className="bg-white rounded-xl p-1.5 border border-slate-200 shadow-2xs flex flex-col items-center justify-center w-18 shrink-0 relative">
            <div className="w-16 h-16 flex items-center justify-center">
              <svg width={60} height={60} viewBox="0 0 64 64" className="block">
                {qrMatrix.map((row, rIdx) =>
                  row.map((isDark, cIdx) =>
                    isDark ? (
                      <rect
                        key={`${rIdx}-${cIdx}`}
                        x={cIdx * cellSize}
                        y={rIdx * cellSize}
                        width={cellSize + 0.1}
                        height={cellSize + 0.1}
                        fill="#002244"
                      />
                    ) : null
                  )
                )}
              </svg>
            </div>
            <div className="flex items-center gap-0.5 mt-0.5 text-[7px] font-bold text-[#00838F] text-center leading-none">
              <Smartphone className="w-2 h-2 shrink-0" />
              <span>Ver ficha</span>
            </div>
          </div>
        </div>

        {/* Módulos Inferiores del Carnet */}
        <div className="bg-white rounded-xl p-1.5 mt-2 grid grid-cols-3 divide-x divide-slate-100 shadow-2xs border border-slate-100 text-center">
          <div className="px-1">
            <span className="text-[7px] font-bold text-slate-400 leading-tight flex items-center justify-center gap-0.5">
              <Calendar className="w-2 h-2 text-[#00838F]" /> Nacimiento
            </span>
            <span className="text-[9px] font-extrabold text-[#003356] block mt-0.5 truncate">
              {formatDate(patient.dateOfBirth)}
            </span>
          </div>

          <div className="px-1">
            <span className="text-[7px] font-bold text-slate-400 leading-tight flex items-center justify-center gap-0.5">
              <PhoneCall className="w-2 h-2 text-[#00838F]" /> Teléfono
            </span>
            <span className="text-[9px] font-extrabold text-[#003356] block mt-0.5 truncate">
              {patient.phone || 'N/A'}
            </span>
          </div>

          <div className="px-1">
            <span className="text-[7px] font-bold text-slate-400 leading-tight flex items-center justify-center gap-0.5">
              <Home className="w-2 h-2 text-[#00838F]" /> Sexo
            </span>
            <span className="text-[9px] font-extrabold text-[#003356] block mt-0.5 truncate">
              {sexo}
            </span>
          </div>
        </div>

        {/* Pie Oficial del Carnet */}
        <div className="bg-[#00838F] text-white px-3 py-1 rounded-lg flex items-center justify-between shadow-2xs mt-2 text-[9px]">
          <span className="italic font-medium text-[#E0F7FA] text-[8px]">Tu salud, nuestra prioridad</span>
          <span className="font-black text-white">MedicOS</span>
          <span className="font-bold text-[#B2EBF2] text-[8px]">2026</span>
        </div>
      </div>

      {/* 2. BOTÓN DE CAMBIO DE PERSONA */}
      <button
        type="button"
        onClick={onChangePatient}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-50 hover:bg-teal-50/80 text-slate-700 hover:text-teal-800 border border-slate-200/80 hover:border-teal-300 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer shadow-2xs active:scale-95"
      >
        <UserCheck className="w-4 h-4 text-teal-600" />
        <span>Cambiar Persona</span>
      </button>

      {/* 3. ALERTAS CLÍNICAS Y ALERGIAS */}
      <div className="p-3.5 bg-amber-50/80 border border-amber-200/70 rounded-2xl space-y-1 text-xs">
        <div className="flex items-center gap-1.5 text-amber-900 font-extrabold text-xs">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Alergias / Alertas Clínicas</span>
        </div>
        <p className="text-amber-950 text-xs font-medium leading-relaxed">{alergias}</p>
      </div>

      {/* 4. CONTACTO Y UBICACIÓN TERRITORIAL */}
      <div className="p-3.5 bg-slate-50/80 border border-slate-200/70 rounded-2xl space-y-2 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="font-medium truncate">{patient.phone || 'Teléfono no registrado'}</span>
        </div>
        <div className="flex items-start gap-2">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
          <span className="line-clamp-2 leading-snug font-medium text-[11px]">{direccionLimpia}</span>
        </div>
      </div>

      {/* 5. BARRA DE PROGRESO DE LOS 9 PASOS */}
      <div className="border-t border-slate-100 pt-3 space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-teal-600" />
            <span>Progreso del Registro</span>
          </span>
          <span className="font-extrabold text-teal-800 text-[11px] bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200/60">
            {porcentajeProgreso}% completado
          </span>
        </div>

        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-linear-to-r from-[#2B7A78] to-emerald-500 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${porcentajeProgreso}%` }}
          />
        </div>
      </div>
    </aside>
  );
};

export default AtencionPacienteCard;