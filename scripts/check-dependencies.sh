#!/bin/bash
# Dependency checker and installer for Medicaid CE MVP
# Supports macOS, Linux, and Windows (WSL)

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║         Medicaid CE MVP - Dependency Checker                 ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Detect OS
OS="unknown"
if [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macos"
    echo -e "${BLUE}Detected OS: macOS${NC}"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="linux"
    echo -e "${BLUE}Detected OS: Linux${NC}"
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    OS="windows"
    echo -e "${BLUE}Detected OS: Windows (WSL/Git Bash)${NC}"
fi
echo ""

MISSING_DEPS=()
NEEDS_INSTALL=false

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check Homebrew (macOS)
check_homebrew() {
    if [[ "$OS" == "macos" ]]; then
        if ! command_exists brew; then
            echo -e "${YELLOW}⚠️  Homebrew not found. Installing Homebrew...${NC}"
            /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

            # Add Homebrew to PATH for this session
            if [[ -f "/opt/homebrew/bin/brew" ]]; then
                eval "$(/opt/homebrew/bin/brew shellenv)"
            fi

            echo -e "${GREEN}✅ Homebrew installed${NC}"
        else
            echo -e "${GREEN}✅ Homebrew found${NC}"
        fi
    fi
}

# Check Docker
echo -e "${BLUE}1. Checking Docker...${NC}"
if command_exists docker; then
    DOCKER_VERSION=$(docker --version 2>/dev/null | cut -d' ' -f3 | cut -d',' -f1)
    echo -e "${GREEN}   ✅ Docker installed (version ${DOCKER_VERSION})${NC}"

    # Check if Docker daemon is running
    if docker info >/dev/null 2>&1; then
        echo -e "${GREEN}   ✅ Docker daemon is running${NC}"
    else
        echo -e "${RED}   ❌ Docker daemon is NOT running${NC}"
        echo -e "${YELLOW}   ⚠️  Please start Docker Desktop and wait for it to fully start${NC}"
        echo -e "${YELLOW}      Look for the Docker whale icon in your menu bar/system tray${NC}"
        NEEDS_INSTALL=true
    fi
else
    echo -e "${RED}   ❌ Docker not installed${NC}"
    MISSING_DEPS+=("docker")
    NEEDS_INSTALL=true

    if [[ "$OS" == "macos" ]]; then
        echo -e "${YELLOW}   📦 Install: brew install --cask docker${NC}"
        echo -e "${YELLOW}      Or download from: https://www.docker.com/products/docker-desktop${NC}"
    elif [[ "$OS" == "linux" ]]; then
        echo -e "${YELLOW}   📦 Install: https://docs.docker.com/engine/install/${NC}"
    else
        echo -e "${YELLOW}   📦 Install: https://www.docker.com/products/docker-desktop${NC}"
    fi
fi
echo ""

# Check Docker Compose
echo -e "${BLUE}2. Checking Docker Compose...${NC}"
COMPOSE_CMD=""
if command_exists docker-compose; then
    COMPOSE_VERSION=$(docker-compose --version 2>/dev/null | cut -d' ' -f4 | cut -d',' -f1)
    echo -e "${GREEN}   ✅ docker-compose installed (version ${COMPOSE_VERSION})${NC}"
    COMPOSE_CMD="docker-compose"
elif docker compose version >/dev/null 2>&1; then
    COMPOSE_VERSION=$(docker compose version 2>/dev/null | cut -d' ' -f4)
    echo -e "${GREEN}   ✅ docker compose (v2) available (version ${COMPOSE_VERSION})${NC}"
    COMPOSE_CMD="docker compose"
else
    echo -e "${RED}   ❌ Docker Compose not installed${NC}"
    MISSING_DEPS+=("docker-compose")
    NEEDS_INSTALL=true

    if [[ "$OS" == "macos" ]]; then
        echo -e "${YELLOW}   📦 Usually included with Docker Desktop${NC}"
        echo -e "${YELLOW}      If missing: brew install docker-compose${NC}"
    elif [[ "$OS" == "linux" ]]; then
        echo -e "${YELLOW}   📦 Install: sudo apt-get install docker-compose${NC}"
        echo -e "${YELLOW}      Or: https://docs.docker.com/compose/install/${NC}"
    fi
fi
echo ""

# Check Node.js
echo -e "${BLUE}3. Checking Node.js...${NC}"
if command_exists node; then
    NODE_VERSION=$(node --version)
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
    echo -e "${GREEN}   ✅ Node.js installed (${NODE_VERSION})${NC}"

    if [ "$NODE_MAJOR" -lt 20 ]; then
        echo -e "${YELLOW}   ⚠️  Node.js version should be 20 or higher (you have v${NODE_MAJOR})${NC}"
        echo -e "${YELLOW}      Consider upgrading: https://nodejs.org/${NC}"
    fi
else
    echo -e "${RED}   ❌ Node.js not installed${NC}"
    MISSING_DEPS+=("node")
    NEEDS_INSTALL=true

    if [[ "$OS" == "macos" ]]; then
        echo -e "${YELLOW}   📦 Install: brew install node@20${NC}"
    elif [[ "$OS" == "linux" ]]; then
        echo -e "${YELLOW}   📦 Install: https://nodejs.org/en/download/${NC}"
    else
        echo -e "${YELLOW}   📦 Install: https://nodejs.org/en/download/${NC}"
    fi
fi
echo ""

# Check npm
echo -e "${BLUE}4. Checking npm...${NC}"
if command_exists npm; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}   ✅ npm installed (version ${NPM_VERSION})${NC}"
else
    echo -e "${RED}   ❌ npm not installed (usually comes with Node.js)${NC}"
    MISSING_DEPS+=("npm")
    NEEDS_INSTALL=true
