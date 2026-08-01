#!/usr/bin/env bash

# Colores para la consola
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}=====================================${NC}"
echo -e "${CYAN}        MedicOS Launcher v1.0        ${NC}"
echo -e "${CYAN}=====================================${NC}\n"

# 1. Verificar Requisitos
echo -e "${YELLOW}[1/6] Verificando entorno del sistema...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}✖ Node.js no está instalado. Descárgalo de https://nodejs.org${NC}"
    exit 1
fi
echo -e "  ${GREEN}✔ Node.js $(node -v) detectado${NC}"

if ! command -v npm &> /dev/null; then
    echo -e "${RED}✖ npm no está instalado.${NC}"
    exit 1
fi
echo -e "  ${GREEN}✔ npm v$(npm -v) detectado${NC}"

# 2. Verificar Puertos (3000 y 5173)
echo -e "\n${YELLOW}[2/6] Verificando disponibilidad de puertos...${NC}"
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        echo -e "${RED}✖ El puerto $1 está ocupado por otro proceso.${NC}"
        return 1
    else
        echo -e "  ${GREEN}✔ Puerto $1 libre${NC}"
        return 0
    fi
}

check_port 3000 || exit 1
check_port 5173 || exit 1

# 3. Instalación de Dependencias
echo -e "\n${YELLOW}[3/6] Comprobando dependencias de Node...${NC}"
if [ ! -d "node_modules" ]; then
    echo -e "  ${CYAN}📦 Instalando dependencias del monorepo (esto puede tardar un poco)...${NC}"
    npm install
    echo -e "  ${GREEN}✔ Dependencias instaladas con éxito.${NC}"
else
    echo -e "  ${GREEN}✔ Dependencias ya presentes en node_modules.${NC}"
fi

# 4. Variables de Entorno (.env)
echo -e "\n${YELLOW}[4/6] Verificando archivos de configuración (.env)...${NC}"
if [ ! -f "apps/api/.env" ]; then
    if [ -f "apps/api/.env.example" ]; then
        cp apps/api/.env.example apps/api/.env
        echo -e "  ${YELLOW}⚠ Se creó apps/api/.env basado en .env.example. Revisa las credenciales de BD.${NC}"
    else
        echo -e "  ${YELLOW}⚠ Advertencia: No se encontró apps/api/.env${NC}"
    fi
else
    echo -e "  ${GREEN}✔ Configuración de API (.env) detectada.${NC}"
fi

# 5. Configuración de Prisma ORM
echo -e "\n${YELLOW}[5/6] Sincronizando Prisma ORM...${NC}"
echo -e "  ${CYAN}⚙ Generando cliente de Prisma...${NC}"
npm --prefix apps/api run prisma:generate

echo -e "  ${CYAN}⚙ Aplicando migraciones a la Base de Datos...${NC}"
npm --prefix apps/api run prisma:push

echo -e "  ${GREEN}✔ Base de datos y cliente Prisma listos.${NC}"

# 6. Lanzar la Aplicación Monorepo
echo -e "\n${YELLOW}[6/6] Iniciando ecosistema MedicOS...${NC}"
echo -e "${GREEN}=====================================${NC}"
echo -e "${GREEN}🚀 MedicOS se está ejecutando:${NC}"
echo -e "   • Backend API:  ${CYAN}http://localhost:3000${NC}"
echo -e "   • Frontend Web: ${CYAN}http://localhost:5173${NC}"
echo -e "${GREEN}=====================================${NC}\n"

# Iniciar el comando dev centralizado (Turbo / Concurrently / npm run dev)
npm run dev