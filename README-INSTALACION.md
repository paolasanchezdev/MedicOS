# MedicOS — Guía de Instalación y Especificación Técnica

> **Nota de Documentación:**  
> Este documento forma parte de la documentación técnica de **MedicOS**. Aquí se describen en detalle las dependencias del monorepo, librerías de producción y desarrollo, requisitos previos, procedimiento de instalación, scripts y configuración del entorno de desarrollo.
>
> Para conocer la descripción general del proyecto, su propósito funcional, arquitectura global, capturas de pantalla, módulos e información general para usuarios, consulte el archivo principal [README.md]

---

## 1. Dependencias del Proyecto

Todas las dependencias pertenecen exclusivamente a las declaraciones reales presentes en los archivos `package.json` de la raíz y de las aplicaciones del monorepo.

### Dependencias del Monorepo (Raíz)

#### Dependencias de Desarrollo

- **`turbo`**
  - **Qué es:** Motor de compilación y orquestador de tareas de alto rendimiento para monorepos JavaScript y TypeScript.
  - **Por qué MedicOS la utiliza:** Orquesta y ejecuta pipelines de desarrollo, compilación, linteo y pruebas (`dev`, `build`, `lint`, `test`) de forma paralela e incremental entre las distintas aplicaciones del monorepo.
  - **Ruta de ubicación:** `/package.json` (raíz)
  - **Versión:** `^2.10.8`
  - **Comando de instalación:** `npm install -D turbo`

---

### Backend (`apps/api/package.json`)

#### Dependencias de Producción

- **`express`**
  - **Qué es:** Framework web minimalista e infraestructura de servidor HTTP para Node.js.
  - **Por qué MedicOS la utiliza:** Administra las rutas HTTP, controladores REST, middlewares de la API y el ciclo de solicitud/respuesta en el Backend (configurado como ES Modules).
  - **Ruta de ubicación:** `apps/api`
  - **Versión:** `^5.2.1`
  - **Comando de instalación:** `npm install express`

- **`@prisma/client`**
  - **Qué es:** Cliente ORM autogenerado y type-safe para consultas a la base de datos.
  - **Por qué MedicOS la utiliza:** Proporciona una interfaz con tipado estático estricto para interactuar con la base de datos relacional PostgreSQL, garantizando la integridad de las consultas respecto al esquema.
  - **Ruta de ubicación:** `apps/api`
  - **Versión:** `^7.8.0`
  - **Comando de instalación:** `npm install @prisma/client`

- **`@prisma/adapter-pg`**
  - **Qué es:** Adaptador oficial de Prisma 7 para la integración de drivers nativos PostgreSQL.
  - **Por qué MedicOS la utiliza:** Vincula la instancia del cliente de Prisma con el driver `pg`, optimizando la conectividad y el manejo de pools de sockets de PostgreSQL.
  - **Ruta de ubicación:** `apps/api`
  - **Versión:** `^7.8.0`
  - **Comando de instalación:** `npm install @prisma/adapter-pg`

- **`pg`**
  - **Qué es:** Driver cliente de PostgreSQL no bloqueante para Node.js.
  - **Por qué MedicOS la utiliza:** Ofrece comunicación a bajo nivel y administración de conexiones TCP/IP con el motor de base de datos PostgreSQL.
  - **Ruta de ubicación:** `apps/api`
  - **Versión:** `^8.22.0`
  - **Comando de instalación:** `npm install pg`

- **`zod`**
  - **Qué es:** Librería de declaración y validación de esquemas con inferencia de tipos para TypeScript.
  - **Por qué MedicOS la utiliza:** Valida y sanitiza las estructuras de datos de las peticiones HTTP (payloads del body, query params y parámetros de ruta) en la capa de controladores de la API.
  - **Ruta de ubicación:** `apps/api`
  - **Versión:** `^4.4.3`
  - **Comando de instalación:** `npm install zod`

