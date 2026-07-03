# Mini CRM

A full-stack Customer Relationship Management app with user authentication, role-based access control, client management, and task tracking.

## Tech Stack

**Backend**
- Node.js + Express 5
- TypeScript (strict mode)
- Prisma ORM + SQLite (dev) / PostgreSQL (production)
- JWT authentication + bcrypt password hashing
- Zod validation

**Frontend**
- React 19 + TypeScript
- Vite
- React Router
- Zustand (auth state)
- Axios (API client)
- React Toastify (notifications)
- Tailwind CSS

## Features

- User registration & login with JWT
- Role-based access (`admin` / `user`)
- User management (admin only)
- Client CRUD with ownership rules
- Task management with status filtering
- Global error handling & toast notifications
- Loading skeletons & empty states
- Database seeding with sample data

## Prerequisites

- Node.js 20+
- npm

## Setup

### 1. Clone & install

```bash
# Backend
npm install

# Frontend
cd crm-frontend
npm install
```

### 2. Environment variables

**Backend** — copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Default dev config uses SQLite (`DATABASE_URL="file:./dev.db"`). For PostgreSQL, update `prisma/schema.prisma` provider and set:

```
DATABASE_URL=postgresql://user:password@localhost:5432/mini_crm
JWT_SECRET=your-secret-key
PORT=3000
NODE_ENV=development
```

**Frontend** — copy `.env.example` to `.env.local`:

```bash
cd crm-frontend
cp .env.example .env.local
```

```
VITE_API_URL=http://localhost:3000
```

### 3. Database

```bash
npm run db:push
npm run db:seed
```

### 4. Run dev servers

```bash
# Terminal 1 — Backend (port 3000)
npm run dev

# Terminal 2 — Frontend (port 5173)
cd crm-frontend
npm run dev
```

Open http://localhost:5173

## Seed Credentials

| Role  | Email            | Password  |
|-------|------------------|-----------|
| Admin | admin@test.com   | admin123  |
| User  | user@test.com    | user123   |

## API Endpoints

Base URL: `http://localhost:3000/api`

### Auth
| Method | Route            | Auth | Description        |
|--------|------------------|------|--------------------|
| POST   | /auth/register   | No   | Register user      |
| POST   | /auth/login      | No   | Login              |
| GET    | /auth/me         | Yes  | Current user       |

### Users (admin only for list/delete)
| Method | Route        | Auth | Description     |
|--------|--------------|------|-----------------|
| GET    | /users       | Yes  | List all users  |
| GET    | /users/:id   | Yes  | Get user by ID  |
| PUT    | /users/:id   | Yes  | Update user     |
| DELETE | /users/:id   | Yes  | Delete user     |

### Clients
| Method | Route          | Auth | Description                    |
|--------|----------------|------|--------------------------------|
| POST   | /clients       | Yes  | Create client                  |
| GET    | /clients       | Yes  | List all clients               |
| GET    | /clients/:id   | Yes  | Get client by ID               |
| PUT    | /clients/:id   | Yes  | Update (creator or admin)      |
| DELETE | /clients/:id   | Yes  | Delete (admin only)            |

### Tasks
| Method | Route        | Auth | Description                          |
|--------|--------------|------|--------------------------------------|
| POST   | /tasks       | Yes  | Create task                          |
| GET    | /tasks       | Yes  | List tasks (?status, ?assignedTo)    |
| PUT    | /tasks/:id   | Yes  | Update task                          |
| DELETE | /tasks/:id   | Yes  | Delete task                          |

### Health
| Method | Route   | Description  |
|--------|---------|--------------|
| GET    | /health | Health check |

## Scripts

| Command            | Description              |
|--------------------|--------------------------|
| `npm run dev`      | Start backend dev server |
| `npm run build`    | Compile backend          |
| `npm run db:push`  | Sync Prisma schema       |
| `npm run db:seed`  | Seed sample data         |
| `npm run db:studio`| Open Prisma Studio       |

## Project Structure

```
mini-CRM/
├── src/                  # Backend source
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── utils/
│   └── server.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── crm-frontend/         # React frontend
│   └── src/
│       ├── api/
│       ├── components/
│       ├── pages/
│       └── utils/
└── README.md
```
