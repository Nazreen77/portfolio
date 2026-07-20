---
name: tailwind-v4-class-dark-mode
description: Enable class-based dark mode in Tailwind v4 with @custom-variant directive
source: auto-skill
extracted_at: '2026-07-13T18:05:00.000Z'
---

# Tailwind v4 Class-Based Dark Mode

## Problem

Tailwind v4 defaults to `media` dark mode strategy (responds only to `prefers-color-scheme`). When you use a custom theme toggle that adds/removes a `.dark` class on `<html>`, all `dark:` utility classes (e.g. `dark:bg-gray-900`) do nothing.

## Solution

### Step 1 — Add `@custom-variant` in your CSS config

In your main CSS file (where you `@import "tailwindcss"`):

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));
```

This overrides Tailwind's default `dark:` variant from `@media (prefers-color-scheme: dark)` to a class-based selector.

### Step 2 — Respect stored theme on page load

In `index.html`, add a synchronous script **before** the React root to apply the theme class immediately (prevents flash):

```html
<body>
  <script>
    if (localStorage.getItem('theme') !== 'dark') document.documentElement.classList.remove('dark')
  </script>
  <div id="root"></div>
</body>
```

### Step 3 — React theme hook

```jsx
useEffect(() => {
  const root = document.documentElement
  if (theme === 'dark') root.classList.add('dark')
  else root.classList.remove('dark')
  localStorage.setItem('theme', theme)
}, [theme])
```

## Why

Tailwind v4 removed the `tailwind.config.js` `darkMode: 'class'` option. The new v4 config system uses CSS-native `@custom-variant` instead. Without this directive, `dark:` utilities compile to `@media (prefers-color-scheme: dark)` rules, ignoring any `.dark` class you toggle.

## Note

If your CSS also uses `@media (prefers-color-scheme: dark)` for non-Tailwind styles, those will still respond to system preference. Remove or replace them if you want fully class-controlled dark mode.

## Troubleshooting: `dark:` classes not applying despite correct setup

If `dark:` utilities don't apply even though `@custom-variant` is present and `<html class="dark">` is correct:

### 1. Check for stale CSS files overriding Tailwind

Old CSS files (e.g. a leftover `src/index.css` with `#root { color: var(--text) }`) can override Tailwind classes through higher specificity. **Only** the CSS file imported in `main.jsx` (e.g. `src/styles/index.css`) gets Tailwind processing. Any other CSS file referenced or auto-loaded will compete in the cascade.

Fix: remove unused CSS files or ensure they don't set `color`/`text-align` on `#root` or other parent elements.

### 2. CSS variable resolution

Tailwind `dark:text-gray-100` compiles to `color: var(--color-gray-100)`. If the `--color-gray-100` custom property isn't defined or resolves to `transparent`/same-as-background, text appears invisible even though DevTools shows `value="text"`.

Fix: use inline `style={{ color: '#f3f4f6' }}` as a temporary workaround to confirm it's a CSS issue, then trace which CSS variable is failing.

### 3. `#root` text-align interference

If `#root { text-align: center }` is set (e.g. from a template's global styles), it affects all child inputs. Add `text-left` to input containers or override at the component level:

```jsx
<div className="... text-left">
  <input className="..." />
</div>
```

### 4. Browser cache of old Vite HMR bundle

After CSS changes, hard-refresh (Ctrl+Shift+R) to ensure the browser isn't using a cached JS bundle that references old class names.
