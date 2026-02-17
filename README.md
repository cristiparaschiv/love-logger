<div align="center">

# Love Logger

**A self-hosted relationship tracker for two.**

Pin memories on a map, plan vacations, document your story, and keep score — all synced in real-time.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![SQLite](https://img.shields.io/badge/SQLite-003B57?logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![PWA](https://img.shields.io/badge/PWA-Installable-5A0FC8?logo=pwa&logoColor=white)](#pwa)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

</div>

---

## Features

- **Interactive Map** — Pin geotagged memories anywhere in the world. Tap a location, add a note, and it's automatically reverse-geocoded to a city name via OpenStreetMap.
- **Vacation Planner** — Track upcoming and past trips with photo uploads and a live countdown to your next adventure.
- **Timeline** — Document your relationship milestones in a beautiful chronological "Our Story" view.
- **Score Tracker** — A playful shared scoreboard between partners. Tap to score, compete for fun.
- **Real-Time Sync** — Every change is pushed instantly to both users via WebSocket. No refresh needed.
- **PWA** — Installable on mobile and desktop with offline support. Caches map tiles, uploads, and API responses.
- **Self-Hosted** — Your data stays yours. Runs on Docker with a single `docker-compose up`.
- **Two Users Only** — Designed for exactly two people. No multi-tenancy, no complexity.

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite 5, Tailwind CSS 3, Zustand, React Router 6 |
| **Backend** | Express 4, Prisma 5, SQLite, Socket.IO 4, Zod |
| **Map** | Leaflet + react-leaflet, OpenStreetMap Nominatim |
| **Auth** | JWT (access + refresh tokens), bcrypt |
| **Infra** | Docker multi-stage builds, Nginx reverse proxy |
| **PWA** | vite-plugin-pwa, Workbox |

## Quick Start

### Docker (recommended)

```bash
git clone https://github.com/your-username/love-logger.git
cd love-logger
cp .env.example .env
# Edit .env with your JWT_SECRET and passwords
docker-compose up -d
```

The app will be available at **http://localhost:5173**.

### Docker with Nginx reverse proxy

```bash
docker-compose -f docker-compose.full.yml up -d
```

This runs backend, frontend, and Nginx on ports 80/443.

### Local Development

**Prerequisites:** Node.js 20+

```bash
# Install all dependencies (npm workspaces)
npm install

# Set up environment
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# Edit both .env files

# Initialize database
cd backend
npm run db:generate
npm run db:migrate
npm run db:seed
cd ..

# Run both services
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api
- Prisma Studio: `npm run db:studio`

### Default Credentials

| Username | Password |
|----------|----------|
| `he` | `he123` |
| `she` | `she123` |

> Change passwords via environment variables `HE_PASSWORD` and `SHE_PASSWORD` before first run, or use `scripts/change-password.sh`.

## Architecture

```
love-logger/
├── backend/                 # Express API + WebSocket server
│   ├── prisma/              # Schema, migrations, seed
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/       # Auth, validation, error handling
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── websocket/       # Socket.IO setup
│   │   └── server.ts        # Entry point
│   └── Dockerfile
├── frontend/                # React SPA
│   ├── src/
│   │   ├── components/      # UI components (map, timeline, vacations, score)
│   │   ├── hooks/           # Data fetching + WebSocket hooks
│   │   ├── pages/           # Route pages
│   │   ├── store/           # Zustand state stores
│   │   └── services/        # API + WebSocket clients
│   ├── nginx.conf           # Production serving config
│   └── Dockerfile
├── nginx/                   # Reverse proxy (full deployment)
├── scripts/                 # Backup, restore, password utilities
├── docker-compose.yml       # Simple 2-service deployment
└── docker-compose.full.yml  # Production 3-service deployment
```

## API

All endpoints are under `/api` and require JWT authentication (except login and health).

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/login` | Login |
| `POST` | `/api/auth/refresh` | Refresh access token |
| `GET` | `/api/auth/me` | Current user |
| `GET/POST/PUT/DELETE` | `/api/events` | Map events |
| `GET/POST/PUT/DELETE` | `/api/vacations` | Vacations |
| `GET/POST/PUT/DELETE` | `/api/timeline` | Timeline events |
| `GET/POST` | `/api/score` | Score tracker |
| `GET` | `/api/geocode` | Reverse geocoding |
| `GET` | `/api/health` | Health check |

### WebSocket Events

All changes broadcast in real-time:
`event:created` `event:updated` `event:deleted` `vacation:created` `vacation:updated` `vacation:deleted` `timeline:created` `timeline:updated` `timeline:deleted` `score:updated`

## PWA

Love Logger is a fully installable Progressive Web App:

- **Offline support** — App shell and cached data available without connection
- **Runtime caching** — API responses (NetworkFirst), uploaded photos (CacheFirst, 30 days), map tiles (CacheFirst, 30 days, up to 500 tiles)
- **Install prompt** — Dismissible banner prompts home screen installation
- **Share target** — Share photos and text directly to Love Logger from other apps

## Data & Backups

SQLite database is stored in a Docker volume at `/app/data/love-logger.db`.

```bash
# Backup
./scripts/backup.sh

# Restore
./scripts/restore.sh <backup-file>
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `JWT_SECRET` | — | **Required.** Secret for signing JWTs |
| `HE_PASSWORD` | `he123` | Password for the "he" account |
| `SHE_PASSWORD` | `she123` | Password for the "she" account |
| `DATABASE_URL` | `file:./dev.db` | Prisma database URL |
| `FRONTEND_URL` | `http://localhost:5173` | CORS origin |
| `GEOCODING_API_URL` | `https://nominatim.openstreetmap.org` | Nominatim instance |
| `VITE_API_URL` | `http://localhost:3000/api` | Frontend API base URL |
| `VITE_WS_URL` | `http://localhost:3000` | Frontend WebSocket URL |

## Security

- JWT access tokens (24h) + refresh tokens (30d)
- bcrypt password hashing (cost factor 12)
- Rate limiting on all endpoints
- Helmet.js security headers
- CORS restricted to configured origin
- Zod input validation on all requests
- Parameterized queries via Prisma (no SQL injection)

## License

MIT
