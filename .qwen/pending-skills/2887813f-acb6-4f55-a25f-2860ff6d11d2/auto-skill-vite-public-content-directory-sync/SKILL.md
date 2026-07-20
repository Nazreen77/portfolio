---
name: vite-public-content-directory-sync
description: Vite copies public/ to dist/ — edit YAML content in public/content/, not the source content/ directory
source: auto-skill
extracted_at: '2026-07-15T10:35:00.000Z'
---

# Vite Content Directory Sync Pitfall

## Problem

This portfolio has **two copies** of the content directory:

| Path | Purpose |
|---|---|
| `content/` | Development source of truth (read by Decap CMS config, git-tracked) |
| `public/content/` | Copied by Vite into `dist/content/` at build time — this is what the running app fetches |

When you edit `content/about.yaml` and run `npm run build`, the changes **do not appear** in the built output because Vite only copies `public/` → `dist/`.

## Solution

**Always edit files in `public/content/`**, then sync `content/` to match:

```
public/content/  ← primary (served at runtime, copied to dist/)
content/         ← secondary (Decap CMS config reference, git source)
```

Or use a build-step script to copy `content/` → `public/content/` before building.

## Why

Vite's `public/` directory is a static assets folder — everything inside gets copied verbatim to `dist/`. The app fetches content via `fetch('/content/about.yaml')`, which resolves to `dist/content/about.yaml` in production and `public/content/about.yaml` in dev. The root `content/` directory is not part of the Vite build pipeline.

## How to Apply

- When updating portfolio content (skills, about, experience, etc.), edit `public/content/*.yaml` first
- Then copy the same changes to `content/*.yaml` to keep both in sync
- After editing, always rebuild: `npm run build`
