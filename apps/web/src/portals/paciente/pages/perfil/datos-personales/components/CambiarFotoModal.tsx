// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/perfil/datos-personales/components/CambiarFotoModal.tsx
// DESCRIPCIÓN: Modal accesible para subir, recortar en vista previa o eliminar
//              la foto de perfil (JPG, PNG, WebP máx 2MB) sin uso biométrico.
// =========================================================================

import React, { useState, useRef } from 'react';
import { X, Upload, Trash2, Camera, AlertCircle } from 'lucide-react';

interface CambiarFotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatarUrl?: string | undefined;
  onSaveAvatar: (base64Image: string) => void;
  onRemoveAvatar: () => void;
}

export const CambiarFotoModal: React.FC<CambiarFotoModalProps> = ({
  isOpen,
  onClose,
  currentAvatarUrl,
  onSaveAvatar,
  onRemoveAvatar,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validación de tipo de archivo
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Formato no compatible. Por favor sube una imagen JPG, PNG o WebP.');
      return;
    }

    // Validación de tamaño (2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('El archivo supera los 2 MB máximos permitidos.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmSave = () => {
    if (!previewUrl) return;
    onSaveAvatar(previewUrl);
    setPreviewUrl(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150 select-none">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-sm overflow-hidden flex flex-col">
        {/* Cabecera del Modal */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-[#1c5752]" />
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Foto de Perfil
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Contenido Central con Vista Previa */}
        <div className="p-6 flex flex-col items-center space-y-4">
          <div className="w-28 h-28 rounded-full border-4 border-teal-50 overflow-hidden bg-slate-100 flex items-center justify-center shadow-md">
            {previewUrl || currentAvatarUrl ? (
              <img
                src={previewUrl || currentAvatarUrl}
                alt="Vista previa"
                className="w-full h-full object-cover"
              />
            ) : (
              <Camera className="w-12 h-12 text-slate-300" />
            )}
          </div>

          <p className="text-xs text-slate-500 text-center font-medium max-w-xs">
            Personaliza la imagen visible en tu portal. Esta fotografía no es utilizada para autenticación biométrica ni clínica.
          </p>

          {error && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
          />

          {/* Botones de Selección y Eliminación */}
          <div className="flex items-center gap-2 w-full">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 py-2.5 px-3 rounded-2xl bg-[#1c5752] hover:bg-[#164743] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Subir Imagen</span>
            </button>

            {currentAvatarUrl && !previewUrl && (
              <button
                type="button"
                onClick={onRemoveAvatar}
                title="Eliminar foto actual"
                className="p-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition cursor-pointer active:scale-95"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {previewUrl && (
            <button
              type="button"
              onClick={handleConfirmSave}
              className="w-full py-2 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer active:scale-95"
            >
              Guardar Esta Foto
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CambiarFotoModal;