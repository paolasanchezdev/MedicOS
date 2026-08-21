#!/usr/bin/env bash

# ============================================================
# MedicOS - Instalador completo y automatizado (v2.4)
# ============================================================
# Compatible con Ubuntu 22.04 / 24.04 LTS y derivados Debian
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
# Verificar ejecutor y sudo
# ------------------------------------------------------------
if [ "$EUID" -ne 0 ]; then
    error "Este instalador requiere permisos de administrador.\nEjecuta: sudo bash ./install_all.sh"
fi

REAL_USER="${SUDO_USER:-$USER}"
REAL_HOME="$(eval echo "~$REAL_USER")"

if [ "$REAL_USER" = "root" ]; then
    warning "Advertencia: Estás ejecutando el instalador directamente como root."
fi

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
echo "                  MedicOS Installer v2.4"
echo "============================================================"
echo "Usuario objetivo: $REAL_USER"
echo "Directorio      : $PROJECT_DIR"
echo "============================================================"
echo

# ------------------------------------------------------------
# Verificar estructura del Monorepo
# ------------------------------------------------------------
[ -d "$PROJECT_DIR/apps/api" ] || error "No existe la carpeta apps/api."
[ -d "$PROJECT_DIR/apps/web" ] || error "No existe la carpeta apps/web."
[ -f "$PROJECT_DIR/package.json" ] || error "No existe package.json en la raíz."

success "Estructura del proyecto MedicOS validada."

# ------------------------------------------------------------
# 1. Dependencias del sistema
# ------------------------------------------------------------
log "[1/8] Instalando paquetes base del sistema..."

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

success "Dependencias básicas instaladas."

# ------------------------------------------------------------
# 2. Node.js (v20 o v22 LTS)
# ------------------------------------------------------------
log "[2/8] Verificando entorno Node.js..."

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
# 3. Docker Engine y Plugin de Compose
# ------------------------------------------------------------
log "[3/8] Verificando entorno Docker..."

if ! command -v docker >/dev/null 2>&1; then
    warning "Docker no detectado. Instalando Docker y Compose plugin..."
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

success "Docker ($DOCKER_COMPOSE) configurado correctamente."

# ------------------------------------------------------------
# 4. Configurar PostgreSQL en Docker
# ------------------------------------------------------------
DB_CONTAINER="medicos_db"
DB_NAME="medicos_db"
DB_USER="medicos_app"
DB_PASSWORD="MedicosDB_2026_Secure"
DB_PORT="5432"

API_PORT="4000"
WEB_PORT="5173"

if systemctl is-active --quiet postgresql 2>/dev/null; then
    warning "Deteniendo servicio local de PostgreSQL en el host para evitar conflictos en el puerto ${DB_PORT}..."
    systemctl stop postgresql || true
fi

log "[4/8] Generando docker-compose.yml y levantando contenedor de base de datos..."

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
      interval: 3s
      timeout: 5s
      retries: 20

volumes:
  postgres_data:
EOF

$DOCKER_COMPOSE down -v --remove-orphans >/dev/null 2>&1 || true
$DOCKER_COMPOSE up -d

log "Esperando conexión a PostgreSQL..."
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
    error "La base de datos PostgreSQL no respondió a tiempo."
fi

success "PostgreSQL activo en el puerto ${DB_PORT}."

# ------------------------------------------------------------
# 5. Generar archivos de entorno (.env)
# ------------------------------------------------------------
log "[5/8] Configurando variables de entorno (.env)..."

API_ENV="$PROJECT_DIR/apps/api/.env"
cat > "$API_ENV" <<EOF
PORT=${API_PORT}
NODE_ENV=development
DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@localhost:${DB_PORT}/${DB_NAME}?schema=public"
JWT_SECRET="medicos_jwt_secret_super_seguro_2026"
EOF

WEB_ENV="$PROJECT_DIR/apps/web/.env"
cat > "$WEB_ENV" <<EOF
VITE_API_URL="http://localhost:${API_PORT}"
EOF

chmod 644 "$API_ENV" "$WEB_ENV"
success "Archivos apps/api/.env y apps/web/.env configurados."

# ------------------------------------------------------------
# 6. Instalación de dependencias
# ------------------------------------------------------------
log "[6/8] Instalando dependencias de npm en el monorepo..."

if [ -n "${SUDO_USER:-}" ] && [ "$REAL_USER" != "root" ]; then
    chown -R "$REAL_USER:$REAL_USER" "$PROJECT_DIR"
fi

run_as_user npm install || error "Fallo al ejecutar npm install"
success "Dependencias instaladas."

# ------------------------------------------------------------
# 7. Prisma ORM: Generar cliente, migraciones y seeders
# ------------------------------------------------------------
log "[7/8] Sincronizando esquema y sembrando base de datos con Prisma..."

cd "$PROJECT_DIR/apps/api" || exit 1

run_as_user npx prisma generate || error "Fallo en npx prisma generate"
run_as_user npx prisma db push || error "Fallo en npx prisma db push"
run_as_user npx prisma db seed || warning "No se pudo ejecutar db seed automáticamente, puedes ejecutarlo manualmente luego."

cd "$PROJECT_DIR" || exit 1
success "Base de datos local sincronizada."

# ------------------------------------------------------------
# 8. Ajuste de permisos finales
# ------------------------------------------------------------
if [ -n "${SUDO_USER:-}" ] && [ "$REAL_USER" != "root" ]; then
    chown -R "$REAL_USER:$REAL_USER" "$PROJECT_DIR"
fi

echo
echo "============================================================"
echo "          INSTALACIÓN COMPLETADA EXITOSAMENTE"
echo "============================================================"
echo "Servicios locales listos:"
echo "  • Base de Datos : postgresql://${DB_USER}:****@localhost:${DB_PORT}/${DB_NAME}"
echo "  • API Backend   : http://localhost:${API_PORT}"
echo "  • Web Frontend  : http://localhost:${WEB_PORT}"
echo "============================================================"
echo "Iniciando MedicOS en modo desarrollo..."
echo "Presiona Ctrl + C para detener."
echo

run_as_user npm run dev