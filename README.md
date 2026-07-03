# Mini CRM

A full-stack Customer Relationship Management app with user authentication, role-based access control, client management, and task tracking.

## Tech Stack

**Backend** (`backend/`)
- Node.js + Express 5
- TypeScript (strict mode)
- Prisma ORM + SQLite (dev) / PostgreSQL (production)
- JWT access + refresh tokens, bcrypt password hashing
- Zod validation, express-rate-limit

**Frontend** (`frontend/`)
- React 19 + TypeScript
- Vite
- React Router
- Zustand (auth state)
- Axios (API client with token refresh)
- React Toastify (notifications)
- Tailwind CSS (responsive layout)

## Features

- User registration & login with JWT (access + refresh tokens)
- Role-based access (`admin` / `user`)
- User management (admin only)
- Client CRUD with ownership rules
- Task management with status filtering and optional assignee
- Safe deletes (FK checks for users/clients with related data)
- Rate limiting on auth routes
- Global error handling & toast notifications
- Responsive UI (mobile cards, desktop tables)
- Loading skeletons & empty states
- Database seeding with sample data

## Prerequisites

- Node.js 20+
- npm

## Setup

### Quick Start

```bash
# 1. Install & setup
cd backend && npm install && cp .env.example .env
cd ../frontend && npm install && cp .env.example .env.local

# 2. Seed database
cd backend && npm run db:seed

# 3. Run both
npm run dev  # backend
npm run dev  # frontend (new terminal)
```

### 1. Clone & install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Environment variables

**Backend** — copy `.env.example` to `.env`:

```bash
cd backend
cp .env.example .env
```

```env
PORT=3000
DATABASE_URL="file:./dev.db"
JWT_SECRET=change-me-to-a-random-secret-key-min-32-chars
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

For PostgreSQL, update `backend/prisma/schema.prisma` provider and set `DATABASE_URL` accordingly.

**Frontend** — copy `.env.example` to `.env.local`:

```bash
cd frontend
cp .env.example .env.local
```

```env
VITE_API_URL=http://localhost:3000
```

### 3. Database

```bash
cd backend
npm run db:push
npm run db:seed
```

### 4. Run dev servers

```bash
# Terminal 1 — Backend (port 3000)
cd backend
npm run dev

# Terminal 2 — Frontend (port 5173)
cd frontend
npm run dev
```

Open http://localhost:5173

## Seed Credentials

| Role  | Email            | Password  |
|-------|------------------|-----------|
| Admin | admin@test.com   | admin123  |
| User  | user@test.com    | user123   |

## Deployment

### Frontend (Vercel)

```bash
# Push to GitHub
git push origin main

# Import in Vercel
# Root: frontend/
# Build: npm run build
# Public: dist/
```

### Backend (Railway)

```bash
# 1. Push to GitHub
# 2. Create Railway project
# 3. Add env vars:
#    - DATABASE_URL (from Neon)
#    - JWT_SECRET (32+ chars)
#    - CORS_ORIGIN (your deployed URL)
# 4. Deploy
```

### Database (Neon)

- Create free PostgreSQL: https://neon.tech
- Copy DATABASE_URL
- Set in Railway

## API Endpoints

Base URL: `http://localhost:3000/api`

### Auth
| Method | Route            | Auth | Description              |
|--------|------------------|------|--------------------------|
| POST   | /auth/register   | No   | Register user            |
| POST   | /auth/login      | No   | Login                    |
| POST   | /auth/refresh    | No   | Refresh access token     |
| GET    | /auth/me         | Yes  | Current user             |
| GET    | /auth/profile    | Yes  | Current user (alias)     |

Auth routes are rate-limited: 5 requests per 15 minutes.

### Users
| Method | Route        | Auth  | Description                          |
|--------|--------------|-------|--------------------------------------|
| GET    | /users       | Admin | List all users                       |
| GET    | /users/:id   | Yes   | Get user (self or admin)             |
| PUT    | /users/:id   | Yes   | Update user (self or admin)          |
| DELETE | /users/:id   | Yes   | Delete user (self or admin; admin users cannot be deleted) |

