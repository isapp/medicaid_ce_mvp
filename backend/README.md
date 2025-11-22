# Medicaid CE Backend

Backend API server for the Medicaid Community Engagement MVP application.

## Tech Stack

- **Runtime**: Node.js 20+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | Secret for signing JWT tokens (min 32 chars in prod) | Generate with `openssl rand -base64 64` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `4000` |
| `NODE_ENV` | Environment | `development` |
| `JWT_EXPIRES_IN` | Token expiration | `24h` |
| `ALLOWED_ORIGINS` | CORS allowed origins (comma-separated) | `http://localhost:5173,...` |
| `LOG_LEVEL` | Logging level | `debug` (dev), `info` (prod) |

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Generate a secure JWT secret:

```bash
openssl rand -base64 64
```

Update `.env.local` with your values.

### 3. Setup Database

Start PostgreSQL (via Docker):

```bash
docker-compose up -d db
```

Run migrations:

```bash
npx prisma migrate dev
```

Seed demo data:

```bash
npm run seed
```

### 4. Start Development Server

```bash
npm run dev
```

The server will start on http://localhost:4000

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Run production build
- `npm run seed` - Seed database with demo data
- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx prisma migrate dev` - Create and apply migrations

## Project Structure

```
backend/
├── src/
│   ├── modules/           # Domain modules
│   │   ├── auth/         # Authentication
│   │   ├── beneficiaries/# Beneficiary management
│   │   └── engagement/   # Engagement tracking
│   ├── routes/           # Route aggregation
│   ├── shared/           # Shared utilities
│   │   ├── config.ts     # Configuration management
│   │   ├── db.ts         # Database client
│   │   ├── auth.ts       # Auth utilities
│   │   ├── health.ts     # Health checks
│   │   ├── logging.ts    # Logging
│   │   ├── errors.ts     # Error handling
│   │   └── middleware.ts # Express middleware
│   └── index.ts          # Application entry point
├── prisma/
│   ├── schema.prisma     # Database schema
│   ├── migrations/       # Database migrations
│   └── seed.ts          # Seed script
└── package.json
```

## API Endpoints

### Health Checks

- `GET /health` - Comprehensive health check (database, memory)
- `GET /health/ready` - Readiness probe (200 or 503)
- `GET /health/live` - Liveness probe (always 200)

### Authentication

- `POST /api/v1/auth/admin/login` - Admin/case worker login

### Beneficiaries

- `GET /api/v1/beneficiaries` - List beneficiaries (requires auth)
- `POST /api/v1/beneficiaries` - Create beneficiary (requires auth)

## Demo Credentials

After running the seed script:

- **Admin**: admin@demo.com / Admin123!
- **Case Worker**: worker@demo.com / Worker123!

## Docker

### Build Production Image

```bash
docker build -t medicaid-ce-backend .
```

### Run Container

```bash
docker run -p 4000:4000 \
  -e DATABASE_URL="postgresql://..." \
  -e JWT_SECRET="your-secret" \
  medicaid-ce-backend
```

### Development with Docker Compose

```bash
docker-compose up
```

## Troubleshooting

### Database Connection Failed

Check that PostgreSQL is running:

```bash
docker-compose ps db
```

Test connection:

```bash
docker-compose exec db psql -U medicaid_ce -d medicaid_ce -c "SELECT version();"
```

### JWT Token Invalid

Ensure `JWT_SECRET` is consistent across restarts and matches what was used to sign tokens.

### Port Already in Use

Change the `PORT` environment variable or stop the conflicting service.

## Production Deployment

1. Set `NODE_ENV=production`
2. Generate secure `JWT_SECRET` (min 64 chars)
3. Use managed PostgreSQL database
4. Run migrations: `npx prisma migrate deploy`
5. Build application: `npm run build`
6. Start server: `npm start`

See `DEPLOYMENT_CHECKLIST.md` in the repository root for detailed deployment steps.
