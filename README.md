# HackClub VIT Chennai - Member Portal

Welcome to the HackClub VIT Chennai Member Portal! This application is a fully-featured Single Page Application (SPA) that serves as the primary dashboard for HackClub members to upload projects, track their leaderboard rankings, and manage community activities.

## Quick Start

The project requires **two terminals** — one for the backend API and one for the frontend dev server. The backend is powered by **PostgreSQL (Neon)** via **Prisma**, so a one-time database setup is needed first.

### 1. Configure the database connection

Copy the example env file and paste your Neon connection string into it:

```bash
cd server
cp .env.example .env       # then edit server/.env
```

In `server/.env`, set `DATABASE_URL` to your Neon connection string (Neon dashboard → **Connect** → pooled connection string, keep `?sslmode=require`):

```env
DATABASE_URL="postgresql://USER:PASSWORD@ep-xxxx-pooler.region.aws.neon.tech/neondb?sslmode=require"
```

> `server/.env` is git-ignored — your credentials are never committed.

### 2. Backend (Terminal 1)

```bash
cd server
npm install            # installs Express, Prisma, etc.
npm run db:push        # creates the tables in your Neon database
npm run db:seed        # (optional) ports existing data + demo accounts
npm start              # API server running at http://localhost:5000
```

### 3. Frontend (Terminal 2)

```bash
npm install
npm run dev
# Dev server running at http://localhost:5173
```

Vite automatically proxies all `/api` requests from `:5173` to `:5000`, so no CORS configuration is needed during development.

**Demo accounts** (always allowed, shared password `Hackclub@2026`, or use OTP):
`admin@vitstudent.ac.in` (admin) · `user@vitstudent.ac.in` (member).

---

## Landing Page

On load, the app renders a public-facing landing page (`src/LandingPage.jsx`) with sections for About, Events, Team, FAQ, and Contact. Clicking **Login** in the top-right corner transitions to the authentication shell. After signing in, the portal (user or admin dashboard) renders. **Logout** returns the user to the landing page.

---

## Tech Stack

This project is built using modern, fast, and scalable web technologies. All versions are pinned for consistent development environments.

