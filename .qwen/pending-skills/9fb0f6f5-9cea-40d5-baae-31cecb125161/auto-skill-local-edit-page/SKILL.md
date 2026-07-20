---
name: local-edit-page
description: PIN-protected /edit page for editing portfolio YAML content via forms instead of raw YAML
source: auto-skill
extracted_at: '2026-07-15T17:00:00.000Z'
---

# Local Edit Page — Form-Based Content Editor

## Problem

The user found raw YAML editing too difficult, rejected CMS (Decap/Netlify) due to privacy concerns about GitHub OAuth exposing credentials to third-party servers, and wanted a simpler way to update portfolio content (skills, projects, experience, etc.).

## Solution

A PIN-protected `/edit` page built into the portfolio itself. Works only during local development (`npm run dev`), disabled on production.

### Architecture

1. **`.env.local`** — stores `EDIT_PIN` (gitignored via `*.local` pattern in `.gitignore`)
2. **Vite plugin** (`vite-plugin-edit.js`) — exposes a `/api/edit` endpoint during dev for reading/writing `public/content/*.yaml` files
3. **EditPage component** — PIN login screen, then tabbed forms for each content section
4. **Route registration** in `App.jsx` — only renders in `import.meta.env.DEV` mode

### Key design decisions

- **PIN check is client-side** — sufficient for local-only use; no one can access it on production because the route doesn't exist in the build
- **Writes to `public/content/`** — the folder Vite copies to `dist/`, so changes take effect on next build
- **Uses `yaml` package** (already a dependency) for serialization — avoids manual YAML formatting
- **Build button** triggers `npm run build` via the Vite plugin API

### Content files structure

All content lives under `public/content/`:
- `settings.yaml` — name, title, email, social links, resume
- `about.yaml` — summary, bio, stats
- `skills.yaml` — categories with skill name + level (0-100)
- `projects.yaml` — title, description, technologies, category, URLs
- `experience.yaml` — company, role, period, description, technologies
- `certifications.yaml` — name, issuer, date, credential ID, URL
- `education.yaml` — degree, school, period, GPA, description
- `achievements.yaml` — title, description, date, icon

### Production safety

- The edit route only renders when `import.meta.env.DEV` is true
- In production build, the EditPage component is never included
- The `.env.local` file is never deployed (gitignored)
- Even if someone guesses the PIN, the `/edit` route won't exist on GitHub Pages

### User rejected concerns

- **GitHub OAuth**: "git auth expose data to others server 3partey" — user fears credential exposure
- **Private repo**: User also wants the GitHub repo itself to be private so no one can download the code
- **CMS removed entirely**: No admin button, no lock icon, no decap-server dependency needed
