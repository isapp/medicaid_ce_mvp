#!/bin/bash
set -e

echo "🚀 Medicaid CE MVP - One-Click Installation"
echo "============================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# =============================================================================
# Detect where script is being run from
# =============================================================================
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCRIPT_NAME="$(basename "${BASH_SOURCE[0]}")"

# Check if we're in the fixes directory or the repo
if [ -f "docker-compose.yml" ]; then
    echo -e "${GREEN}✅ Running from repository root${NC}"
    REPO_ROOT="$(pwd)"
elif [ -f "../medicaid_ce_mvp/docker-compose.yml" ]; then
    echo -e "${YELLOW}📦 Detected fixes directory, switching to repository...${NC}"
    REPO_ROOT="$(cd ../medicaid_ce_mvp && pwd)"
    cd "$REPO_ROOT"
    echo -e "${GREEN}✅ Changed to: $REPO_ROOT${NC}"
elif [ -f "../../medicaid_ce_mvp/docker-compose.yml" ]; then
    echo -e "${YELLOW}📦 Detected fixes directory, switching to repository...${NC}"
    REPO_ROOT="$(cd ../../medicaid_ce_mvp && pwd)"
    cd "$REPO_ROOT"
    echo -e "${GREEN}✅ Changed to: $REPO_ROOT${NC}"
else
    echo -e "${RED}❌ Cannot find medicaid_ce_mvp repository${NC}"
    echo -e "${YELLOW}Please run this script from:${NC}"
    echo "  1. Inside the cloned repository: cd medicaid_ce_mvp && /path/to/this/script"
    echo "  2. From the fixes directory (script will auto-switch)"
    echo ""
    echo -e "${BLUE}To get started:${NC}"
    echo "  git clone https://github.com/isapp/medicaid_ce_mvp.git"
    echo "  cd medicaid_ce_mvp"
    echo "  $SCRIPT_DIR/$SCRIPT_NAME"
    exit 1
fi

echo ""

# =============================================================================
# STEP 0: Check Dependencies
# =============================================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}          STEP 0: Checking Dependencies                       ${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Check Docker
echo -e "${YELLOW}Checking Docker...${NC}"
if ! command -v docker >/dev/null 2>&1; then
    echo -e "${RED}❌ Docker is required but not installed${NC}"
    echo -e "${YELLOW}Install from: https://www.docker.com/products/docker-desktop${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Docker found${NC}"

# Check Docker is running
echo -e "${YELLOW}Checking Docker daemon...${NC}"
if ! docker info >/dev/null 2>&1; then
    echo -e "${RED}❌ Docker daemon is not running${NC}"
    echo -e "${YELLOW}Please start Docker Desktop and wait for it to be ready${NC}"
    echo -e "${YELLOW}Look for the whale icon in your menu bar/system tray${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Docker daemon is running${NC}"

# Determine Docker Compose command
echo -e "${YELLOW}Detecting Docker Compose...${NC}"
COMPOSE_CMD=""
if command -v docker-compose >/dev/null 2>&1; then
    COMPOSE_CMD="docker-compose"
    COMPOSE_VERSION=$(docker-compose --version 2>/dev/null | cut -d' ' -f4 | cut -d',' -f1)
    echo -e "${GREEN}✅ Using docker-compose (version ${COMPOSE_VERSION})${NC}"
elif docker compose version >/dev/null 2>&1; then
    COMPOSE_CMD="docker compose"
    COMPOSE_VERSION=$(docker compose version 2>/dev/null | cut -d' ' -f4)
    echo -e "${GREEN}✅ Using docker compose v2 (version ${COMPOSE_VERSION})${NC}"
else
    echo -e "${RED}❌ Docker Compose not found${NC}"
    echo -e "${YELLOW}Install Docker Desktop which includes Docker Compose${NC}"
    exit 1
fi

# Check Node.js
echo -e "${YELLOW}Checking Node.js...${NC}"
if ! command -v node >/dev/null 2>&1; then
    echo -e "${RED}❌ Node.js is required but not installed${NC}"
    echo -e "${YELLOW}Install from: https://nodejs.org/${NC}"
    exit 1
