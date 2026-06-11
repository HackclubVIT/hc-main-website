# HackClub VIT Chennai - Member Portal

Welcome to the HackClub VIT Chennai Member Portal! This application is a fully-featured Single Page Application (SPA) that serves as the primary dashboard for HackClub members to upload projects, track their leaderboard rankings, and manage community activities.

## Quick Start

To run the project locally, run the following commands:

```bash
npm install
npm run dev
```

The application will spin up a local development server at `http://localhost:5173/`.

---

## Tech Stack

This project is built using modern, fast, and scalable web technologies. All versions are pinned for consistent development environments.

- **Frontend Framework**: [React](https://react.dev/) `v19.2.6`
- **Build Tool**: [Vite](https://vitejs.dev/) `v8.0.12`
- **Routing**: React Router (Internal Shell Routing)
- **Linting**: [ESLint](https://eslint.org/) `v10.3.0` with React Hooks & Refresh plugins.
- **Transpilation**: Babel Core `v7.29.0` with React Compiler `v1.0.0`

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

### Color Palette
The UI strictly adheres to a dark, high-contrast HackClub theme:
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

- `src/App.jsx`: The primary shell. Handles routing between the Landing Page, Login, User Portal, and Admin Portal.
- `src/components/`: Contains the main portal shells (`UserPortal.jsx`, `AdminPortal.jsx`) and the isolated feature tabs organized by folder.
  - `src/components/user/`: Contains individual folders for each User Portal tab (e.g., `Overview/`, `Profile/`, `Projects/`).
  - `src/components/admin/`: Contains individual folders for each Admin Portal tab (e.g., `ManageUsers/`, `ManageProjects/`, `Dashboard/`).
- `src/Leaderboard/`: Contains all the specialized UI components for rendering the multi-view leaderboard. Like the portal tabs, every leaderboard sub-tab is isolated into its own dedicated folder (e.g., `TopMembers/`, `BestProjects/`).
- `src/data/mockData.js`: Centralized mock database schema. Contains all constants and state shapes.
- `src/index.css` & `src/App.css`: Core application styling containing the design system variables.

---

## Constants & Mock Database

Currently, the application runs entirely on the frontend. We simulate backend database interactions using the constants exported from `src/data/mockData.js`. 

If you need to test new features or add dummy data to the UI, modify the following arrays in `mockData.js`:
- `users`: Simulates registered members. Includes scores, roles, and badge arrays.
- `projects`: Simulates project uploads. Includes individual rating arrays and approval statuses.
- `feedbacks`: Simulates bug reports and suggestions.

### Scoring Formula
The leaderboard ranks are calculated dynamically in the UI based on the constants. The active formula is:
- **Project Rating Score** (70% weight)
- **Contribution Score** (20% weight)
- **Event Score** (10% weight)
