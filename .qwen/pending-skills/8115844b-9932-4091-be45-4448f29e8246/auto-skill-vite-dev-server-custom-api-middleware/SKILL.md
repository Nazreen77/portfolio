---
name: vite-dev-server-custom-api-middleware
description: Add custom API endpoints to Vite dev server using configureServer middleware
source: auto-skill
extracted_at: '2026-07-15T11:07:58.392Z'
---

# Vite Dev Server Custom API Middleware

## Problem

You need to serve custom API endpoints (e.g. file writes, build triggers) during development, but Vite's dev server doesn't expose a way to add routes by default.

## Solution: configureServer middleware

Use a custom Vite plugin with `configureServer` to intercept requests on the dev server:

```js
import { defineConfig } from 'vite'
import fs from 'node:fs'
import { exec } from 'node:child_process'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [
    // ... other plugins
    {
      name: 'my-api-plugin',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.method === 'POST' && req.url === '/api/my/endpoint') {
            let body = ''
            req.on('data', chunk => { body += chunk.toString() })
            req.on('end', () => {
              try {
                const payload = JSON.parse(body)
                // ... handle request
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ success: true }))
              } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ error: err.message }))
              }
            })
          } else {
            next()
          }
        })
      },
    },
  ],
})
```

## Critical Gotchas

### 1. Import Node modules at top level — never use `await import()`

```js
// WRONG — build fails: "await is not valid in this context"
configureServer(server) {
  const fs = await import('node:fs')
  // ...
}

// RIGHT — import at module top level
import fs from 'node:fs'
import { exec } from 'node:child_process'
```

### 2. Always call `next()` for non-matching routes

Forgetting `next()` causes all unmatched requests (including asset loads) to hang because the middleware never passes them to the next handler.

### 3. Read the full request body before processing

HTTP request bodies arrive as streams. Accumulate chunks in a `data` event handler, then process in the `end` event:

```js
let body = ''
req.on('data', chunk => { body += chunk.toString() })
req.on('end', () => { /* process body */ })
```

### 4. Path validation for file writes

When writing files, always validate the path to prevent directory traversal attacks:

```js
const targetDir = resolve(process.cwd(), 'content')
const filePath = resolve(process.cwd(), 'content', fileName)
if (!filePath.startsWith(targetDir)) {
  res.writeHead(400)
  res.end(JSON.stringify({ error: 'Invalid file' }))
  return
}
```

## Why This Works

Vite's dev server is built on `connect`, which uses a middleware chain. The `configureServer` callback receives the connect app, letting you register custom middleware that runs before Vite's own handlers.

## Production Note

This only works in **dev mode**. The `configureServer` callback is ignored during `vite build`. For production, deploy a separate backend or use a serverless function.
