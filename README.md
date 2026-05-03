# Multi-App Netlify Setup

This project is structured as a collection of independent apps under `apps/`.
Each app has its own `package.json` and its own `node_modules`.

## Apps

- `apps/emi-calculator`
- `apps/converter`
- `apps/random-name-generator`

## URL Structure

The site root (`/`) serves a landing index page with links to all apps.
Each app is served under its own subdirectory:

- `/emi-calculator/`
- `/converter/`
- `/random-name-generator/`

## Local Development

Run a specific app in dev mode:

- `npm run dev:emi`
- `npm run dev:converter`
- `npm run dev:names`

## Build for Netlify

Run:

`npm run build`

The build script will:

1. Install dependencies inside each app folder.
2. Build each app.
3. Copy outputs into root `dist/` as subdirectories.
4. Copy the root `index.html` as the landing page.

Netlify config is in `netlify.toml` with:

- Build command: `npm run build`
- Publish directory: `dist`
