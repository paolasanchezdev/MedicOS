// =========================================================================
// COMPONENTE: Footer.tsx
// DESCRIPCIÓN: Pie de página con cuatro columnas: Logo+RRSS, Producto,
//              Recursos, Empresa y Newsletter. Diseño limpio en fondo oscuro
//              con transiciones de color en iconos de RRSS.
// =========================================================================

import React, { useState } from 'react';
import { ArrowRight, Stethoscope } from 'lucide-react';

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface FooterLink {
  label: string;
  href: string;
}

interface FooterColumn {
  heading: string;
  links: FooterLink[];
}

// ─── Ícono de Twitter/X (SVG inline) ─────────────────────────────────────────

const IconX: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L2.5 2.25H8.28l4.253 5.622 5.71-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const IconLinkedIn: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const IconFacebook: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const IconInstagram: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

// ─── Datos ───────────────────────────────────────────────────────────────────

const columns: FooterColumn[] = [
  {
    heading: 'Producto',
    links: [
      { label: 'Funciones', href: '#funciones' },
      { label: 'Panel de control', href: '#dashboard' },
      { label: 'Inteligencia Artificial', href: '#beneficios' },
      { label: 'Integraciones', href: '#' },
      { label: 'Precios', href: '#' },
    ],
  },
  {
    heading: 'Recursos',
    links: [
      { label: 'Documentación', href: '#' },
      { label: 'Blog médico', href: '#' },
      { label: 'Guías de uso', href: '#' },
      { label: 'API Reference', href: '#' },
      { label: 'Soporte técnico', href: '#' },
    ],
  },
  {
    heading: 'Empresa',
    links: [
      { label: 'Acerca de nosotros', href: '#nosotros' },
      { label: 'Equipo', href: '#' },
      { label: 'Carreras', href: '#' },
      { label: 'Política de privacidad', href: '#' },
      { label: 'Términos de uso', href: '#' },
    ],
  },
];

const socialLinks = [
  { icon: IconX, label: 'X / Twitter', href: '#', hoverColor: 'hover:text-medicos-cyan' },
  { icon: IconLinkedIn, label: 'LinkedIn', href: '#', hoverColor: 'hover:text-medicos-cyan' },
  { icon: IconFacebook, label: 'Facebook', href: '#', hoverColor: 'hover:text-medicos-cyan' },
  { icon: IconInstagram, label: 'Instagram', href: '#', hoverColor: 'hover:text-medicos-cyan' },
];

// ─── Componente principal ────────────────────────────────────────────────────

export const Footer: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [subscribed, setSubscribed] = useState<boolean>(false);

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer id="contacto" className="bg-medicos-dark-blue pt-20 pb-10 px-4 sm:px-8 md:px-12">
      <div className="max-w-7xl mx-auto">

        {/* Fila principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-16 border-b border-white/5">

          {/* ── Columna 1: Logo + descripción + RRSS ── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-medicos-teal flex items-center justify-center shrink-0">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">MedicOS</span>
            </div>

            {/* Tagline */}
            <p className="text-white/40 text-sm leading-relaxed font-medium max-w-xs">
              La plataforma integral de gestión médica que transforma la forma en que los profesionales de la salud trabajan cada día.
            </p>

            {/* Redes sociales */}
            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, label, href, hoverColor }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className={`w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 ${hoverColor} hover:bg-white/10 hover:border-medicos-cyan/30 transition-all duration-300`}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* ── Columnas 2–4: Navegación ── */}
          {columns.map((col) => (
            <div key={col.heading} className="space-y-5">
              <h4 className="text-xs font-bold text-white/80 tracking-widest uppercase">
                {col.heading}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-white/40 hover:text-medicos-cyan font-medium transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Fila de Newsletter + Copyright */}
        <div className="pt-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">

          {/* Newsletter */}
          <div className="space-y-3 flex-1 max-w-md">
            <h4 className="text-xs font-bold text-white/80 tracking-widest uppercase">
              Newsletter
            </h4>
            <p className="text-white/40 text-xs font-medium">
              Recibe novedades, guías clínicas y actualizaciones del producto.
            </p>

            {subscribed ? (
              <p className="text-medicos-cyan text-sm font-semibold">
                ¡Gracias! Te mantendremos informado ✓
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  required
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm font-medium placeholder:text-white/25 focus:outline-none focus:border-medicos-cyan/50 focus:bg-white/8 transition-all duration-300"
                />
                <button
                  type="submit"
                  aria-label="Suscribirse al boletín"
                  className="w-10 h-10 rounded-xl bg-medicos-teal flex items-center justify-center text-white hover:bg-medicos-cyan transition-colors duration-300 shrink-0 cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>

          {/* Copyright */}
          <div className="text-right">
            <p className="text-white/25 text-xs font-medium">
              © {new Date().getFullYear()} MedicOS. Todos los derechos reservados.
            </p>
            <p className="text-white/15 text-xs mt-1">
              Hecho con ❤️ para los profesionales de la salud
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
