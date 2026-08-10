
#!/usr/bin/env bash

# ============================================================
# MedicOS - Instalador completo
# ============================================================
# Compatible con Ubuntu 24.04+
#
# Hace:
#   1. Dependencias básicas
#   2. Node.js 22
#   3. Docker
#   4. PostgreSQL mediante Docker
#   5. Usuario y BD PostgreSQL
#   6. apps/api/.env
#   7. npm install
#   8. Prisma generate + db push
#   9. Levanta MedicOS
#
# NO crea usuarios administrativos de MedicOS.
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
# Verificar Bash
# ------------------------------------------------------------

if [ -z "${BASH_VERSION:-}" ]; then
    echo "Este instalador debe ejecutarse con Bash."
    echo "Ejecuta:"
    echo "  chmod +x install_all.sh"
    echo "  sudo bash ./install_all.sh"
    exit 1
fi

# ------------------------------------------------------------
# Directorio raíz del proyecto
# ------------------------------------------------------------

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cd "$PROJECT_DIR" || exit 1

echo
echo "============================================================"
echo "                 MedicOS Installer v2.0"
echo "============================================================"
echo
echo "Directorio del proyecto:"
echo "$PROJECT_DIR"
echo

# ------------------------------------------------------------
# Verificar estructura
# ------------------------------------------------------------

[ -d "$PROJECT_DIR/apps/api" ] || error "No existe apps/api."
[ -d "$PROJECT_DIR/apps/web" ] || error "No existe apps/web."
[ -f "$PROJECT_DIR/package.json" ] || error "No existe package.json en la raíz."

success "Estructura de MedicOS detectada."

# ------------------------------------------------------------
# 1. Dependencias básicas
# ------------------------------------------------------------

log "[1/9] Instalando dependencias básicas..."

apt-get update

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

success "Dependencias básicas listas."

# ------------------------------------------------------------
# 2. Node.js 22
# ------------------------------------------------------------

log "[2/9] Verificando Node.js..."

NODE_MAJOR=0

if command -v node >/dev/null 2>&1; then
    NODE_VERSION="$(node -v | sed 's/^v//')"
    NODE_MAJOR="$(echo "$NODE_VERSION" | cut -d. -f1)"
else
    NODE_VERSION="0"
fi

if [ "$NODE_MAJOR" -lt 22 ]; then

    warning "Node.js 22 o superior es requerido. Instalando Node.js 22..."

    curl -fsSL https://deb.nodesource.com/setup_22.x | bash -

    apt-get install -y nodejs

fi

NODE_VERSION="$(node -v)"
NPM_VERSION="$(npm -v)"

success "Node.js $NODE_VERSION"
success "npm $NPM_VERSION"

# ------------------------------------------------------------
# 3. Docker
# ------------------------------------------------------------

log "[3/9] Verificando Docker..."

if ! command -v docker >/dev/null 2>&1; then

    warning "Docker no está instalado. Instalando..."

    apt-get update

    apt-get install -y \
        docker.io \
        docker-compose-plugin

else
    success "Docker ya está instalado."
fi

systemctl enable docker >/dev/null 2>&1 || true
systemctl start docker >/dev/null 2>&1 || true

if ! docker info >/dev/null 2>&1; then
    error "Docker no está funcionando correctamente."
fi

success "Docker disponible."

# ------------------------------------------------------------
# Variables PostgreSQL
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

log "[4/9] Configurando PostgreSQL..."

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
      test:
        [
          "CMD-SHELL",
          "pg_isready -U ${DB_USER} -d ${DB_NAME}"
        ]
      interval: 5s
      timeout: 5s
      retries: 20

volumes:
  postgres_data:
EOF

success "docker-compose.yml configurado."

# ------------------------------------------------------------
# 5. Crear apps/api/.env
# ------------------------------------------------------------

log "[5/9] Configurando variables de entorno..."

JWT_SECRET="$(openssl rand -hex 64)"

API_ENV="$PROJECT_DIR/apps/api/.env"

cat > "$API_ENV" <<EOF
PORT=${API_PORT}

DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@localhost:${DB_PORT}/${DB_NAME}?schema=public"

JWT_SECRET=${JWT_SECRET}

TURNSTILE_SECRET_KEY=0x4AAAAAAD8UiHj9T22_Ygg0IC7wlQayK8Y
EOF

chmod 600 "$API_ENV"

success "apps/api/.env creado automáticamente."

