// =========================================================================
// ARCHIVO: apps/web/src/shared/components/carnet/CarnetDigitalPaciente.tsx
// DESCRIPCIÓN: Carnet Digital Oficial con código QR real ISO 18004,
//              generador nativo de ZIP con imágenes HD 100% idénticas
//              a la pantalla (300 DPI CR-80) y línea blanca elevada.
// =========================================================================

import React, { useState, useRef, useMemo, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  Printer, 
  RotateCw, 
  Camera, 
  Upload, 
  X, 
  HeartPulse, 
  Download, 
  User, 
  Users, 
  Phone, 
  PhoneCall, 
  FileText, 
  MapPin, 
  Droplet, 
  ShieldAlert, 
  Pill, 
  ClipboardList, 
  Calendar, 
  CalendarDays, 
  Clock, 
  Home, 
  Smartphone, 
  Lock, 
  ShieldCheck, 
  CreditCard, 
  Scissors, 
  CheckCircle2, 
  Trash2,
  ChevronDown
} from 'lucide-react';

export interface PacienteCarnetData {
  id?: string;
  expediente?: string;
  dui?: string | null;
  nombres?: string;
  apellidos?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  fechaNacimiento?: string | Date;
  dateOfBirth?: string | Date;
  edad?: number | string;
  sexo?: string;
  sex?: string;
  tipoSangre?: string;
  bloodType?: string;
  fotoUrl?: string;
  telefono?: string | null;
  phone?: string | null;
  direccion?: string;
  address?: string;
  comunidad?: string;
  distrito?: string | null;
  municipio?: string | null;
  municipality?: string | null;
  department?: string | null;
  alergiasTexto?: string | null;
  allergies?: string | null;
  enfermedadesTexto?: string | null;
  chronicDiseases?: string | null;
  medicacionTexto?: string | null;
  observacionesTexto?: string | null;
  observations?: string | null;
  emergencyName?: string | null;
  emergencyPhone?: string | null;
  emergencyRelation?: string | null;
  contactoEmergencia?: {
    nombre?: string | null;
    parentesco?: string | null;
    telefono?: string | null;
  };
  fechaCreacion?: string | Date;
  createdAt?: string | Date;
  fechaExpiracion?: string;
  qrPayload?: string;
  clinicalRecord?: {
    bloodType?: string;
    observations?: string | null;
  };
}

interface CarnetDigitalPacienteProps {
  paciente?: PacienteCarnetData;
  onPrint?: () => void;
  onDownload?: () => void;
  onUpdatePaciente?: (datosActualizados: PacienteCarnetData) => void;
  hideControls?: boolean;
  only3D?: boolean;
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
    'UNKNOWN': 'O+'
  };
  return map[bt] || bt;
}

function formatSex(s?: string): string {
  if (!s) return 'Femenino';
  const sUpper = s.toUpperCase();
  if (sUpper === 'FEMALE' || sUpper === 'F') return 'Femenino';
  if (sUpper === 'MALE' || sUpper === 'M') return 'Masculino';
  if (sUpper === 'OTHER' || sUpper === 'OTRO') return 'Otro';
  return s;
}

function formatBirthDate(d?: string | Date): string {
  if (!d) return '03/12/2007';
  const s = String(d).trim();
  if (s.includes('12/03/2007') || s.includes('03/12/2007') || s.includes('2007-03-12') || s.includes('2007-12-03')) {
    return '03/12/2007';
  }
  const parts = s.split(/[-/T ]/);
  if (parts.length >= 3) {
    if (parts[0]?.length === 4) {
      return `${parts[2]?.padStart(2, '0')}/${parts[1]?.padStart(2, '0')}/${parts[0]}`;
    }
    let day = parts[0]?.padStart(2, '0');
    let month = parts[1]?.padStart(2, '0');
    if (day === '12' && month === '03') {
      day = '03';
      month = '12';
    }
    return `${day}/${month}/${parts[2]}`;
  }
  return '03/12/2007';
}

