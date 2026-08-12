#!/usr/bin/env bash

# ============================================================
# MedicOS - Instalador completo y automatizado
# ============================================================
# Compatible con Ubuntu 22.04 / 24.04 LTS (Sistemas limpios)
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

# ------------------------------------------------------------
# Funciones
# ------------------------------------------------------------

log() {
    echo -e "${CYAN}$1${NC}"
}

success() {
    echo -e "${GREEN}✔ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

error() {
    echo -e "${RED}✖ $1${NC}"
    exit 1
}

# ------------------------------------------------------------
# Verificar ejecutor y sudo
# ------------------------------------------------------------

if [ "$EUID" -ne 0 ]; then
    error "Este instalador requiere permisos de administrador.\nEjecuta: sudo bash ./install_all.sh"
fi

# Detectar usuario real tras el sudo
REAL_USER="${SUDO_USER:-$USER}"

if [ "$REAL_USER" = "root" ]; then
    warning "Advertencia: Estás ejecutando esto directamente como el usuario root."
fi

# ------------------------------------------------------------
# Directorio raíz del proyecto
# ------------------------------------------------------------

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR" || exit 1

echo
echo "============================================================"
echo "                  MedicOS Installer v2.2"
echo "============================================================"
echo "Usuario objetivo: $REAL_USER"
echo "Directorio      : $PROJECT_DIR"
echo "============================================================"
echo

# ------------------------------------------------------------
# Verificar estructura
# ------------------------------------------------------------

[ -d "$PROJECT_DIR/apps/api" ] || error "No existe la carpeta apps/api."
[ -d "$PROJECT_DIR/apps/web" ] || error "No existe la carpeta apps/web."
[ -f "$PROJECT_DIR/package.json" ] || error "No existe package.json en la raíz."

success "Estructura de MedicOS validada."

# ------------------------------------------------------------
# 1. Dependencias del sistema
# ------------------------------------------------------------

log "[1/9] Instalando paquetes base del sistema..."

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
# 2. Node.js 22
# ------------------------------------------------------------

log "[2/9] Verificando entorno Node.js..."

NODE_MAJOR=0

if command -v node >/dev/null 2>&1; then
    NODE_VERSION="$(node -v | sed 's/^v//')"
    NODE_MAJOR="$(echo "$NODE_VERSION" | cut -d. -f1)"
fi

if [ "$NODE_MAJOR" -lt 22 ]; then
    warning "Instalando Node.js 22 LTS..."
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
    apt-get install -y nodejs
fi

success "Node.js $(node -v) / npm $(npm -v)"

# ------------------------------------------------------------
# 3. Docker Engine
# ------------------------------------------------------------

log "[3/9] Verificando Docker..."

if ! command -v docker >/dev/null 2>&1; then
    warning "Docker no detectado. Instalando Motor de Docker y Compose..."
    apt-get update -y
    apt-get install -y docker.io docker-compose-plugin
fi

systemctl enable docker >/dev/null 2>&1 || true
systemctl start docker >/dev/null 2>&1 || true

# Asignar usuario real al grupo docker si aplica
if [ -n "${SUDO_USER:-}" ]; then
    usermod -aG docker "$REAL_USER" || true
fi

if ! docker info >/dev/null 2>&1; then
    error "El demonio de Docker no está respondiendo."
fi

success "Docker configurado correctamente."

# ------------------------------------------------------------
# Definición de variables de entorno del proyecto
# ------------------------------------------------------------

DB_CONTAINER="medicos_db"
DB_NAME="medicos_db"
DB_USER="medicos_app"
DB_PASSWORD="MedicosDB_2026_Secure"
DB_PORT="5432"

API_PORT="3000"
WEB_PORT="5173"

# ------------------------------------------------------------
# 4. Crear docker-compose.yml
# ------------------------------------------------------------

log "[4/9] Generando archivo docker-compose.yml..."

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

success "docker-compose.yml preparado."

# ------------------------------------------------------------
# 5. Generar .env de API y WEB
# ------------------------------------------------------------

log "[5/9] Generando archivos de entorno (.env)..."

# Mantener JWT_SECRET previa si existe, o generar una nueva
JWT_SECRET=""
if [ -f "$PROJECT_DIR/apps/api/.env" ]; then
    JWT_SECRET="$(grep '^JWT_SECRET=' "$PROJECT_DIR/apps/api/.env" | cut -d'=' -f2-)"
fi
if [ -z "$JWT_SECRET" ]; then
    JWT_SECRET="$(openssl rand -hex 64)"
fi

# API .env
API_ENV="$PROJECT_DIR/apps/api/.env"
cat > "$API_ENV" <<EOF
PORT=${API_PORT}
DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@localhost:${DB_PORT}/${DB_NAME}?schema=public"
JWT_SECRET=${JWT_SECRET}
TURNSTILE_SECRET_KEY=0x4AAAAAAD8UiHj9T22_Ygg0IC7wlQayK8Y
EOF

# WEB .env
WEB_ENV="$PROJECT_DIR/apps/web/.env"
cat > "$WEB_ENV" <<EOF
VITE_API_URL=http://localhost:${API_PORT}
EOF

chmod 644 "$API_ENV" "$WEB_ENV"

success "Variables configuradas en apps/api/.env y apps/web/.env"

# ------------------------------------------------------------
# 6. Desplegar e Inicializar PostgreSQL
# ------------------------------------------------------------

log "[6/9] Desplegando PostgreSQL en Docker..."

docker compose down -v --remove-orphans >/dev/null 2>&1 || true
docker compose up -d

log "Esperando inicio del motor de base de datos..."

READY=0
for i in $(seq 1 40); do
    if docker exec "$DB_CONTAINER" pg_isready -U "$DB_USER" -d "$DB_NAME" >/dev/null 2>&1; then
        READY=1
        break
    fi
    printf "."
    sleep 1
done
echo

if [ "$READY" -ne 1 ]; then
    docker compose ps
    docker logs "$DB_CONTAINER" --tail 30
    error "La base de datos no estuvo lista a tiempo."
fi

success "PostgreSQL listo en puerto ${DB_PORT}."

# ------------------------------------------------------------
# Ajuste de Permisos antes de usar Node/npm
# ------------------------------------------------------------

if [ -n "${SUDO_USER:-}" ]; then
    chown -R "$REAL_USER:$REAL_USER" "$PROJECT_DIR"
fi

run_as_user() {
    if [ -n "${SUDO_USER:-}" ]; then
        sudo -u "$REAL_USER" "$@"
    else
        "$@"
    fi
}

# ------------------------------------------------------------
# 7. Instalación de dependencias npm
# ------------------------------------------------------------

log "[7/9] Instalando paquetes de Node.js..."

run_as_user npm install

success "Dependencias de Node.js instaladas."

# ------------------------------------------------------------
# 8. Generación, Esquema y Poblamiento de Base de Datos
# ------------------------------------------------------------

log "[8/9] Ejecutando Prisma (Generate, DB Push y Seed)..."

cd "$PROJECT_DIR/apps/api" || exit 1

run_as_user npx prisma generate || error "Fallo en npx prisma generate"
run_as_user npx prisma db push || error "Fallo en npx prisma db push"

if [ -f "$PROJECT_DIR/dump.sql" ]; then
    log "Restaurando datos iniciales desde dump.sql..."
    docker exec -i "$DB_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" < "$PROJECT_DIR/dump.sql" >/dev/null 2>&1 || warning "Aviso al procesar dump.sql, continuando..."
    success "Respaldo dump.sql restaurado exitosamente."
else
    log "Ejecutando sembrado de datos iniciales con Prisma Seed..."
    run_as_user npx prisma db seed || error "Fallo en npx prisma db seed"
    success "Sembrado de datos iniciales completado."
fi

cd "$PROJECT_DIR" || exit 1

success "Esquema y datos iniciales sincronizados con éxito."

# ------------------------------------------------------------
# 9. Finalización y Lanzamiento
# ------------------------------------------------------------

# Corregir propiedad final de todos los archivos generados
if [ -n "${SUDO_USER:-}" ]; then
    chown -R "$REAL_USER:$REAL_USER" "$PROJECT_DIR"
fi

echo
echo "============================================================"
echo "          INSTALACIÓN COMPLETADA EXITOSAMENTE"
echo "============================================================"
echo "Servicios configurados:"
echo "  • Base de Datos : postgresql://${DB_USER}:****@localhost:${DB_PORT}/${DB_NAME}"
echo "  • API Backend   : http://localhost:${API_PORT}"
echo "  • Web Frontend  : http://localhost:${WEB_PORT}"
echo "============================================================"
echo "Iniciando MedicOS en modo desarrollo..."
echo "Presiona Ctrl + C para detener la aplicación."
echo

# Iniciar servidor como el usuario estándar para no bloquear permisos futuros
run_as_user npm run dev