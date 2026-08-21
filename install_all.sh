#!/usr/bin/env bash

# ============================================================
# MedicOS - Instalador y Sincronizador Maestro (v2.5)
# ============================================================
# Compatible con Ubuntu 22.04 / 24.04 LTS y derivadas
# ============================================================

set -u

# ------------------------------------------------------------
# Colores
# ------------------------------------------------------------
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

log() { echo -e "${CYAN}$1${NC}"; }
success() { echo -e "${GREEN}✔ $1${NC}"; }
warning() { echo -e "${YELLOW}⚠ $1${NC}"; }
error() { echo -e "${RED}✖ $1${NC}"; exit 1; }

# ------------------------------------------------------------
# Verificar permisos de administrador
# ------------------------------------------------------------
if [ "$EUID" -ne 0 ]; then
    error "Este script requiere permisos de administrador.\nEjecuta: sudo bash ./install_all.sh"
fi

REAL_USER="${SUDO_USER:-$USER}"
REAL_HOME="$(eval echo "~$REAL_USER")"

run_as_user() {
    if [ -n "${SUDO_USER:-}" ] && [ "$REAL_USER" != "root" ]; then
        sudo -u "$REAL_USER" env PATH="$PATH" HOME="$REAL_HOME" "$@"
    else
        "$@"
    fi
}

# ------------------------------------------------------------
# Directorio raíz del proyecto
# ------------------------------------------------------------
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR" || exit 1

echo
echo "============================================================"
echo "                  MedicOS Installer v2.5"
echo "============================================================"
echo "Usuario objetivo: $REAL_USER"
echo "Directorio      : $PROJECT_DIR"
echo "============================================================"
echo

# ------------------------------------------------------------
# 1. Dependencias base del sistema
# ------------------------------------------------------------
log "[1/7] Verificando dependencias del sistema..."

apt-get update -y
apt-get install -y \
    curl \
    git \
    ca-certificates \
    gnupg \
    lsb-release \
    build-essential \
    lsof \
    openssl \
    postgresql-client

success "Dependencias del sistema verificadas."

# ------------------------------------------------------------
# 2. Node.js (v20 o v22 LTS)
# ------------------------------------------------------------
log "[2/7] Verificando entorno Node.js..."

NODE_MAJOR=0
if command -v node >/dev/null 2>&1; then
    NODE_VERSION="$(node -v | sed 's/^v//')"
    NODE_MAJOR="$(echo "$NODE_VERSION" | cut -d. -f1)"
fi

if [ "$NODE_MAJOR" -lt 20 ]; then
    warning "Instalando Node.js 22 LTS..."
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
    apt-get install -y nodejs
fi

export PATH="$PATH:/usr/bin:/usr/local/bin"
success "Node.js $(node -v) / npm $(npm -v)"

# ------------------------------------------------------------
# 3. Docker Engine y Compose
# ------------------------------------------------------------
log "[3/7] Verificando entorno Docker..."

if ! command -v docker >/dev/null 2>&1; then
    warning "Instalando Docker Engine y Compose..."
    apt-get update -y
    apt-get install -y docker.io docker-compose-plugin
fi

systemctl enable docker >/dev/null 2>&1 || true
systemctl start docker >/dev/null 2>&1 || true

if [ -n "${SUDO_USER:-}" ] && [ "$REAL_USER" != "root" ]; then
    usermod -aG docker "$REAL_USER" || true
fi

DOCKER_COMPOSE=""
if docker compose version >/dev/null 2>&1; then
    DOCKER_COMPOSE="docker compose"
elif command -v docker-compose >/dev/null 2>&1; then
    DOCKER_COMPOSE="docker-compose"
else
    error "No se encontró Docker Compose."
fi

success "Docker ($DOCKER_COMPOSE) listo."

# ------------------------------------------------------------
# 4. Configurar y Desplegar PostgreSQL en Docker (Sin conflictos)
# ------------------------------------------------------------
DB_CONTAINER="medicos_db"
DB_NAME="medicos_db"
DB_USER="medicos_app"
DB_PASSWORD="MedicosDB_2026_Secure"
DB_PORT="5432"

API_PORT="4000"
WEB_PORT="5173"

# Detener PostgreSQL local del host si estuviese activo
if systemctl is-active --quiet postgresql 2>/dev/null; then
    warning "Deteniendo servicio PostgreSQL en el host para liberar puerto ${DB_PORT}..."
    systemctl stop postgresql || true
