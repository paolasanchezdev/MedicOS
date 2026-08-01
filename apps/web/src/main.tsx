// =========================================================================
// ARCHIVO: apps/web/src/main.tsx
// DESCRIPCIÓN: Punto de entrada principal de la aplicación en el navegador.
//              Importa los estilos de Tailwind CSS e inicializa el DOM de React.
// =========================================================================

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Importa el componente raíz App (donde están tus rutas y contexto)
import './index.css';    // Importación crítica de Tailwind v4: ¡Carga los estilos globales!

// Monta de forma estricta la aplicación en el elemento div con id "root" del HTML
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);