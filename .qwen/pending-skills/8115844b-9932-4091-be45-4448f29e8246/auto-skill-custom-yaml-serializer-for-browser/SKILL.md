---
name: custom-yaml-serializer-for-browser
description: Custom toYaml() serializer to avoid yaml package browser build issues
source: auto-skill
extracted_at: '2026-07-15T11:07:58.392Z'
---

# Custom YAML Serializer for Browser

## Problem

The `yaml` npm package's browser build does not export `dump`. This causes runtime errors when you try to serialize JavaScript objects to YAML strings in the browser:

```js
import { dump } from 'yaml'
// Error: "dump is not exported by node_modules/yaml/dist/esm/index.js"
```

## Solution: Write a simple toYaml() serializer

For flat or lightly-nested data (like portfolio content), a custom serializer avoids the dependency entirely:

```js
function toYaml(data) {
  const lines = []

  if (Array.isArray(data)) {
    data.forEach((item, i) => {
      lines.push(`- ${item.title || item.name || 'Item ' + (i + 1)}`)
      if (item.description) {
        lines.push(`  description: ${quoteIfNeeded(item.description)}`)
      }
      if (item.url) {
        lines.push(`  url: ${item.url}`)
      }
      if (item.level) {
        lines.push(`  level: ${item.level}`)
      }
      // add more fields as needed
    })
  } else if (typeof data === 'object') {
    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        lines.push(`${key}:`)
        value.forEach(item => {
          lines.push(`  - ${item}`)
        })
      } else {
        lines.push(`${key}: ${quoteIfNeeded(String(value))}`)
      }
    })
  }

  return lines.join('\n')
}

function quoteIfNeeded(value) {
  if (!value) return value
  const needsQuote = /[,:{}[\]#&*!|>?'"%@`]/.test(value) ||
    value.startsWith(' ') || value.endsWith(' ') ||
    value === 'true' || value === 'false' ||
    !isNaN(value)
  return needsQuote ? `"${value.replace(/"/g, '\\"')}"` : value
}
```

## When to Use This

- Your YAML structure is simple (flat objects, arrays of objects with known fields)
- You need browser-side serialization (no Node `fs` available)
- You want to avoid bundling the `yaml` package in a browser build

## When NOT to Use This

- Complex nested YAML with anchors, aliases, or multi-line blocks
- Unstructured data where you don't know the schema ahead of time
- Server-side code — just use the `yaml` package there normally

## Why

The `yaml` package uses ES module exports that don't include `dump` in the browser-optimized build. The full Node build includes it, but bundlers like Vite pick the ESM version for browser targets, which omits the function.