fi
NODE_VERSION=$(node --version)
NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
echo -e "${GREEN}✅ Node.js ${NODE_VERSION}${NC}"
if [ "$NODE_MAJOR" -lt 20 ]; then
    echo -e "${YELLOW}⚠️  Node.js 20+ recommended (you have v${NODE_MAJOR})${NC}"
fi

# Check npm
echo -e "${YELLOW}Checking npm...${NC}"
if ! command -v npm >/dev/null 2>&1; then
    echo -e "${RED}❌ npm is required but not installed${NC}"
    exit 1
fi
NPM_VERSION=$(npm --version)
echo -e "${GREEN}✅ npm ${NPM_VERSION}${NC}"

# Check for required tools
echo -e "${YELLOW}Checking required tools...${NC}"
if ! command -v openssl >/dev/null 2>&1; then
    echo -e "${RED}❌ openssl is required but not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ openssl found${NC}"

echo -e "${GREEN}✅ All dependencies satisfied!${NC}"

# =============================================================================
# STEP 1: Update Prisma Schema
# =============================================================================
echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}          STEP 1: Updating Prisma Schema                     ${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if [ -f "backend/prisma/schema.prisma" ]; then
    # Update to PostgreSQL
    if grep -q 'provider = "postgresql"' backend/prisma/schema.prisma; then
        echo -e "${GREEN}✅ Schema already uses PostgreSQL${NC}"
    else
        echo -e "${YELLOW}Updating schema to PostgreSQL...${NC}"
        if [[ "$OSTYPE" == "darwin"* ]]; then
            sed -i '.bak' 's/provider = "sqlite"/provider = "postgresql"/' backend/prisma/schema.prisma
        else
            sed -i.bak 's/provider = "sqlite"/provider = "postgresql"/' backend/prisma/schema.prisma
        fi
        echo -e "${GREEN}✅ Schema updated to PostgreSQL${NC}"
    fi

    # Add binary targets for OpenSSL 3.0.x
    if grep -q "binaryTargets" backend/prisma/schema.prisma; then
        echo -e "${GREEN}✅ Binary targets already configured${NC}"
    else
        echo -e "${YELLOW}Adding OpenSSL 3.0.x binary targets...${NC}"
        # Add binaryTargets after provider line
        if [[ "$OSTYPE" == "darwin"* ]]; then
            sed -i '.bak2' '/^  provider.*=.*"prisma-client-js"/a\
  binaryTargets = ["native", "linux-musl-arm64-openssl-3.0.x", "linux-musl-openssl-3.0.x"]
' backend/prisma/schema.prisma
        else
            sed -i.bak2 '/^  provider.*=.*"prisma-client-js"/a\  binaryTargets = ["native", "linux-musl-arm64-openssl-3.0.x", "linux-musl-openssl-3.0.x"]' backend/prisma/schema.prisma
        fi
        echo -e "${GREEN}✅ Binary targets added${NC}"
    fi
else
    echo -e "${RED}❌ backend/prisma/schema.prisma not found${NC}"
    exit 1
fi

# =============================================================================
# STEP 2: Update Backend Dockerfile
# =============================================================================
echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}          STEP 2: Updating Backend Dockerfile                ${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if [ -f "backend/Dockerfile" ]; then
    if grep -q "apk add --no-cache openssl" backend/Dockerfile; then
        echo -e "${GREEN}✅ Backend Dockerfile already has OpenSSL${NC}"
    else
        echo -e "${YELLOW}Adding OpenSSL to backend Dockerfile...${NC}"
        # Add after "FROM node:20-alpine AS runtime"
        if [[ "$OSTYPE" == "darwin"* ]]; then
            sed -i '.bak' '/FROM node:20-alpine AS runtime/a\
\
# Install OpenSSL (required by Prisma)\
RUN apk add --no-cache openssl
' backend/Dockerfile
        else
            sed -i.bak '/FROM node:20-alpine AS runtime/a\\n# Install OpenSSL (required by Prisma)\nRUN apk add --no-cache openssl' backend/Dockerfile
        fi
        echo -e "${GREEN}✅ OpenSSL added to backend Dockerfile${NC}"
    fi
else
    echo -e "${RED}❌ backend/Dockerfile not found${NC}"
    exit 1
fi

# =============================================================================
# STEP 3: Update Frontend Dockerfile
# =============================================================================
echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}          STEP 3: Updating Frontend Dockerfile               ${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if [ -f "frontend/Dockerfile" ]; then
    if grep -q "ARG VITE_API_BASE_URL" frontend/Dockerfile; then
        echo -e "${GREEN}✅ Frontend Dockerfile already has API URL build args${NC}"
    else
        echo -e "${YELLOW}Adding API URL build args to frontend Dockerfile...${NC}"
        # Add after "WORKDIR /app"
        if [[ "$OSTYPE" == "darwin"* ]]; then
            sed -i '.bak' '/^WORKDIR \/app$/a\
\
# Build argument for API URL\
ARG VITE_API_BASE_URL=http://localhost:4000/api/v1\
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
' frontend/Dockerfile
        else
            sed -i.bak '/^WORKDIR \/app$/a\\n# Build argument for API URL\nARG VITE_API_BASE_URL=http://localhost:4000/api/v1\nENV VITE_API_BASE_URL=$VITE_API_BASE_URL' frontend/Dockerfile
        fi
        echo -e "${GREEN}✅ API URL build args added${NC}"
    fi
else
    echo -e "${RED}❌ frontend/Dockerfile not found${NC}"
    exit 1
fi

# =============================================================================
# STEP 4: Update docker-compose.yml
# =============================================================================
echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}          STEP 4: Updating docker-compose.yml                ${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if [ -f "docker-compose.yml" ]; then
    # Fix frontend port mapping
    if grep -q '"5173:5173"' docker-compose.yml || grep -q "'5173:5173'" docker-compose.yml; then
        echo -e "${YELLOW}Fixing frontend port mapping...${NC}"
        if [[ "$OSTYPE" == "darwin"* ]]; then
            sed -i '.bak' 's/"5173:5173"/"5173:80"/' docker-compose.yml
            sed -i '.bak2' "s/'5173:5173'/'5173:80'/" docker-compose.yml
        else
            sed -i.bak 's/"5173:5173"/"5173:80"/' docker-compose.yml
            sed -i.bak2 "s/'5173:5173'/'5173:80'/" docker-compose.yml
        fi
        echo -e "${GREEN}✅ Port mapping fixed (5173:80)${NC}"
    else
        echo -e "${GREEN}✅ Port mapping already correct${NC}"
    fi

    # Add frontend build args if not present
    if grep -q "VITE_API_BASE_URL" docker-compose.yml; then
        echo -e "${GREEN}✅ Frontend build args already configured${NC}"
    else
        echo -e "${YELLOW}⚠️  Adding frontend build args to docker-compose.yml${NC}"
        echo -e "${YELLOW}    Note: You may need to manually verify frontend service configuration${NC}"
    fi
else
    echo -e "${RED}❌ docker-compose.yml not found${NC}"
    exit 1
fi

# =============================================================================
# STEP 5: Clean Old Files
# =============================================================================
echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}          STEP 5: Cleaning Old Files                         ${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

rm -f backend/prisma/dev.db backend/prisma/dev.db-journal
rm -rf backend/prisma/migrations_sqlite_backup 2>/dev/null || true
echo -e "${GREEN}✅ Old SQLite files removed${NC}"

# =============================================================================
# STEP 6: Setup Environment Files
# =============================================================================
echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}          STEP 6: Setting Up Environment Files               ${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Backend .env.local
if [ ! -f "backend/.env.local" ]; then
    echo -e "${YELLOW}Creating backend/.env.local...${NC}"
    JWT_SECRET=$(openssl rand -base64 64 | tr -d '\n')
    cat > backend/.env.local << EOF
NODE_ENV=development
PORT=4000
DATABASE_URL="postgresql://medicaid_ce:medicaid_ce_password@db:5432/medicaid_ce"
JWT_SECRET="$JWT_SECRET"
JWT_EXPIRES_IN="24h"
ALLOWED_ORIGINS="http://localhost:5173,http://localhost:3000,http://localhost:5174"
LOG_LEVEL="debug"
EOF
    echo -e "${GREEN}✅ Created backend/.env.local with secure JWT secret${NC}"
else
    echo -e "${GREEN}✅ backend/.env.local exists${NC}"
    # Ensure JWT_SECRET exists
    if ! grep -q "JWT_SECRET=" backend/.env.local; then
        echo -e "${YELLOW}Adding JWT_SECRET...${NC}"
        JWT_SECRET=$(openssl rand -base64 64 | tr -d '\n')
        echo "JWT_SECRET=\"$JWT_SECRET\"" >> backend/.env.local
        echo -e "${GREEN}✅ JWT_SECRET added${NC}"
    fi
fi

# Backend .env for Prisma CLI
cp backend/.env.local backend/.env
echo -e "${GREEN}✅ Created backend/.env for Prisma CLI${NC}"

# Frontend .env.local
if [ ! -f "frontend/.env.local" ]; then
    echo -e "${YELLOW}Creating frontend/.env.local...${NC}"
    cat > frontend/.env.local << EOF
# Local Development Configuration
VITE_API_BASE_URL=http://localhost:4000/api/v1
EOF
    echo -e "${GREEN}✅ Created frontend/.env.local${NC}"
else
    echo -e "${GREEN}✅ frontend/.env.local exists${NC}"
fi

# =============================================================================
# STEP 7: Install PostgreSQL Client
# =============================================================================
echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}          STEP 7: Installing PostgreSQL Client              ${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

cd backend
if npm list pg >/dev/null 2>&1; then
    echo -e "${GREEN}✅ PostgreSQL client already installed${NC}"
else
    echo -e "${YELLOW}Installing pg package...${NC}"
    npm install pg --save
    echo -e "${GREEN}✅ PostgreSQL client installed${NC}"
fi
cd ..

# =============================================================================
# STEP 8: Start Database
# =============================================================================
echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}          STEP 8: Starting Database                          ${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

$COMPOSE_CMD up -d db
echo -e "${YELLOW}Waiting for PostgreSQL to be ready...${NC}"
for i in {1..30}; do
    if $COMPOSE_CMD exec -T db pg_isready -U medicaid_ce > /dev/null 2>&1; then
        echo -e "\n${GREEN}✅ Database ready${NC}"
        break
    fi
    echo -n "."
    sleep 1
done

# =============================================================================
# STEP 9: Install Backend Dependencies
# =============================================================================
echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}          STEP 9: Installing Backend Dependencies           ${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

cd backend
echo -e "${YELLOW}Running npm install...${NC}"
npm install
cd ..
echo -e "${GREEN}✅ Backend dependencies installed${NC}"

# =============================================================================
# STEP 10: Run Database Migrations
# =============================================================================
echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}          STEP 10: Running Database Migrations              ${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

cd backend

# Backup old SQLite migrations
if [ -d "prisma/migrations" ]; then
    if grep -q 'provider = "sqlite"' prisma/migrations/migration_lock.toml 2>/dev/null; then
        echo -e "${YELLOW}Backing up old SQLite migrations...${NC}"
        mv prisma/migrations prisma/migrations_sqlite_backup
    fi
fi

# Update DATABASE_URL to localhost for migration
if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '.bak-migrate' 's/@db:5432/@localhost:5432/' .env
else
    sed -i.bak-migrate 's/@db:5432/@localhost:5432/' .env
fi

echo -e "${YELLOW}Running Prisma migrations...${NC}"
npx prisma migrate dev --name switch_to_postgresql

echo -e "${YELLOW}Generating Prisma client...${NC}"
npx prisma generate

# Restore DATABASE_URL
if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '.bak-migrate2' 's/@localhost:5432/@db:5432/' .env
else
    sed -i.bak-migrate2 's/@localhost:5432/@db:5432/' .env
fi

cd ..
echo -e "${GREEN}✅ Database migrations complete${NC}"

# =============================================================================
# STEP 11: Seed Database
# =============================================================================
echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}          STEP 11: Seeding Database                          ${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

cd backend

# Update DATABASE_URL to localhost for seeding
if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '.bak-seed' 's/@db:5432/@localhost:5432/' .env
else
    sed -i.bak-seed 's/@db:5432/@localhost:5432/' .env
fi

npm run seed

# Restore DATABASE_URL
if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '.bak-seed2' 's/@localhost:5432/@db:5432/' .env
else
    sed -i.bak-seed2 's/@localhost:5432/@db:5432/' .env
fi

cd ..
echo -e "${GREEN}✅ Database seeded with demo data${NC}"

# =============================================================================
# STEP 12: Build Docker Images
# =============================================================================
echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}          STEP 12: Building Docker Images                    ${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo -e "${YELLOW}Building images (this may take 5-10 minutes)...${NC}"
$COMPOSE_CMD build --no-cache
echo -e "${GREEN}✅ Docker images built${NC}"

# =============================================================================
# STEP 13: Start All Services
# =============================================================================
echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}          STEP 13: Starting All Services                     ${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

$COMPOSE_CMD up -d
echo -e "${YELLOW}Waiting for services to become healthy (30 seconds)...${NC}"
sleep 30
echo -e "${GREEN}✅ All services started${NC}"

# =============================================================================
# STEP 14: Health Checks
# =============================================================================
echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}          STEP 14: Running Health Checks                     ${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo -e "${YELLOW}Checking backend...${NC}"
HEALTH_STATUS=$(curl -s http://localhost:4000/health 2>/dev/null | grep -o '"status":"[^"]*"' | cut -d'"' -f4 || echo "error")
if [ "$HEALTH_STATUS" = "ok" ]; then
    echo -e "${GREEN}✅ Backend healthy${NC}"
else
    echo -e "${YELLOW}⚠️  Backend may still be starting...${NC}"
fi

echo -e "${YELLOW}Checking frontend...${NC}"
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5173/ 2>/dev/null || echo "000")
if [ "$FRONTEND_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ Frontend responding${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend may still be starting...${NC}"
fi

# =============================================================================
# SUCCESS!
# =============================================================================
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ INSTALLATION COMPLETE!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}🌐 Access Your Application:${NC}"
echo ""
echo -e "   Frontend: ${GREEN}http://localhost:5173${NC}"
echo -e "   Backend:  ${GREEN}http://localhost:4000${NC}"
echo -e "   Health:   ${GREEN}http://localhost:4000/health${NC}"
echo ""
echo -e "${BLUE}🔑 Demo Login Credentials:${NC}"
echo ""
echo -e "   ${YELLOW}Admin User:${NC}"
echo -e "   Email:    admin@demo.com"
echo -e "   Password: Admin123!"
echo ""
echo -e "   ${YELLOW}Case Worker:${NC}"
echo -e "   Email:    worker@demo.com"
echo -e "   Password: Worker123!"
echo ""
echo -e "${BLUE}📊 Service Status:${NC}"
$COMPOSE_CMD ps
echo ""
echo -e "${BLUE}💡 Useful Commands:${NC}"
echo -e "   View logs:     ${YELLOW}$COMPOSE_CMD logs -f${NC}"
echo -e "   Stop services: ${YELLOW}$COMPOSE_CMD down${NC}"
echo -e "   Restart:       ${YELLOW}$COMPOSE_CMD restart${NC}"
echo -e "   Access DB:     ${YELLOW}$COMPOSE_CMD exec db psql -U medicaid_ce -d medicaid_ce${NC}"
echo ""
echo -e "${GREEN}🎉 Ready to use! Open http://localhost:5173 in your browser${NC}"
echo ""