fi

log "[4/7] Limpiando contenedores previos y levantando PostgreSQL..."

# Eliminar cualquier contenedor huérfano para evitar 'Conflict container name'
docker rm -f "$DB_CONTAINER" >/dev/null 2>&1 || true

cat > "$PROJECT_DIR/docker-compose.yml" <<EOF
services:
  postgres:
    image: postgres:16-alpine
    container_name: ${DB_CONTAINER}
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    ports:
      - "${DB_PORT}:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER} -d ${DB_NAME}"]
      interval: 2s
      timeout: 5s
      retries: 20

volumes:
  postgres_data:
EOF

$DOCKER_COMPOSE up -d

log "Esperando que PostgreSQL acepte conexiones..."
READY=0
for i in $(seq 1 30); do
    if docker exec "$DB_CONTAINER" pg_isready -U "$DB_USER" -d "$DB_NAME" >/dev/null 2>&1; then
        READY=1
        break
    fi
    printf "."
    sleep 1
done
echo

if [ "$READY" -ne 1 ]; then
    error "PostgreSQL no respondió a tiempo."
fi

success "PostgreSQL activo en el puerto ${DB_PORT}."

# ------------------------------------------------------------
# 5. Generar Variables de Entorno (.env) Estandarizadas
# ------------------------------------------------------------
log "[5/7] Configurando variables de entorno estándar..."

API_ENV="$PROJECT_DIR/apps/api/.env"
cat > "$API_ENV" <<EOF
PORT=${API_PORT}
NODE_ENV=development
DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@localhost:${DB_PORT}/${DB_NAME}?schema=public"
JWT_SECRET="medicos_jwt_secret_super_seguro_2026"
TURNSTILE_SECRET_KEY="1x0000000000000000000000000000000AA"
EOF

WEB_ENV="$PROJECT_DIR/apps/web/.env"
cat > "$WEB_ENV" <<EOF
VITE_API_URL="http://localhost:${API_PORT}"
EOF

chmod 644 "$API_ENV" "$WEB_ENV"
success "Archivos de entorno configurados con puerto ${API_PORT}."

# ------------------------------------------------------------
# 6. Dependencias de Node.js y Sincronización Total de Prisma
# ------------------------------------------------------------
log "[6/7] Instalando paquetes y sincronizando esquema de base de datos..."

if [ -n "${SUDO_USER:-}" ] && [ "$REAL_USER" != "root" ]; then
    chown -R "$REAL_USER:$REAL_USER" "$PROJECT_DIR"
fi

run_as_user npm install || error "Fallo al ejecutar npm install"

cd "$PROJECT_DIR/apps/api" || exit 1

# Generar cliente
run_as_user npx prisma generate || error "Fallo en prisma generate"

# Forzar sincronización de todas las columnas (evita error 500 por tablas desactualizadas)
run_as_user npx prisma db push --accept-data-loss || error "Fallo en prisma db push"

# Sembrar todos los datos iniciales
log "Sembrando base de datos con usuarios, roles y catálogo de establecimientos..."
run_as_user npx prisma db seed || warning "Advertencia en prisma seed, continuando..."

cd "$PROJECT_DIR" || exit 1

success "Base de datos y modelos de Prisma 100% sincronizados."

# ------------------------------------------------------------
# 7. Ajuste de Permisos y Arranque
# ------------------------------------------------------------
log "[7/7] Ajustando permisos de usuario..."

if [ -n "${SUDO_USER:-}" ] && [ "$REAL_USER" != "root" ]; then
    chown -R "$REAL_USER:$REAL_USER" "$PROJECT_DIR"
fi

echo
echo "============================================================"
echo "          TODO CONFIGURADO Y LISTO PARA PROGRAMAR"
echo "============================================================"
echo "Servicios locales:"
echo "  • Base de Datos : postgresql://${DB_USER}:****@localhost:${DB_PORT}/${DB_NAME}"
echo "  • API Backend   : http://localhost:${API_PORT}"
echo "  • Web Frontend  : http://localhost:${WEB_PORT}"
echo "============================================================"
echo "Iniciando MedicOS en modo desarrollo..."
echo "Presiona Ctrl + C para detener."
echo

run_as_user npm run dev