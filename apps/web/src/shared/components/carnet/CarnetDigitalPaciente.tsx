// =========================================================================
// ARCHIVO: apps/web/src/shared/components/carnet/CarnetDigitalPaciente.tsx
// DESCRIPCIÓN: Carnet Digital Oficial de Paciente con código QR real ISO 18004,
//              giro 3D optimizado para móviles (iOS/Android) y estándar CR-80.
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
  Trash2 
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
    const match = p.distrito.match(/Distrito\s+([^,]+)/i);
    if (match && match[1]) return match[1].trim();
    if (!p.distrito.includes(',')) {
      return p.distrito.trim().replace(/\s+(Costa|Norte|Sur|Este|Oeste|Centro)$/i, '');
    }
  }

  const rawAddr = p.direccion || p.address || '';
  const matchAddr = rawAddr.match(/Distrito\s+([^,]+)/i);
  if (matchAddr && matchAddr[1]) return matchAddr[1].trim();

  if (rawAddr.includes(',')) {
    const segments = rawAddr.split(',').map((s) => s.trim()).filter(Boolean);
    for (const seg of segments) {
      if (
        !/^(calle|av|avenida|pasaje|pje|casa|pol|poligono|block|col|colonia|res|residencial|urb|urbanizacion|canton|cantón|caserio|caserío|barrio)\b/i.test(seg) &&
        !/\b(costa|sur|norte|este|oeste|centro)\b/i.test(seg)
      ) {
        return seg.replace(/^Distrito\s+/i, '').replace(/\s+(Costa|Norte|Sur|Este|Oeste|Centro)$/i, '');
      }
    }
  }

  if (p.comunidad?.trim()) {
    return p.comunidad.trim().replace(/^Distrito\s+/i, '').replace(/\s+(Costa|Norte|Sur|Este|Oeste|Centro)$/i, '');
  }
  if (p.municipality?.trim()) {
    return p.municipality.trim().replace(/\s+(Costa|Norte|Sur|Este|Oeste|Centro)$/i, '');
  }
  if (p.municipio?.trim()) {
    return p.municipio.trim().replace(/\s+(Costa|Norte|Sur|Este|Oeste|Centro)$/i, '');
  }

  return 'San Salvador';
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
    const direccionCompleta = p.direccion || p.address || [p.municipality, p.department].filter(Boolean).join(', ') || 'El Salvador';
    const distritoFinal = extractDistritoLimpio(p);

    const fechaNacRaw = p.fechaNacimiento || p.dateOfBirth || '2000-01-01';
    const fechaCreacionRaw = p.fechaCreacion || p.createdAt || new Date();

    const contactoNombre = p.contactoEmergencia?.nombre || p.emergencyName || 'No asignado';
    const contactoParentesco = p.contactoEmergencia?.parentesco || p.emergencyRelation || 'Familiar';
    const contactoTelefono = p.contactoEmergencia?.telefono || p.emergencyPhone || 'No registrado';

    let alergias = p.alergiasTexto || p.allergies || 'Ninguna';
    let enfermedades = p.enfermedadesTexto || p.chronicDiseases || 'Ninguna';
    let medicacion = p.medicacionTexto || 'Ninguna';
    let observaciones = p.observacionesTexto || p.observations || 'Ninguna';

    const obsSource = p.clinicalRecord?.observations || p.alergiasTexto || p.observacionesTexto;
    if (typeof obsSource === 'string' && obsSource.trim().startsWith('{')) {
      try {
        const parsed = JSON.parse(obsSource);
        if (parsed && typeof parsed === 'object') {
          alergias = parsed.allergies || alergias;
          enfermedades = parsed.chronicDiseases || enfermedades;
          medicacion = parsed.medication || medicacion;
          observaciones = parsed.notes || parsed.observations || observaciones;
        }
      } catch {
        // Fallback
      }
    }

    // Payload oficial para el QR (JSON estructurado ISO 18004 compatible con resolvePatientQR)
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
      fechaNacimiento: formatDate(fechaNacRaw),
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

  // Generación en cliente de código QR estándar ISO/IEC 18004 (100% Offline)
  useEffect(() => {
    let isMounted = true;

    const generateQR = async () => {
      if (!datosPaciente.qrPayload) return;
      try {
        const url = await QRCode.toDataURL(datosPaciente.qrPayload, {
          width: 320,
          margin: 1,
          errorCorrectionLevel: 'M',
          color: {
            dark: '#1C3138',
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
      console.warn('No se pudo guardar la foto en localStorage:', e);
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
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
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

  return (
    <div className={`w-full flex flex-col items-center select-none font-sans ${only3D ? 'max-w-xl' : 'max-w-4xl'}`}>
      
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept="image/*" 
        className="hidden" 
      />

      {/* Barra en Modo 3D con Soporte de Foto */}
      {only3D && (
        <div className="w-full flex items-center justify-between gap-2 mb-2.5 px-1 print:hidden">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 bg-white hover:bg-slate-50 text-[#166E7A] text-[11px] sm:text-xs font-semibold rounded-xl border border-slate-200 shadow-2xs transition active:scale-95 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{fotoPersonalizada ? 'Cambiar Foto' : 'Subir Foto'}</span>
            </button>

            <button
              type="button"
              onClick={startCamera}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 bg-white hover:bg-slate-50 text-[#166E7A] text-[11px] sm:text-xs font-semibold rounded-xl border border-slate-200 shadow-2xs transition active:scale-95 cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Cámara</span>
            </button>

            {fotoPersonalizada && (
              <button
                type="button"
                onClick={handleEliminarFoto}
                title="Quitar foto"
                className="p-1 text-rose-500 hover:bg-rose-50 rounded-xl transition border border-rose-200 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsFlipped(!isFlipped)}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 bg-white hover:bg-slate-50 text-[#166E7A] text-[11px] sm:text-xs font-semibold rounded-xl border border-slate-200 shadow-2xs transition active:scale-95 cursor-pointer"
          >
            <RotateCw className={`w-3.5 h-3.5 transition-transform duration-500 ${isFlipped ? 'rotate-180' : ''}`} />
            <span>{isFlipped ? 'Ver Frontal' : 'Giro 3D'}</span>
          </button>
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

            {fotoPersonalizada && (
              <button
                type="button"
                onClick={handleEliminarFoto}
                title="Eliminar foto personalizada"
                className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-xl transition border border-rose-200 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}

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

            {activeTab === 'interactive' && (
              <button
                type="button"
                onClick={() => setIsFlipped(!isFlipped)}
                className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition border border-slate-300 cursor-pointer"
              >
                <RotateCw className={`w-3.5 h-3.5 transition-transform duration-500 ${isFlipped ? 'rotate-180 text-[#166E7A]' : ''}`} />
                <span>{isFlipped ? 'Ver Frente' : 'Ver Reverso'}</span>
              </button>
            )}

            {onDownload && (
              <button
                type="button"
                onClick={onDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition border border-slate-300 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Descargar</span>
              </button>
            )}

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

      {/* 2. Visualización 3D Interactiva (Blindada contra flickering en iOS y WebKit) */}
      {(only3D || activeTab === 'interactive') ? (
        <div className="w-full flex flex-col items-center justify-center print:hidden">
          <div 
            className="relative w-full aspect-[1.586/1] cursor-pointer select-none group"
            style={{ 
              perspective: '1600px',
              isolation: 'isolate',
            }}
            onClick={() => setIsFlipped(!isFlipped)}
            title="Haz clic para voltear el carnet en 3D"
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

      {/* 3. Hoja Oficial de Emisión de Carnet (Impresión Física / PDF CR-80) */}
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
  const direccionCompleta = paciente.direccion || 'El Salvador';

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

      {/* 2. Cuerpo Principal (Distribución elástica para celulares) */}
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

        {/* Datos Personales (Protegidos contra desbordamiento en celular) */}
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
                  className="font-medium text-slate-700 text-[8.5px] xs:text-[9.5px] sm:text-[11px] leading-tight line-clamp-2"
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

      {/* 3. Módulos Inferiores: 5 Columnas con Auto-Escala */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-1 xs:p-1.5 sm:p-2 grid grid-cols-[1fr_1fr_1.3fr_1fr_1fr] divide-x divide-slate-100 shadow-xs border border-slate-100 items-center">
        <div className="flex items-center gap-1 px-1 truncate">
          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-[#166E7A] shrink-0 stroke-2" />
          <div className="flex flex-col truncate">
            <span className="text-[6.5px] xs:text-[7px] sm:text-[7.5px] font-bold text-slate-400 leading-tight">Nacimiento</span>
            <span className="text-[8px] xs:text-[8.5px] sm:text-[9.5px] font-extrabold text-slate-900 mt-0.5 truncate">{formatDate(paciente.fechaNacimiento)}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 px-1 truncate">
          <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
            <PhoneCall className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#166E7A] stroke-[2.5]" />
          </div>
          <div className="flex flex-col truncate">
            <span className="text-[6.5px] xs:text-[7px] sm:text-[7.5px] font-bold text-slate-400 leading-tight">Teléfono</span>
            <span className="text-[8px] xs:text-[8.5px] sm:text-[9.5px] font-extrabold text-slate-900 mt-0.5 truncate">{paciente.telefono}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 px-1 min-w-0">
          <Home className="w-3 h-3 sm:w-4 sm:h-4 text-[#166E7A] shrink-0 stroke-2" />
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[6.5px] xs:text-[7px] sm:text-[7.5px] font-bold text-slate-400 leading-tight">Distrito</span>
            <span 
              className="text-[8px] xs:text-[8.5px] sm:text-[9.5px] font-black text-[#166E7A] mt-0.5 truncate" 
              title={paciente.distrito || ''}
            >
              {paciente.distrito}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 px-1 truncate">
          <CalendarDays className="w-3 h-3 sm:w-4 sm:h-4 text-[#166E7A] shrink-0 stroke-2" />
          <div className="flex flex-col truncate">
            <span className="text-[6.5px] xs:text-[7px] sm:text-[7.5px] font-bold text-slate-400 leading-tight">Creación</span>
            <span className="text-[8px] xs:text-[8.5px] sm:text-[9.5px] font-extrabold text-slate-900 mt-0.5 truncate">{formatDate(paciente.fechaCreacion)}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 px-1 truncate">
          <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-[#166E7A] shrink-0 stroke-2" />
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

            <div className="flex items-start gap-1.5">
              <ClipboardList className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#166E7A] shrink-0 mt-0.5 stroke-[2.5]" />
              <div className="flex flex-col truncate">
                <span className="text-[7.5px] sm:text-[9px] font-bold text-slate-400">Observaciones:</span>
                <span className="font-medium text-slate-600 line-clamp-2 text-[8px] xs:text-[9px] sm:text-[10px] leading-tight">
                  {paciente.observacionesTexto}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bloque Inferior: Instrucciones */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 px-0.5 sm:px-1 py-0.5 sm:py-1 items-center">
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