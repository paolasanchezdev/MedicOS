MedicOS - Guía de Instalación y Configuración
Este repositorio cuenta con un instalador automatizado (install_all.sh) diseñado para configurar todo el entorno de desarrollo (Node.js, Docker, PostgreSQL, variables de entorno y migraciones de Prisma) en una computadora nueva con Ubuntu / Debian / WSL2.

📋 Requisitos Previos
Sistema Operativo Ubuntu / Debian (o derivado Linux / WSL2 en Windows).

Tener Git instalado.

Conexión a Internet.

🚀 OPCIÓN 1: Instalación Rápida Automatizada (Recomendada)
Ejecuta los siguientes comandos en la terminal de la nueva computadora:

Paso 1: Clonar el repositorio
Bash
git clone <URL_DE_TU_REPOSISTORIO>
cd MedicOS
Paso 2: Otorgar permisos de ejecución al instalador
Bash
chmod +x install_all.sh
Paso 3: Ejecutar el instalador con permisos de administrador
Bash
sudo ./install_all.sh
¿Qué hace este script automáticamente?

Instala dependencias del sistema y Node.js v20 LTS (si no están presentes).

Instala Docker y Docker Compose.

Genera el archivo .env con las credenciales por defecto del equipo.

Instala todas las dependencias del monorepo (npm install).

Libera el puerto 5432 e inicia el contenedor de PostgreSQL con Docker.

Ejecuta las migraciones de Prisma (prisma migrate deploy) e importa los datos iniciales o el archivo de respaldo .sql.

Paso 4: Actualizar permisos de Docker en la sesión actual
Bash
newgrp docker
Paso 5: Iniciar el entorno de desarrollo
Bash
npm run dev
