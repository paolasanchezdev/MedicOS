#!/usr/bin/env bash

# ============================================================
# MedicOS - Launcher Robusto y Resiliente
# Sistema Inteligente para Brigadas Médicas Comunitarias
# ============================================================

set -Eeuo pipefail

# ============================================================
# COLORES
# ============================================================

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BLUE='\033[0;34m'
NC='\033[0m'

# ============================================================
# CONFIGURACIÓN DE RUTAS Y PUERTOS
# ============================================================

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
API_DIR="$PROJECT_DIR/apps/api"
WEB_DIR="$PROJECT_DIR/apps/web"
ENV_FILE="$API_DIR/.env"

API_PORT=3000
WEB_PORT=5173

# ============================================================
# FUNCIONES AUXILIARES
# ============================================================

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${CYAN}ℹ️  $1${NC}"
}

command_exists() {
    command -v "$1" >/dev/null 2>&1
}

port_in_use() {
    local port="$1"
    if command_exists lsof; then
        lsof -Pi :"$port" -sTCP:LISTEN -t >/dev/null 2>&1
    elif command_exists ss; then
        ss -ltn "( sport = :$port )" 2>/dev/null | grep -q ":$port"
    else
        return 1
    fi
}

cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Deteniendo MedicOS de forma segura...${NC}"
    echo ""
}

trap cleanup INT TERM

# ============================================================
# ENCABEZADO
# ============================================================

clear

echo -e "${BLUE}============================================================${NC}"
echo -e "${BLUE}                 MedicOS Launcher v2.0                      ${NC}"
echo -e "${BLUE}============================================================${NC}"
echo -e "${CYAN} Sistema Inteligente para Brigadas Médicas Comunitarias     ${NC}"
echo -e "${BLUE}============================================================${NC}"

# ============================================================
# 1. COMPROBAR ESTRUCTURA DEL PROYECTO
# ============================================================

echo ""
echo -e "${YELLOW}[1/7] Verificando estructura del proyecto...${NC}"

cd "$PROJECT_DIR"

if [ ! -f "$PROJECT_DIR/package.json" ]; then
    print_error "No se encontró package.json en la raíz del proyecto."
    exit 1
fi

if [ ! -d "$API_DIR" ] || [ ! -d "$WEB_DIR" ]; then
    print_error "No se encontró el directorio apps/api o apps/web."
    exit 1
fi

print_success "Estructura Monorepo detectada."

# ============================================================
# 2. VERIFICAR REQUISITOS DEL ENTORNO
# ============================================================

echo ""
echo -e "${YELLOW}[2/7] Verificando requisitos del sistema...${NC}"

if ! command_exists node; then
    print_error "Node.js no está instalado."
    exit 1
fi
print_success "Node.js $(node -v) detectado."

if ! command_exists npm; then
    print_error "npm no está instalado."
    exit 1
fi
print_success "npm $(npm -v) detectado."

# ============================================================
# 3. VERIFICAR VARIABLES DE ENTORNO (NO DESTRUCTIVO)
# ============================================================

echo ""
echo -e "${YELLOW}[3/7] Verificando variables de entorno...${NC}"

if [ ! -f "$ENV_FILE" ]; then
    if [ -f "$API_DIR/.env.example" ]; then
        cp "$API_DIR/.env.example" "$ENV_FILE"
        print_info "Se creó apps/api/.env a partir de .env.example."
    else
        print_info "Creando apps/api/.env inicial..."
        cat > "$ENV_FILE" <<EOF
PORT=${API_PORT}
DATABASE_URL="postgresql://medicos_app:MedicosDB_2026_Secure@localhost:5432/medicos_db?schema=public"
JWT_SECRET="f9a8b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0"
EOF
    fi
else
    print_success "Archivo apps/api/.env existente preservado (sin sobreescrituras)."
fi

# ============================================================
# 4. VERIFICAR ESTADO DE POSTGRESQL (NATIVO O DOCKER)
# ============================================================

