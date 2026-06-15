# HackClub VIT Chennai - Member Portal

Welcome to the HackClub VIT Chennai Member Portal! This application is a fully-featured Single Page Application (SPA) that serves as the primary dashboard for HackClub members to upload projects, track their leaderboard rankings, and manage community activities.

## Quick Start

The project requires **two terminals** — one for the backend API and one for the frontend dev server.

**Terminal 1 — Backend**
```bash
cd server
npm install
node server.js
# API server running at http://localhost:5000
```

**Terminal 2 — Frontend**
```bash
npm install
npm run dev
# Dev server running at http://localhost:5173
```

Vite automatically proxies all `/api` requests from `:5173` to `:5000`, so no CORS configuration is needed during development.

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

---

## Backend

The backend lives in the `server/` directory and is a standalone Node.js Express server.

- **Location**: `server/server.js`
- **Port**: `5000` (override with the `PORT` environment variable)
- **Stack**: Node.js + Express, `jsonwebtoken`, `nodemailer` (Gmail), JSON flat-file database (`server/database.json`)
- **Dev proxy**: `vite.config.js` proxies `/api → http://localhost:5000`, so the frontend always calls `/api/*`

### Authentication flow
1. User enters a `@vitstudent.ac.in` email address.
2. Backend sends a one-time passcode (OTP) via Gmail — valid for **5 minutes**.
3. On verification, a JWT is issued with a **7-day** expiry and stored in `localStorage` as `hc_session_token`.
4. On subsequent visits, `App.jsx` restores the session by calling `/api/auth/me` with the stored token.

### Key API routes
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/send-otp` | Send OTP to email |
| POST | `/api/auth/login-otp` | Verify OTP, receive JWT |
| GET | `/api/auth/me` | Validate token, return user |
| GET | `/api/data` | Fetch all global state |
| GET | `/api/public/leaderboard` | Public leaderboard (no auth) |
| PUT | `/api/projects` | Update projects list |
| PUT | `/api/announcements` | Update announcements |

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
├── server/                    ← Express backend
│   ├── server.js              ← API server (port 5000)
│   ├── database.json          ← JSON flat-file database
│   └── package.json
├── src/
│   ├── LandingPage.jsx        ← Public landing page (rendered on load)
│   ├── App.jsx                ← Shell: landing → login → portal routing
│   ├── api.js                 ← Fetch wrapper + token helpers
│   ├── components/
│   │   ├── LoginShell.jsx
│   │   ├── LaunchScreen.jsx
│   │   ├── UserPortal.jsx
│   │   ├── AdminPortal.jsx
│   │   ├── user/              ← User portal tab blocks
│   │   └── admin/             ← Admin portal tab blocks
│   ├── Leaderboard/           ← Leaderboard sub-tab blocks
│   ├── data/mockData.js       ← Seed/fallback data shapes
│   ├── index.css              ← Design system variables
│   └── App.css                ← Portal-level styles
├── vite.config.js             ← Dev proxy: /api → :5000
└── package.json               ← Frontend scripts
```

---

## Constants & Mock Database

`src/data/mockData.js` defines the data shapes and seed constants used as a structural reference. In development, live data is fetched from the backend via `/api/data` and synced back on mutations. If the backend is not running, the app falls back to the mock constants for UI rendering.

If you need to adjust seed data or test new fields, modify the relevant arrays in `mockData.js`:
- `users`: Simulates registered members. Includes scores, roles, and badge arrays.
- `projects`: Simulates project uploads. Includes individual rating arrays and approval statuses.
- `feedbacks`: Simulates bug reports and suggestions.

### Scoring Formula
The leaderboard ranks are calculated dynamically in the UI based on the constants. The active formula is:
- **Project Rating Score** (70% weight)
- **Contribution Score** (20% weight)
- **Event Score** (10% weight)
