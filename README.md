# Corpman Project

A full-stack web application with a React (Vite) client and a Python (FastAPI) server. The project is structured into two main parts:

- **client/**: Frontend React app (Vite, TypeScript, Tailwind CSS, PWA-ready)
- **server/**: Backend Python app (with migrations, static files, and templates)

---

## Table of Contents

- [Corpman Project](#corpman-project)
  - [Table of Contents](#table-of-contents)
  - [Project Structure](#project-structure)
  - [Client (Frontend)](#client-frontend)
    - [Setup \& Development](#setup--development)
    - [Build for Production](#build-for-production)
    - [Preview Production Build](#preview-production-build)
    - [PWA Features](#pwa-features)
    - [Directory Highlights](#directory-highlights)
  - [Server (Backend)](#server-backend)
    - [Backend Setup \& Development](#backend-setup--development)
    - [Database Migrations](#database-migrations)
    - [Directory Highlights](#directory-highlights-1)
  - [Splash Screens](#splash-screens)
  - [License](#license)

---

## Project Structure

```text
corpman/
├── client/   # React frontend (Vite, TypeScript, Tailwind, PWA)
├── server/   # Python backend (FastAPI/Flask, Alembic migrations)
└── README.md
```

---

## Client (Frontend)

- **Framework:** React + Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **PWA:** Configured with `vite-plugin-pwa` (offline support, manifest, service worker)
- **Location:** `client/`

### Setup & Development

```sh
cd client
npm install
npm run dev
```

### Build for Production

```sh
npm run build
```

### Preview Production Build

```sh
npm run preview
```

### PWA Features

- Manifest and service worker for offline support
- Installable on mobile and desktop
- Splash screens and icons in `public/`

### Directory Highlights

- `src/` — Main source code (components, hooks, pages, utils)
- `public/` — Static assets, manifest, splash screens
- `vite.config.ts` — Vite and PWA plugin configuration

---

## Server (Backend)

- **Language:** Python
- **Framework:** (Check `server/src/` for FastAPI, Flask, or other)
- **Migrations:** Alembic (`server/migrations/`)
- **Static Files:** `server/static/`
- **Templates:** `server/view/`
- **Location:** `server/`

### Backend Setup & Development

1. Create a virtual environment:

   ```sh
   cd server
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

2. Run the server:

   ```sh
   fastapi dev src
   ```

### Database Migrations

- Alembic is used for migrations:

  ```sh
  alembic upgrade head
  ```

### Directory Highlights

- `src/` — Main backend code (models, modules, config, middleware)
- `migrations/` — Alembic migration scripts
- `static/` — Static files (css, js, svg)
- `view/` — HTML templates

---

## Splash Screens

Splash screens for PWA are in `client/public/splashscreens/` and are referenced in the manifest for installability and native-like experience.

---

## License

Add your license information here.