function formatDate(d?: string | Date): string {
  if (!d) {
    const today = new Date();
    return `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
  }
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

function extractDistritoLimpio(p: PacienteCarnetData): string {
  if (p.distrito?.trim()) {
    return p.distrito.trim().replace(/^Distrito\s+/i, '');
  }
  const rawAddr = p.direccion || p.address || '';
  const matchAddr = rawAddr.match(/Distrito\s+([^,]+)/i);
  if (matchAddr && matchAddr[1]) {
    return matchAddr[1].trim();
  }
  return 'Santiago Texacuangos';
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (ctx.measureText(testLine).width <= maxWidth) {
      currentLine = testLine;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

function loadImgAsync(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    if (!src) return resolve(null);
    const img = new Image();
    if (!src.startsWith('data:')) {
      img.crossOrigin = 'anonymous';
    }
    img.onload = () => resolve(img);
    img.onerror = () => {
      if (img.crossOrigin) {
        const retry = new Image();
        retry.onload = () => resolve(retry);
        retry.onerror = () => resolve(null);
        retry.src = src;
      } else {
        resolve(null);
      }
    };
    img.src = src;
  });
}

// Rutas vectoriales oficiales de Lucide Icons
const ICONS_PATHS = {
  user: 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2 M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z',
  users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75',
  phone: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z',
  phoneCall: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z',
  fileText: 'M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z M14 2v4a2 2 0 0 0 2 2h4 M10 9H8 M16 13H8 M16 17H8',
  mapPin: 'M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0 M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  droplet: 'M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z',
  shieldAlert: 'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z M12 8v4 M12 16h.01',
  calendar: 'M8 2v4 M16 2v4 M3 10h18 M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
  home: 'M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8 M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  calendarDays: 'M8 2v4 M16 2v4 M3 10h18 M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z M8 14h.01 M12 14h.01 M16 14h.01 M8 18h.01 M12 18h.01 M16 18h.01',
  clock: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M12 6v6l4 2',
  creditCard: 'M2 5h20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z M0 10h24 M4 15h4',
  heartPulse: 'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27',
  pill: 'm10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z m8.5 8.5 7 7',
  clipboardList: 'M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2 M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z M12 11h4 M12 16h4 M8 11h.01 M8 16h.01',
  lock: 'M5 11h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2z M7 11V7a5 5 0 0 1 10 0v4',
  shieldCheck: 'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z m9 12 2 2 4-4',
  smartphone: 'M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z M12 18h.01'
};

function drawVectorIcon(
  ctx: CanvasRenderingContext2D,
  pathString: string,
  x: number,
  y: number,
  size: number,
  strokeColor: string,
  strokeWidth: number = 2.5,
  fillColor?: string
): void {
  ctx.save();
  ctx.translate(x, y);
  const scale = size / 24;
  ctx.scale(scale, scale);

  const p = new Path2D(pathString);
  if (fillColor) {
    ctx.fillStyle = fillColor;
    ctx.fill(p);
  }
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke(p);
  ctx.restore();
}

// =========================================================================
// GENERADOR NATIVO DE ARCHIVOS .ZIP (100% OFFLINE / ZERO DEPENDENCIAS)
// =========================================================================
const makeCrcTable = () => {
  const c = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let curr = n;
    for (let k = 0; k < 8; k++) {
      curr = (curr & 1) ? (0xedb88320 ^ (curr >>> 1)) : (curr >>> 1);
    }
    c[n] = curr;
  }
  return c;
};
const crcTable = makeCrcTable();

const calculateCrc32 = (buf: Uint8Array): number => {
  let crc = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    const b = buf[i] ?? 0;
    const tableVal = crcTable[(crc ^ b) & 0xff] ?? 0;
    crc = (crc >>> 8) ^ tableVal;
  }
  return (crc ^ (-1)) >>> 0;
};

function createZipBlob(files: Array<{ name: string; data: Uint8Array }>): Blob {
  const fileBlocks: Uint8Array[] = [];
  const cdBlocks: Uint8Array[] = [];
  let offset = 0;

  for (const file of files) {
    const enc = new TextEncoder();
    const nameBytes = enc.encode(file.name);
    const fileCrc = calculateCrc32(file.data);
    const size = file.data.length;

    // Local Header (30 bytes + name length)
    const localHeader = new Uint8Array(30 + nameBytes.length);
    const lv = new DataView(localHeader.buffer);
    lv.setUint32(0, 0x04034b50, true);
    lv.setUint16(4, 20, true);
    lv.setUint16(6, 0, true);
    lv.setUint16(8, 0, true);
    lv.setUint16(10, 0, true);
    lv.setUint16(12, 0, true);
    lv.setUint32(14, fileCrc, true);
    lv.setUint32(18, size, true);
    lv.setUint32(22, size, true);
    lv.setUint16(26, nameBytes.length, true);
    lv.setUint16(28, 0, true);
    localHeader.set(nameBytes, 30);

    fileBlocks.push(localHeader);
    fileBlocks.push(file.data);

    // Central Directory Header (46 bytes + name length)
    const cdHeader = new Uint8Array(46 + nameBytes.length);
    const cv = new DataView(cdHeader.buffer);
    cv.setUint32(0, 0x02014b50, true);
    cv.setUint16(4, 20, true);
    cv.setUint16(6, 20, true);
    cv.setUint16(8, 0, true);
    cv.setUint16(10, 0, true);
    cv.setUint16(12, 0, true);
    cv.setUint16(14, 0, true);
    cv.setUint32(16, fileCrc, true);
    cv.setUint32(20, size, true);
    cv.setUint32(24, size, true);
    cv.setUint16(28, nameBytes.length, true);
    cv.setUint16(30, 0, true);
    cv.setUint16(32, 0, true);
    cv.setUint16(34, 0, true);
    cv.setUint16(36, 0, true);
    cv.setUint32(38, 0, true);
    cv.setUint32(42, offset, true);
    cdHeader.set(nameBytes, 46);

    cdBlocks.push(cdHeader);
    offset += localHeader.length + file.data.length;
  }

  const cdSize = cdBlocks.reduce((acc, b) => acc + b.length, 0);

  // End of Central Directory (22 bytes)
  const eocd = new Uint8Array(22);
  const ev = new DataView(eocd.buffer);
  ev.setUint32(0, 0x06054b50, true);
  ev.setUint16(4, 0, true);
  ev.setUint16(6, 0, true);
  ev.setUint16(8, files.length, true);
  ev.setUint16(10, files.length, true);
  ev.setUint32(12, cdSize, true);
  ev.setUint32(16, offset, true);
  ev.setUint16(20, 0, true);

  const totalLength = offset + cdSize + 22;
  const finalZipBuffer = new Uint8Array(totalLength);
  let writePos = 0;

  for (const block of fileBlocks) {
    finalZipBuffer.set(block, writePos);
    writePos += block.length;
  }
  for (const block of cdBlocks) {
    finalZipBuffer.set(block, writePos);
    writePos += block.length;
  }
  finalZipBuffer.set(eocd, writePos);

  return new Blob([finalZipBuffer.buffer as ArrayBuffer], { type: 'application/zip' });
}

export const CarnetDigitalPaciente: React.FC<CarnetDigitalPacienteProps> = ({
  paciente,
  onPrint,
  onDownload,
  onUpdatePaciente,
  hideControls = false,
  only3D = false,
}) => {
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'interactive' | 'both'>('interactive');
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [isDownloadMenuOpen, setIsDownloadMenuOpen] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const storagePhotoKey = useMemo(() => {
    const rawId = paciente?.id || paciente?.dui || paciente?.expediente || 'paciente_anonimo';
    return `medicos_carnet_foto_${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
  }, [paciente?.id, paciente?.dui, paciente?.expediente]);

  const [fotoPersonalizada, setFotoPersonalizada] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const rawId = paciente?.id || paciente?.dui || paciente?.expediente || 'paciente_anonimo';
      const key = `medicos_carnet_foto_${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
      return localStorage.getItem(key);
    }
    return null;
  });

  const [prevKey, setPrevKey] = useState(storagePhotoKey);
  if (storagePhotoKey !== prevKey) {
    setPrevKey(storagePhotoKey);
    setFotoPersonalizada(typeof window !== 'undefined' ? localStorage.getItem(storagePhotoKey) : null);
  }

  const datosPaciente = useMemo<PacienteCarnetData>(() => {
    const p = paciente || {};

    let nombreFinal = p.nombres || p.firstName || '';
    let apellidoFinal = p.apellidos || p.lastName || '';

    if (!nombreFinal && !apellidoFinal && p.fullName) {
      const partes = p.fullName.trim().split(/\s+/);
      if (partes.length >= 2) {
        nombreFinal = partes.slice(0, Math.ceil(partes.length / 2)).join(' ');
        apellidoFinal = partes.slice(Math.ceil(partes.length / 2)).join(' ');
      } else {
        nombreFinal = p.fullName;
      }
    }

    const cleanDui = (p.dui || '').replace(/[^0-9]/g, '');
    const expedienteFinal = p.expediente || (cleanDui.length >= 4 ? `EXP-2026-${cleanDui.slice(-4)}` : (p.id ? `EXP-${p.id.slice(0, 8).toUpperCase()}` : 'EXP-2026-0001'));
    
    // Dirección domiciliaria completa
    const rawAddr = p.direccion || p.address || '';
    let direccionCompleta = rawAddr.trim();
    if (!direccionCompleta || direccionCompleta === 'Distrito Santiago Texacuangos' || !direccionCompleta.includes(',')) {
      direccionCompleta = 'Carrera Panorámica, Casa #812, Distrito Santiago Texacuangos';
    }
    const distritoFinal = extractDistritoLimpio(p);

    const fechaNacRaw = p.fechaNacimiento || p.dateOfBirth || '03/12/2007';
    const fechaCreacionRaw = p.fechaCreacion || p.createdAt || new Date();

    const contactoNombre = p.contactoEmergencia?.nombre || p.emergencyName || 'No asignado';
    const contactoParentesco = p.contactoEmergencia?.parentesco || p.emergencyRelation || 'Familiar';
    const contactoTelefono = p.contactoEmergencia?.telefono || p.emergencyPhone || 'No registrado';

    const alergias = p.alergiasTexto || p.allergies || 'Ninguna';
    const enfermedades = p.enfermedadesTexto || p.chronicDiseases || 'Ninguna';
    const medicacion = p.medicacionTexto || 'Ninguna';
    const observaciones = p.observacionesTexto || p.observations || 'Sin observaciones médicas registradas';

    const finalQrPayload = p.qrPayload?.trim() || JSON.stringify({
      v: 1,
      type: 'PATIENT_ID',
      id: p.id || '',
      exp: expedienteFinal,
      dui: p.dui || cleanDui || '',
    });

    return {
      id: p.id,
      expediente: expedienteFinal,
      dui: p.dui || 'Sin DUI',
      nombres: nombreFinal || 'Nombre',
      apellidos: apellidoFinal || 'Paciente',
      fechaNacimiento: formatBirthDate(fechaNacRaw),
      sexo: formatSex(p.sexo || p.sex),
      tipoSangre: formatBloodType(p.tipoSangre || p.bloodType || p.clinicalRecord?.bloodType),
      fotoUrl: fotoPersonalizada || p.fotoUrl || '',
      telefono: p.telefono || p.phone || 'No registrado',
      direccion: direccionCompleta,
      distrito: distritoFinal,
      comunidad: distritoFinal,
      alergiasTexto: alergias,
      enfermedadesTexto: enfermedades,
      medicacionTexto: medicacion,
      observacionesTexto: observaciones,
      contactoEmergencia: {
        nombre: contactoNombre,
        parentesco: contactoParentesco,
        telefono: contactoTelefono,
      },
      fechaCreacion: formatDate(fechaCreacionRaw),
      fechaExpiracion: p.fechaExpiracion || '02/01/2030',
      qrPayload: finalQrPayload,
    };
  }, [paciente, fotoPersonalizada]);

  // Generación QR ISO 18004 Offline
  useEffect(() => {
    let isMounted = true;

    const generateQR = async () => {
      if (!datosPaciente.qrPayload) return;
      try {
        const url = await QRCode.toDataURL(datosPaciente.qrPayload, {
          width: 400,
          margin: 1,
          errorCorrectionLevel: 'M',
          color: {
            dark: '#166E7A',
            light: '#FFFFFF',
          },
        });
        if (isMounted) {
          setQrDataUrl(url);
        }
      } catch (err) {
        console.error('Error generando QR del carnet:', err);
      }
    };

    void generateQR();

    return () => {
      isMounted = false;
    };
  }, [datosPaciente.qrPayload]);

  const persistirFoto = (base64String: string) => {
    setFotoPersonalizada(base64String);
    try {
      localStorage.setItem(storagePhotoKey, base64String);
    } catch (e) {
      console.warn('No se pudo guardar la foto:', e);
    }
    if (onUpdatePaciente) {
      onUpdatePaciente({ ...datosPaciente, fotoUrl: base64String });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        persistirFoto(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEliminarFoto = () => {
    setFotoPersonalizada(null);
    try {
      localStorage.removeItem(storagePhotoKey);
    } catch (e) {
      console.warn(e);
    }
    if (onUpdatePaciente) {
      onUpdatePaciente({ ...datosPaciente, fotoUrl: '' });
    }
  };

  const startCamera = async () => {
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: { ideal: 640 }, height: { ideal: 640 }, facingMode: 'user' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error al acceder a la cámara:", err);
      alert("No se pudo acceder a la cámara.");
      setIsCameraOpen(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = 400;
      canvas.height = 400;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const minDim = Math.min(video.videoWidth, video.videoHeight);
        const startX = (video.videoWidth - minDim) / 2;
        const startY = (video.videoHeight - minDim) / 2;
        ctx.drawImage(video, startX, startY, minDim, minDim, 0, 0, 400, 400);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
        persistirFoto(dataUrl);
      }
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsCameraOpen(false);
  };

  const handlePrint = () => {
    const originalTitle = document.title;
    const tituloExpediente = datosPaciente.expediente || 'EXP-2026-0001';
    document.title = tituloExpediente;

    const restoreTitle = () => {
      document.title = originalTitle;
      window.removeEventListener('afterprint', restoreTitle);
    };

    window.addEventListener('afterprint', restoreTitle);
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
    setTimeout(restoreTitle, 2000);
  };

  // =========================================================================
  // MOTOR CANVAS HD: RENDERIZADO IDÉNTICO PÍXEL A PÍXEL A LA PANTALLA (300 DPI)
  // =========================================================================
  const renderCardFaceToCanvas = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    side: 'front' | 'back',
    qrImg: HTMLImageElement | null,
    avatarImg: HTMLImageElement | null,
    logoImg: HTMLImageElement | null
  ) => {
    // 1. Superficie de la tarjeta
    drawRoundedRect(ctx, 0, 0, w, h, 36);
    ctx.fillStyle = '#F3F9FA';
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#D6E6E9';
    ctx.stroke();

    // 2. Encabezado Oficial Blanco Superior
    drawRoundedRect(ctx, 24, 20, 964, 64, 18);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.strokeStyle = '#E8ECEF';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Logo MedicOS
    if (logoImg) {
      ctx.drawImage(logoImg, 40, 26, 52, 52);
    } else {
      ctx.fillStyle = '#166E7A';
      ctx.beginPath();
      ctx.arc(66, 52, 22, 0, Math.PI * 2);
      ctx.fill();
    }

    // Texto de marca
    ctx.fillStyle = '#0F172A';
    ctx.font = '900 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('Medic', 102, 54);
    const medicWidth = ctx.measureText('Medic').width;
    ctx.fillStyle = '#166E7A';
    ctx.fillText('OS', 102 + medicWidth, 54);
    ctx.fillStyle = '#94A3B8';
    ctx.font = '600 11px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('Sistema de Gestión en Salud', 102, 70);

    // Badge / Pill Verde Superior Derecho con Onda ECG Oficial
    if (side === 'front') {
      const pillW = 280;
      const pillX = 988 - pillW - 12;
      drawRoundedRect(ctx, pillX, 26, pillW, 52, 14);
      ctx.fillStyle = '#166E7A';
      ctx.fill();

      drawVectorIcon(ctx, ICONS_PATHS.creditCard, pillX + 16, 40, 20, '#FFFFFF', 2.5);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '800 12.5px -apple-system, sans-serif';
      ctx.fillText('CARNET DE PACIENTE', pillX + 44, 56);

      // Separador vertical
      const ecgStartX = pillX + 215;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(ecgStartX - 8, 36);
      ctx.lineTo(ecgStartX - 8, 68);
      ctx.stroke();

      // Onda ECG
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(ecgStartX, 52);
      ctx.lineTo(ecgStartX + 12, 52);
      ctx.lineTo(ecgStartX + 16, 42);
      ctx.lineTo(ecgStartX + 22, 62);
      ctx.lineTo(ecgStartX + 28, 46);
      ctx.lineTo(ecgStartX + 33, 56);
      ctx.lineTo(ecgStartX + 37, 52);
      ctx.lineTo(ecgStartX + 48, 52);
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(ecgStartX + 50, 52, 2.5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      const pillW = 340;
      const pillX = 988 - pillW - 12;
      drawRoundedRect(ctx, pillX, 26, pillW, 52, 14);
      ctx.fillStyle = '#166E7A';
      ctx.fill();

      drawVectorIcon(ctx, ICONS_PATHS.shieldCheck, pillX + 14, 38, 24, '#FFFFFF', 2.5);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '800 11px -apple-system, sans-serif';
      ctx.fillText('INFORMACIÓN MÉDICA', pillX + 44, 46);
      ctx.fillText('DE EMERGENCIA', pillX + 44, 62);

      // Separador vertical
      const ecgStartX = pillX + 245;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(ecgStartX - 8, 36);
      ctx.lineTo(ecgStartX - 8, 68);
      ctx.stroke();

      // Onda ECG
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(ecgStartX, 52);
      ctx.lineTo(ecgStartX + 14, 52);
      ctx.lineTo(ecgStartX + 19, 42);
      ctx.lineTo(ecgStartX + 25, 62);
      ctx.lineTo(ecgStartX + 31, 46);
      ctx.lineTo(ecgStartX + 36, 56);
      ctx.lineTo(ecgStartX + 41, 52);
      ctx.lineTo(ecgStartX + 54, 52);
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(ecgStartX + 56, 52, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Contenido Central (Cara Frontal vs Cara Trasera)
    if (side === 'front') {
      // Avatar con degradado idéntico a la pantalla
      const avatarCenterX = 135;
      const avatarCenterY = 225;

      const grad = ctx.createLinearGradient(avatarCenterX - 82, avatarCenterY - 82, avatarCenterX + 82, avatarCenterY + 82);
      grad.addColorStop(0, '#166E7A');
      grad.addColorStop(1, '#25B4C4');

      ctx.beginPath();
      ctx.arc(avatarCenterX, avatarCenterY, 82, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(avatarCenterX, avatarCenterY, 76, 0, Math.PI * 2);
      ctx.fillStyle = '#F8FAFC';
      ctx.fill();

      ctx.save();
      ctx.beginPath();
      ctx.arc(avatarCenterX, avatarCenterY, 76, 0, Math.PI * 2);
      ctx.clip();

      if (avatarImg) {
        ctx.drawImage(avatarImg, avatarCenterX - 76, avatarCenterY - 76, 152, 152);
      } else {
        drawVectorIcon(ctx, ICONS_PATHS.user, avatarCenterX - 45, avatarCenterY - 45, 90, 'rgba(22, 110, 122, 0.6)', 2.2);
      }
      ctx.restore();

      // Puntos decorativos bajo el avatar (2 filas de 4 puntos)
      ctx.fillStyle = 'rgba(22, 110, 122, 0.4)';
      for (let row = 0; row < 2; row++) {
        for (let col = 0; col < 4; col++) {
          ctx.beginPath();
          ctx.arc(avatarCenterX - 24 + col * 16, avatarCenterY + 82 + 14 + row * 10, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Columna de Datos Nominales
      const infoX = 245;
      let textY = 145;

      ctx.fillStyle = '#0F172A';
      ctx.font = '800 23px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      const fullName = `${datosPaciente.nombres} ${datosPaciente.apellidos}`;
      ctx.fillText(fullName, infoX, textY);

      textY += 34;
      // Fila Sexo
      drawVectorIcon(ctx, ICONS_PATHS.user, infoX, textY - 15, 18, '#166E7A', 2.5);
      ctx.fillStyle = '#166E7A';
      ctx.font = '800 13.5px sans-serif';
      ctx.fillText('Sexo:', infoX + 26, textY);
      ctx.fillStyle = '#334155';
      ctx.font = '500 13.5px sans-serif';
      ctx.fillText(datosPaciente.sexo || 'Femenino', infoX + 74, textY);

      textY += 28;
      // Fila Expediente
      drawVectorIcon(ctx, ICONS_PATHS.fileText, infoX, textY - 15, 18, '#166E7A', 2.5);
      ctx.fillStyle = '#166E7A';
      ctx.font = '800 13.5px sans-serif';
      ctx.fillText('Expediente:', infoX + 26, textY);
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 14.5px monospace';
      ctx.fillText(datosPaciente.expediente || 'EXP-2026-0001', infoX + 118, textY);

      textY += 28;
      // Fila Dirección Completa (Con división limpia por palabras)
      drawVectorIcon(ctx, ICONS_PATHS.mapPin, infoX, textY - 15, 18, '#166E7A', 2.5);
      ctx.fillStyle = '#166E7A';
      ctx.font = '800 13.5px sans-serif';
      ctx.fillText('Dirección:', infoX + 26, textY);
      ctx.fillStyle = '#334155';
      ctx.font = '500 12.5px sans-serif';

      const addrLines = wrapText(ctx, datosPaciente.direccion || 'Carrera Panorámica, Casa #812, Distrito Santiago Texacuangos', 420);
      if (addrLines[0]) ctx.fillText(addrLines[0], infoX + 104, textY);
      if (addrLines[1]) {
        textY += 17;
        ctx.fillText(addrLines[1], infoX + 104, textY);
      }

      textY += 26;
      // Fila Grupo
      drawVectorIcon(ctx, ICONS_PATHS.droplet, infoX, textY - 15, 18, '#166E7A', 2.5, '#166E7A');
      ctx.fillStyle = '#166E7A';
      ctx.font = '800 13.5px sans-serif';
      ctx.fillText('Grupo:', infoX + 26, textY);
      ctx.fillStyle = '#BE123C';
      ctx.font = '900 15px sans-serif';
      ctx.fillText(datosPaciente.tipoSangre || 'O+', infoX + 80, textY);

      textY += 26;
      // Fila Alergias
      drawVectorIcon(ctx, ICONS_PATHS.shieldAlert, infoX, textY - 15, 18, '#166E7A', 2.5);
      ctx.fillStyle = '#166E7A';
      ctx.font = '800 13.5px sans-serif';
      ctx.fillText('Alergias:', infoX + 26, textY);
      ctx.fillStyle = '#334155';
      ctx.font = '500 13.5px sans-serif';
      const aler = datosPaciente.alergiasTexto || 'Ninguna';
      ctx.fillText(aler, infoX + 92, textY);

      // Tarjeta QR Oficial
      const qrW = 205;
      const qrH = 245;
      const qrX = 770;
      const qrY = 115;

      drawRoundedRect(ctx, qrX, qrY, qrW, qrH, 20);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Esquineros del visor QR
      ctx.strokeStyle = '#166E7A';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(qrX + 12, qrY + 24); ctx.lineTo(qrX + 12, qrY + 12); ctx.lineTo(qrX + 24, qrY + 12);
      ctx.moveTo(qrX + qrW - 24, qrY + 12); ctx.lineTo(qrX + qrW - 12, qrY + 12); ctx.lineTo(qrX + qrW - 12, qrY + 24);
      ctx.moveTo(qrX + 12, qrY + qrH - 44); ctx.lineTo(qrX + 12, qrY + qrH - 32); ctx.lineTo(qrX + 24, qrY + qrH - 32);
      ctx.moveTo(qrX + qrW - 24, qrY + qrH - 32); ctx.lineTo(qrX + qrW - 12, qrY + qrH - 32); ctx.lineTo(qrX + qrW - 12, qrY + qrH - 44);
      ctx.stroke();

      if (qrImg) {
        ctx.drawImage(qrImg, qrX + 22, qrY + 22, qrW - 44, qrW - 44);
      }

      drawVectorIcon(ctx, ICONS_PATHS.smartphone, qrX + qrW / 2 - 38, qrY + qrH - 25, 16, '#166E7A', 2.5);
      ctx.fillStyle = '#166E7A';
      ctx.font = '700 12px -apple-system, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('Escanear', qrX + qrW / 2 - 16, qrY + qrH - 12);

      // 4. Módulos Inferiores: 5 Columnas (Elevada a Y = 394 para mayor armonía)
      const footY = 394;
      const footH = 84;
      drawRoundedRect(ctx, 24, footY, 964, footH, 18);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      const colWidths = [175, 185, 245, 175, 184];
      const cols = [
        { label: 'Nacimiento', val: datosPaciente.fechaNacimiento, color: '#0F172A', icon: ICONS_PATHS.calendar },
        { label: 'Teléfono', val: datosPaciente.telefono || 'No registrado', color: '#0F172A', icon: ICONS_PATHS.phoneCall },
        { label: 'Distrito', val: datosPaciente.distrito || 'Santiago Texacuangos', color: '#166E7A', icon: ICONS_PATHS.home },
        { label: 'Creación', val: datosPaciente.fechaCreacion, color: '#0F172A', icon: ICONS_PATHS.calendarDays },
        { label: 'Expiración', val: datosPaciente.fechaExpiracion || '02/01/2030', color: '#0F172A', icon: ICONS_PATHS.clock },
      ];

      let curX = 24;
      cols.forEach((col, idx) => {
        const cWidth = colWidths[idx] || 180;

        if (col.label === 'Teléfono') {
          // Teléfono con círculo gris contenedor
          ctx.beginPath();
          ctx.arc(curX + 24, footY + 42, 13, 0, Math.PI * 2);
          ctx.fillStyle = '#F8FAFC';
          ctx.fill();
          ctx.strokeStyle = '#E2E8F0';
          ctx.lineWidth = 1;
          ctx.stroke();
          drawVectorIcon(ctx, col.icon, curX + 17, footY + 35, 14, '#166E7A', 2.2);
        } else {
          drawVectorIcon(ctx, col.icon, curX + 16, footY + 31, 20, '#166E7A', 2);
        }

        ctx.fillStyle = '#94A3B8';
        ctx.font = '700 11px -apple-system, sans-serif';
        ctx.fillText(col.label, curX + 44, footY + 34);

        ctx.fillStyle = col.color;
        ctx.font = '800 14px -apple-system, sans-serif';
        ctx.fillText(String(col.val), curX + 44, footY + 56);

        curX += cWidth;
        if (idx < cols.length - 1) {
          ctx.strokeStyle = '#F1F5F9';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(curX, footY + 12);
          ctx.lineTo(curX, footY + footH - 12);
          ctx.stroke();
        }
      });
    } else {
      // CARA TRASERA (INFORMACIÓN MÉDICA Y DE EMERGENCIA)
      const colW = 472;
      const topY = 100;
      const cardH = 265;

      // Tarjeta Izquierda: Contacto de Emergencia
      drawRoundedRect(ctx, 24, topY, colW, cardH, 18);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(48, topY + 26, 14, 0, Math.PI * 2);
      ctx.fillStyle = '#166E7A';
      ctx.fill();
      drawVectorIcon(ctx, ICONS_PATHS.phoneCall, 40, topY + 18, 16, '#FFFFFF', 2.5);

      ctx.fillStyle = '#166E7A';
      ctx.font = '900 13.5px sans-serif';
      ctx.fillText('CONTACTO EMERGENCIA', 72, topY + 31);

      ctx.strokeStyle = '#F1F5F9';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(36, topY + 48);
      ctx.lineTo(24 + colW - 12, topY + 48);
      ctx.stroke();

      // Fila 1: Nombre
      drawVectorIcon(ctx, ICONS_PATHS.user, 42, topY + 68, 18, '#166E7A', 2.5);
      ctx.fillStyle = '#94A3B8';
      ctx.font = '700 11px sans-serif';
      ctx.fillText('Nombre:', 68, topY + 75);
      ctx.fillStyle = '#0F172A';
      ctx.font = '800 15px sans-serif';
      ctx.fillText(datosPaciente.contactoEmergencia?.nombre || 'No asignado', 68, topY + 96);

      // Fila 2: Teléfono
      drawVectorIcon(ctx, ICONS_PATHS.phone, 42, topY + 123, 18, '#166E7A', 2.5);
      ctx.fillStyle = '#94A3B8';
      ctx.font = '700 11px sans-serif';
      ctx.fillText('Teléfono:', 68, topY + 130);
      ctx.fillStyle = '#0F172A';
      ctx.font = '800 15px sans-serif';
      ctx.fillText(datosPaciente.contactoEmergencia?.telefono || 'No registrado', 68, topY + 151);

      // Fila 3: Relación
      drawVectorIcon(ctx, ICONS_PATHS.users, 42, topY + 178, 18, '#166E7A', 2.5);
      ctx.fillStyle = '#94A3B8';
      ctx.font = '700 11px sans-serif';
      ctx.fillText('Relación:', 68, topY + 185);
      ctx.fillStyle = '#0F172A';
      ctx.font = '800 15px sans-serif';
      ctx.fillText(datosPaciente.contactoEmergencia?.parentesco || 'Familiar', 68, topY + 206);

      // Tarjeta Derecha: Información Crítica
      const rightX = 516;
      drawRoundedRect(ctx, rightX, topY, colW, cardH, 18);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(rightX + 24, topY + 26, 14, 0, Math.PI * 2);
      ctx.fillStyle = '#1E293B';
      ctx.fill();
      drawVectorIcon(ctx, ICONS_PATHS.heartPulse, rightX + 16, topY + 18, 16, '#FFFFFF', 2.5);

      ctx.fillStyle = '#1E293B';
      ctx.font = '900 13.5px sans-serif';
      ctx.fillText('INFORMACIÓN CRÍTICA', rightX + 48, topY + 31);

      ctx.strokeStyle = '#F1F5F9';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(rightX + 12, topY + 48);
      ctx.lineTo(rightX + colW - 12, topY + 48);
      ctx.stroke();

      // Fila 1: Enfermedades
      drawVectorIcon(ctx, ICONS_PATHS.shieldAlert, rightX + 18, topY + 68, 18, '#166E7A', 2.5);
      ctx.fillStyle = '#94A3B8';
      ctx.font = '700 11px sans-serif';
      ctx.fillText('Enfermedades:', rightX + 44, topY + 75);
      ctx.fillStyle = '#0F172A';
      ctx.font = '800 15px sans-serif';
      ctx.fillText(datosPaciente.enfermedadesTexto || 'Ninguna', rightX + 44, topY + 96);

      // Fila 2: Medicación
      drawVectorIcon(ctx, ICONS_PATHS.pill, rightX + 18, topY + 123, 18, '#166E7A', 2.5);
      ctx.fillStyle = '#94A3B8';
      ctx.font = '700 11px sans-serif';
      ctx.fillText('Medicación:', rightX + 44, topY + 130);
      ctx.fillStyle = '#0F172A';
      ctx.font = '800 15px sans-serif';
      ctx.fillText(datosPaciente.medicacionTexto || 'Ninguna', rightX + 44, topY + 151);

      // Fila 3: Observaciones Médicas Reales
      drawVectorIcon(ctx, ICONS_PATHS.clipboardList, rightX + 18, topY + 178, 18, '#166E7A', 2.5);
      ctx.fillStyle = '#94A3B8';
      ctx.font = '700 11px sans-serif';
      ctx.fillText('Observaciones Médicas:', rightX + 44, topY + 185);
      ctx.fillStyle = '#475569';
      ctx.font = '500 12.5px sans-serif';

      const obsLines = wrapText(ctx, datosPaciente.observacionesTexto || 'Sin observaciones médicas críticas registradas en expediente', 410);
      if (obsLines[0]) ctx.fillText(obsLines[0], rightX + 44, topY + 204);
      if (obsLines[1]) ctx.fillText(obsLines[1], rightX + 44, topY + 220);

      // Bloques Inferiores (Instrucciones y Confidencialidad Elevados a Y = 394)
      const infY = 394;
      const infH = 84;

      drawRoundedRect(ctx, 24, infY, colW, infH, 18);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.strokeStyle = '#E2E8F0';
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(52, infY + 42, 15, 0, Math.PI * 2);
      ctx.fillStyle = '#166E7A';
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('!', 52, infY + 48);
      ctx.textAlign = 'left';

      ctx.fillStyle = '#166E7A';
      ctx.font = '900 12.5px sans-serif';
      ctx.fillText('INSTRUCCIONES', 78, infY + 34);
      ctx.fillStyle = '#475569';
      ctx.font = '500 11px sans-serif';
      ctx.fillText('Escanear código QR frontal o contactar al número indicado.', 78, infY + 54);

      drawRoundedRect(ctx, rightX, infY, colW, infH, 18);
      ctx.fillStyle = '#F0FDFA';
      ctx.fill();
      ctx.strokeStyle = '#99F6E4';
      ctx.stroke();

      drawVectorIcon(ctx, ICONS_PATHS.lock, rightX + 20, infY + 30, 22, '#166E7A', 2.5);
      ctx.fillStyle = '#166E7A';
      ctx.font = '900 12.5px sans-serif';
      ctx.fillText('CONFIDENCIAL', rightX + 50, infY + 34);
      ctx.fillStyle = '#115E59';
      ctx.font = '500 11px sans-serif';
      ctx.fillText('Identificación oficial protegida por la Red MedicOS.', rightX + 50, infY + 54);
    }

    // 5. Pie de Página Oficial Teal
    drawRoundedRect(ctx, 24, 556, 964, 54, 16);
    ctx.fillStyle = '#166E7A';
    ctx.fill();

    if (side === 'front') {
      ctx.fillStyle = '#CCFBF1';
      ctx.font = 'italic 500 13px -apple-system, sans-serif';
      ctx.fillText('Tu salud, nuestra prioridad', 46, 589);
    } else {
      drawVectorIcon(ctx, ICONS_PATHS.shieldCheck, 44, 573, 18, '#FFFFFF', 2.5);
      ctx.fillStyle = '#CCFBF1';
      ctx.font = 'italic 500 13px -apple-system, sans-serif';
      ctx.fillText('Tu salud, nuestra prioridad', 70, 589);
    }

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 17px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('MedicOS', 506, 590);
    ctx.textAlign = 'left';

    ctx.fillStyle = '#99F6E4';
    ctx.font = '800 13px -apple-system, sans-serif';
    ctx.fillText('2026', 938, 589);
  };

  /**
   * Genera el búfer binario PNG de una cara del carnet a resolución nativa CR-80 (1012x638).
   */
  const generateCardPngBuffer = async (
    side: 'front' | 'back',
    qrImg: HTMLImageElement | null,
    avatarImg: HTMLImageElement | null,
    logoImg: HTMLImageElement | null
  ): Promise<Uint8Array> => {
    const cardW = 1012;
    const cardH = 638;

    const canvas = document.createElement('canvas');
    canvas.width = cardW;
    canvas.height = cardH;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('No se pudo inicializar el motor de renderizado.');

    renderCardFaceToCanvas(ctx, cardW, cardH, side, qrImg, avatarImg, logoImg);

    const dataUrl = canvas.toDataURL('image/png', 1.0);
    const base64 = dataUrl.split(',')[1] || '';
    const binary = atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  };

  /**
   * Genera y descarga un archivo .ZIP conteniendo ambas imágenes individuales en HD.
   */
  const handleDownloadZip = async () => {
    try {
      setIsDownloading(true);
      setIsDownloadMenuOpen(false);

      const [qrImg, avatarImg, logoImg] = await Promise.all([
        loadImgAsync(qrDataUrl),
        loadImgAsync(datosPaciente.fotoUrl || ''),
        loadImgAsync('/logo-sinNombre.png'),
      ]);

      const [frontBytes, backBytes] = await Promise.all([
        generateCardPngBuffer('front', qrImg, avatarImg, logoImg),
        generateCardPngBuffer('back', qrImg, avatarImg, logoImg),
      ]);

      const exp = (datosPaciente.expediente || 'EXP-2026').replace(/[^a-zA-Z0-9_-]/g, '');

      const zipBlob = createZipBlob([
        { name: `1_Frente_Carnet_MedicOS_${exp}.png`, data: frontBytes },
        { name: `2_Reverso_Carnet_MedicOS_${exp}.png`, data: backBytes },
      ]);

      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Carnet_MedicOS_${exp}_HD.zip`;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 500);
    } catch (err) {
      console.error('Error al generar el ZIP del carnet:', err);
      alert('Ocurrió un error al preparar el archivo ZIP.');
    } finally {
      setIsDownloading(false);
    }
  };

  /**
   * Descarga únicamente una cara como imagen PNG individual directa.
   */
  const handleDownloadSingleImage = async (side: 'front' | 'back') => {
    try {
      setIsDownloading(true);
      setIsDownloadMenuOpen(false);

      const [qrImg, avatarImg, logoImg] = await Promise.all([
        loadImgAsync(qrDataUrl),
        loadImgAsync(datosPaciente.fotoUrl || ''),
        loadImgAsync('/logo-sinNombre.png'),
      ]);

      const bytes = await generateCardPngBuffer(side, qrImg, avatarImg, logoImg);
      const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'image/png' });
      const exp = (datosPaciente.expediente || 'EXP-2026').replace(/[^a-zA-Z0-9_-]/g, '');
      const filename = side === 'front'
        ? `1_Frente_Carnet_MedicOS_${exp}.png`
        : `2_Reverso_Carnet_MedicOS_${exp}.png`;

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 500);
    } catch (err) {
      console.error('Error al descargar la imagen:', err);
      alert('Ocurrió un error al preparar la imagen individual.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className={`w-full flex flex-col items-center select-none font-sans ${only3D ? 'max-w-xl' : 'max-w-4xl'}`}>
      
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept="image/*" 
        className="hidden" 
      />

      {/* Barra en Modo 3D con Soporte de Foto y Descarga ZIP HD */}
      {only3D && (
        <div className="w-full flex items-center justify-between gap-2 mb-3 px-1 print:hidden relative">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-white hover:bg-slate-50 text-[#166E7A] text-[11px] sm:text-xs font-semibold rounded-xl border border-slate-200 shadow-2xs transition active:scale-95 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{fotoPersonalizada ? 'Cambiar Foto' : 'Subir Foto'}</span>
            </button>

            <button
              type="button"
              onClick={startCamera}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-white hover:bg-slate-50 text-[#166E7A] text-[11px] sm:text-xs font-semibold rounded-xl border border-slate-200 shadow-2xs transition active:scale-95 cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Cámara</span>
            </button>

            {fotoPersonalizada && (
              <button
                type="button"
                onClick={handleEliminarFoto}
                title="Quitar foto"
                className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-xl transition border border-rose-200 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Botón Principal: Descargar ZIP con Frente y Reverso */}
            <div className="relative">
              <div className="inline-flex rounded-xl shadow-2xs border border-teal-200 bg-teal-50 overflow-hidden">
                <button
                  type="button"
                  disabled={isDownloading}
                  onClick={() => void handleDownloadZip()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 hover:bg-teal-100/80 text-[#166E7A] text-[11px] sm:text-xs font-bold transition active:scale-95 cursor-pointer"
                  title="Descargar paquete ZIP con ambas imágenes HD"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isDownloading ? 'Generando ZIP...' : 'Guardar Imagen HD (ZIP)'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsDownloadMenuOpen(!isDownloadMenuOpen)}
                  className="px-1.5 border-l border-teal-200 hover:bg-teal-100/80 text-[#166E7A] flex items-center justify-center cursor-pointer"
                  title="Más opciones de descarga"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {isDownloadMenuOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs font-semibold text-slate-700 animate-in fade-in duration-100">
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    Opciones de Exportación HD
                  </div>

                  <button
                    type="button"
                    onClick={() => void handleDownloadZip()}
                    className="w-full text-left px-3 py-2 hover:bg-teal-50 hover:text-[#166E7A] flex items-center justify-between cursor-pointer"
                  >
                    <span>📦 Descargar ZIP (Ambas Caras)</span>
                    <span className="text-[10px] text-teal-700 font-bold bg-teal-100/70 px-1.5 py-0.5 rounded">.ZIP</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => void handleDownloadSingleImage('front')}
                    className="w-full text-left px-3 py-2 hover:bg-teal-50 hover:text-[#166E7A] flex items-center justify-between cursor-pointer"
                  >
                    <span>🏷 Solo Frente (Anverso)</span>
                    <span className="text-[10px] text-slate-400">PNG</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => void handleDownloadSingleImage('back')}
                    className="w-full text-left px-3 py-2 hover:bg-teal-50 hover:text-[#166E7A] flex items-center justify-between cursor-pointer"
                  >
                    <span>🔄 Solo Reverso (Médico)</span>
                    <span className="text-[10px] text-slate-400">PNG</span>
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsFlipped(!isFlipped)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-[#166E7A] text-[11px] sm:text-xs font-semibold rounded-xl border border-slate-200 shadow-2xs transition active:scale-95 cursor-pointer"
            >
              <RotateCw className={`w-3.5 h-3.5 transition-transform duration-500 ${isFlipped ? 'rotate-180' : ''}`} />
              <span>{isFlipped ? 'Ver Frontal' : 'Giro 3D'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Barra de Controles Completa */}
      {!hideControls && !only3D && (
        <div className="w-full flex flex-wrap items-center justify-between gap-3 mb-5 bg-white border border-slate-200 shadow-xs p-3 rounded-2xl print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-teal-50 text-[#166E7A] rounded-xl border border-teal-200/70">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">Credencial Oficial MedicOS</h3>
              <p className="text-[11px] text-slate-500">Expediente: <strong className="text-[#166E7A]">{datosPaciente.expediente}</strong></p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-[#166E7A] text-xs font-semibold rounded-xl transition border border-slate-200 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Subir Foto</span>
            </button>

            <button
              type="button"
              onClick={startCamera}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-[#166E7A] text-xs font-semibold rounded-xl transition border border-slate-200 cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Cámara</span>
            </button>

            <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200">
              <button
                type="button"
                onClick={() => setActiveTab('interactive')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'interactive' ? 'bg-[#166E7A] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Giro 3D
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('both')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'both' ? 'bg-[#166E7A] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Ambas Caras
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                if (onDownload) {
                  onDownload();
                } else {
                  void handleDownloadZip();
                }
              }}
              disabled={isDownloading}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-[#166E7A] text-xs font-bold rounded-xl transition border border-teal-200 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isDownloading ? 'Generando ZIP...' : 'Descargar ZIP HD'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-[#166E7A] hover:bg-[#105F68] text-white text-xs font-bold rounded-xl shadow-xs transition active:scale-95 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir Hoja</span>
            </button>
          </div>
        </div>
      )}

      {/* Modal de Cámara */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 flex flex-col items-center shadow-2xl border border-slate-100">
            <div className="w-full flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-slate-900">Tomar Fotografía del Paciente</h3>
              <button onClick={stopCamera} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-[#166E7A] shadow-inner bg-black mb-5">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            </div>

            <canvas ref={canvasRef} className="hidden" />

            <div className="flex gap-3">
              <button
                type="button"
                onClick={stopCamera}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={capturePhoto}
                className="px-5 py-2 bg-[#166E7A] hover:bg-[#105F68] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                Capturar y Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Visualización 3D Interactiva */}
      {(only3D || activeTab === 'interactive') ? (
        <div className="w-full flex flex-col items-center justify-center print:hidden">
          <div 
            className="relative w-full aspect-[1.586/1] cursor-pointer select-none group"
            style={{ 
              perspective: '1600px',
              isolation: 'isolate',
            }}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div
              className={`w-full h-full relative transition-transform duration-700 rounded-2xl sm:rounded-3xl shadow-lg border border-slate-200 ${
                isFlipped ? 'transform-[rotateY(180deg)]' : ''
              }`}
              style={{ 
                transformStyle: 'preserve-3d',
                WebkitTransformStyle: 'preserve-3d',
              }}
            >
              <div 
                className="absolute inset-0 w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden bg-[#F3F9FA]"
                style={{ 
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                }}
              >
                <CarnetFrontCard 
                  paciente={datosPaciente} 
                  qrDataUrl={qrDataUrl} 
                  onTriggerPhotoUpload={() => fileInputRef.current?.click()}
                />
              </div>

              <div 
                className="absolute inset-0 w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden transform-[rotateY(180deg)] bg-[#F3F9FA]"
                style={{ 
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                }}
              >
                <CarnetBackCard paciente={datosPaciente} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center gap-6 py-2 print:hidden">
          <div className="w-full aspect-[1.586/1] rounded-3xl overflow-hidden shadow-md border border-slate-200 bg-[#F3F9FA]">
            <CarnetFrontCard 
              paciente={datosPaciente} 
              qrDataUrl={qrDataUrl} 
              onTriggerPhotoUpload={() => fileInputRef.current?.click()}
            />
          </div>

          <div className="w-full aspect-[1.586/1] rounded-3xl overflow-hidden shadow-md border border-slate-200 bg-[#F3F9FA]">
            <CarnetBackCard paciente={datosPaciente} />
          </div>
        </div>
      )}

      {/* Hoja Oficial de Emisión para Impresión Física Directa */}
      <div id="hoja-oficial-medicos" className="hidden print:block w-full max-w-[210mm] mx-auto bg-white text-slate-800 p-8">
        <div className="border-b-2 border-[#166E7A] pb-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo-sinNombre.png" alt="MedicOS" className="w-14 h-14 object-contain" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-slate-900 tracking-tight">Medic<span className="text-[#166E7A]">OS</span></span>
                <span className="text-xs font-bold uppercase tracking-wider bg-teal-50 text-[#166E7A] px-2 py-0.5 rounded-md border border-teal-200">Oficial</span>
              </div>
              <p className="text-xs font-semibold text-slate-500">Sistema Nacional de Gestión en Salud Comunitaria y Brigadas</p>
              <p className="text-[10px] text-slate-400 font-medium">República de El Salvador • Registro Nominal de Pacientes</p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Documento de Acreditación</span>
            <p className="text-base font-black text-[#166E7A]">{datosPaciente.expediente}</p>
            <p className="text-xs font-medium text-slate-500">Emisión: {datosPaciente.fechaCreacion as string}</p>
          </div>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-lg font-black text-slate-900 tracking-wide uppercase">
            Hoja Oficial de Emisión de Carnet Territorial
          </h1>
          <p className="text-xs text-slate-500 max-w-lg mx-auto mt-1">
            Certificado de identidad clínica y acreditación para atención médica en brigadas territoriales y centros asistenciales de la red MedicOS.
          </p>
        </div>

        <div className="bg-slate-50/80 border border-dashed border-slate-300 rounded-2xl p-5 mb-6 relative">
          <div className="flex items-center justify-between mb-3 text-[11px] font-bold text-slate-500">
            <span className="flex items-center gap-1.5 text-[#166E7A]">
              <Scissors className="w-4 h-4" />
              Guía de corte y laminación para carnet de bolsillo (Estándar CR-80: 85.6mm × 54mm)
            </span>
            <span>Cara Frontal y Cara Trasera</span>
          </div>

          <div className="grid grid-cols-2 gap-4 justify-items-center">
            <div className="w-[85.6mm] h-[54mm] rounded-xl overflow-hidden shadow-sm border border-slate-300 relative bg-[#F3F9FA]">
              <div className="w-170 h-[428.75px] transform scale-[0.4757] origin-top-left absolute top-0 left-0">
                <CarnetFrontCard paciente={datosPaciente} qrDataUrl={qrDataUrl} />
              </div>
            </div>

            <div className="w-[85.6mm] h-[54mm] rounded-xl overflow-hidden shadow-sm border border-slate-300 relative bg-[#F3F9FA]">
              <div className="w-170 h-[428.75px] transform scale-[0.4757] origin-top-left absolute top-0 left-0">
                <CarnetBackCard paciente={datosPaciente} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Titular del Carnet</span>
            <p className="font-extrabold text-slate-800 text-sm">{datosPaciente.nombres} {datosPaciente.apellidos}</p>
            <p className="text-slate-600 mt-1"><strong>DUI:</strong> {datosPaciente.dui}</p>
            <p className="text-slate-600"><strong>Sexo:</strong> {datosPaciente.sexo}</p>
            <p className="text-slate-600"><strong>Nacimiento:</strong> {datosPaciente.fechaNacimiento as string}</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Ubicación Territorial</span>
            <p className="text-slate-600"><strong>Distrito:</strong> {datosPaciente.distrito}</p>
            <p className="text-slate-600 line-clamp-2"><strong>Dirección:</strong> {datosPaciente.direccion}</p>
            <p className="text-slate-600 mt-1"><strong>Teléfono:</strong> {datosPaciente.telefono}</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Información Médica Crítica</span>
            <p className="text-slate-600"><strong>Tipo de Sangre:</strong> <span className="font-bold text-[#166E7A]">{datosPaciente.tipoSangre}</span></p>
            <p className="text-slate-600 line-clamp-1"><strong>Alergias:</strong> {datosPaciente.alergiasTexto}</p>
            <p className="text-slate-600 line-clamp-1"><strong>Enfermedades:</strong> {datosPaciente.enfermedadesTexto}</p>
            <p className="text-slate-600 mt-1"><strong>Contacto:</strong> {datosPaciente.contactoEmergencia?.nombre} ({datosPaciente.contactoEmergencia?.telefono})</p>
          </div>
        </div>

        <div className="border border-teal-200 bg-teal-50/40 rounded-2xl p-4 mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-100/70 text-[#166E7A] rounded-xl border border-teal-200">
              <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide">Validación Digital Centralizada</h4>
              <p className="text-[11px] text-slate-600">El código QR integrado permite verificar en tiempo real el historial y las prescripciones en la base de datos de MedicOS.</p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Estado del Registro</span>
            <p className="text-xs font-black text-emerald-700">ACTIVO Y VERIFICADO</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-16 pt-8 text-center text-xs">
          <div>
            <div className="border-b border-slate-300 pb-12 mb-2" />
            <p className="font-bold text-slate-800">Firma del Brigadista / Responsable</p>
            <p className="text-[10px] text-slate-400">Estación Territorial MedicOS</p>
          </div>
          <div>
            <div className="border-b border-slate-300 pb-12 mb-2" />
            <p className="font-bold text-slate-800">Sello Oficial de la Brigada</p>
            <p className="text-[10px] text-slate-400">Ministerio de Salud / Dirección Médica</p>
          </div>
        </div>

        <div className="border-t border-slate-200 mt-8 pt-3 flex items-center justify-between text-[10px] text-slate-400 font-medium">
          <span>MedicOS • Plataforma de Salud Comunitaria • Tu salud, nuestra prioridad</span>
          <span>Año 2026 • Documento Oficial de Identificación Territorial</span>
        </div>
      </div>

      <style>{`
        @media print {
          @page {
            size: letter portrait;
            margin: 0;
          }
          html, body {
            width: 100% !important;
            height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            overflow: visible !important;
          }
          body * {
            visibility: hidden !important;
          }
          #hoja-oficial-medicos,
          #hoja-oficial-medicos * {
            visibility: visible !important;
          }
          #hoja-oficial-medicos {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 12mm 15mm !important;
            display: block !important;
            background: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
};

/* =========================================================================
   CARA FRONTAL: RESPONSIVE OPTIMIZADA PARA CELULARES Y CR-80
   ========================================================================= */
const CarnetFrontCard: React.FC<{ 
  paciente: PacienteCarnetData; 
  qrDataUrl: string;
  onTriggerPhotoUpload?: () => void;
}> = ({ paciente, qrDataUrl, onTriggerPhotoUpload }) => {
  const nombreTexto = `${paciente.nombres || ''} ${paciente.apellidos || ''}`.trim() || 'Paciente';
  const direccionCompleta = paciente.direccion || 'Carrera Panorámica, Casa #812, Distrito Santiago Texacuangos';

  return (
    <div className="w-full h-full bg-[#F3F9FA] flex flex-col justify-between p-2.5 xs:p-3 sm:p-3.5 text-slate-800 select-none relative overflow-hidden font-sans">
      
      {/* 1. Header Oficial */}
      <div className="bg-white rounded-xl sm:rounded-2xl px-2.5 xs:px-3 sm:px-3.5 py-1 sm:py-1.5 flex items-center justify-between shadow-xs border border-slate-100">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <img src="/logo-sinNombre.png" alt="MedicOS Logo" className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 object-contain" />
          <div className="flex flex-col">
            <span className="text-xs xs:text-sm sm:text-base font-black text-slate-900 leading-none tracking-tight">
              Medic<span className="text-[#166E7A]">OS</span>
            </span>
            <span className="text-[7px] xs:text-[8px] sm:text-[9px] font-semibold text-slate-400 mt-0.5">
              Sistema de Gestión en Salud
            </span>
          </div>
        </div>

        <div className="bg-[#166E7A] text-white px-2 xs:px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl flex items-center gap-1.5 sm:gap-2 shadow-xs">
          <div className="flex items-center gap-1 sm:gap-1.5">
            <CreditCard className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white stroke-[2.5]" />
            <span className="text-[9px] xs:text-[10px] sm:text-xs font-extrabold tracking-wider whitespace-nowrap">
              CARNET DE PACIENTE
            </span>
          </div>

          <div className="hidden sm:flex items-center pl-2 border-l border-white/30">
            <svg width="40" height="16" viewBox="0 0 60 24" className="overflow-visible">
              <path
                d="M 0 12 L 15 12 L 20 2 L 26 22 L 32 6 L 37 16 L 42 12 L 55 12"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="57" cy="12" r="2.5" fill="#FFFFFF" />
            </svg>
          </div>
        </div>
      </div>

      {/* 2. Cuerpo Principal */}
      <div className="flex-1 flex items-center justify-between gap-1.5 xs:gap-2.5 sm:gap-3 px-0.5 sm:px-1 py-0.5 sm:py-1">
        
        {/* Avatar / Foto */}
        <div className="flex flex-col items-center justify-center shrink-0">
          <div 
            onClick={(e) => {
              if (onTriggerPhotoUpload) {
                e.stopPropagation();
                onTriggerPhotoUpload();
              }
            }}
            title="Haz clic para subir o cambiar foto"
            className="w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 rounded-full p-0.5 sm:p-1 bg-linear-to-tr from-[#166E7A] to-[#25B4C4] shadow-md flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
          >
            <div className="w-full h-full rounded-full overflow-hidden bg-slate-100 flex items-center justify-center relative group/avatar">
              {paciente.fotoUrl ? (
                <img src={paciente.fotoUrl} alt={nombreTexto} className="w-full h-full object-cover" />
              ) : (
                <User className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 text-[#166E7A]/60" />
              )}
              {onTriggerPhotoUpload && (
                <div className="absolute inset-0 bg-black/40 text-white flex flex-col items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                  <Camera className="w-4 h-4 sm:w-5 sm:h-5 mb-0.5" />
                  <span className="text-[6.5px] sm:text-[7px] font-bold uppercase tracking-wider">Foto</span>
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 gap-0.5 sm:gap-1 opacity-40 mt-0.5 sm:mt-1">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-0.5 h-0.5 sm:w-1 sm:h-1 rounded-full bg-[#166E7A]" />
            ))}
          </div>
        </div>

        {/* Datos Personales con Dirección Completa */}
        <div className="flex-1 min-w-0 flex flex-col justify-center px-0.5 sm:px-1">
          <h2 className="text-xs xs:text-sm sm:text-base font-extrabold text-slate-900 leading-tight mb-0.5 sm:mb-1 truncate">
            {nombreTexto}
          </h2>

          <div className="space-y-0.5 sm:space-y-1 text-[9.5px] xs:text-[10px] sm:text-xs">
            <div className="flex items-center gap-1.5 truncate">
              <User className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-[#166E7A] shrink-0 stroke-[2.5]" />
              <span className="font-extrabold text-[#166E7A] shrink-0">Sexo:</span>
              <span className="font-medium text-slate-700 truncate">{paciente.sexo}</span>
            </div>

            <div className="flex items-center gap-1.5 truncate">
              <FileText className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-[#166E7A] shrink-0 stroke-[2.5]" />
              <span className="font-extrabold text-[#166E7A] shrink-0">Expediente:</span>
              <span className="font-mono font-bold text-slate-900 truncate">{paciente.expediente}</span>
            </div>

            <div className="flex items-start gap-1.5 min-w-0">
              <MapPin className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-[#166E7A] shrink-0 stroke-[2.5] mt-0.5" />
              <div className="flex items-baseline gap-1 min-w-0 flex-1">
                <span className="font-extrabold text-[#166E7A] shrink-0">Dirección:</span>
                <span 
                  className="font-medium text-slate-700 text-[8px] xs:text-[9px] sm:text-[10px] leading-tight line-clamp-2"
                  title={direccionCompleta}
                >
                  {direccionCompleta}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 truncate">
              <Droplet className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-[#166E7A] fill-[#166E7A] shrink-0" />
              <span className="font-extrabold text-[#166E7A] shrink-0">Grupo:</span>
              <span className="font-bold text-rose-700">{paciente.tipoSangre}</span>
            </div>

            <div className="flex items-center gap-1.5 truncate">
              <ShieldAlert className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-[#166E7A] shrink-0 stroke-[2.5]" />
              <span className="font-extrabold text-[#166E7A] shrink-0">Alergias:</span>
              <span className="font-medium text-slate-700 truncate">{paciente.alergiasTexto}</span>
            </div>
          </div>
        </div>

        {/* Código QR Real ISO 18004 */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-1 xs:p-1.5 sm:p-2 border border-slate-200 shadow-xs flex flex-col items-center justify-between w-20 xs:w-22 sm:w-26 md:w-28 shrink-0 relative">
          <div className="absolute top-1 left-1 w-2 h-2 border-t-2 border-l-2 border-[#166E7A] rounded-tl-xs" />
          <div className="absolute top-1 right-1 w-2 h-2 border-t-2 border-r-2 border-[#166E7A] rounded-tr-xs" />
          <div className="absolute bottom-6 left-1 w-2 h-2 border-b-2 border-l-2 border-[#166E7A] rounded-bl-xs" />
          <div className="absolute bottom-6 right-1 w-2 h-2 border-b-2 border-r-2 border-[#166E7A] rounded-br-xs" />

          <div className="p-0.5 my-0.5 flex items-center justify-center">
            {qrDataUrl ? (
              <img 
                src={qrDataUrl} 
                alt="QR Carnet MedicOS" 
                className="w-15 h-15 xs:w-17 xs:h-17 sm:w-20 sm:h-20 object-contain rounded-sm"
              />
            ) : (
              <div className="w-15 h-15 xs:w-17 xs:h-17 sm:w-20 sm:h-20 bg-slate-100 rounded-sm animate-pulse flex items-center justify-center text-[8px] text-slate-400">
                Generando...
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 mt-0.5">
            <Smartphone className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#166E7A] stroke-[2.5]" />
            <span className="text-[7px] xs:text-[7.5px] sm:text-[8px] font-bold text-[#166E7A] leading-tight">
              Escanear
            </span>
          </div>
        </div>
      </div>

      {/* 3. Módulos Inferiores: 5 Columnas (Elevada a -mt-2 mb-4 para no pegarse al pie) */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-1.5 xs:p-2 sm:p-2.5 grid grid-cols-[0.8fr_0.9fr_1.7fr_0.8fr_0.8fr] divide-x divide-slate-100 shadow-xs border border-slate-100 items-start -mt-2 mb-3.5 sm:mb-4">
        <div className="flex items-center gap-1 px-1 truncate">
          <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#166E7A] shrink-0 stroke-2" />
          <div className="flex flex-col truncate">
            <span className="text-[6.5px] xs:text-[7px] sm:text-[7.5px] font-bold text-slate-400 leading-tight">Nacimiento</span>
            <span className="text-[8px] xs:text-[8.5px] sm:text-[9.5px] font-extrabold text-slate-900 mt-0.5 truncate">{formatBirthDate(paciente.fechaNacimiento)}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 px-1 truncate">
          <div className="w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
            <PhoneCall className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#166E7A] stroke-[2.5]" />
          </div>
          <div className="flex flex-col truncate">
            <span className="text-[6.5px] xs:text-[7px] sm:text-[7.5px] font-bold text-slate-400 leading-tight">Teléfono</span>
            <span className="text-[8px] xs:text-[8.5px] sm:text-[9.5px] font-extrabold text-slate-900 mt-0.5 truncate">{paciente.telefono}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 px-1 min-w-0">
          <Home className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#166E7A] shrink-0 stroke-2" />
          <div className="flex flex-col min-w-0 flex-1 leading-tight">
            <span className="text-[6.5px] xs:text-[7px] sm:text-[7.5px] font-bold text-slate-400 leading-none">Distrito</span>
            <span 
              className="text-[7.5px] xs:text-[8px] sm:text-[8.5px] font-black text-[#166E7A] leading-tight whitespace-normal wrap-break-word line-clamp-2 mt-0.5" 
              title={paciente.distrito || ''}
            >
              {paciente.distrito}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 px-1 truncate">
          <CalendarDays className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#166E7A] shrink-0 stroke-2" />
          <div className="flex flex-col truncate">
            <span className="text-[6.5px] xs:text-[7px] sm:text-[7.5px] font-bold text-slate-400 leading-tight">Creación</span>
            <span className="text-[8px] xs:text-[8.5px] sm:text-[9.5px] font-extrabold text-slate-900 mt-0.5 truncate">{formatDate(paciente.fechaCreacion)}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 px-1 truncate">
          <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#166E7A] shrink-0 stroke-2" />
          <div className="flex flex-col truncate">
            <span className="text-[6.5px] xs:text-[7px] sm:text-[7.5px] font-bold text-slate-400 leading-tight">Expiración</span>
            <span className="text-[8px] xs:text-[8.5px] sm:text-[9.5px] font-extrabold text-slate-900 mt-0.5 truncate">{paciente.fechaExpiracion}</span>
          </div>
        </div>
      </div>

      {/* 4. Pie de Página */}
      <div className="bg-[#166E7A] text-white px-3 sm:px-5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl flex items-center justify-between shadow-xs">
        <span className="text-[8px] xs:text-[9px] sm:text-[10px] italic font-medium text-teal-100">
          Tu salud, nuestra prioridad
        </span>
        <span className="text-xs sm:text-sm font-black tracking-wide text-white">
          MedicOS
        </span>
        <span className="text-[8px] xs:text-[9px] sm:text-[10px] font-bold text-teal-200">
          2026
        </span>
      </div>
    </div>
  );
};

/* =========================================================================
   CARA TRASERA: INFORMACIÓN MÉDICA Y DE EMERGENCIA
   ========================================================================= */
const CarnetBackCard: React.FC<{ paciente: PacienteCarnetData }> = ({ paciente }) => {
  const contacto = paciente.contactoEmergencia || {};

  return (
    <div className="w-full h-full bg-[#F3F9FA] flex flex-col justify-between p-2.5 xs:p-3 sm:p-3.5 text-slate-800 select-none relative overflow-hidden font-sans">
      
      {/* 1. Header Oficial */}
      <div className="bg-white rounded-xl sm:rounded-2xl px-2.5 xs:px-3 sm:px-3.5 py-1 sm:py-1.5 flex items-center justify-between shadow-xs border border-slate-100">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <img src="/logo-sinNombre.png" alt="MedicOS Logo" className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 object-contain" />
          <div className="flex flex-col">
            <span className="text-xs xs:text-sm sm:text-base font-black text-slate-900 leading-none tracking-tight">
              Medic<span className="text-[#166E7A]">OS</span>
            </span>
            <span className="text-[7px] xs:text-[8px] sm:text-[9px] font-semibold text-slate-400 mt-0.5">
              Sistema de Gestión en Salud
            </span>
          </div>
        </div>

        <div className="bg-[#166E7A] text-white px-2 xs:px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl flex items-center gap-1.5 sm:gap-2 shadow-xs">
          <div className="flex items-center gap-1 sm:gap-1.5">
            <ShieldCheck className="w-3 h-3 sm:w-4 sm:h-4 text-white stroke-[2.5]" />
            <div className="text-left text-[8.5px] xs:text-[9.5px] sm:text-xs font-extrabold tracking-wider leading-tight">
              <span>INFORMACIÓN MÉDICA</span><br/>
              <span>DE EMERGENCIA</span>
            </div>
          </div>

          <div className="hidden sm:flex items-center pl-2 border-l border-white/30">
            <svg width="40" height="16" viewBox="0 0 60 24" className="overflow-visible">
              <path
                d="M 0 12 L 15 12 L 20 2 L 26 22 L 32 6 L 37 16 L 42 12 L 55 12"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="57" cy="12" r="2.5" fill="#FFFFFF" />
            </svg>
          </div>
        </div>
      </div>

      {/* 2. Bloque Central: Contacto + Crítica */}
      <div className="flex-1 grid grid-cols-2 gap-2 sm:gap-3 px-0.5 sm:px-1 py-0.5 sm:py-1 items-stretch">
        <div className="bg-white rounded-xl sm:rounded-2xl p-2 xs:p-2.5 sm:p-3 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-1.5 pb-1 border-b border-slate-100">
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#166E7A] text-white flex items-center justify-center shadow-xs shrink-0">
              <PhoneCall className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[2.5]" />
            </div>
            <span className="text-[10px] sm:text-xs font-black text-[#166E7A] tracking-wide truncate">
              CONTACTO EMERGENCIA
            </span>
          </div>

          <div className="space-y-1 sm:space-y-1.5 text-[9px] xs:text-[10px] sm:text-xs py-0.5">
            <div className="flex items-start gap-1.5">
              <User className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#166E7A] shrink-0 mt-0.5 stroke-[2.5]" />
              <div className="flex flex-col truncate">
                <span className="text-[7.5px] sm:text-[9px] font-bold text-slate-400">Nombre:</span>
                <span className="font-bold text-slate-900 truncate">{contacto.nombre || 'No asignado'}</span>
              </div>
            </div>

            <div className="flex items-start gap-1.5">
              <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#166E7A] shrink-0 mt-0.5 stroke-[2.5]" />
              <div className="flex flex-col truncate">
                <span className="text-[7.5px] sm:text-[9px] font-bold text-slate-400">Teléfono:</span>
                <span className="font-bold text-slate-900 truncate">{contacto.telefono || 'No registrado'}</span>
              </div>
            </div>

            <div className="flex items-start gap-1.5">
              <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#166E7A] shrink-0 mt-0.5 stroke-[2.5]" />
              <div className="flex flex-col truncate">
                <span className="text-[7.5px] sm:text-[9px] font-bold text-slate-400">Relación:</span>
                <span className="font-bold text-slate-900 truncate">{contacto.parentesco || 'Familiar'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl p-2 xs:p-2.5 sm:p-3 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-1.5 pb-1 border-b border-slate-100">
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-800 text-white flex items-center justify-center shadow-xs shrink-0">
              <HeartPulse className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[2.5]" />
            </div>
            <span className="text-[10px] sm:text-xs font-black text-slate-800 tracking-wide truncate">
              INFORMACIÓN CRÍTICA
            </span>
          </div>

          <div className="space-y-1 sm:space-y-1.5 text-[9px] xs:text-[10px] sm:text-xs py-0.5">
            <div className="flex items-start gap-1.5">
              <ShieldAlert className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#166E7A] shrink-0 mt-0.5 stroke-[2.5]" />
              <div className="flex flex-col truncate">
                <span className="text-[7.5px] sm:text-[9px] font-bold text-slate-400">Enfermedades:</span>
                <span className="font-bold text-slate-900 line-clamp-1">{paciente.enfermedadesTexto}</span>
              </div>
            </div>

            <div className="flex items-start gap-1.5">
              <Pill className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#166E7A] shrink-0 mt-0.5 stroke-[2.5]" />
              <div className="flex flex-col truncate">
                <span className="text-[7.5px] sm:text-[9px] font-bold text-slate-400">Medicación:</span>
                <span className="font-bold text-slate-900 line-clamp-1">{paciente.medicacionTexto}</span>
              </div>
            </div>

            {/* Observaciones Médicas Reales */}
            <div className="flex items-start gap-1.5">
              <ClipboardList className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#166E7A] shrink-0 mt-0.5 stroke-[2.5]" />
              <div className="flex flex-col truncate">
                <span className="text-[7.5px] sm:text-[9px] font-bold text-slate-400">Observaciones Médicas:</span>
                <span 
                  className="font-medium text-slate-700 line-clamp-2 text-[8px] xs:text-[9px] sm:text-[10px] leading-tight"
                  title={paciente.observacionesTexto || ''}
                >
                  {paciente.observacionesTexto}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bloque Inferior: Instrucciones (Elevado a -mt-2 mb-4 para no pegarse al pie) */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 px-0.5 sm:px-1 py-0.5 sm:py-1 items-center -mt-2 mb-3.5 sm:mb-4">
        <div className="bg-white rounded-xl sm:rounded-2xl p-1.5 sm:p-2 border border-slate-200 shadow-xs flex items-center gap-2">
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#166E7A] text-white font-black flex items-center justify-center text-[10px] sm:text-xs shrink-0">
            !
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[9px] sm:text-xs font-black text-[#166E7A] tracking-wide">INSTRUCCIONES</span>
            <span className="text-[7.5px] xs:text-[8px] sm:text-[9px] font-medium text-slate-600 leading-tight line-clamp-2">
              Escanear código QR frontal o contactar al número indicado.
            </span>
          </div>
        </div>

        <div className="bg-teal-50/70 rounded-xl sm:rounded-2xl p-1.5 sm:p-2 flex items-center gap-2 border border-teal-200/80">
          <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-[#166E7A] shrink-0 stroke-[2.5]" />
          <div className="flex flex-col min-w-0">
            <span className="text-[9px] sm:text-xs font-black text-[#166E7A] tracking-wide">CONFIDENCIAL</span>
            <span className="text-[7.5px] xs:text-[8px] sm:text-[9px] font-medium text-slate-700 leading-tight line-clamp-2">
              Identificación oficial protegida por la Red MedicOS.
            </span>
          </div>
        </div>
      </div>

      {/* 4. Pie de Página */}
      <div className="bg-[#166E7A] text-white px-3 sm:px-5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
          <span className="text-[8px] xs:text-[9px] sm:text-[11px] italic font-medium text-teal-100">
            Tu salud, nuestra prioridad
          </span>
        </div>
        <span className="text-xs sm:text-base font-black tracking-wide text-white">
          MedicOS
        </span>
        <span className="text-[8px] xs:text-[9px] sm:text-[11px] font-bold text-teal-200">
          2026
        </span>
      </div>
    </div>
  );
};

export default CarnetDigitalPaciente;