# QR Code Generator (React + Vite)

This project is a customizable QR code generator built with React and Vite.

## Features

- Generate QR codes for `URL`, `Text`, `Email`, `Phone`, and `SMS`
- Customize `Title`, `Frame`, `Color`, `Subtext`, `Style`, `Padding width`, and `Border`
- Download QR codes in `png`, `svg`, or `jpg`
- Download filename rule:
  - `title.<format>` when title exists
  - `<domain>.<format>` when title is empty and QR content is a valid URL

## Local development

1. Install dependencies:

```bash
npm install
```

2. Run the dev server:

```bash
npm run dev
```

3. Build production output:

```bash
npm run build
```

4. Preview production build locally:

```bash
npm run preview
```

## Deploy to Netlify (Dashboard)

The project includes `netlify.toml` with:

- Build command: `npm run build`
- Publish directory: `dist`
- SPA redirect to `index.html`

Steps:

1. Push this project to GitHub/GitLab/Bitbucket.
2. In Netlify, click `Add new site` → `Import an existing project`.
3. Select your repository.
4. Netlify should auto-detect settings from `netlify.toml`.
5. Click `Deploy site`.

## Deploy to Netlify (CLI)

1. Install Netlify CLI:

```bash
npm install -g netlify-cli
```

2. Login:

```bash
netlify login
```

3. Build the app:

```bash
npm run build
```

4. Deploy draft:

```bash
netlify deploy
```

5. Deploy to production:

```bash
netlify deploy --prod
```