echo ""
echo -e "${YELLOW}[4/7] Verificando motor de base de datos PostgreSQL...${NC}"

if port_in_use 5432; then
    print_success "PostgreSQL detectado y activo en el puerto 5432."
else
    print_info "PostgreSQL no responde en el puerto 5432. Intentando iniciar servicio nativo..."
    if command_exists systemctl; then
        sudo systemctl start postgresql || true
    fi

    if ! port_in_use 5432; then
        if command_exists docker && [ -f "$PROJECT_DIR/docker-compose.yml" ]; then
            print_info "Iniciando PostgreSQL mediante Docker Compose..."
            docker compose up -d
        else
            print_error "No se pudo iniciar PostgreSQL ni en sistema nativo ni en Docker."
            exit 1
        fi
    fi
fi

# ============================================================
# 5. INSTALACIÓN DE DEPENDENCIAS
# ============================================================

echo ""
echo -e "${YELLOW}[5/7] Verificando dependencias del monorepo...${NC}"

if [ ! -d "$PROJECT_DIR/node_modules" ]; then
    print_info "Instalando dependencias generales..."
    npm install
    print_success "Dependencias instaladas."
else
    print_success "Dependencias ya instaladas."
fi

# ============================================================
# 6. GENERAR Y SINCRONIZAR BASE DE DATOS
# ============================================================

echo ""
echo -e "${YELLOW}[6/7] Sincronizando esquema de base de datos...${NC}"

(
    cd "$API_DIR"
    echo -e "${CYAN}⚙ Generando cliente de Prisma...${NC}"
    npx prisma generate

    echo -e "${CYAN}⚙ Sincronizando modelos con PostgreSQL (db push)...${NC}"
    npx prisma db push --skip-generate
)
print_success "Base de datos sincronizada con el modelo Prisma actual."

# ============================================================
# 7. VERIFICACIÓN DE DATOS / SEMBRADO DE RESPALDO
# ============================================================

echo ""
echo -e "${YELLOW}[7/7] Verificando datos del sistema...${NC}"

USER_COUNT=$(
    cd "$API_DIR" && \
    npx tsx -e "
        import { PrismaClient } from '@prisma/client';
        import { PrismaPg } from '@prisma/adapter-pg';
        import pg from 'pg';
        import dotenv from 'dotenv';
        dotenv.config();

        const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
        const adapter = new PrismaPg(pool);
        const prisma = new PrismaClient({ adapter });

        async function check() {
            try {
                const count = await prisma.user.count();
                console.log(count);
            } catch {
                console.log('0');
            } finally {
                await prisma.\$disconnect();
                await pool.end();
            }
        }
        check();
    " 2>/dev/null
) || USER_COUNT="0"

if [ "$USER_COUNT" -eq "0" ]; then
    print_warning "La base de datos está vacía. Ejecutando sembrado maestro de datos..."
    (
        cd "$API_DIR"
        npx tsx prisma/seed.ts
    )
    print_success "Catálogo oficial, brigadas y usuarios sembrados exitosamente."
else
    print_success "Datos existentes detectados (${USER_COUNT} usuarios registrados)."
fi

# ============================================================
# INICIO DEL ENTORNO DE DESARROLLO
# ============================================================

echo ""
echo -e "${GREEN}============================================================${NC}"
echo -e "${GREEN}                 🚀 MedicOS ESTÁ LISTO                      ${NC}"
echo -e "${GREEN}============================================================${NC}"
echo -e " 🐘 PostgreSQL:   ${GREEN}localhost:5432/medicos_db${NC}"
echo -e " 🔧 API Backend:  ${CYAN}http://localhost:${API_PORT}${NC}"
echo -e " 🌐 Frontend Web: ${CYAN}http://localhost:${WEB_PORT}${NC}"
echo -e "${GREEN}============================================================${NC}"
echo ""

npm run dev