fi
echo ""

# Check Git
echo -e "${BLUE}5. Checking Git...${NC}"
if command_exists git; then
    GIT_VERSION=$(git --version | cut -d' ' -f3)
    echo -e "${GREEN}   ✅ Git installed (version ${GIT_VERSION})${NC}"
else
    echo -e "${RED}   ❌ Git not installed${NC}"
    MISSING_DEPS+=("git")
    NEEDS_INSTALL=true

    if [[ "$OS" == "macos" ]]; then
        echo -e "${YELLOW}   📦 Install: brew install git${NC}"
    elif [[ "$OS" == "linux" ]]; then
        echo -e "${YELLOW}   📦 Install: sudo apt-get install git${NC}"
    else
        echo -e "${YELLOW}   📦 Install: https://git-scm.com/downloads${NC}"
    fi
fi
echo ""

# Check curl
echo -e "${BLUE}6. Checking curl...${NC}"
if command_exists curl; then
    echo -e "${GREEN}   ✅ curl installed${NC}"
else
    echo -e "${RED}   ❌ curl not installed${NC}"
    MISSING_DEPS+=("curl")
    NEEDS_INSTALL=true

    if [[ "$OS" == "macos" ]]; then
        echo -e "${YELLOW}   📦 Install: brew install curl${NC}"
    elif [[ "$OS" == "linux" ]]; then
        echo -e "${YELLOW}   📦 Install: sudo apt-get install curl${NC}"
    fi
fi
echo ""

# Check jq (optional but recommended)
echo -e "${BLUE}7. Checking jq (optional but recommended)...${NC}"
if command_exists jq; then
    JQ_VERSION=$(jq --version)
    echo -e "${GREEN}   ✅ jq installed (${JQ_VERSION})${NC}"
else
    echo -e "${YELLOW}   ⚠️  jq not installed (optional - for prettier JSON output)${NC}"

    if [[ "$OS" == "macos" ]]; then
        echo -e "${YELLOW}   📦 Install: brew install jq${NC}"
    elif [[ "$OS" == "linux" ]]; then
        echo -e "${YELLOW}   📦 Install: sudo apt-get install jq${NC}"
    fi
