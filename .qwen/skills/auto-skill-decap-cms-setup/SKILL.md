---
name: decap-cms-setup
description: Decap CMS was removed; use the /edit local form-based editor instead
source: auto-skill
extracted_at: '2026-07-15T10:57:40.079Z'
updated_at: '2026-07-15T17:00:00.000Z'
---

# CMS Removed — Use /edit Page Instead

## Current State

Decap CMS was **removed** from this project in July 2026. The admin panel, lock icon button, and GitHub OAuth approach were all discarded.

**Why:** User rejected GitHub OAuth for CMS (privacy concerns about exposing credentials to third-party servers) and also found raw YAML editing too difficult. The user wanted a simpler, fully local editing experience.

**Solution:** A PIN-protected `/edit` page was built as a replacement. It provides form-based editing for all portfolio content (skills, projects, experience, etc.) and writes directly to YAML files. Only works in dev mode (`import.meta.env.DEV`), so it's disabled on production (GitHub Pages).

## What was removed

- `cms/config.yml` — no longer needed
- `public/admin/index.html` — no longer needed
- Admin lock icon button from Header.jsx
- `FiLock` import, `useContent` hook from Header
- Header logo was `initials` derived from settings, reverted to "Portfolio"

## What remains

- `decap-server` in `devDependencies` (can be removed if desired)
- `npm run cms` script in `package.json` (can be removed if desired)

## The /edit page approach

- PIN stored in `.env.local` (gitignored via `*.local` pattern)
- Forms for: skills, projects, experience, about, certifications, education, achievements, settings
- Save writes to `public/content/*.yaml` (and syncs to `content/`)
- Build button runs `npm run build` via `/api/edit/build` endpoint
- Only accessible in dev mode — production build has no edit route
- Custom `toYaml()` serializer handles nested arrays (e.g. skills inside categories) — see skill `yaml-serializer-for-react-editors`

## Known bugs fixed

1. `Object.entries().next()` — Object.entries returns an array, not an iterator; store result and index into it
2. `scalar()` flattening nested arrays — skills inside categories were serialized as inline strings; `formatValue()` handles recursion
3. Education YAML `items` was a single object, not an array — `.map()` crashed; normalize defensively in ListItemEditor
4. `useEffect` depending on whole `data` object — depend on `data?.categories` instead so it fires when the nested array loads

## If you ever need to re-add Decap CMS

The old approach used CDN loading (not npm) to avoid React 19 peer dependency conflicts. Key files were:
- `public/admin/index.html` with `<script>` CDN + `CMS.init()`
- `public/admin/config.yml` mirrored from `cms/config.yml`

But the current `/edit` page is the preferred approach for this project.