- **`jsonwebtoken`**
  - **Qué es:** Implementación de la especificación JSON Web Token (JWT) para Node.js.
  - **Por qué MedicOS la utiliza:** Emite, firma y verifica tokens de sesión criptográficos para la autenticación y autorización de usuarios en la API REST.
  - **Ruta de ubicación:** `apps/api`
  - **Versión:** `^9.0.3`
  - **Comando de instalación:** `npm install jsonwebtoken`

- **`bcryptjs`**
  - **Qué es:** Librería de hashing de contraseñas basada en el algoritmo bcrypt en JavaScript puro.
  - **Por qué MedicOS la utiliza:** Aplica hashing seguro con sal a las contraseñas antes de su almacenamiento en la base de datos y realiza la verificación durante la autenticación.
  - **Ruta de ubicación:** `apps/api`
  - **Versión:** `^3.0.3`
  - **Comando de instalación:** `npm install bcryptjs`

- **`express-rate-limit`**
  - **Qué es:** Middleware de limitación de tasa de peticiones para Express.
  - **Por qué MedicOS la utiliza:** Restringe el volumen de solicitudes por dirección IP en intervalos de tiempo para prevenir ataques de fuerza bruta y denegación de servicio (DoS).
  - **Ruta de ubicación:** `apps/api`
  - **Versión:** `^8.6.0`
  - **Comando de instalación:** `npm install express-rate-limit`

- **`cookie-parser`**
  - **Qué es:** Middleware para el procesamiento y análisis de cabeceras HTTP `Cookie`.
  - **Por qué MedicOS la utiliza:** Parsea las cookies enviadas por las peticiones del cliente y las expone en la propiedad `req.cookies` para el control de sesiones HTTP.
  - **Ruta de ubicación:** `apps/api`
  - **Versión:** `^1.4.7`
  - **Comando de instalación:** `npm install cookie-parser`

- **`cors`**
  - **Qué es:** Middleware de Express para habilitar el intercambio de recursos de origen cruzado (Cross-Origin Resource Sharing).
  - **Por qué MedicOS la utiliza:** Configura las políticas de seguridad HTTP que permiten a la aplicación web (`apps/web`) consumir los endpoints expuestos por la API (`apps/api`).
  - **Ruta de ubicación:** `apps/api`
  - **Versión:** `^2.8.6`
  - **Comando de instalación:** `npm install cors`

- **`dotenv`**
  - **Qué es:** Módulo de carga de variables de entorno desde un archivo `.env` a `process.env`.
  - **Por qué MedicOS la utiliza:** Inyecta configuraciones sensibles de ejecución (cadenas de conexión a base de datos, claves secretas JWT y puertos) en el entorno del proceso Node.js.
  - **Ruta de ubicación:** `apps/api`
  - **Versión:** `^17.4.2`
  - **Comando de instalación:** `npm install dotenv`

#### Dependencias de Desarrollo

- **`typescript`**
  - **Qué es:** Lenguaje de programación fuertemente tipado que se compila a JavaScript.
  - **Por qué MedicOS la utiliza:** Proporciona comprobación estática de tipos en todo el código fuente del proyecto Backend.
  - **Ruta de ubicación:** `apps/api`
  - **Versión:** `^6.0.3`
  - **Comando de instalación:** `npm install -D typescript`

- **`tsx`**
  - **Qué es:** Ejecutor y monitor de archivos TypeScript para Node.js basado en esbuild.
  - **Por qué MedicOS la utiliza:** Ejecuta el servidor API en entorno de desarrollo (`src/server.ts`) con recarga automática sin generar archivos intermedios de compilación en disco.
  - **Ruta de ubicación:** `apps/api`
  - **Versión:** `^4.23.1`
  - **Comando de instalación:** `npm install -D tsx`

- **`prisma`**
  - **Qué es:** CLI oficial de la plataforma de base de datos Prisma.
  - **Por qué MedicOS la utiliza:** Administra las migraciones SQL (`prisma migrate`), la sincronización de esquemas (`prisma db push`), la generación del cliente TypeScript (`prisma generate`) y la exploración visual de datos (`prisma studio`).
  - **Ruta de ubicación:** `apps/api`
  - **Versión:** `^7.8.0`
  - **Comando de instalación:** `npm install -D prisma`