fi
echo ""

# Check openssl
echo -e "${BLUE}8. Checking openssl...${NC}"
if command_exists openssl; then
    echo -e "${GREEN}   ✅ openssl installed${NC}"
else
    echo -e "${RED}   ❌ openssl not installed${NC}"
    MISSING_DEPS+=("openssl")
    NEEDS_INSTALL=true

    if [[ "$OS" == "macos" ]]; then
        echo -e "${YELLOW}   📦 Install: brew install openssl${NC}"
    elif [[ "$OS" == "linux" ]]; then
        echo -e "${YELLOW}   📦 Install: sudo apt-get install openssl${NC}"
    fi
fi
echo ""

# Summary
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}                         SUMMARY                               ${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

if [ "$NEEDS_INSTALL" = false ]; then
    echo -e "${GREEN}✅ All required dependencies are installed and ready!${NC}"
    echo ""
    echo -e "${GREEN}You can now run:${NC}"
    echo -e "${BLUE}   ./scripts/apply-priority1-fixes.sh${NC}"
    echo ""
    exit 0
else
    echo -e "${RED}❌ Some dependencies are missing or not running${NC}"
    echo ""

    if [ ${#MISSING_DEPS[@]} -gt 0 ]; then
        echo -e "${YELLOW}Missing dependencies:${NC}"
        for dep in "${MISSING_DEPS[@]}"; do
            echo -e "${RED}   • $dep${NC}"
        done
        echo ""
    fi

    # Auto-install option for macOS
    if [[ "$OS" == "macos" ]] && [ ${#MISSING_DEPS[@]} -gt 0 ]; then
        echo -e "${YELLOW}═══════════════════════════════════════════════════════════════${NC}"
        echo -e "${YELLOW}Would you like to auto-install missing dependencies? (y/n)${NC}"
        read -p "Install now? " -n 1 -r
        echo ""

        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo -e "${BLUE}Installing missing dependencies...${NC}"

            # Ensure Homebrew is installed
            check_homebrew

            # Install missing dependencies
            for dep in "${MISSING_DEPS[@]}"; do
                case $dep in
                    docker)
                        echo -e "${BLUE}Installing Docker Desktop...${NC}"
                        brew install --cask docker
                        echo -e "${YELLOW}⚠️  Please start Docker Desktop manually after installation${NC}"
                        ;;
                    docker-compose)
                        echo -e "${BLUE}Installing Docker Compose...${NC}"
                        brew install docker-compose
                        ;;
                    node)
                        echo -e "${BLUE}Installing Node.js 20...${NC}"
                        brew install node@20
                        ;;
                    git)
                        echo -e "${BLUE}Installing Git...${NC}"
                        brew install git
                        ;;
                    curl)
                        echo -e "${BLUE}Installing curl...${NC}"
                        brew install curl
                        ;;
                    openssl)
                        echo -e "${BLUE}Installing openssl...${NC}"
                        brew install openssl
                        ;;
                esac
            done

            echo ""
            echo -e "${GREEN}✅ Installation complete!${NC}"
            echo ""
            echo -e "${YELLOW}Next steps:${NC}"
            echo -e "${YELLOW}1. If Docker was installed, start Docker Desktop from Applications${NC}"
            echo -e "${YELLOW}2. Wait for Docker to fully start (whale icon in menu bar)${NC}"
            echo -e "${YELLOW}3. Run this script again to verify: ./scripts/check-dependencies.sh${NC}"
            echo -e "${YELLOW}4. Then run: ./scripts/apply-priority1-fixes.sh${NC}"
        else
            echo -e "${YELLOW}Skipping auto-install. Please install manually using the commands above.${NC}"
        fi
    else
        echo -e "${YELLOW}Please install the missing dependencies and run this script again.${NC}"
    fi

    echo ""
    exit 1
fi