echo
echo "Configuración:"
echo "  Usuario DB : ${DB_USER}"
echo "  Base datos : ${DB_NAME}"
echo "  Puerto DB  : ${DB_PORT}"
echo "  Puerto API : ${API_PORT}"
echo "  Puerto Web : ${WEB_PORT}"
echo

# ------------------------------------------------------------
# 6. PostgreSQL
# ------------------------------------------------------------

log "[6/9] Preparando PostgreSQL..."

# Detener instalación anterior.
docker compose down --remove-orphans >/dev/null 2>&1 || true

# Eliminar volumen anterior SOLO para garantizar una instalación
# limpia y que las credenciales definidas arriba sean aplicadas.
docker compose down -v --remove-orphans >/dev/null 2>&1 || true

success "Instalación PostgreSQL anterior limpiada."

echo
echo "Iniciando PostgreSQL..."

docker compose up -d

if [ $? -ne 0 ]; then
    error "No se pudo iniciar PostgreSQL."
fi

echo
echo "Esperando a PostgreSQL..."

READY=0

for i in $(seq 1 60); do

    if docker exec "$DB_CONTAINER" \
        pg_isready \
        -U "$DB_USER" \
        -d "$DB_NAME" >/dev/null 2>&1; then

        READY=1
        break
    fi

    printf "."
    sleep 1

done

echo

if [ "$READY" -ne 1 ]; then

    echo
    echo "Estado del contenedor:"
    docker compose ps

    echo
    echo "Últimos logs:"
    docker logs "$DB_CONTAINER" --tail 50

    error "PostgreSQL no estuvo disponible."
fi

success "PostgreSQL funcionando."

# ------------------------------------------------------------
# Verificar autenticación real
# ------------------------------------------------------------

echo
echo "Verificando credenciales PostgreSQL..."

PGPASSWORD="$DB_PASSWORD" \
psql \
    -h 127.0.0.1 \
    -p "$DB_PORT" \
    -U "$DB_USER" \
    -d "$DB_NAME" \
    -c "SELECT 1;" >/dev/null 2>&1

if [ $? -ne 0 ]; then

    echo
    docker compose ps

    echo
    docker logs "$DB_CONTAINER" --tail 50

    error "Las credenciales PostgreSQL no coinciden."
fi

success "Credenciales PostgreSQL correctas."

# ------------------------------------------------------------
# 7. Dependencias Node
# ------------------------------------------------------------

log "[7/9] Instalando dependencias del proyecto..."

cd "$PROJECT_DIR" || exit 1

if [ -f package-lock.json ]; then
    npm ci
else
    npm install
fi

if [ $? -ne 0 ]; then
    error "npm no pudo instalar las dependencias."
fi

success "Dependencias instaladas."

# ------------------------------------------------------------
# 8. Prisma
# ------------------------------------------------------------

log "[8/9] Configurando Prisma..."

cd "$PROJECT_DIR/apps/api" || exit 1

npx prisma generate

if [ $? -ne 0 ]; then
    error "Prisma generate falló."
fi

success "Prisma Client generado."

npx prisma db push

if [ $? -ne 0 ]; then
    error "Prisma db push falló."
fi

success "Base de datos sincronizada con Prisma."

# ------------------------------------------------------------
# 9. Finalizar
# ------------------------------------------------------------

log "[9/9] MedicOS listo."

cd "$PROJECT_DIR" || exit 1

echo
echo "============================================================"
echo "                 INSTALACIÓN COMPLETADA"
echo "============================================================"
echo
echo "PostgreSQL:"
echo "  Host     : localhost"
echo "  Puerto   : ${DB_PORT}"
echo "  Usuario  : ${DB_USER}"
echo "  Base     : ${DB_NAME}"
echo
echo "API:"
echo "  Puerto   : ${API_PORT}"
echo
echo "Web:"
echo "  Puerto   : ${WEB_PORT}"
echo
echo "Archivo generado:"
echo "  apps/api/.env"
echo
echo "No se creó ningún administrador de MedicOS."
echo
echo "============================================================"
echo

# ------------------------------------------------------------
# Iniciar MedicOS
# ------------------------------------------------------------

echo "Iniciando MedicOS..."
echo
echo "Cuando Vite/Node muestre las URLs, abre la correspondiente."
echo
echo "Para detener MedicOS:"
echo "  Ctrl + C"
echo

npm run dev