- **`@types/express`**
  - **Qué es:** Definiciones de tipos de TypeScript para la librería Express.
  - **Por qué MedicOS la utiliza:** Aporta autocompletado y validación de tipos para objetos de solicitud, respuesta y middlewares en la API.
  - **Ruta de ubicación:** `apps/api`
  - **Versión:** `^5.0.6`
  - **Comando de instalación:** `npm install -D @types/express`

- **`@types/node`**
  - **Qué es:** Definiciones de tipos de TypeScript para las APIs nativas de Node.js.
  - **Por qué MedicOS la utiliza:** Proporciona el tipado de los módulos core e integrados del runtime de Node.js.
  - **Ruta de ubicación:** `apps/api`
  - **Versión:** `^24.13.3`
  - **Comando de instalación:** `npm install -D @types/node`

- **`@types/pg`**
  - **Qué es:** Definiciones de tipos de TypeScript para la librería `pg`.
  - **Por qué MedicOS la utiliza:** Añade tipado estático al interactuar con el cliente nativo de PostgreSQL.
  - **Ruta de ubicación:** `apps/api`
  - **Versión:** `^8.20.0`
  - **Comando de instalación:** `npm install -D @types/pg`

- **`@types/jsonwebtoken`**
  - **Qué es:** Definiciones de tipos de TypeScript para la librería `jsonwebtoken`.
  - **Por qué MedicOS la utiliza:** Proporciona seguridad de tipos durante la firma, decodificación y verificación de tokens de sesión.
  - **Ruta de ubicación:** `apps/api`
  - **Versión:** `^9.0.10`
  - **Comando de instalación:** `npm install -D @types/jsonwebtoken`

- **`@types/bcryptjs`**
  - **Qué es:** Definiciones de tipos de TypeScript para la librería `bcryptjs`.
  - **Por qué MedicOS la utiliza:** Aporta validación de tipos a las funciones de encriptación de contraseñas.
  - **Ruta de ubicación:** `apps/api`
  - **Versión:** `^2.4.6`
  - **Comando de instalación:** `npm install -D @types/bcryptjs`

- **`@types/cookie-parser`**
  - **Qué es:** Definiciones de tipos de TypeScript para la librería `cookie-parser`.
  - **Por qué MedicOS la utiliza:** Tipifica la propiedad `req.cookies` dentro del ciclo de peticiones de Express.
  - **Ruta de ubicación:** `apps/api`
  - **Versión:** `^1.4.10`
  - **Comando de instalación:** `npm install -D @types/cookie-parser`

- **`@types/cors`**
  - **Qué es:** Definiciones de tipos de TypeScript para la librería `cors`.
  - **Por qué MedicOS la utiliza:** Permite verificar la validez de los objetos de opciones de configuración de CORS.
  - **Ruta de ubicación:** `apps/api`
  - **Versión:** `^2.8.19`
  - **Comando de instalación:** `npm install -D @types/cors`

---

### Frontend (`apps/web/package.json`)

#### Dependencias de Producción

- **`react`**
  - **Qué es:** Librería para la construcción de interfaces de usuario interactivas basadas en componentes declarativos.
  - **Por qué MedicOS la utiliza:** Construye la arquitectura de componentes UI de la interfaz cliente de la plataforma médica.
  - **Ruta de ubicación:** `apps/web`
  - **Versión:** `^19.2.7`
  - **Comando de instalación:** `npm install react`

- **`react-dom`**
  - **Qué es:** Paquete de integración de React para la manipulación del Modelo de Objetos del Documento (DOM).
  - **Por qué MedicOS la utiliza:** Renderiza el árbol de componentes React en el DOM del navegador web.
  - **Ruta de ubicación:** `apps/web`
  - **Versión:** `^19.2.7`
  - **Comando de instalación:** `npm install react-dom`

