#!/bin/bash
set -e

echo -e "\033[0;36m====================================="
echo -e "        MedicOS Launcher v1.0        "
echo -e "=====================================\033[0m\n"

# 1. Verificar Requisitos
echo -e "\033[0;33m[1/6] Verificando entorno del sistema...\033[0m"

if ! command -v node &> /dev/null; then
echo -e "\033[0;31m✖ Node.js no está instalado. Descárgalo de https://nodejs.org\033[0m"
exit 1
fi
echo -e "\033[0;32m  ✔ Node.js $(node -v) detectado\033[0m"

if ! command -v npm &> /dev/null; then
echo -e "\033[0;31m✖ npm no está instalado.\033[0m"
exit 1
fi
echo -e "\033[0;32m  ✔ npm v$(npm -v) detectado\033[0m"

# 2. Verificar Puertos
echo -e "\n\033[0;33m[2/6] Verificando disponibilidad de puertos...\033[0m"

check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1 || nc -z localhost $port >/dev/null 2>&1; then
    echo -e "\033[0;31m✖ El puerto $port está ocupado por otro proceso.\033[0m"
    return 1
    else
    echo -e "\033[0;32m  ✔ Puerto $port libre\033[0m"
    return 0
    fi
}

if ! check_port 3000 || ! check_port 5173; then
exit 1
fi

# 3. Instalación de Dependencias
echo -e "\n\033[0;33m[3/6] Comprobando dependencias de Node...\033[0m"
if [ ! -d "node_modules" ]; then
echo -e "\033[0;36m  📦 Instalando dependencias del monorepo...\033[0m"
npm install
echo -e "\033[0;32m  ✔ Dependencias instaladas con éxito.\033[0m"
else
echo -e "\033[0;32m  ✔ Dependencias ya presentes en node_modules.\033[0m"
fi

# 4. Variables de Entorno
echo -e "\n\033[0;33m[4/6] Verificando archivos de configuración (.env)...\033[0m"
if [ ! -f "apps/api/.env" ]; then
if [ -f "apps/api/.env.example" ]; then
cp "apps/api/.env.example" "apps/api/.env"
echo -e "\033[0;33m  ⚠ Se creó apps/api/.env basado en .env.example.\033[0m"
fi
else
echo -e "\033[0;32m  ✔ Configuración de API (.env) detectada.\033[0m"
fi

# 5. Configurar Prisma 7
echo -e "\n\033[0;33m[5/6] Sincronizando Prisma ORM...\033[0m"
cd apps/api
npx prisma generate
npx prisma db push
cd ../..
echo -e "\033[0;32m  ✔ Base de datos y cliente Prisma listos.\033[0m"

# 6. Despliegue
echo -e "\n\033[0;33m[6/6] Iniciando ecosistema MedicOS...\033[0m"
echo -e "\033[0;32m====================================="
echo -e "🚀 MedicOS se está ejecutando:"
echo -e "   • Backend API:  http://localhost:3000"
echo -e "   • Frontend Web: http://localhost:5173"
echo -e "=====================================\033[0m\n"

npm run dev