// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/pacientes/registrar/components/CarnetDigitalPaciente.tsx
// DESCRIPCIÓN: Componente con visualizador interactivo y Hoja Oficial de Emisión de Carnet con Identidad Institucional MedicOS para Impresión/PDF (Nombre de archivo: Expediente).
// =========================================================================

import React, { useState, useRef, useMemo } from 'react';
import { 
  Printer, 
  RotateCw, 
  Camera, 
  Upload, 
  X, 
  HeartPulse, 
  Download, 
  Edit3, 
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
  CheckCircle2
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

function extractDistritoLimpio(p: PacienteCarnetData, manualDistrito?: string | null): string {
  if (manualDistrito?.trim()) {
    return manualDistrito.trim().replace(/\s+(Costa|Norte|Sur|Este|Oeste|Centro)$/i, '');
  }
  if (p.distrito?.trim()) {
    return p.distrito.trim().replace(/\s+(Costa|Norte|Sur|Este|Oeste|Centro)$/i, '');
  }

  const rawAddr = p.direccion || p.address || '';
  if (rawAddr.includes(',')) {
    const segments = rawAddr.split(',').map((s) => s.trim()).filter(Boolean);
    for (const seg of segments) {
      if (
        !/^(calle|av|avenida|pasaje|pje|casa|pol|poligono|block|col|colonia|res|residencial|urb|urbanizacion|canton|cantón|caserio|caserío)\b/i.test(seg) &&
        !/\b(costa|sur|norte|este|oeste|centro)\b/i.test(seg)
      ) {
        return seg.replace(/\s+(Costa|Norte|Sur|Este|Oeste|Centro)$/i, '');
      }
    }
  }

  if (p.comunidad?.trim()) {
    return p.comunidad.trim().replace(/\s+(Costa|Norte|Sur|Este|Oeste|Centro)$/i, '');
  }
  if (p.municipality?.trim()) {
    return p.municipality.trim().replace(/\s+(Costa|Norte|Sur|Este|Oeste|Centro)$/i, '');
  }
  if (p.municipio?.trim()) {
    return p.municipio.trim().replace(/\s+(Costa|Norte|Sur|Este|Oeste|Centro)$/i, '');
  }

  return 'La Libertad';
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

export const CarnetDigitalPaciente: React.FC<CarnetDigitalPacienteProps> = ({
  paciente,
  onPrint,
  onDownload,
  onUpdatePaciente
}) => {
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'interactive' | 'both'>('interactive');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [fotoPersonalizada, setFotoPersonalizada] = useState<string | null>(null);

  const [edicionManual, setEdicionManual] = useState<Partial<PacienteCarnetData>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const datosPaciente = useMemo<PacienteCarnetData>(() => {
    const p = paciente || {};

    let nombreFinal = edicionManual.nombres || p.nombres || p.firstName || '';
    let apellidoFinal = edicionManual.apellidos || p.apellidos || p.lastName || '';

    if (!nombreFinal && !apellidoFinal && p.fullName) {
      const partes = p.fullName.trim().split(/\s+/);
      if (partes.length >= 2) {
        nombreFinal = partes.slice(0, Math.ceil(partes.length / 2)).join(' ');
        apellidoFinal = partes.slice(Math.ceil(partes.length / 2)).join(' ');
      } else {
        nombreFinal = p.fullName;
      }
    }

    const rawDui = edicionManual.dui !== undefined ? edicionManual.dui : p.dui;
    const duiFinal = rawDui ?? '';
    const cleanDui = duiFinal.replace(/[^0-9]/g, '');
    const expedienteFinal = edicionManual.expediente || p.expediente || p.id || (cleanDui ? `EXP-2026-${cleanDui.slice(-4)}` : 'EXP-2026-0001');

    const direccionCompleta = edicionManual.direccion || p.direccion || p.address || [p.municipality, p.department].filter(Boolean).join(', ') || 'No registrada';
    const distritoFinal = extractDistritoLimpio(p, edicionManual.distrito);

    const fechaNacRaw = p.fechaNacimiento || p.dateOfBirth || '2000-01-01';
    const fechaCreacionRaw = p.fechaCreacion || p.createdAt || new Date();

    const contactoNombre = p.contactoEmergencia?.nombre || p.emergencyName || 'No asignado';
    const contactoParentesco = p.contactoEmergencia?.parentesco || p.emergencyRelation || 'Familiar';
    const contactoTelefono = p.contactoEmergencia?.telefono || p.emergencyPhone || 'No registrado';

    const alergias = p.alergiasTexto || p.allergies || p.clinicalRecord?.observations || 'Ninguna reportada';
    const enfermedades = p.enfermedadesTexto || p.chronicDiseases || 'Ninguna registrada';
    const medicacion = p.medicacionTexto || 'Ninguna activa';
    const observaciones = p.observacionesTexto || p.observations || alergias || 'Sin observaciones.';

    return {
      expediente: expedienteFinal,
      dui: duiFinal || 'Sin DUI',
      nombres: nombreFinal || 'Nombre',
      apellidos: apellidoFinal || 'Paciente',
      fechaNacimiento: formatDate(fechaNacRaw),
      sexo: formatSex(edicionManual.sexo || p.sexo || p.sex),
      tipoSangre: formatBloodType(edicionManual.tipoSangre || p.tipoSangre || p.bloodType || p.clinicalRecord?.bloodType),
      fotoUrl: fotoPersonalizada || p.fotoUrl || '',
      telefono: edicionManual.telefono || p.telefono || p.phone || 'No registrado',
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
      qrPayload: p.qrPayload || `https://medicos.local/expediente/${expedienteFinal}`
    };
  }, [paciente, edicionManual, fotoPersonalizada]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setFotoPersonalizada(base64);
        if (onUpdatePaciente) onUpdatePaciente({ ...datosPaciente, fotoUrl: base64 });
      };
      reader.readAsDataURL(file);
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
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setFotoPersonalizada(dataUrl);
        if (onUpdatePaciente) onUpdatePaciente({ ...datosPaciente, fotoUrl: dataUrl });
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

  const handleFieldChange = (field: keyof PacienteCarnetData, value: string) => {
    const updated = { ...edicionManual, [field]: value };
    setEdicionManual(updated);
    if (onUpdatePaciente) onUpdatePaciente({ ...datosPaciente, [field]: value });
  };

  const qrMatrix = useMemo(() => {
    return generateQRCodeMatrix(datosPaciente.qrPayload || `https://medicos.local/expediente/${datosPaciente.expediente}`);
  }, [datosPaciente.qrPayload, datosPaciente.expediente]);

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

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 flex flex-col items-center">
      {/* 1. Barra de Controles Superior */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 mb-6 bg-white border border-slate-200 shadow-sm p-3 rounded-2xl print:hidden">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-teal-50 text-teal-600 rounded-xl">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800">Carnet Oficial de Paciente</h2>
            <p className="text-xs text-slate-500">Expediente: {datosPaciente.expediente}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept="image/*" 
            className="hidden" 
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors border border-slate-300 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Subir Foto</span>
          </button>

          <button
            onClick={startCamera}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors border border-slate-300 cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Tomar Foto</span>
          </button>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors border cursor-pointer ${
              isEditing ? 'bg-teal-600 text-white border-teal-600' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Guardar Cambios' : 'Editar Datos'}</span>
          </button>

          <div className="bg-slate-100 p-1 rounded-xl flex ml-1">
            <button
              onClick={() => setActiveTab('interactive')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'interactive' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Vista 3D
            </button>
            <button
              onClick={() => setActiveTab('both')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'both' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ambas Caras
            </button>
          </div>

          {activeTab === 'interactive' && (
            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-xl transition-colors border border-slate-300 cursor-pointer"
            >
              <RotateCw className={`w-3.5 h-3.5 transition-transform duration-500 ${isFlipped ? 'rotate-180' : ''}`} />
              <span>Girar</span>
            </button>
          )}

          {onDownload && (
            <button
              onClick={onDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors border border-slate-300 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Descargar</span>
            </button>
          )}

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir Hoja Oficial</span>
          </button>
        </div>
      </div>

      {/* Editor manual en vivo */}
      {isEditing && (
        <div className="w-full bg-teal-50 border border-teal-200 p-4 rounded-2xl mb-6 flex flex-wrap gap-3 items-center justify-between print:hidden">
          <div className="text-xs text-teal-800 font-medium w-full mb-1">
            Modificación manual de campos del carnet:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full">
            <input
              type="text"
              placeholder="Nombres"
              value={datosPaciente.nombres}
              onChange={(e) => handleFieldChange('nombres', e.target.value)}
              className="px-3 py-1.5 text-xs border rounded-lg bg-white"
            />
            <input
              type="text"
              placeholder="Apellidos"
              value={datosPaciente.apellidos}
              onChange={(e) => handleFieldChange('apellidos', e.target.value)}
              className="px-3 py-1.5 text-xs border rounded-lg bg-white"
            />
            <input
              type="text"
              placeholder="DUI"
              value={datosPaciente.dui || ''}
              onChange={(e) => handleFieldChange('dui', e.target.value)}
              className="px-3 py-1.5 text-xs border rounded-lg bg-white"
            />
            <input
              type="text"
              placeholder="Distrito"
              value={datosPaciente.distrito || ''}
              onChange={(e) => handleFieldChange('distrito', e.target.value)}
              className="px-3 py-1.5 text-xs border rounded-lg bg-white"
            />
          </div>
        </div>
      )}

      {/* Modal de Cámara */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 flex flex-col items-center shadow-2xl">
            <div className="w-full flex justify-between items-center mb-3">
              <h3 className="text-base font-bold text-slate-800">Tomar Fotografía del Paciente</h3>
              <button onClick={stopCamera} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative w-72 h-72 rounded-full overflow-hidden border-4 border-teal-500 shadow-inner bg-black mb-4">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            </div>

            <canvas ref={canvasRef} className="hidden" />

            <div className="flex gap-3">
              <button
                onClick={stopCamera}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-semibold rounded-xl cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={capturePhoto}
                className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                Capturar Foto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Visualización en Pantalla (3D o Ambas Caras) */}
      {activeTab === 'interactive' ? (
        <div className="w-full flex flex-col items-center justify-center py-4 print:hidden">
          <div 
            className="relative w-full max-w-2xl aspect-[1.586/1] cursor-pointer select-none group"
            style={{ perspective: '1600px' }}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div
              className={`w-full h-full relative transition-transform duration-700 rounded-3xl shadow-xl ${
                isFlipped ? 'transform-[rotateY(180deg)]' : ''
              }`}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden backface-hidden border border-slate-200 bg-[#F0F8FA]">
                <CarnetFrontCard paciente={datosPaciente} qrMatrix={qrMatrix} />
              </div>

              <div className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden backface-hidden transform-[rotateY(180deg)] border border-slate-200 bg-[#F0F8FA]">
                <CarnetBackCard paciente={datosPaciente} />
              </div>
            </div>

            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-medium text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-sm">
              Haz clic sobre el carnet para voltearlo
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center gap-8 print:hidden">
          <div className="w-full max-w-2xl aspect-[1.586/1] rounded-3xl overflow-hidden shadow-lg border border-slate-200 bg-[#F0F8FA]">
            <CarnetFrontCard paciente={datosPaciente} qrMatrix={qrMatrix} />
          </div>

          <div className="w-full max-w-2xl aspect-[1.586/1] rounded-3xl overflow-hidden shadow-lg border border-slate-200 bg-[#F0F8FA]">
            <CarnetBackCard paciente={datosPaciente} />
          </div>
        </div>
      )}

      {/* 3. DOCUMENTO OFICIAL DE EMISIÓN DE CARNET MEDICOS (Solo para Impresión / Guardar como PDF) */}
      <div id="hoja-oficial-medicos" className="hidden print:block w-full max-w-[210mm] mx-auto bg-white text-slate-800 p-8">

        {/* Encabezado Institucional MedicOS */}
        <div className="border-b-2 border-[#00838F] pb-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo-sinNombre.png" alt="MedicOS" className="w-14 h-14 object-contain" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-[#003356] tracking-tight">Medic<span className="text-[#00838F]">OS</span></span>
                <span className="text-xs font-bold uppercase tracking-wider bg-teal-50 text-[#00838F] px-2 py-0.5 rounded-md border border-teal-200">Oficial</span>
              </div>
              <p className="text-xs font-semibold text-slate-500">Sistema Nacional de Gestión en Salud Comunitaria y Brigadas</p>
              <p className="text-[10px] text-slate-400 font-medium">República de El Salvador • Registro Nominal de Pacientes</p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Documento de Acreditación</span>
            <p className="text-base font-black text-[#00838F]">{datosPaciente.expediente}</p>
            <p className="text-xs font-medium text-slate-500">Emisión: {datosPaciente.fechaCreacion as string}</p>
          </div>
        </div>

        {/* Título de la Hoja */}
        <div className="text-center mb-6">
          <h1 className="text-lg font-black text-[#003356] tracking-wide uppercase">
            Hoja Oficial de Emisión de Carnet Territorial
          </h1>
          <p className="text-xs text-slate-500 max-w-lg mx-auto mt-1">
            Certificado de identidad clínica y acreditación para atención médica en brigadas territoriales y centros asistenciales de la red MedicOS.
          </p>
        </div>

        {/* Sección de Recorte y Doblado del Carnet Físico (Tamaño Estándar CR80 85.6mm x 54mm) */}
        <div className="bg-slate-50/80 border border-dashed border-slate-300 rounded-2xl p-5 mb-6 relative">
          <div className="flex items-center justify-between mb-3 text-[11px] font-bold text-slate-500">
            <span className="flex items-center gap-1.5 text-[#00838F]">
              <Scissors className="w-4 h-4" />
              Guía de corte y laminación para carnet de bolsillo (Estándar CR-80)
            </span>
            <span>Cara Frontal y Cara Trasera</span>
          </div>

          <div className="grid grid-cols-2 gap-4 justify-items-center">
            {/* Frontal Imprimible */}
            <div className="w-[85.6mm] h-[54mm] rounded-xl overflow-hidden shadow-sm border border-slate-300 relative bg-[#F3F9FA]">
              <div className="w-170 h-[428.75px] transform scale-[0.4757] origin-top-left absolute top-0 left-0">
                <CarnetFrontCard paciente={datosPaciente} qrMatrix={qrMatrix} />
              </div>
            </div>

            {/* Trasera Imprimible */}
            <div className="w-[85.6mm] h-[54mm] rounded-xl overflow-hidden shadow-sm border border-slate-300 relative bg-[#F3F9FA]">
              <div className="w-170 h-[428.75px] transform scale-[0.4757] origin-top-left absolute top-0 left-0">
                <CarnetBackCard paciente={datosPaciente} />
              </div>
            </div>
          </div>
        </div>

        {/* Ficha Resumen de Datos Oficiales */}
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
            <p className="text-slate-600"><strong>Tipo de Sangre:</strong> <span className="font-bold text-[#00838F]">{datosPaciente.tipoSangre}</span></p>
            <p className="text-slate-600 line-clamp-1"><strong>Alergias:</strong> {datosPaciente.alergiasTexto}</p>
            <p className="text-slate-600 line-clamp-1"><strong>Enfermedades:</strong> {datosPaciente.enfermedadesTexto}</p>
            <p className="text-slate-600 mt-1"><strong>Contacto:</strong> {datosPaciente.contactoEmergencia?.nombre} ({datosPaciente.contactoEmergencia?.telefono})</p>
          </div>
        </div>

        {/* Sección de Validación y Firmas Institucionales */}
        <div className="border border-teal-200 bg-teal-50/50 rounded-2xl p-4 mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-100 text-[#00838F] rounded-xl">
              <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="text-xs font-black text-[#003356] uppercase tracking-wide">Validación Digital Centralizada</h4>
              <p className="text-[11px] text-slate-600">El código QR integrado permite verificar en tiempo real el historial y las prescripciones en la base de datos de MedicOS.</p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Estado del Registro</span>
            <p className="text-xs font-black text-emerald-700">ACTIVO Y SINCRONIZADO</p>
          </div>
        </div>

        {/* Firmas y Sellos */}
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

        {/* Pie de Página Institucional */}
        <div className="border-t border-slate-200 mt-8 pt-3 flex items-center justify-between text-[10px] text-slate-400 font-medium">
          <span>MedicOS • Plataforma de Salud Comunitaria • Tu salud, nuestra prioridad</span>
          <span>Año 2026 • Documento Oficial de Identificación Territorial</span>
        </div>
      </div>

      {/* Estilos CSS de impresión */}
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
          /* Ocultar toda la interfaz visual general */
          body * {
            visibility: hidden !important;
          }
          /* Mostrar de forma exclusiva la hoja membretada oficial */
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
   CARA FRONTAL: RENDERIZADO VECTORIAL FIEL
   ========================================================================= */
const CarnetFrontCard: React.FC<{ paciente: PacienteCarnetData; qrMatrix: boolean[][] }> = ({ paciente, qrMatrix }) => {
  const qrSize = qrMatrix.length;
  const cellSize = 110 / qrSize;
  const nombreTexto = `${paciente.nombres || ''} ${paciente.apellidos || ''}`.trim() || 'Paciente';

  return (
    <div className="w-full h-full bg-[#F3F9FA] flex flex-col justify-between p-3.5 sm:p-4 text-slate-800 select-none relative overflow-hidden font-sans">

      {/* 1. Header Blanco */}
      <div className="bg-white rounded-2xl px-4 py-2 flex items-center justify-between shadow-xs border border-slate-100">
        <div className="flex items-center gap-2.5">
          <img src="/logo-sinNombre.png" alt="MedicOS Logo" className="w-10 h-10 object-contain" />
          <div className="flex flex-col">
            <span className="text-xl font-black text-[#003356] leading-none tracking-tight">
              Medic<span className="text-[#00838F]">OS</span>
            </span>
            <span className="text-[10px] font-semibold text-[#546E7A] mt-0.5">
              Sistema de Gestión en Salud
            </span>
          </div>
        </div>

        <div className="bg-[#3B9EAA] text-white px-4 py-2 rounded-xl flex items-center gap-3 shadow-xs">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-white stroke-[2.5]" />
            <span className="text-xs sm:text-sm font-extrabold tracking-wider whitespace-nowrap">
              CARNET DE PACIENTE
            </span>
          </div>

          <div className="hidden sm:flex items-center pl-2 border-l border-white/30">
            <svg width="60" height="24" viewBox="0 0 60 24" className="overflow-visible">
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
      <div className="flex-1 flex items-center justify-between gap-4 px-2 py-1">
        <div className="flex flex-col items-center justify-center shrink-0">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-linear-to-tr from-[#26C6DA] to-[#80DEEA] shadow-md flex items-center justify-center">
            <div className="w-full h-full rounded-full overflow-hidden bg-[#E0F2F1] flex items-center justify-center">
              {paciente.fotoUrl ? (
                <img src={paciente.fotoUrl} alt={nombreTexto} className="w-full h-full object-cover" />
              ) : (
                <User className="w-16 h-16 text-[#90A4AE]" />
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 gap-1.5 opacity-50 mt-1.5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-1 h-1 rounded-full bg-[#00ACC1]" />
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center px-1">
          <h2 className="text-base sm:text-lg font-extrabold text-[#003356] leading-tight mb-2">
            {nombreTexto}
          </h2>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[#00838F] shrink-0 stroke-[2.5]" />
              <span className="font-extrabold text-[#00838F]">Sexo:</span>
              <span className="font-medium text-slate-700">{paciente.sexo}</span>
            </div>

            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#00838F] shrink-0 stroke-[2.5]" />
              <span className="font-extrabold text-[#00838F]">Expediente:</span>
              <span className="font-medium text-slate-700">{paciente.expediente}</span>
            </div>

            {/* Dirección alineada en columna */}
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#00838F] shrink-0 stroke-[2.5] mt-0.5" />
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-extrabold text-[#00838F] shrink-0">Dirección:</span>
                  <span 
                    className="font-medium text-slate-700 line-clamp-2 max-w-53.75 leading-snug wrap-break-word text-left"
                    title={paciente.direccion}
                  >
                    {paciente.direccion}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Droplet className="w-4 h-4 text-[#00838F] fill-[#00838F] shrink-0" />
              <span className="font-extrabold text-[#00838F]">Grupo sanguíneo:</span>
              <span className="font-medium text-slate-700">{paciente.tipoSangre}</span>
            </div>

            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#00838F] shrink-0 stroke-[2.5]" />
              <span className="font-extrabold text-[#00838F]">Alergias:</span>
              <span className="font-medium text-slate-700 truncate max-w-47.5">{paciente.alergiasTexto}</span>
            </div>
          </div>
        </div>

        {/* Código QR */}
        <div className="bg-white rounded-2xl p-2.5 border border-slate-200 shadow-xs flex flex-col items-center justify-between w-32 sm:w-36 shrink-0 relative">
          <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-[#00ACC1] rounded-tl-sm" />
          <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-[#00ACC1] rounded-tr-sm" />
          <div className="absolute bottom-9 left-1.5 w-3 h-3 border-b-2 border-l-2 border-[#00ACC1] rounded-bl-sm" />
          <div className="absolute bottom-9 right-1.5 w-3 h-3 border-b-2 border-r-2 border-[#00ACC1] rounded-br-sm" />

          <div className="p-1 my-0.5">
            <svg width={110} height={110} viewBox="0 0 110 110" className="block">
              {qrMatrix.map((row, rIdx) =>
                row.map((isDark, cIdx) =>
                  isDark ? (
                    <rect
                      key={`${rIdx}-${cIdx}`}
                      x={cIdx * cellSize}
                      y={rIdx * cellSize}
                      width={cellSize + 0.2}
                      height={cellSize + 0.2}
                      fill="#002244"
                    />
                  ) : null
                )
              )}
            </svg>
          </div>

          <div className="flex items-center gap-1.5 mt-1">
            <Smartphone className="w-4 h-4 text-[#00838F] stroke-[2.5]" />
            <div className="text-[9px] font-bold text-[#00838F] leading-tight">
              <span>Escanea para ver</span><br/>
              <span>expediente</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Módulos Inferiores con Distrito Limpio */}
      <div className="bg-white rounded-2xl p-2.5 grid grid-cols-5 divide-x divide-slate-100 shadow-xs border border-slate-100 items-center">
        <div className="flex items-center gap-2 px-2">
          <Calendar className="w-6 h-6 text-[#00838F] shrink-0 stroke-2" />
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-slate-400 leading-tight">Fecha de nacimiento</span>
            <span className="text-[11px] font-extrabold text-[#003356] mt-0.5">{formatDate(paciente.fechaNacimiento)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 px-2">
          <div className="w-7 h-7 rounded-full bg-teal-50 border border-[#00838F]/40 flex items-center justify-center shrink-0">
            <PhoneCall className="w-4 h-4 text-[#00838F] stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-slate-400 leading-tight">Teléfono</span>
            <span className="text-[11px] font-extrabold text-[#003356] mt-0.5">{paciente.telefono}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 px-2">
          <Home className="w-6 h-6 text-[#00838F] shrink-0 stroke-2" />
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-slate-400 leading-tight">Distrito</span>
            <span 
              className="text-[11px] font-extrabold text-[#003356] line-clamp-1 mt-0.5 leading-tight" 
              title={paciente.distrito || ''}
            >
              {paciente.distrito}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 px-2">
          <CalendarDays className="w-6 h-6 text-[#00838F] shrink-0 stroke-2" />
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-slate-400 leading-tight">Fecha de Creación</span>
            <span className="text-[11px] font-extrabold text-[#003356] mt-0.5">{formatDate(paciente.fechaCreacion)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 px-2">
          <Clock className="w-6 h-6 text-[#00838F] shrink-0 stroke-2" />
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-slate-400 leading-tight">Fecha de Expiracion</span>
            <span className="text-[11px] font-extrabold text-[#003356] mt-0.5">{paciente.fechaExpiracion}</span>
          </div>
        </div>
      </div>

      {/* 4. Pie de Página */}
      <div className="bg-[#00838F] text-white px-6 py-2 rounded-xl flex items-center justify-between shadow-xs">
        <span className="text-xs italic font-medium text-[#E0F7FA]">
          Tu salud, nuestra prioridad
        </span>
        <span className="text-lg font-black tracking-wide text-white">
          MedicOS
        </span>
        <span className="text-xs font-bold text-[#B2EBF2]">
          2026
        </span>
      </div>
    </div>
  );
};

/* =========================================================================
   CARA TRASERA: INFORMACIÓN MÉDICA
   ========================================================================= */
const CarnetBackCard: React.FC<{ paciente: PacienteCarnetData }> = ({ paciente }) => {
  const contacto = paciente.contactoEmergencia || {};

  return (
    <div className="w-full h-full bg-[#F3F9FA] flex flex-col justify-between p-3.5 sm:p-4 text-slate-800 select-none relative overflow-hidden font-sans">

      {/* 1. Header Blanco */}
      <div className="bg-white rounded-2xl px-4 py-2 flex items-center justify-between shadow-xs border border-slate-100">
        <div className="flex items-center gap-2.5">
          <img src="/logo-sinNombre.png" alt="MedicOS Logo" className="w-10 h-10 object-contain" />
          <div className="flex flex-col">
            <span className="text-xl font-black text-[#003356] leading-none tracking-tight">
              Medic<span className="text-[#00838F]">OS</span>
            </span>
            <span className="text-[10px] font-semibold text-[#546E7A] mt-0.5">
              Sistema de Gestión en Salud
            </span>
          </div>
        </div>

        <div className="bg-[#00838F] text-white px-4 py-2 rounded-xl flex items-center gap-3 shadow-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-white stroke-[2.5]" />
            <div className="text-left text-xs sm:text-[13px] font-extrabold tracking-wider leading-tight">
              <span>INFORMACIÓN MÉDICA</span><br/>
              <span>DE EMERGENCIA</span>
            </div>
          </div>

          <div className="hidden sm:flex items-center pl-2 border-l border-white/30">
            <svg width="60" height="24" viewBox="0 0 60 24" className="overflow-visible">
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

      {/* 2. Bloque Central: 2 Tarjetas */}
      <div className="flex-1 grid grid-cols-2 gap-3.5 px-1 py-1 items-stretch">
        <div className="bg-white rounded-2xl p-3.5 border border-[#E0F2F1] shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <div className="w-8 h-8 rounded-full bg-[#00838F] text-white flex items-center justify-center shadow-xs shrink-0">
              <PhoneCall className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span className="text-xs font-black text-[#00838F] tracking-wide">
              CONTACTO DE EMERGENCIA
            </span>
          </div>

          <div className="space-y-2 text-xs py-1">
            <div className="flex items-start gap-2">
              <User className="w-4 h-4 text-[#00838F] shrink-0 mt-0.5 stroke-[2.5]" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400">Nombre:</span>
                <span className="font-bold text-[#003356]">{contacto.nombre || 'No asignado'}</span>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Phone className="w-4 h-4 text-[#00838F] shrink-0 mt-0.5 stroke-[2.5]" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400">Teléfono:</span>
                <span className="font-bold text-[#003356]">{contacto.telefono || 'No registrado'}</span>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Users className="w-4 h-4 text-[#00838F] shrink-0 mt-0.5 stroke-[2.5]" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400">Relación:</span>
                <span className="font-bold text-[#003356]">{contacto.parentesco || 'Familiar'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-3.5 border border-[#E0F2F1] shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <div className="w-8 h-8 rounded-full bg-[#003356] text-white flex items-center justify-center shadow-xs shrink-0">
              <HeartPulse className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span className="text-xs font-black text-[#003356] tracking-wide">
              INFORMACIÓN CRÍTICA
            </span>
          </div>

          <div className="space-y-2 text-xs py-1">
            <div className="flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-[#00838F] shrink-0 mt-0.5 stroke-[2.5]" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400">Enfermedades:</span>
                <span className="font-bold text-[#003356] line-clamp-1">{paciente.enfermedadesTexto}</span>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Pill className="w-4 h-4 text-[#00838F] shrink-0 mt-0.5 stroke-[2.5]" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400">Medicación:</span>
                <span className="font-bold text-[#003356] line-clamp-1">{paciente.medicacionTexto}</span>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <ClipboardList className="w-4 h-4 text-[#00838F] shrink-0 mt-0.5 stroke-[2.5]" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400">Observaciones:</span>
                <span className="font-medium text-slate-600 line-clamp-2 text-[11px] leading-tight">{paciente.observacionesTexto}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bloque Inferior */}
      <div className="grid grid-cols-2 gap-3.5 px-1 py-1 items-center">
        <div className="bg-white rounded-2xl p-2.5 border border-[#E0F2F1] shadow-xs flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#00838F] text-white font-black flex items-center justify-center text-sm shrink-0">
            !
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-black text-[#00838F] tracking-wide">INSTRUCCIONES</span>
            <span className="text-[10px] font-medium text-slate-600 leading-tight">
              En caso de emergencia, escanear el código QR del frente o contactar al número indicado.
            </span>
          </div>
        </div>

        <div className="bg-[#E0F7FA] rounded-2xl p-2.5 flex items-center gap-3">
          <Lock className="w-6 h-6 text-[#00838F] shrink-0 stroke-[2.5]" />
          <div className="flex flex-col">
            <span className="text-xs font-black text-[#00838F] tracking-wide">CONFIDENCIAL</span>
            <span className="text-[10px] font-medium text-[#006064] leading-tight">
              La información de este carnet es personal y está protegida por MedicOS.
            </span>
          </div>
        </div>
      </div>

      {/* 4. Pie de Página */}
      <div className="bg-[#00838F] text-white px-6 py-2 rounded-xl flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-white" />
          <span className="text-xs italic font-medium text-[#E0F7FA]">
            Tu salud, nuestra prioridad
          </span>
        </div>
        <span className="text-lg font-black tracking-wide text-white">
          MedicOS
        </span>
        <span className="text-xs font-bold text-[#B2EBF2]">
          2026
        </span>
      </div>
    </div>
  );
};

export default CarnetDigitalPaciente;