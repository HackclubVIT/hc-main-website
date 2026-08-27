# HackClub VIT Chennai — Frontend Portal (`hc-main-website`)

Welcome to the frontend single-page application for the HackClub VIT Chennai Member Portal!

## Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite 8
- **Compiler**: React Compiler (Babel)
- **Package Manager**: pnpm
- **Backend API**: Connects to [`hc-api`](../hc-api)

## Getting Started

### 1. Installation

Ensure you have **pnpm** installed:

```bash
pnpm install
```

### 2. Environment Configuration (Optional)

In development, Vite proxies `/api` requests to `http://127.0.0.1:5000` automatically.
If you need to customize the backend endpoint, create a `.env.local` file:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Running the Development Server

Make sure your backend server ([`hc-api`](../hc-api)) is running on port 5000:

```bash
pnpm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Production Build

```bash
pnpm run build
pnpm run preview
```

## Repository Structure

```
hc-main-website/
├── public/                 # Static assets and icons
├── src/
│   ├── components/         # Portal components & admin/user views
│   ├── Leaderboard/        # Leaderboard showcase & rankings
│   ├── api.js              # Configurable API client
│   ├── App.jsx             # Main router and authentication shell
│   ├── LandingPage.jsx     # Public landing page
│   └── main.jsx            # React root entry point
├── vite.config.js          # Vite config & dev API proxy
├── package.json            # Scripts & dependencies
└── pnpm-lock.yaml          # Pinned pnpm lockfile
```
