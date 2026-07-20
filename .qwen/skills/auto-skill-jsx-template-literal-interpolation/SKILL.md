---
name: jsx-template-literal-interpolation
description: Interpolate JavaScript variables inside <code>/<pre> blocks in JSX
source: auto-skill
extracted_at: '2026-07-13T12:55:32.545Z'
---

# JSX Template Literal Interpolation

## Problem

Wrapping a template literal in JSX braces renders `${variable}` as literal text instead of interpolating:

```jsx
{/* WRONG — renders as literal "${name}..." */}
<code>
  {`const dev = { name: "${name}..." }`}
</code>
```

## Solution: Build the string outside JSX

Construct the interpolated string as a JavaScript variable before the `return`:

```jsx
const firstName = settings.name?.split(' ')[0] || 'A'
const codeSnippet = [
  'const developer = {',
  `  name: "${firstName}...",`,
  '  skills: ["React", "Node.js"],',
  '};',
].join('\n')

// In JSX:
<pre>
  <code>{codeSnippet}</code>
</pre>
```

## Why Not `dangerouslySetInnerHTML`

`dangerouslySetInnerHTML` works for interpolation but **breaks JSX structure** — the `<code>` tag becomes self-closing (`<code />`), leaving `<pre>` unclosed and cascading into multiple JSX parse errors:

```jsx
{/* BROKEN — </pre> and </code> are missing, causing cascading parse errors */}
<pre>
  <code dangerouslySetInnerHTML={{ __html: `...` }} />
</pre>
```

The array `.join('\n')` approach avoids this entirely — the string is fully evaluated by JavaScript before reaching JSX, and `<code>` renders normally with a text child.

## Security Note

Only interpolate **trusted data**. If the variable comes from user input, sanitize it first.
