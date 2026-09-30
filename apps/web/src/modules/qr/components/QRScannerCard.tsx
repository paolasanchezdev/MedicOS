// =========================================================================
// ARCHIVO: apps/web/src/modules/qr/components/QRScannerCard.tsx
// DESCRIPCIÓN: Escáner visual con cámara en tiempo real mediante html5-qrcode.
//              Visor ampliado para monitor/PC, video centrado con object-fit
//              y liberación completa de hardware al desmontar la vista.
// =========================================================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { 
  Camera, 
  RotateCw, 
  Keyboard, 
  Search, 
  AlertCircle, 
  ShieldCheck, 
  RefreshCw 
} from 'lucide-react';
import { qrService } from '../services/qr.service.js';
import { QRScanResultModal } from './QRScanResultModal.js';
import type { 
  ScannerStatus, 
  ResolvedPatientQRData 
} from '../types/qr.types.js';

interface QRScannerCardProps {
  scannerRole: 'DOCTOR' | 'BRIGADISTA' | 'ADMIN';
  onPatientResolved?: (patient: ResolvedPatientQRData) => void;
}

const scannerContainerId = 'medicos-qr-reader-viewport';

/**
 * Detiene físicamente cualquier pista de video (MediaStreamTrack) activa
 * para garantizar que el hardware de la cámara se apague por completo.
 */
function stopScannerTracks(scanner: Html5Qrcode | null, container: HTMLElement | null): void {
  try {
    const internalStream = (scanner as unknown as { localMediaStream?: MediaStream })?.localMediaStream;
    if (internalStream && typeof internalStream.getTracks === 'function') {
      internalStream.getTracks().forEach((track) => {
        if (track.readyState === 'live') {
          track.stop();
        }
      });
    }
  } catch {
    // Limpieza silenciosa
  }

  try {
    const target = container || document.getElementById(scannerContainerId);
    if (target) {
      const videos = target.querySelectorAll('video');
      videos.forEach((video) => {
        if (video.srcObject instanceof MediaStream) {
          video.srcObject.getTracks().forEach((track) => {
            if (track.readyState === 'live') {
              track.stop();
            }
          });
          video.srcObject = null;
        }
      });
    }
  } catch {
    // Limpieza síncrona
  }
}