- **Frontend Framework**: [React](https://react.dev/) `v19.2.6`
- **Build Tool**: [Vite](https://vitejs.dev/) `v8.0.12`
- **Routing**: React Router (Internal Shell Routing)
- **Linting**: [ESLint](https://eslint.org/) `v10.3.0` with React Hooks & Refresh plugins.
- **Transpilation**: Babel Core `v7.29.0` with React Compiler `v1.0.0`
- **Backend**: [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/) `v4`
- **Database**: [PostgreSQL](https://www.postgresql.org/) on [Neon](https://neon.tech/) via the [Prisma](https://www.prisma.io/) ORM `v5`
- **Auth**: JWT (`jsonwebtoken`) + email OTP (`nodemailer`)

---

## Backend

The backend lives in the `server/` directory and is a standalone Node.js Express server backed by **PostgreSQL on [Neon](https://neon.tech/)** through the **[Prisma](https://www.prisma.io/) ORM**.

- **Location**: `server/server.js`
- **Port**: `5000` (override with the `PORT` environment variable)
- **Stack**: Node.js + Express, Prisma + `@prisma/client`, PostgreSQL (Neon), `jsonwebtoken`, `nodemailer` (Gmail), `dotenv`
- **Schema**: `server/prisma/schema.prisma`
- **Dev proxy**: `vite.config.js` proxies `/api → http://localhost:5000`, so the frontend always calls `/api/*`

### Environment variables (`server/.env`)
| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Neon PostgreSQL connection string (**required**) |
| `JWT_SECRET` | Secret used to sign session tokens |
| `SMTP_USER` / `SMTP_PASS` | Gmail account + App Password for sending OTP emails |
| `PORT` | API port (default `5000`) |

### Database scripts (run from `server/`)
| Command | What it does |
|---------|--------------|
| `npm run db:push` | Pushes the Prisma schema to Neon (creates/updates tables) |
| `npm run db:seed` | Seeds users, projects, recruitment apps + demo accounts from `database.json` |
| `npm run db:generate` | Regenerates the Prisma client (auto-runs on install) |
| `npm run db:studio` | Opens Prisma Studio to browse the database |

### Data model (Prisma)
- **`User`** — registered members/admins. Login requires the email to exist here. Stores an optional per-user `password` (set at signup or via a password reset); when absent, the shared club password is accepted.
- **`Project`** — project submissions with nested ratings/awards (JSON columns).
- **`RecruitmentApplication`** — recruitment submissions; `email` and `registerNumber` are **unique**, so one person can apply only once.
- **`AllowedEmail`** — admin-managed signup allowlist (see below).
- **`Collection`** — key/value store for bulk dashboard data the UI syncs wholesale (announcements, uploads, events, winners, feedback, etc.).

### Authentication & access control
1. **OTP login** — user enters a `@vitstudent.ac.in` email; the backend **verifies the email already exists** in the `User` table, then emails a 6-digit OTP (valid **5 minutes**). Unknown emails are rejected with *"No account found — please sign up first."*
2. **Password login** — same existence check; accepts the user's own password if set, otherwise the shared club password.
3. **Forgot password** — a real OTP-based reset, in three steps: (a) `forgot-password` emails a 6-digit reset OTP (valid **5 minutes**) if the account exists; (b) `verify-reset-otp` checks the code; (c) `reset-password` re-verifies the code and saves the new password. The user is then prompted to log in with it.
4. **Signup** — gated by the **allowlist + email format**: an account can only be created if the email is on the admin-managed allowlist *and* matches the VIT student format. The chosen password is stored for that user. Otherwise signup is blocked with a clear message.
5. On success a JWT (**7-day** expiry) is stored in `localStorage` as `hc_session_token`; `App.jsx` restores the session via `/api/auth/me`.

The live password-requirement checklist appears only while **creating an account** or **resetting a password** — never on the normal login screen.

> **Signup Allowlist tab**: Admins manage who may register from the **Signup Allowlist** tab in the admin portal. Accepting a recruitment application automatically adds that applicant's email to the allowlist and registers them as a member.

### Key API routes
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/send-otp` | Send OTP (requires existing email) |
| POST | `/api/auth/login-otp` | Verify OTP, receive JWT |
| POST | `/api/auth/login` | Password login (requires existing email) |
| POST | `/api/auth/signup` | Create account (allowlist-gated) |
| POST | `/api/auth/forgot-password` | Email a password-reset OTP |
| POST | `/api/auth/verify-reset-otp` | Verify the reset OTP |
| POST | `/api/auth/reset-password` | Set a new password (OTP + new password) |
| GET | `/api/auth/me` | Validate token, return user |
| GET | `/api/data` | Fetch all global state |
| GET | `/api/public/leaderboard` | Public leaderboard (no auth) |
| POST | `/api/recruitment/apply` | Submit a recruitment application (one per email/reg no.) |
| GET / PUT | `/api/recruitment/applications` | List / update applications (admin) |
| GET / POST / DELETE | `/api/allowlist` | Manage the signup allowlist (admin) |

---

## Device Independence

This application is strictly **Device Independent**.
It guarantees a seamless experience across Mobile, Tablet, and Desktop resolutions without relying on hardcoded pixel widths. We achieve this using:
- **Fluid Grid/Flexbox Layouts**: Components dynamically wrap and resize depending on the viewport.
- **CSS Media Queries**: Heavy sidebars collapse into a sticky bottom navigation bar (`< 700px`), and data tables transform into stacked vertical cards for readability on mobile devices.
- **Responsive Modals**: Modals scale fluidly using viewport relative units (e.g., `width: 95vw`).

---

## Design System

We employ a highly premium, dynamic, and responsive aesthetic.

### Typography
- **Headings**: `Inter`, system-ui, sans-serif
- **Body Text**: `system-ui`, `Segoe UI`, `Roboto`, sans-serif
- **Monospace**: `ui-monospace`, `Consolas`, monospace
- **Landing page**: `Unbounded` (display), `Space Grotesk` (body), `JetBrains Mono` (code) — loaded via Google Fonts

### Color Palette
The UI strictly adheres to a dark, high-contrast HackClub theme (defined in `src/index.css` and mirrored in the landing page):
- **Background**: `#020000`
- **Surface**: `#120202`
- **Primary / Brand**: `#720907`
- **Accent**: `#ac120c`
- **Highlight (Warning/Links)**: `#d07d22`
- **Text (Primary)**: `#f4ede4`
- **Text (Muted)**: `#bfa8a2`

---

## Architecture & The "Block Trick"

This project adheres to a strict **Modular Block Architecture** (often referred to as the "Block Trick"). Every specific tab or UI feature is isolated into its own discrete folder and component file.

The core philosophy is: **Just like building blocks in a house, if a component needs to be changed or removed, you can easily pull out that specific block without breaking or needing to rebuild the rest of the house.**

**For Contributors:**
1. **Never clutter large files**: If you are adding a new feature, do **not** dump it into `App.jsx`, `UserPortal.jsx`, or `AdminPortal.jsx`. Create a new `.jsx` component "block" inside a dedicated folder and import it.
2. **Plug & Play**: Because of this architecture, you can safely delete or swap an entire folder (e.g., a specific Dashboard tab) and the rest of the application grid will remain completely unaffected.

### Project Structure

```
hc-main-website/
├── server/                    ← Express + Prisma backend
│   ├── server.js              ← API server (port 5000)
│   ├── prismaClient.js        ← Shared Prisma client
│   ├── seed.js                ← Seeds Neon from database.json
│   ├── prisma/schema.prisma   ← PostgreSQL schema
│   ├── .env.example           ← Env template (copy to .env)
│   ├── database.json          ← Legacy seed data (source for db:seed)
│   └── package.json
├── src/
│   ├── LandingPage.jsx        ← Public landing page (rendered on load)
│   ├── App.jsx                ← Shell: landing → login → portal routing
│   ├── api.js                 ← Fetch wrapper + token helpers
│   ├── components/
│   │   ├── LoginShell.jsx
│   │   ├── PasswordChecklist.jsx  ← Live rules (signup only)
│   │   ├── LaunchScreen.jsx
│   │   ├── UserPortal.jsx
│   │   ├── AdminPortal.jsx
│   │   ├── user/              ← User portal tab blocks
│   │   └── admin/             ← Admin portal tab blocks (incl. Allowlist/)
│   ├── Leaderboard/           ← Leaderboard sub-tab blocks
│   ├── data/mockData.js       ← UI defaults / fallback shapes
│   ├── index.css              ← Design system variables
│   └── App.css                ← Portal-level styles
├── vite.config.js             ← Dev proxy: /api → :5000
└── package.json               ← Frontend scripts
```

---

## Data: Neon PostgreSQL (source of truth)

Live data is stored in **Neon PostgreSQL** and accessed through Prisma. The frontend fetches all state from `/api/data` after login and syncs mutations back to the API. `src/data/mockData.js` now only provides UI structural defaults (e.g. the admin `navItems` list) and fallback shapes when the backend is unreachable.

To seed or reset the database, edit `server/database.json` and run `npm run db:seed` from the `server/` directory — it wipes and repopulates the Neon tables (users, projects, recruitment applications, the signup allowlist, and the bulk collections), and always (re)creates the demo `admin@`/`user@` accounts.

### Scoring Formula
The leaderboard ranks are calculated dynamically in the UI based on the constants. The active formula is:
- **Project Rating Score** (70% weight)
- **Contribution Score** (20% weight)
- **Event Score** (10% weight)