- **`react-router-dom`**
  - **Qué es:** Librería de enrutamiento declarativo cliente para aplicaciones React en la web.
  - **Por qué MedicOS la utiliza:** Gestiona la navegación Single Page Application (SPA), renderizado de vistas y control de rutas cliente en el navegador.
  - **Ruta de ubicación:** `apps/web`
  - **Versión:** `^7.18.1`
  - **Comando de instalación:** `npm install react-router-dom`

- **`framer-motion`**
  - **Qué es:** Librería de animaciones declarativas para React.
  - **Por qué MedicOS la utiliza:** Implementa transiciones de página, componentes animados y efectos micro-interactivos en la interfaz de usuario.
  - **Ruta de ubicación:** `apps/web`
  - **Versión:** `^12.42.2`
  - **Comando de instalación:** `npm install framer-motion`

- **`lucide-react`**
  - **Qué es:** Colección de iconos vectoriales empaquetados como componentes React.
  - **Por qué MedicOS la utiliza:** Proporciona la iconografía de la plataforma cliente (paneles, botones, indicadores y formularios).
  - **Ruta de ubicación:** `apps/web`
  - **Versión:** `^1.24.0`
  - **Comando de instalación:** `npm install lucide-react`

- **`@marsidev/react-turnstile`**
  - **Qué es:** Componente de integración para el servicio Cloudflare Turnstile en React.
  - **Por qué MedicOS la utiliza:** Despliega protección anti-bot captcha en formularios sensibles (como login y registros) sin degradar la experiencia de usuario.
  - **Ruta de ubicación:** `apps/web`
  - **Versión:** `^1.5.3`
  - **Comando de instalación:** `npm install @marsidev/react-turnstile`

#### Dependencias de Desarrollo

- **`vite`**
  - **Qué es:** Herramienta de construcción y servidor de desarrollo para proyectos web basado en ES Modules nativos.
  - **Por qué MedicOS la utiliza:** Sirve la aplicación en desarrollo con Hot Module Replacement (HMR) ultrarrápido y realiza el empaquetado de producción de la app web.
  - **Ruta de ubicación:** `apps/web`
  - **Versión:** `^8.1.1`
  - **Comando de instalación:** `npm install -D vite`

- **`typescript`**
  - **Qué es:** Compilador de tipos estáticos para JavaScript.
  - **Por qué MedicOS la utiliza:** Ejecuta la comprobación estática de tipos en los componentes y lógica cliente del Frontend.
  - **Ruta de ubicación:** `apps/web`
  - **Versión:** `~6.0.2`
  - **Comando de instalación:** `npm install -D typescript`

- **`@vitejs/plugin-react`**
  - **Qué es:** Plugin oficial de Vite para la compilación de aplicaciones React.
  - **Por qué MedicOS la utiliza:** Habilita el soporte para transformaciones JSX/TSX y Fast Refresh durante el desarrollo en Vite.
  - **Ruta de ubicación:** `apps/web`
  - **Versión:** `^6.0.3`
  - **Comando de instalación:** `npm install -D @vitejs/plugin-react`

- **`tailwindcss`**
  - **Qué es:** Framework CSS orientado a clases utilitarias.
  - **Por qué MedicOS la utiliza:** Facilita la construcción de estilos dinámicos, adaptativos y modulares directamente en el maquetado de los componentes.
  - **Ruta de ubicación:** `apps/web`
  - **Versión:** `^4.3.2`
  - **Comando de instalación:** `npm install -D tailwindcss`

- **`@tailwindcss/postcss`**
  - **Qué es:** Plugin de integración de Tailwind CSS v4 para el motor PostCSS.
  - **Por qué MedicOS la utiliza:** Procesa el CSS de Tailwind v4 a través del pipeline de compilación de PostCSS.
  - **Ruta de ubicación:** `apps/web`
  - **Versión:** `^4.3.2`
  - **Comando de instalación:** `npm install -D @tailwindcss/postcss`

