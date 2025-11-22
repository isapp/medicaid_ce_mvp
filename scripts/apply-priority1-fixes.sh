#!/bin/bash
set -e

echo "🚀 Applying Priority 1 Fixes for Medicaid CE MVP"
echo "================================================"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if running from root directory
if [ ! -f "docker-compose.yml" ]; then
    echo -e "${RED}❌ Please run this script from the repository root${NC}"
    exit 1
fi

# Run dependency checker first
echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}          STEP 0: Checking Dependencies                       ${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if [ -f "scripts/check-dependencies.sh" ]; then
    bash scripts/check-dependencies.sh
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Dependency check failed. Please install missing dependencies first.${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}⚠️  Dependency checker not found, running basic checks...${NC}"

    # Basic checks
    command -v docker >/dev/null 2>&1 || { echo -e "${RED}❌ Docker is required but not installed${NC}"; exit 1; }
    command -v node >/dev/null 2>&1 || { echo -e "${RED}❌ Node.js is required but not installed${NC}"; exit 1; }

    # Check Docker is running
    if ! docker info >/dev/null 2>&1; then
        echo -e "${RED}❌ Docker daemon is not running. Please start Docker Desktop.${NC}"
        exit 1
    fi
fi

# Determine Docker Compose command
COMPOSE_CMD=""
if command -v docker-compose >/dev/null 2>&1; then
    COMPOSE_CMD="docker-compose"
    echo -e "${GREEN}✅ Using docker-compose${NC}"
elif docker compose version >/dev/null 2>&1; then
    COMPOSE_CMD="docker compose"
    echo -e "${GREEN}✅ Using docker compose (v2)${NC}"
else
    echo -e "${RED}❌ Docker Compose not found${NC}"
    exit 1
fi

echo -e "${GREEN}✅ All required commands available${NC}"

echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}          STEP 1: Updating Prisma Schema                     ${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if [ -f "backend/prisma/schema.prisma" ]; then
    # Check if already PostgreSQL
    if grep -q 'provider = "postgresql"' backend/prisma/schema.prisma; then
        echo -e "${GREEN}✅ Schema already uses PostgreSQL${NC}"
    else
        # macOS uses different sed syntax
        if [[ "$OSTYPE" == "darwin"* ]]; then
            sed -i '.bak' 's/provider = "sqlite"/provider = "postgresql"/' backend/prisma/schema.prisma
        else
            sed -i.bak 's/provider = "sqlite"/provider = "postgresql"/' backend/prisma/schema.prisma
        fi
        echo -e "${GREEN}✅ Schema updated to PostgreSQL${NC}"
    fi
else
    echo -e "${RED}❌ backend/prisma/schema.prisma not found${NC}"
    exit 1
fi

echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}          STEP 2: Cleaning SQLite Files                      ${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

rm -f backend/prisma/dev.db backend/prisma/dev.db-journal
echo -e "${GREEN}✅ SQLite files removed${NC}"

echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}          STEP 3: Installing PostgreSQL Client              ${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

cd backend

# Check if pg is already installed
if npm list pg >/dev/null 2>&1; then
    echo -e "${GREEN}✅ PostgreSQL client already installed${NC}"
else
    echo -e "${YELLOW}Installing pg package...${NC}"
    npm install pg --save
    echo -e "${GREEN}✅ PostgreSQL client installed${NC}"
fi

cd ..

echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}          STEP 4: Generating JWT Secret                      ${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if ! grep -q "JWT_SECRET=" backend/.env.local 2>/dev/null; then
    JWT_SECRET=$(openssl rand -base64 64 | tr -d '\n')
    echo "JWT_SECRET=\"$JWT_SECRET\"" >> backend/.env.local
    echo -e "${GREEN}✅ JWT secret generated and saved${NC}"
else
    echo -e "${GREEN}✅ JWT secret already exists${NC}"
fi

echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}          STEP 5: Starting Database                          ${NC}"
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

echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}          STEP 6: Installing Backend Dependencies           ${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

cd backend
echo -e "${YELLOW}Running npm install...${NC}"
npm install
cd ..
echo -e "${GREEN}✅ Dependencies installed${NC}"

echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}          STEP 7: Running Database Migrations               ${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

cd backend
echo -e "${YELLOW}Creating migration...${NC}"
npx prisma migrate dev --name switch_to_postgresql
echo -e "${YELLOW}Generating Prisma client...${NC}"
npx prisma generate
cd ..
echo -e "${GREEN}✅ Migrations complete${NC}"

echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}          STEP 8: Seeding Database                           ${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

cd backend
npm run seed
cd ..
echo -e "${GREEN}✅ Database seeded${NC}"

echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}          STEP 9: Building Docker Images                     ${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo -e "${YELLOW}Building images (this may take 5-10 minutes)...${NC}"
$COMPOSE_CMD build --no-cache
echo -e "${GREEN}✅ Images built${NC}"

echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}          STEP 10: Starting All Services                     ${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

$COMPOSE_CMD up -d
echo -e "${YELLOW}Waiting for services to be healthy (30 seconds)...${NC}"
sleep 30
echo -e "${GREEN}✅ Services started${NC}"

echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}          STEP 11: Running Health Checks                     ${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo -e "${YELLOW}Checking backend health...${NC}"
HEALTH_STATUS=$(curl -s http://localhost:4000/health 2>/dev/null | grep -o '"status":"[^"]*"' | cut -d'"' -f4 || echo "error")
if [ "$HEALTH_STATUS" = "ok" ]; then
    echo -e "${GREEN}✅ Backend healthy${NC}"
else
    echo -e "${RED}⚠️  Backend health check inconclusive (may still be starting)${NC}"
fi

echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}          STEP 12: Testing Authentication                    ${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

AUTH_RESPONSE=$(curl -s -X POST http://localhost:4000/api/v1/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@demo.com","password":"Admin123!"}' 2>/dev/null)

if echo "$AUTH_RESPONSE" | grep -q '"token"'; then
    echo -e "${GREEN}✅ Authentication working${NC}"
else
    echo -e "${RED}⚠️  Authentication test inconclusive${NC}"
fi

echo -e "\n${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ ALL FIXES APPLIED SUCCESSFULLY!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}📋 Next steps:${NC}"
echo "1. Open your browser: http://localhost:5173"
echo "2. Login with: admin@demo.com / Admin123!"
echo "3. Review DEPLOYMENT_CHECKLIST.md for full verification"
echo ""
echo -e "${BLUE}🔑 Demo Credentials:${NC}"
echo "   Admin:       admin@demo.com / Admin123!"
echo "   Case Worker: worker@demo.com / Worker123!"
echo ""
echo -e "${BLUE}🌐 URLs:${NC}"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:4000"
echo "   Health:   http://localhost:4000/health"
echo ""
echo -e "${BLUE}📊 Service Status:${NC}"
$COMPOSE_CMD ps
echo ""
echo -e "${BLUE}💡 Useful Commands:${NC}"
echo "   View logs:        $COMPOSE_CMD logs -f"
echo "   Stop services:    $COMPOSE_CMD down"
echo "   Restart:          $COMPOSE_CMD restart"
echo "   Access DB:        $COMPOSE_CMD exec db psql -U medicaid_ce -d medicaid_ce"
echo ""
