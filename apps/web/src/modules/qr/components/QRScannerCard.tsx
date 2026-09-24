// =========================================================================
// ARCHIVO: apps/web/src/modules/qr/components/QRScannerCard.tsx
// DESCRIPCIÓN: Escáner visual con cámara en tiempo real mediante html5-qrcode
//              y fallback manual para contingencias o modo offline.
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
  const scannerContainerId = 'medicos-qr-reader-viewport';

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

  // Manejador del ciclo de vida de la cámara sin llamadas sincrónicas a setState en el cuerpo del efecto
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
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
          },
          (decodedText: string) => {
            if (!isMounted) return;
            void (async () => {
              try {
                if (scanner.isScanning) {
                  await scanner.stop();
                  try {
                    scanner.clear();
                  } catch {
                    // Limpieza síncrona segura
                  }
                }
              } catch {
                // Fallback seguro
              }
              void handleProcessPayload(decodedText);
            })();
          },
          undefined
        );

        if (isMounted) {
          setStatus('SCANNING');
        }
      } catch (err: unknown) {
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
      if (scanner.isScanning) {
        scanner.stop()
          .catch(() => {})
          .finally(() => {
            try {
              scanner.clear();
            } catch {
              // Limpieza síncrona segura
            }
          });
      } else {
        try {
          scanner.clear();
        } catch {
          // Limpieza síncrona segura
        }
      }
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
    <div className="w-full max-w-xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-xs p-5 sm:p-7 select-none flex flex-col items-center">
      {/* Cabecera del Escáner */}
      <div className="w-full flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#166E7A] border border-teal-200/70 flex items-center justify-center">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 tracking-tight">
              Lector Oficial de Carnet MedicOS
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">
              Escaneo nominal instantáneo y seguro
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleToggleMode}
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition cursor-pointer"
        >
          {isManualMode ? (
            <Camera className="w-3.5 h-3.5 text-[#166E7A]" />
          ) : (
            <Keyboard className="w-3.5 h-3.5 text-[#166E7A]" />
          )}
          <span>{isManualMode ? 'Usar Cámara' : 'Ingreso Manual'}</span>
        </button>
      </div>

      {/* Visor de Cámara */}
      {!isManualMode ? (
        <div className="w-full flex flex-col items-center">
          <div className="relative w-full aspect-square max-w-[320px] rounded-3xl overflow-hidden bg-slate-950 border-4 border-slate-100 shadow-inner flex items-center justify-center">
            <div id={scannerContainerId} className="w-full h-full object-cover" />

            {status === 'REQUESTING_CAMERA' && (
              <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center gap-2 text-white text-xs">
                <RotateCw className="w-7 h-7 animate-spin text-teal-400" />
                <span>Iniciando sensor óptico...</span>
              </div>
            )}

            {status === 'RESOLVING' && (
              <div className="absolute inset-0 bg-slate-950/85 flex flex-col items-center justify-center gap-2 text-white text-xs z-20">
                <RotateCw className="w-8 h-8 animate-spin text-[#25B4C4]" />
                <span className="font-bold">Verificando en PostgreSQL...</span>
              </div>
            )}

            {status === 'SCANNING' && (
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-between p-6">
                <div className="w-full flex justify-between">
                  <div className="w-6 h-6 border-t-4 border-l-4 border-[#25B4C4] rounded-tl-lg" />
                  <div className="w-6 h-6 border-t-4 border-r-4 border-[#25B4C4] rounded-tr-lg" />
                </div>
                <span className="text-[10px] text-teal-200/90 font-mono bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-xs">
                  Enfoca el QR del Carnet
                </span>
                <div className="w-full flex justify-between">
                  <div className="w-6 h-6 border-b-4 border-l-4 border-[#25B4C4] rounded-bl-lg" />
                  <div className="w-6 h-6 border-b-4 border-r-4 border-[#25B4C4] rounded-br-lg" />
                </div>
              </div>
            )}
          </div>

          <p className="text-center text-[11px] text-slate-400 font-medium mt-3">
            Apunta la cámara al código QR impreso o en pantalla del paciente.
          </p>
        </div>
      ) : (
        /* Formulario de Contingencia Manual */
        <form onSubmit={handleManualSubmit} className="w-full max-w-sm space-y-4 py-4">
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
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:outline-hidden focus:border-[#166E7A] focus:bg-white transition"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
            </div>
            <p className="text-[10.5px] text-slate-400">
              Permite validar pacientes sin necesidad de cámara en brigadas o estaciones fijas.
            </p>
          </div>

          <button
            type="submit"
            disabled={!manualCode.trim() || status === 'RESOLVING'}
            className="w-full py-2.5 bg-[#166E7A] hover:bg-[#105F68] disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition active:scale-95 cursor-pointer flex items-center justify-center gap-2"
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
        <div className="w-full mt-4 p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between text-xs text-rose-800 animate-in fade-in duration-150">
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