- **`postcss`**
  - **Qué es:** Herramienta de transformación de CSS basada en plugins JavaScript.
  - **Por qué MedicOS la utiliza:** Transforma y optimiza las hojas de estilo del cliente web.
  - **Ruta de ubicación:** `apps/web`
  - **Versión:** `^8.5.19`
  - **Comando de instalación:** `npm install -D postcss`

- **`autoprefixer`**
  - **Qué es:** Plugin de PostCSS para inyectar prefijos de proveedores CSS automáticamente según reglas de compatibilidad de navegadores.
  - **Por qué MedicOS la utiliza:** Garantiza la correcta visualización de propiedades CSS modernas en múltiples navegadores.
  - **Ruta de ubicación:** `apps/web`
  - **Versión:** `^10.5.3`
  - **Comando de instalación:** `npm install -D autoprefixer`

- **`eslint`**
  - **Qué es:** Herramienta de análisis estático de código para identificar errores de sintaxis y validar estándares de codificación.
  - **Por qué MedicOS la utiliza:** Mantiene la calidad y consistencia del código fuente de la aplicación cliente.
  - **Ruta de ubicación:** `apps/web`
  - **Versión:** `^10.6.0`
  - **Comando de instalación:** `npm install -D eslint`

- **`@eslint/js`**
  - **Qué es:** Configuración oficial de reglas estandarizadas de JavaScript para ESLint.
  - **Por qué MedicOS la utiliza:** Establece las reglas base recomendadas de auditoría sintáctica.
  - **Ruta de ubicación:** `apps/web`
  - **Versión:** `^10.0.1`
  - **Comando de instalación:** `npm install -D @eslint/js`

- **`typescript-eslint`**
  - **Qué es:** Conjunto de reglas y herramientas para permitir la evaluación de código TypeScript en ESLint.
  - **Por qué MedicOS la utiliza:** Adapta el análisis sintáctico de ESLint a archivos `.ts` y `.tsx`.
  - **Ruta de ubicación:** `apps/web`
  - **Versión:** `^8.62.0`
  - **Comando de instalación:** `npm install -D typescript-eslint`

- **`eslint-plugin-react-hooks`**
  - **Qué es:** Plugin de ESLint para la validación estricta de las reglas de los React Hooks.
  - **Por qué MedicOS la utiliza:** Previene errores comunes de estado garantizando el cumplimiento de las reglas de Hooks.
  - **Ruta de ubicación:** `apps/web`
  - **Versión:** `^7.1.1`
  - **Comando de instalación:** `npm install -D eslint-plugin-react-hooks`

- **`eslint-plugin-react-refresh`**
  - **Qué es:** Plugin de ESLint para validar la compatibilidad de componentes con React Fast Refresh en Vite.
  - **Por qué MedicOS la utiliza:** Asegura que los componentes exported cumplan con las condiciones necesarias para mantener el estado durante el reemplazo en caliente.
  - **Ruta de ubicación:** `apps/web`
  - **Versión:** `^0.5.3`
  - **Comando de instalación:** `npm install -D eslint-plugin-react-refresh`

- **`globals`**
  - **Qué es:** Definición de diccionarios de variables globales para herramientas de análisis sintáctico.
  - **Por qué MedicOS la utiliza:** Registra los entornos globales (browser, node, es2021) en la configuración de ESLint.
  - **Ruta de ubicación:** `apps/web`
  - **Versión:** `^17.7.0`
  - **Comando de instalación:** `npm install -D globals`

- **`@types/react`**
  - **Qué es:** Definiciones de tipos de TypeScript para la librería React.
  - **Por qué MedicOS la utiliza:** Aporta autocompletado y validación de tipos para JSX, elementos y Hooks de React.
  - **Ruta de ubicación:** `apps/web`
  - **Versión:** `^19.2.17`
  - **Comando de instalación:** `npm install -D @types/react`

- **`@types/react-dom`**
  - **Qué es:** Definiciones de tipos de TypeScript para `react-dom`.
  - **Por qué MedicOS la utiliza:** Habilita el soporte de tipos al interactuar con APIs del DOM mediante React.
  - **Ruta de ubicación:** `apps/web`
  - **Versión:** `^19.2.3`
  - **Comando de instalación:** `npm install -D @types/react-dom`