export const QRScannerCard: React.FC<QRScannerCardProps> = ({
  scannerRole,
  onPatientResolved,
}) => {
  const [isManualMode, setIsManualMode] = useState(false);
  const [status, setStatus] = useState<ScannerStatus>(() => (isManualMode ? 'IDLE' : 'REQUESTING_CAMERA'));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resolvedPatient, setResolvedPatient] = useState<ResolvedPatientQRData | null>(null);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);

  // Fallback manual
  const [manualCode, setManualCode] = useState('');
  const [cameraTrigger, setCameraTrigger] = useState(0);

  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Procesa el payload escaneado o ingresado
  const handleProcessPayload = useCallback(async (payload: string) => {
    if (!payload.trim()) return;

    try {
      setStatus('RESOLVING');
      setErrorMessage(null);

      const res = await qrService.resolvePatientQR(payload.trim());

      if (res.success && res.patient) {
        setStatus('SUCCESS');
        setResolvedPatient(res.patient);
        setIsResultModalOpen(true);
        if (onPatientResolved) {
          onPatientResolved(res.patient);
        }
      } else {
        throw new Error(res.error || 'No se encontró el paciente');
      }
    } catch (err: unknown) {
      setStatus('ERROR');
      setErrorMessage(err instanceof Error ? err.message : 'Error al validar el carnet');
    }
  }, [onPatientResolved]);

  // Ciclo de vida del escáner con auto-ajuste de video y apagado garantizado
  useEffect(() => {
    if (isManualMode) {
      return;
    }

    let isMounted = true;
    const scanner = new Html5Qrcode(scannerContainerId, {
      formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
      verbose: false,
    });
    html5QrCodeRef.current = scanner;

    const startScanning = async () => {
      try {
        await scanner.start(
          { facingMode: 'environment' },
          {
            fps: 15,
            qrbox: (viewfinderWidth, viewfinderHeight) => {
              const minDim = Math.min(viewfinderWidth, viewfinderHeight);
              const boxDim = Math.floor(minDim * 0.82);
              return { width: boxDim, height: boxDim };
            },
          },
          (decodedText: string) => {
            if (!isMounted) return;
            void (async () => {
              try {
                if (scanner.isScanning) {
                  await scanner.stop();
                }
              } catch {
                // Fallback seguro
              } finally {
                stopScannerTracks(scanner, containerRef.current);
                try {
                  scanner.clear();
                } catch {
                  // Limpieza síncrona
                }
              }
              void handleProcessPayload(decodedText);
            })();
          },
          undefined
        );

        if (!isMounted) {
          try {
            if (scanner.isScanning) {
              await scanner.stop();
            }
          } catch {
            // Ignorar
          } finally {
            stopScannerTracks(scanner, containerRef.current);
            try {
              scanner.clear();
            } catch {
              // Limpieza
            }
          }
          return;
        }

        setStatus('SCANNING');
      } catch (err: unknown) {
        stopScannerTracks(scanner, containerRef.current);
        if (!isMounted) return;
        setStatus('ERROR');
        setErrorMessage(
          err instanceof Error && err.message.includes('Permission')
            ? 'Permiso de cámara denegado. Permite el acceso o usa el ingreso manual.'
            : 'No se pudo acceder a la cámara del dispositivo.'
        );
      }
    };

    void startScanning();

    return () => {
      isMounted = false;
      const teardown = async () => {
        try {
          if (scanner.isScanning) {
            await scanner.stop();
          }
        } catch {
          // Ignorar
        } finally {
          stopScannerTracks(scanner, containerRef.current);
          try {
            scanner.clear();
          } catch {
            // Limpieza
          }
          if (html5QrCodeRef.current === scanner) {
            html5QrCodeRef.current = null;
          }
        }
      };
      void teardown();
    };
  }, [isManualMode, cameraTrigger, handleProcessPayload]);

  const handleToggleMode = () => {
    setIsManualMode((prev) => {
      const next = !prev;
      setErrorMessage(null);
      setStatus(next ? 'IDLE' : 'REQUESTING_CAMERA');
      return next;
    });
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      void handleProcessPayload(manualCode.trim());
    }
  };

  const handleReintentar = () => {
    setErrorMessage(null);
    if (isManualMode) {
      setManualCode('');
      setStatus('IDLE');
    } else {
      setStatus('REQUESTING_CAMERA');
      setCameraTrigger((prev) => prev + 1);
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-2xs p-4 sm:p-5 select-none flex flex-col items-center">
      {/* Estilos para que el video llene el 100% del contenedor sin cortarse */}
      <style>{`
        #medicos-qr-reader-viewport {
          width: 100% !important;
          height: 100% !important;
          position: relative !important;
          overflow: hidden !important;
          border-radius: 1.25rem !important;
        }
        #medicos-qr-reader-viewport video {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          border-radius: 1.25rem !important;
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
        }
        #medicos-qr-reader-viewport canvas {
          display: none !important;
        }
        #medicos-qr-reader-viewport #qr-shaded-region {
          display: none !important;
        }
      `}</style>

      {/* Cabecera del Escáner */}
      <div className="w-full flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#2B7A78] border border-teal-200/80 flex items-center justify-center shrink-0 shadow-2xs">
            <Camera className="w-4 h-4 text-[#2B7A78]" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 tracking-tight leading-none">
              Lector Oficial de Carnet MedicOS
            </h3>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">
              Escaneo nominal instantáneo y seguro
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleToggleMode}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition cursor-pointer active:scale-95 shadow-2xs"
        >
          {isManualMode ? (
            <Camera className="w-3.5 h-3.5 text-[#2B7A78]" />
          ) : (
            <Keyboard className="w-3.5 h-3.5 text-[#2B7A78]" />
          )}
          <span>{isManualMode ? 'Usar Cámara' : 'Ingreso Manual'}</span>
        </button>
      </div>

      {/* Visor de Cámara Ampliado */}
      {!isManualMode ? (
        <div className="w-full flex flex-col items-center">
          <div className="relative w-full aspect-square max-w-[280px] sm:max-w-[320px] lg:max-w-[350px] rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-950 border-4 border-slate-100 shadow-inner flex items-center justify-center">
            <div id={scannerContainerId} ref={containerRef} className="w-full h-full" />

            {status === 'REQUESTING_CAMERA' && (
              <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center gap-2 text-white text-xs z-10">
                <RotateCw className="w-7 h-7 animate-spin text-teal-400" />
                <span>Iniciando sensor óptico...</span>
              </div>
            )}

            {status === 'RESOLVING' && (
              <div className="absolute inset-0 bg-slate-950/85 flex flex-col items-center justify-center gap-2 text-white text-xs z-20">
                <RotateCw className="w-8 h-8 animate-spin text-[#25B4C4]" />
                <span className="font-bold">Verificando en base de datos...</span>
              </div>
            )}

            {status === 'SCANNING' && (
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-between p-5 z-10">
                <div className="w-full flex justify-between">
                  <div className="w-7 h-7 border-t-4 border-l-4 border-[#25B4C4] rounded-tl-xl" />
                  <div className="w-7 h-7 border-t-4 border-r-4 border-[#25B4C4] rounded-tr-xl" />
                </div>
                <span className="text-[11px] text-teal-200/90 font-mono bg-black/50 px-3 py-1 rounded-full backdrop-blur-xs">
                  Enfoca el QR del Carnet
                </span>
                <div className="w-full flex justify-between">
                  <div className="w-7 h-7 border-b-4 border-l-4 border-[#25B4C4] rounded-bl-xl" />
                  <div className="w-7 h-7 border-b-4 border-r-4 border-[#25B4C4] rounded-br-xl" />
                </div>
              </div>
            )}
          </div>

          <p className="text-center text-xs text-slate-400 font-medium mt-2.5">
            Apunta la cámara al código QR impreso o en pantalla del paciente.
          </p>
        </div>
      ) : (
        /* Formulario de Contingencia Manual */
        <form onSubmit={handleManualSubmit} className="w-full max-w-sm space-y-3.5 py-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              DUI o Código de Expediente del Paciente
            </label>
            <div className="relative">
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="Ej. 00000000-0 o EXP-2026-XXXX"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:outline-hidden focus:border-[#2B7A78] focus:bg-white transition"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
            </div>
            <p className="text-[11px] text-slate-400">
              Permite validar pacientes sin necesidad de cámara en brigadas o estaciones fijas.
            </p>
          </div>

          <button
            type="submit"
            disabled={!manualCode.trim() || status === 'RESOLVING'}
            className="w-full py-2.5 bg-[#2B7A78] hover:bg-[#236866] disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            {status === 'RESOLVING' ? (
              <RotateCw className="w-4 h-4 animate-spin" />
            ) : (
              <ShieldCheck className="w-4 h-4" />
            )}
            <span>Verificar Paciente</span>
          </button>
        </form>
      )}

      {/* Alerta de Error */}
      {errorMessage && (
        <div className="w-full mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between text-xs text-rose-800 animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={handleReintentar}
            className="p-1 hover:bg-rose-100 rounded-lg transition text-rose-700"
            title="Reintentar"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Modal de Paciente Encontrado */}
      <QRScanResultModal
        isOpen={isResultModalOpen}
        onClose={() => {
          setIsResultModalOpen(false);
          if (!isManualMode) {
            setStatus('REQUESTING_CAMERA');
            setCameraTrigger((prev) => prev + 1);
          } else {
            setStatus('IDLE');
          }
        }}
        patient={resolvedPatient}
        scannerRole={scannerRole}
      />
    </div>
  );
};

export default QRScannerCard;