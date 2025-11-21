# Medicaid Community Engagement MVP

A full-stack web application for managing Medicaid community engagement requirements, enabling beneficiaries to track work, education, and volunteer activities while providing case workers with tools to monitor compliance.

## Features

### Member Portal (`/m`)

- SMS-based authentication
- Activity tracking (employment, education, volunteer work)
- Exemption requests
- Real-time engagement status

### Admin Portal (`/admin`)

- Case worker and admin dashboards
- Beneficiary management
- Reporting and analytics
- Broadcast messaging
- Compliance tracking

## Tech Stack

- **Frontend**: React, TypeScript, Vite, TanStack Query
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: JWT with bcrypt
- **Deployment**: Docker Compose

## Quick Start

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Node.js](https://nodejs.org/) 20+
- npm
- openssl

### Installation

```bash
# Clone the repository
git clone https://github.com/isapp/medicaid_ce_mvp.git
cd medicaid_ce_mvp

# Run the installation script
chmod +x install-medicaid-ce-mvp.sh
./install-medicaid-ce-mvp.sh
```

The installation script will:

- Check all dependencies
- Configure the database
- Generate secure environment variables
- Build and start all services
- Seed demo data

**Installation time**: 5-10 minutes

### Access the Application

Once installation is complete:

- **Frontend**: <http://localhost:5173>
- **Backend API**: <http://localhost:4000>
- **Database**: localhost:5432

## Demo Credentials

### Admin Portal

- **URL**: <http://localhost:5173/admin>
- **Admin**: admin@demo.com / Admin123!
- **Case Worker**: worker@demo.com / Worker123!

### Member Portal

- **URL**: <http://localhost:5173/m>
- **Phone Numbers**: 555-0101, 555-0102, 555-0103 (demo beneficiaries)

## Development

### Manual Setup

If you prefer to set up manually without the installation script:

```bash
# 1. Create environment files
cp backend/.env.example backend/.env.local
# Edit backend/.env.local with your configuration

# 2. Start the database
docker-compose up -d db

# 3. Run migrations
cd backend
npm install
npx prisma migrate dev
npx prisma db seed

# 4. Start backend
npm run dev

# 5. Start frontend (in another terminal)
cd frontend
npm install
npm run dev
```

### Environment Variables

See [backend/.env.example](backend/.env.example) and [frontend/.env.example](frontend/.env.example) for all configuration options.

**Important**: Generate a secure JWT secret for production:

```bash
openssl rand -base64 64
```

## Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild images
docker-compose build --no-cache

# Reset database
docker-compose down -v
docker-compose up -d db
```

## Health Checks

- **Backend Health**: <http://localhost:4000/api/v1/health>
- **Database Health**: <http://localhost:4000/api/v1/health/db>

## Architecture

```text
medicaid_ce_mvp/
├── backend/                 # Express API server
│   ├── src/
│   │   ├── modules/        # Feature modules (auth, users, beneficiaries)
│   │   ├── routes/         # API routes
│   │   └── shared/         # Shared utilities (config, db, auth)
│   ├── prisma/             # Database schema and migrations
│   └── Dockerfile
├── frontend/               # React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── screens/       # Page components
│   │   ├── contexts/      # React contexts
│   │   └── api/           # API client
│   └── Dockerfile
├── docker-compose.yml      # Service orchestration
└── install-medicaid-ce-mvp.sh  # One-click installer
```

## License

MIT

## Contributing

This is an MVP application. For questions or contributions, please open an issue or pull request.