- **`@types/node`**
  - **Qué es:** Definiciones de tipos de TypeScript para módulos de Node.js en herramientas cliente.
  - **Por qué MedicOS la utiliza:** Permite el uso de APIs de Node.js en archivos de configuración web como `vite.config.ts`.
  - **Ruta de ubicación:** `apps/web`
  - **Versión:** `^24.13.2`
  - **Comando de instalación:** `npm install -D @types/node`

---

### Paquetes Internos del Monorepo (Workspace Packages)

- **`@medicos/shared-types`**
  - **Qué es:** Paquete interno de TypeScript perteneciente al Monorepo (ubicado en `packages/shared-types`).
  - **Por qué MedicOS la utiliza:** **No es una dependencia publicada ni descargada desde el registro de npm.** Se resuelve dinámicamente mediante la configuración de **npm Workspaces** (`"workspaces": ["apps/*", "packages/*", "services/*"]`). Centraliza los contratos de datos, interfaces DTO y tipos compartidos entre la API (`apps/api`) y la aplicación cliente (`apps/web`).
  - **Ruta del paquete:** `packages/shared-types`
  - **Importación en subproyectos:** `"@medicos/shared-types": "*"`

---

## 2. Scripts del Monorepo

Detalle completo de la totalidad de scripts configurados en el proyecto:

### Scripts Raíz (`package.json`)

- **`npm run dev`**
  - **Comando que ejecuta:** `turbo run dev`
  - **Dónde lo ejecuta:** En la raíz del monorepo.
  - **Qué hace Turbo:** Inicia de forma paralela y coordinada las tareas `dev` definidas en `apps/api/package.json` (`tsx watch src/server.ts`) y `apps/web/package.json` (`vite --port 5173`), canalizando la salida de logs a la consola.

- **`npm run build`**
  - **Comando que ejecuta:** `turbo run build`
  - **Dónde lo ejecuta:** En la raíz del monorepo.
  - **Qué hace Turbo:** Dispara la compilación optimizada de los artefactos de producción ejecutando los scripts `build` de `apps/api` (`tsc`) y `apps/web` (`tsc -b && vite build`).

- **`npm run lint`**
  - **Comando que ejecuta:** `turbo run lint`
  - **Dónde lo ejecuta:** En la raíz del monorepo.
  - **Qué hace Turbo:** Ejecuta las comprobaciones del linter `lint` en los subproyectos del monorepo.

- **`npm run test`**
  - **Comando que ejecuta:** `turbo run test`
  - **Dónde lo ejecuta:** En la raíz del monorepo.
  - **Qué hace Turbo:** Corre las suites de pruebas definidas en los paquetes del monorepo.

- **`npm run medicos`**
  - **Comando que ejecuta:** `sh ./run.sh`
  - **Dónde lo ejecuta:** En la raíz del proyecto.
  - **Función:** Invoca el script shell de inicialización global que valida requerimientos, genera el cliente de Prisma, sincroniza la base de datos y arranca el ecosistema de servicios.

---

### Scripts del Backend (`apps/api/package.json`)

- **`npm run dev --workspace=apps/api`** _(o `npm run dev` en `apps/api`)_
  - **Comando que ejecuta:** `tsx watch src/server.ts`
  - **Dónde lo ejecuta:** `apps/api`
  - **Función:** Ejecuta el servidor Express en modo desarrollo. `tsx watch` reinicia el proceso automáticamente ante cambios en el código sin requerir compilación previa a disco.

- **`npm run build --workspace=apps/api`**
  - **Comando que ejecuta:** `tsc`
  - **Dónde lo ejecuta:** `apps/api`
  - **Función:** Compila los archivos TypeScript de `src/` a código JavaScript executable dentro del directorio `dist/`.

