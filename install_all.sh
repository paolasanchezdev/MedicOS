```bash
#!/usr/bin/env bash

set -Eeuo pipefail

# ============================================================
# MedicOS - Instalador completo
# ============================================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REAL_USER="${SUDO_USER:-$USER}"

# ------------------------------------------------------------
# Funciones
# ------------------------------------------------------------

success() {
    echo -e "${GREEN}✔ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

error() {
    echo -e "${RED}✖ $1${NC}"
}

info() {
    echo -e "${CYAN}➜ $1${NC}"
}

fail() {
    error "$1"
    exit 1
}

# ------------------------------------------------------------
# Verificar sudo
# ------------------------------------------------------------

if [[ "$EUID" -ne 0 ]]; then
    error "Este instalador debe ejecutarse como administrador."
    echo
    echo "Ejecuta:"
    echo
    echo "    sudo ./install_all.sh"
    echo
    exit 1
fi

cd "$PROJECT_DIR"

echo
echo "============================================================"
echo -e "${CYAN}        MedicOS - Instalador v1.0${NC}"
echo "============================================================"
echo

# ------------------------------------------------------------
# 1. Verificar estructura
# ------------------------------------------------------------

echo -e "${YELLOW}[1/9] Verificando proyecto...${NC}"

REQUIRED_FILES=(
    "package.json"
    "package-lock.json"
    "turbo.json"
    "docker-compose.yml"
    "apps/api/package.json"
    "apps/api/prisma/schema.prisma"
    "apps/api/prisma.config.ts"
    "apps/api/src/scripts/create-admin.ts"
    "apps/web/package.json"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [[ ! -f "$PROJECT_DIR/$file" ]]; then
        fail "No se encontró el archivo: $file"
    fi
done

success "Estructura de MedicOS detectada."

# ------------------------------------------------------------
# 2. Dependencias del sistema
# ------------------------------------------------------------

echo
echo -e "${YELLOW}[2/9] Instalando dependencias del sistema...${NC}"

apt-get update -y

apt-get install -y \
    curl \
    git \
    ca-certificates \
    gnupg \
    lsb-release \
    build-essential \
    lsof \
    openssl

success "Dependencias del sistema instaladas."

# ------------------------------------------------------------
# 3. Node.js
# ------------------------------------------------------------

echo
echo -e "${YELLOW}[3/9] Verificando Node.js...${NC}"

NODE_MAJOR=""

if command -v node >/dev/null 2>&1; then
    NODE_MAJOR="$(node -v | sed 's/^v//' | cut -d'.' -f1)"
fi

if [[ "$NODE_MAJOR" != "20" ]]; then

    info "Instalando Node.js 20 LTS..."

    mkdir -p /etc/apt/keyrings

    curl -fsSL \
        https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key \
        | gpg --dearmor --yes \
        -o /etc/apt/keyrings/nodesource.gpg

    echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" \
        > /etc/apt/sources.list.d/nodesource.list

    apt-get update -y
    apt-get install -y nodejs
fi

success "Node.js $(node -v) detectado."
success "npm $(npm -v) detectado."

# ------------------------------------------------------------
# 4. Docker
# ------------------------------------------------------------

echo
echo -e "${YELLOW}[4/9] Verificando Docker...${NC}"

if ! command -v docker >/dev/null 2>&1; then
    info "Docker no está instalado. Instalándolo..."

    curl -fsSL https://get.docker.com | sh
fi

systemctl enable docker
systemctl start docker

if ! docker compose version >/dev/null 2>&1; then
    fail "Docker Compose no está disponible."
fi

success "Docker instalado."
success "Docker Compose disponible."

usermod -aG docker "$REAL_USER" || true

# ------------------------------------------------------------
# 5. Variables de entorno
# ------------------------------------------------------------

echo
echo -e "${YELLOW}[5/9] Configurando variables de entorno...${NC}"

API_ENV="$PROJECT_DIR/apps/api/.env"

if [[ ! -f "$API_ENV" ]]; then

    if [[ -f "$PROJECT_DIR/apps/api/.env.example" ]]; then
        cp "$PROJECT_DIR/apps/api/.env.example" "$API_ENV"
        info "apps/api/.env creado desde .env.example."
    else
        info "Creando apps/api/.env..."

        cat > "$API_ENV" <<'EOF'
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/medicos_db?schema=public"
JWT_SECRET="medicos-local-secret-change-this"
PORT=3000
NODE_ENV="development"
EOF
    fi

else
    success "apps/api/.env ya existe."
fi

# Asegurar DATABASE_URL si el archivo está vacío o no contiene la variable
if ! grep -q '^DATABASE_URL=' "$API_ENV"; then
    echo 'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/medicos_db?schema=public"' >> "$API_ENV"
fi

# ------------------------------------------------------------
# 6. Dependencias Node
# ------------------------------------------------------------

echo
echo -e "${YELLOW}[6/9] Instalando dependencias de MedicOS...${NC}"

chown -R "$REAL_USER:$REAL_USER" "$PROJECT_DIR"

cd "$PROJECT_DIR"

if [[ -f "package-lock.json" ]]; then
    sudo -u "$REAL_USER" npm ci
else
    sudo -u "$REAL_USER" npm install
fi

success "Dependencias instaladas."

# ------------------------------------------------------------
# 7. PostgreSQL
# ------------------------------------------------------------

echo
echo -e "${YELLOW}[7/9] Levantando PostgreSQL...${NC}"

docker compose up -d db

success "Contenedor PostgreSQL iniciado."

echo
info "Esperando a PostgreSQL..."

MAX_RETRIES=30
RETRY=0

until docker compose exec -T db \
    pg_isready \
    -U postgres \
    -d medicos_db \
    >/dev/null 2>&1
do

    RETRY=$((RETRY + 1))

    if [[ "$RETRY" -ge "$MAX_RETRIES" ]]; then
        echo
        docker compose logs db
        fail "PostgreSQL no respondió correctamente."
    fi

    echo -n "."
    sleep 1
done

echo
success "PostgreSQL está listo."

# ------------------------------------------------------------
# 8. Prisma + base de datos
# ------------------------------------------------------------

echo
echo -e "${YELLOW}[8/9] Preparando base de datos...${NC}"

cd "$PROJECT_DIR/apps/api"

sudo -u "$REAL_USER" npx prisma generate

success "Prisma Client generado."

sudo -u "$REAL_USER" npx prisma migrate deploy

success "Migraciones aplicadas."

cd "$PROJECT_DIR"

# ------------------------------------------------------------
# Backup opcional
# ------------------------------------------------------------

if [[ -f "$PROJECT_DIR/medicos_backup.sql" ]]; then

    echo
    echo "============================================================"
    echo -e "${CYAN}Se encontró medicos_backup.sql${NC}"
    echo "============================================================"
    echo
    echo "El respaldo es OPCIONAL."
    echo

    read -r -p "¿Deseas importar los datos del respaldo? [s/N]: " IMPORT_BACKUP

    if [[ "$IMPORT_BACKUP" =~ ^[sS]$ ]]; then

        info "Importando respaldo..."

        docker compose exec -T db \
            psql \
            -U postgres \
            -d medicos_db \
            < "$PROJECT_DIR/medicos_backup.sql" \
            || warning "El respaldo terminó con algunos mensajes de PostgreSQL."

        success "Proceso de respaldo finalizado."

    else
        info "Respaldo omitido. Se utilizará una base de datos limpia."
    fi

else
    info "No se encontró respaldo. Se utilizará una base de datos limpia."
fi

# ------------------------------------------------------------
# Crear administrador
# ------------------------------------------------------------

echo
echo "============================================================"
echo -e "${CYAN}        CONFIGURACIÓN DEL ADMINISTRADOR${NC}"
echo "============================================================"
echo
echo "Ingresa las credenciales que utilizarás para entrar a MedicOS."
echo

while true; do

    read -r -p "Nombre completo: " ADMIN_NAME

    if [[ -z "$ADMIN_NAME" ]]; then
        warning "El nombre no puede estar vacío."
        continue
    fi

    if [[ ${#ADMIN_NAME} -lt 3 ]]; then
        warning "El nombre debe tener al menos 3 caracteres."
        continue
    fi

    break
done

while true; do

    read -r -s -p "Contraseña: " ADMIN_PASSWORD
    echo

    if [[ -z "$ADMIN_PASSWORD" ]]; then
        warning "La contraseña no puede estar vacía."
        continue
    fi

    if [[ ${#ADMIN_PASSWORD} -lt 8 ]]; then
        warning "La contraseña debe tener al menos 8 caracteres."
        continue
    fi

    read -r -s -p "Confirmar contraseña: " ADMIN_PASSWORD_CONFIRM
    echo

    if [[ "$ADMIN_PASSWORD" != "$ADMIN_PASSWORD_CONFIRM" ]]; then
        warning "Las contraseñas no coinciden."
        continue
    fi

    break
done

info "Creando administrador..."

cd "$PROJECT_DIR/apps/api"

sudo -u "$REAL_USER" \
    env \
    MEDICOS_BOOTSTRAP_NAME="$ADMIN_NAME" \
    MEDICOS_BOOTSTRAP_PASSWORD="$ADMIN_PASSWORD" \
    npx tsx src/scripts/create-admin.ts

success "Administrador creado correctamente."

cd "$PROJECT_DIR"

# ------------------------------------------------------------
# Permisos finales
# ------------------------------------------------------------

chown "$REAL_USER:$REAL_USER" "$API_ENV"

# ------------------------------------------------------------
# Final
# ------------------------------------------------------------

echo
echo "============================================================"
echo -e "${GREEN}        🎉 MEDICOS ESTÁ INSTALADO${NC}"
echo "============================================================"
echo
echo -e "${GREEN}Base de datos:${NC} PostgreSQL"
echo -e "${GREEN}Contenedor:${NC}    medicos_db"
echo -e "${GREEN}Administrador:${NC} $ADMIN_NAME"
echo
echo "Para iniciar MedicOS:"
echo
echo "    ./run.sh"
echo
echo "O:"
echo
echo "    npm run medicos"
echo
echo "============================================================"
echo
echo -e "${YELLOW}Nota:${NC} si acabas de agregar tu usuario al grupo docker,"
echo "puede ser necesario cerrar sesión y volver a entrar."
echo
```