### Clients
| Method | Route          | Auth | Description                         |
|--------|----------------|------|-------------------------------------|
| POST   | /clients       | Yes  | Create client                       |
| GET    | /clients       | Yes  | List all clients                    |
| GET    | /clients/:id   | Yes  | Get client by ID                    |
| PUT    | /clients/:id   | Yes  | Update (creator or admin)           |
| DELETE | /clients/:id   | Yes  | Delete (creator or admin; blocked if client has tasks) |

### Tasks
| Method | Route        | Auth | Description                                                |
|--------|--------------|------|------------------------------------------------------------|
| POST   | /tasks       | Yes  | Create task (assigned to current user)                     |
| GET    | /tasks       | Yes  | List tasks (`?status`, `?assignedTo`; non-admins see own + unassigned) |
| PUT    | /tasks/:id   | Yes  | Update (admin, assignee, or unassigned task)               |
| DELETE | /tasks/:id   | Yes  | Delete (admin, assignee, or unassigned task)               |

### Health
| Method | Route    | Description  |
|--------|----------|--------------|
| GET    | /health  | Health check |

## Example API Calls

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"admin123"}'

# Create client (with token)
curl -X POST http://localhost:3000/api/clients \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Acme Corp","email":"contact@acme.com"}'
```

## Scripts

### Backend (`backend/`)

| Command              | Description              |
|----------------------|--------------------------|
| `npm run dev`        | Start dev server         |
| `npm run build`      | Compile TypeScript       |
| `npm run start`      | Run compiled server      |
| `npm run db:push`    | Sync Prisma schema       |
| `npm run db:migrate` | Run Prisma migrations    |
| `npm run db:seed`    | Seed sample data         |
| `npm run db:studio`  | Open Prisma Studio       |

### Frontend (`frontend/`)

| Command              | Description              |
|----------------------|--------------------------|
| `npm run dev`        | Start Vite dev server    |
| `npm run build`      | Build for production     |
| `npm run preview`    | Preview production build |
| `npm run lint`       | Run ESLint               |

## Project Structure

```
mini-CRM/
├── backend/
│   ├── src/
│   │   ├── config/         # Database, env validation
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Auth, rate limit, errors
│   │   ├── routes/         # API routes
│   │   ├── types/
│   │   ├── utils/          # JWT, validation, password
│   │   └── server.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── package.json
│   └── .gitignore
├── frontend/
│   ├── src/
│   │   ├── api/            # Axios client & API modules
│   │   ├── components/     # UI components
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── store/          # Zustand auth store
│   │   └── utils/
│   ├── public/
│   ├── package.json
│   └── .gitignore
├── .gitignore
└── README.md
```

## Security Notes

- `.env` files are gitignored — never commit secrets
- `JWT_SECRET` must be at least 32 characters
- CORS is restricted to `CORS_ORIGIN` (default: `http://localhost:5173`)
- Passwords are hashed with bcrypt (salt rounds: 10)
- Prisma parameterized queries prevent SQL injection
- Use HTTPS and set `NODE_ENV=production` in production

## Troubleshooting

### Common Issues

**Port 3000/5173 already in use**

```bash
# Kill process
lsof -i :3000
kill -9 PID
```

**Database connection fails**

- Check DATABASE_URL in .env
- Run `npm run db:push`

**CORS error**

- Verify CORS_ORIGIN matches frontend URL
- Clear browser cache

**Auth fails**

- Verify JWT_SECRET in .env
- Clear localStorage in browser DevTools

## Contributing

```bash
1. Create feature branch: git checkout -b feature/name
2. Commit: git commit -m "feat: description"
3. Push: git push origin feature/name
4. Open Pull Request
```

## License & Support

MIT License — feel free to use this project.

For issues: GitHub Issues