- **`npm run start --workspace=apps/api`**
  - **Comando que ejecuta:** `node dist/server.js`
  - **Dónde lo ejecuta:** `apps/api`
  - **Función:** Inicia el servidor API en entorno de producción utilizando la compilación de JavaScript generada en `dist/server.js`.

- **`npm run prisma:generate --workspace=apps/api`**
  - **Comando que ejecuta:** `prisma generate`
  - **Dónde lo ejecuta:** `apps/api`
  - **Función:** Genera las definiciones de tipo y métodos del cliente `@prisma/client` a partir del modelo especificado en `prisma/schema.prisma`.

- **`npm run prisma:push --workspace=apps/api`**
  - **Comando que ejecuta:** `prisma db push`
  - **Dónde lo ejecuta:** `apps/api`
  - **Función:** Sincroniza la estructura del esquema de Prisma directamente contra la base de datos PostgreSQL de desarrollo sin crear archivos de migración SQL.

- **`npm run prisma:migrate --workspace=apps/api`**
  - **Comando que ejecuta:** `prisma migrate dev`
  - **Dónde lo ejecuta:** `apps/api`
  - **Función:** Crea y aplica archivos de migración SQL en la base de datos PostgreSQL de desarrollo basándose en los cambios del archivo de esquema.

- **`npm run prisma:studio --workspace=apps/api`**
  - **Comando que ejecuta:** `prisma studio`
  - **Dónde lo ejecuta:** `apps/api`
  - **Función:** Abre una interfaz web administrativa en el navegador para inspeccionar y modificar los registros de la base de datos PostgreSQL.

---

### Scripts del Frontend (`apps/web/package.json`)

- **`npm run dev --workspace=apps/web`** _(o `npm run dev` en `apps/web`)_
  - **Comando que ejecuta:** `vite --port 5173`
  - **Dónde lo ejecuta:** `apps/web`
  - **Función:** Inicia el servidor de desarrollo local de Vite en el puerto `5173` con reemplazo de módulos en caliente (HMR).

- **`npm run build --workspace=apps/web`**
  - **Comando que ejecuta:** `tsc -b && vite build`
  - **Dónde lo ejecuta:** `apps/web`
  - **Función:** Comprueba los tipos de TypeScript con `tsc -b` y compila los assets web de producción optimizados en la carpeta `dist/`.

- **`npm run lint --workspace=apps/web`**
  - **Comando que ejecuta:** `eslint .`
  - **Dónde lo ejecuta:** `apps/web`
  - **Función:** Ejecuta la inspección sintáctica de ESLint sobre el código fuente del proyecto cliente.

- **`npm run preview --workspace=apps/web`**
  - **Comando que ejecuta:** `vite preview`
  - **Dónde lo ejecuta:** `apps/web`
  - **Función:** Levanta un servidor web de pruebas local para servir la build de producción generada por Vite.

---

## 3. Requisitos Previos

Soportados estrictamente en la declaración de paquetes y scripts del proyecto:

1. **Node.js**: Runtime de JavaScript requerido por la infraestructura de herramientas (`@types/node` v24.x especificado en dependencias).
2. **npm**: Gestor de paquetes configurado en `"packageManager": "npm@11.12.1"` del `package.json` raíz. Debe contar con soporte nativo de **npm Workspaces**.
3. **PostgreSQL**: Servidor de base de datos relacional requerido por los paquetes `@prisma/adapter-pg` y el cliente nativo `pg` (`v8.22.0`).
4. **Git y Entorno Shell (Bash)**: Requeridos para la clonación del repositorio y para ejecutar el script `run.sh` configurado en `npm run medicos`.

---

## 4. Guía de Instalación y Despliegue Local

Siga este procedimiento paso a paso utilizando exclusivamente los scripts configurados en el proyecto:

