# Multi-App Netlify Setup

This project is structured as a collection of independent apps under `apps/`.
Each app has its own `package.json` and its own `node_modules`.

## Apps

- `apps/emi-calculator`
- `apps/converter`
- `apps/random-name-generator`
- `apps/qr-code-generator`

## URL Structure

The site root (`/`) serves a landing index page with links to all apps.
Each app is served under its own subdirectory:

- `/emi-calculator/`
- `/converter/`
- `/random-name-generator/`
- `/qr-code-generator/`

## Local Development

Run a specific app in dev mode:

- `npm run dev:emi`
- `npm run dev:converter`
- `npm run dev:names`
- `npm run dev:qr`

## Build for Netlify

Run:

`npm run build`

The build script will:

1. Install dependencies inside each app folder.
2. Build each app.
3. Copy outputs into root `dist/` as subdirectories.
4. Copy the root `index.html` as the landing page.
5. Copy `robots.txt` and `sitemap.xml` into `dist/` (if present).

## Add a New App

Use this checklist to add a new app (example slug: `my-new-app`):

1. Create app folder

   - Add a new Vite app at `apps/my-new-app`.
   - Ensure it has `index.html`, `src/main.jsx`, `src/App.jsx`, and `vite.config.js`.
   - In `vite.config.js`, set:

   `base: '/my-new-app/'`

2. Add app to root scripts (`package.json`)

   - Update `install:apps` to include:

   `npm install --prefix apps/my-new-app`

   - Add a dev script (optional but recommended), for example:

   `"dev:mynewapp": "npm run dev --prefix apps/my-new-app"`

3. Register app in build pipeline (`scripts/build-netlify.mjs`)

   - Add a new entry to the `apps` array:

   `{ slug: 'my-new-app', dir: resolve(projectRoot, 'apps/my-new-app') }`

4. Add app to landing page (`index.html`)

   - Add one new card in the app grid with:
     - title link to `/my-new-app/`
     - icon
     - short description
     - tags

5. Update SEO routes

   - Add app URL to `sitemap.xml`:

   `https://cybercafe.app/my-new-app/`

   - Add app metadata in `apps/my-new-app/index.html`:
     - `<title>`
     - `description`
     - `canonical`
     - Open Graph / Twitter tags
     - JSON-LD (`WebApplication`)

6. Run and verify

   - Install app deps:

   `npm run install:apps`

   - Build everything:

   `npm run build`

   - Serve and test:

   `npx serve dist -l 5500`

   - Open `http://localhost:5500/` and verify new app route works.

Netlify config is in `netlify.toml` with:

- Build command: `npm run build`
- Publish directory: `dist`
