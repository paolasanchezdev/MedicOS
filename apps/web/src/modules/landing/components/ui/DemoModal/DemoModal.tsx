import React, { useEffect } from "react";

interface DemoModalProps {
  open: boolean;
  onClose: () => void;
}

export const DemoModal: React.FC<DemoModalProps> = ({ open, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (open) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm transition-all duration-300">
      {/* Fondo interactivo para cerrar */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Contenido del Modal */}
      <div className="relative w-full max-w-lg bg-medicos-surface border border-medicos-soft-border rounded-2xl p-6 sm:p-8 shadow-2xl z-10 space-y-6">
        {/* Botón de cierre */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 text-medicos-muted hover:text-medicos-dark-blue p-2 rounded-lg transition-colors cursor-pointer"
          aria-label="Cerrar modal"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Encabezado */}
        <div className="space-y-2">
          <span className="inline-block px-3 py-1 text-xs font-bold font-mono uppercase bg-medicos-cyan/10 text-medicos-cyan border border-medicos-cyan/20 rounded-full">
            Solicitud de Demostración
          </span>
          <h3 className="text-2xl font-extrabold text-medicos-dark-blue">
            Prueba MedicOS en Vivo
          </h3>
          <p className="text-sm text-medicos-muted leading-relaxed">
            Ingresa tus datos para agendar una demostración guiada o solicitar acceso al entorno de prueba.
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={(e) => { e.preventDefault(); onClose(); }} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-medicos-dark-blue uppercase mb-1.5">
              Nombre Completo
            </label>
            <input
              type="text"
              required
              placeholder="Ej. Dra. María López"
              className="w-full px-4 py-2.5 rounded-xl bg-medicos-canvas border border-medicos-soft-border text-sm text-medicos-dark-blue focus:outline-none focus:ring-2 focus:ring-medicos-cyan/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-medicos-dark-blue uppercase mb-1.5">
              Correo Electrónico
            </label>
            <input
              type="email"
              required
              placeholder="ejemplo@medicos.health"
              className="w-full px-4 py-2.5 rounded-xl bg-medicos-canvas border border-medicos-soft-border text-sm text-medicos-dark-blue focus:outline-none focus:ring-2 focus:ring-medicos-cyan/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-medicos-dark-blue uppercase mb-1.5">
              Organización / Institución
            </label>
            <input
              type="text"
              placeholder="Ej. Unidad de Salud Municipal"
              className="w-full px-4 py-2.5 rounded-xl bg-medicos-canvas border border-medicos-soft-border text-sm text-medicos-dark-blue focus:outline-none focus:ring-2 focus:ring-medicos-cyan/50"
            />
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-medicos-dark-blue hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              Solicitar Acceso
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto py-3 px-5 rounded-xl bg-medicos-canvas hover:bg-slate-200/60 text-medicos-muted font-semibold text-sm transition-all cursor-pointer border border-medicos-soft-border"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DemoModal;