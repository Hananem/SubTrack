# SubTrack — Subscription Tracker

Track all your subscriptions, get reminded before every renewal, and stop paying for things you forgot about.

**Stack:** NestJS · Next.js 14 · Neon (PostgreSQL) · Prisma · TypeScript

---

## Project Structure

```
subscription-tracker/
├── backend/          NestJS REST API
└── frontend/         Next.js App Router
```

---

## Backend Setup

### 1. Create a Neon database

Go to [neon.tech](https://neon.tech), create a free project, and copy the **Connection string**.

### 2. Install and configure

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and set:

```env
DATABASE_URL="postgresql://..."   # your Neon connection string
DIRECT_URL="postgresql://..."     # same string (used by Prisma migrations)
JWT_SECRET="change-me-in-prod"
MAIL_USER="your@gmail.com"
MAIL_PASS="your-app-password"     # Gmail App Password (not your account password)
```

### 3. Run database migrations

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Start the API

```bash
npm run start:dev
```

API: http://localhost:3001/api/v1  
Swagger UI: http://localhost:3000/api/docs

---

## Frontend Setup

```bash
cd frontend
npm install
cp .env.local.example .env.local
```

`.env.local` only needs:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

```bash
npm run dev
```

App: http://localhost:3000

---

## API Endpoints

### Auth
| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login, receive JWT |

### Subscriptions (JWT required)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/subscriptions` | List all subscriptions |
| POST | `/subscriptions` | Create subscription |
| GET | `/subscriptions/dashboard` | Stats (spend, upcoming) |
| GET | `/subscriptions/:id` | Get one |
| PUT | `/subscriptions/:id` | Update |
| DELETE | `/subscriptions/:id` | Delete |
| PATCH | `/subscriptions/:id/payment-done` | Advance next payment date |
| PATCH | `/subscriptions/:id/toggle-status` | Pause / Resume |

### Notifications (JWT required)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/notifications` | Get all notifications |
| GET | `/notifications/unread-count` | Unread count |
| PATCH | `/notifications/mark-all-read` | Mark all as read |
| PATCH | `/notifications/:id/read` | Mark one as read |

---

## Background Jobs (Cron)

| Job | Schedule | What it does |
|-----|----------|-------------|
| Payment Reminders | Every day 08:00 AM | Finds subscriptions due within 7 days, saves notification, sends email |
| Expire Subscriptions | Every day midnight | Marks overdue ACTIVE subscriptions as EXPIRED |

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Next.js Frontend                  │
│  Auth Pages │ Dashboard │ Subscriptions │ Notifications│
│        React Query + Axios + Zod + React Hook Form   │
└─────────────────────────┬───────────────────────────┘
                          │ HTTP / REST
┌─────────────────────────▼───────────────────────────┐
│                   NestJS Backend                     │
│   AuthModule │ SubscriptionsModule │ NotificationsModule│
│   TasksModule (Cron) │ MailModule (Nodemailer)       │
└─────────────────────────┬───────────────────────────┘
                          │ Prisma ORM
┌─────────────────────────▼───────────────────────────┐
│              Neon PostgreSQL (Serverless)             │
│        users │ subscriptions │ notifications         │
└─────────────────────────────────────────────────────┘
```

---

## Gmail App Password Setup

1. Enable 2FA on your Google account
2. Go to myaccount.google.com → Security → App Passwords
3. Generate a password for "Mail"
4. Use it as `MAIL_PASS` in `.env`

---

## Production Deployment

- **Backend:** Deploy to Railway / Render / Fly.io
- **Frontend:** Deploy to Vercel (`NEXT_PUBLIC_API_URL` → your backend URL)
- **Database:** Already on Neon (serverless, no server needed)