### Paso 1: Clonar el Repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd MedicOS
```

### Paso 2: Instalar Dependencias del Monorepo

Ejecute la instalación desde la raíz. El gestor npm enlazará automáticamente el paquete interno del workspace (`packages/shared-types`) e instalará las dependencias de los subproyectos:

```bash
npm install
```

### Paso 3: Configurar Variables de Entorno en la API

Cree el archivo `.env` dentro del directorio `apps/api/`:

```env
PORT=3000
DATABASE_URL="postgresql://usuario:password@localhost:5432/medicos_db?schema=public"
JWT_SECRET="clave_secreta_jwt"
```

### Paso 4: Generar el Cliente de Prisma

Construir los tipos del cliente `@prisma/client` para el Backend:

```bash
npm run prisma:generate --workspace=apps/api
```

### Paso 5: Sincronizar o Migrar la Base de Datos

Para aplicar el esquema sobre la base de datos PostgreSQL:

```bash
# Opción A: Aplicar migraciones en entorno de desarrollo
npm run prisma:migrate --workspace=apps/api

# Opción B: Sincronizar esquema directamente
npm run prisma:push --workspace=apps/api
```

### Paso 6: Levantar el Backend (API)

```bash
npm run dev --workspace=apps/api
```

_El servicio iniciará mediante `tsx watch` en `http://localhost:3000`._

### Paso 7: Levantar el Frontend (Web)

En una segunda terminal:

```bash
npm run dev --workspace=apps/web
```

_El servicio iniciará con Vite en `http://localhost:5173`._

### Paso 8: Levantar el Monorepo Completo con TurboRepo

Para iniciar Backend y Frontend simultáneamente mediante el pipeline del monorepo:

```bash
npm run dev
```

O ejecute el lanzador integrado:

```bash
npm run medicos
```

---

## 5. Variables de Entorno

Variables verdaderamente requeridas y procesadas por las librerías declaradas en el proyecto (`dotenv`, `express`, `pg`/`@prisma/adapter-pg`, `jsonwebtoken`):

- **`DATABASE_URL`**
  - **Uso:** Cadena de conexión a la base de datos PostgreSQL consumida por `@prisma/adapter-pg` y el cliente nativo `pg`.
  - **Sintaxis:** `postgresql://<usuario>:<password>@<host>:<puerto>/<nombre_db>?schema=public`

- **`PORT`**
  - **Uso:** Puerto TCP de escucha del servidor HTTP de Express en `apps/api`.
  - **Ejemplo:** `3000`

- **`JWT_SECRET`**
  - **Uso:** Clave o frase secreta empleada por `jsonwebtoken` para firmar y verificar tokens de sesión.

---

## 6. Solución de Problemas Frecuentes

Basada en las tecnologías identificadas en el monorepo:

### 1. Fallos de Conexión a PostgreSQL / Prisma

- **Síntoma:** Error al ejecutar `prisma:push` o `prisma:migrate`.
- **Solución:**
  1. Compruebe que la instancia de PostgreSQL se encuentre activa.
  2. Valide que la variable `DATABASE_URL` en `apps/api/.env` contenga credenciales de acceso correctas.
  3. Reejecute `npm run prisma:generate --workspace=apps/api` tras actualizar modelos en el esquema.

### 2. Ocupación de Puerto en el Frontend (Vite)

- **Síntoma:** Vite indica que el puerto `5173` está en uso.
- **Solución:** Detenga los procesos que ocupen el puerto `5173` o finalice servidores previos de Vite antes de ejecutar `npm run dev --workspace=apps/web`.

### 3. Inconsistencia en Caché de TurboRepo o Workspaces

- **Síntoma:** Cambios en el paquete `@medicos/shared-types` no son detectados en `apps/api` o `apps/web`.
- **Solución:**
  1. Reinstale el enlace de workspaces en la raíz: `npm install`.
  2. Limpie la caché de Turbo con `npx turbo clean` y vuelva a arrancar con `npm run dev`.

### 4. Errores de Módulos o Compilación en Backend (`tsx` / Express)

- **Síntoma:** Fallos de resolución de importaciones ES Modules en `apps/api`.
- **Solución:** Conserve el parámetro `"type": "module"` en `apps/api/package.json`, ya que el Backend está diseñado nativamente bajo la especificación ES Modules.
