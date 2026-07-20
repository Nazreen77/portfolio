---
name: yaml-serializer-for-react-editors
description: Custom YAML serializer for React form-based editors that must handle nested arrays and objects without external dump libraries
source: auto-skill
extracted_at: '2026-07-15T11:22:34.320Z'
---

# Custom YAML Serializer for React Editors

## Problem

When building a React form-based editor that writes to YAML files, you can't use `yaml.dump()` in the browser because the `yaml` npm package's browser build doesn't export `dump`. You need a lightweight custom serializer that handles nested arrays and objects correctly.

## Approach

Two functions: `toYaml()` for the top-level object, and `formatValue()` for handling nested values (especially arrays inside objects inside arrays).

### Key Pitfalls Avoided

1. **`Object.entries()` returns an array, not an iterator** — calling `.next()` on it returns `undefined`. Always store the result and index into it: `const entries = Object.entries(obj); entries[0][0]`.

2. **`scalar()` flattens arrays to inline strings** — if you have `{ name: "Backend", skills: [{name:"Java", level:95}] }`, using `scalar()` on the `skills` array produces `"[Java, 95]"` — destroying structure. You need a recursive `formatValue()` that handles nested arrays as proper YAML block lists.

3. **YAML block mapping for list items** — use `  key: value` format (no `-` prefix on the first key) for object items in lists, with subsequent keys indented at the same level. Nested arrays inside those items need their own indented block lists.

### Working Implementation

```javascript
function toYaml(data, indent = 0) {
  const pad = '  '.repeat(indent)
  let out = ''
  const entries = Object.entries(data)
  for (const [key, value] of entries) {
    if (Array.isArray(value)) {
      out += `${pad}${key}:\n`
      for (const item of value) {
        if (typeof item === 'object' && item !== null) {
          out += `${pad}  `
          const itemEntries = Object.entries(item)
          out += `${itemEntries[0][0]}: ${formatValue(itemEntries[0][1], indent + 2)}\n`
          for (let j = 1; j < itemEntries.length; j++) {
            const [k, v] = itemEntries[j]
            out += `${pad}  ${k}: ${formatValue(v, indent + 2)}\n`
          }
        } else {
          out += `${pad}  - ${scalar(item)}\n`
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
        out += `${pad}  - ${itemEntries[0][0]}: ${formatValue(itemEntries[0][1], indent + 2)}\n`
        for (let j = 1; j < itemEntries.length; j++) {
          const [k, iv] = itemEntries[j]
          out += `${pad}    ${k}: ${formatValue(iv, indent + 2)}\n`
        }
      } else {
        out += `${pad}  - ${scalar(item)}\n`
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
  if (v === '' || v === 'true' || v === 'false' || /^[\d.]+$/.test(v) || v.includes(':') || v.includes('#') || v.includes("'") || v.includes('"')) {
    return '"' + v.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"'
  }
  return v
}
```

## Related Bug: useEffect Dependency for Nested Data

When a component receives nested data (e.g. `data.categories`), don't depend on the whole `data` object reference in `useEffect` — depend on the specific nested property:

```javascript
// BAD: fires on every data reference change, even before categories loads
useEffect(() => {
  if (data?.categories) setCategories(data.categories)
}, [data])

// GOOD: fires only when the categories array itself changes
useEffect(() => {
  if (data?.categories && Array.isArray(data.categories)) setCategories(data.categories)
}, [data?.categories])
```

## Related Bug: YAML List vs Object Structure

When YAML `items` is meant to be a list, each entry must have the `-` prefix:

```yaml
# CORRECT (array)
items:
  - degree: "B.Tech"
    school: "University"
  - degree: "M.Tech"
    school: "Another University"

# WRONG (single object — .map() will crash)
items:
  degree: "B.Tech"
  school: "University"
```

In the editor, normalize non-array data defensively:
```javascript
const normalize = (d) => Array.isArray(d) ? d : (d && typeof d === 'object' ? [d] : [])
```
