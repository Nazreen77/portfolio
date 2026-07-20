---
name: yaml-serializer-for-react-editors
description: Custom toYaml/formatValue/scalar triplet for serializing JS objects to YAML in browser-based editors, with proper array dash prefix
source: auto-skill
extracted_at: '2026-07-15T12:58:58.552Z'
---

# Custom YAML Serializer for Browser-Based React Editors

## Problem

You need a lightweight YAML serializer to write YAML files from a React form (e.g. a local `/edit` page) without adding a heavy YAML library as a write-time dependency. The built-in `yaml` package can parse YAML but serializing requires a custom function.

## Solution

Three cooperating functions in `EditPage.jsx`:

```js
function toYaml(data, indent = 0) {
  const pad = '  '.repeat(indent)
  let out = ''
  const entries = Object.entries(data)
  for (const [key, value] of entries) {
    if (Array.isArray(value)) {
      out += `${pad}${key}:\n`
      for (const item of value) {
        if (typeof item === 'object' && item !== null) {
          const itemEntries = Object.entries(item)
          out += `${pad}- ${itemEntries[0][0]}: ${formatValue(itemEntries[0][1], indent + 2)}\n`
          for (let j = 1; j < itemEntries.length; j++) {
            const [k, v] = itemEntries[j]
            out += `${pad}  ${k}: ${formatValue(v, indent + 2)}\n`
          }
        } else {
          out += `${pad}- ${scalar(item)}\n`
        }
      }
    } else if (typeof value === 'object' && value !== null) {
      out += `${pad}${key}:\n${toYaml(value, indent + 1)}`
    } else {
      out += `${pad}${key}: ${scalar(value)}\n`
    }
  }
  return out
}

function formatValue(v, indent) {
  const pad = '  '.repeat(indent)
  if (Array.isArray(v)) {
    let out = '\n'
    for (const item of v) {
      if (typeof item === 'object' && item !== null) {
        const itemEntries = Object.entries(item)
        out += `${pad}- ${itemEntries[0][0]}: ${formatValue(itemEntries[0][1], indent + 2)}\n`
        for (let j = 1; j < itemEntries.length; j++) {
          const [k, iv] = itemEntries[j]
          out += `${pad}  ${k}: ${formatValue(iv, indent + 2)}\n`
        }
      } else {
        out += `${pad}- ${scalar(item)}\n`
      }
    }
    return out.replace(/\n$/, '')
  }
  if (typeof v === 'object' && v !== null) {
    return '\n' + toYaml(v, indent + 1)
  }
  return scalar(v)
}

function scalar(v) {
  if (v === true) return 'true'
  if (v === false) return 'false'
  if (Array.isArray(v)) return '[' + v.map(scalar).join(', ') + ']'
  if (typeof v === 'number') return String(v)
  if (typeof v !== 'string') return String(v)
  // quote strings that could be misinterpreted
  if (v === '' || v === 'true' || v === 'false' || /^[\d.]+$/.test(v) || v.includes(':') || v.includes('#') || v.includes("'") || v.includes('"')) {
    return '"' + v.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"'
  }
  return v
}
```

## Key Pitfalls

### 1. Missing `- ` dash prefix for array items

**Bug:** Array items that are objects were serialized without the `- ` dash prefix, causing the YAML parser to see duplicate map keys (e.g., `Map keys must be unique at line 20`).

**Fix:** Always emit `- ` before the first key of each array object item:
```js
// Wrong (causes "Map keys must be unique"):
// categories:
//   name: Backend       ← treated as map key
//   name: Frontend      ← duplicate key!

// Correct:
// categories:
//   - name: Backend     ← proper array item
//     skills:
//       - name: Java
//         level: 95
//   - name: Frontend
```

Both `toYaml()` (top-level arrays) AND `formatValue()` (nested arrays like `skills` inside categories) need the `- ` prefix logic.

### 2. `Object.entries()` is not an iterator

**Bug:** Calling `.next()` on `Object.entries()` return value throws `Object.entries(...).next is not a function`.

**Fix:** `Object.entries()` returns an array, not an iterator. Store the result and index into it:
```js
const itemEntries = Object.entries(item)
// Use itemEntries[0][0], itemEntries[0][1], etc.
// NOT entries.next().value
```

### 3. Defensively normalize data that might be object vs array

**Bug:** `items.map is not a function` when the YAML file contains a single object instead of an array.

**Fix:** Normalize in the editor component:
```js
const normalize = (d) => Array.isArray(d) ? d : (d && typeof d === 'object' ? [d] : [])
```

### 4. `useEffect` dependency on whole parent object

**Bug:** `useEffect(() => { setCategories(data.categories) }, [data])` doesn't fire when `data.categories` loads later because `data` starts as `{}`.

**Fix:** Depend on the specific nested property:
```js
useEffect(() => {
  if (data?.categories && Array.isArray(data.categories)) setCategories(data.categories)
}, [data?.categories])
```

## When to use

- Local edit pages that write YAML files via Vite dev-server middleware
- Any browser-based form that needs to serialize JS objects to YAML without a library
- Nested structures (e.g., categories → skills, experience → items)

## When NOT to use

- Production deployments (use the `yaml` library's `. stringify()` or a proper CMS)
- Complex YAML with anchors, multi-line blocks, or custom tags (this serializer handles flat key-value + arrays only)
