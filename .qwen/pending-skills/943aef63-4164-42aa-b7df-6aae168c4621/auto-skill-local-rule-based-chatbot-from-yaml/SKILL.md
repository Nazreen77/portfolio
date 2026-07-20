---
name: local-rule-based-chatbot-from-yaml
description: Build a 100% client-side chatbot that answers questions from portfolio YAML content with zero external dependencies
source: auto-skill
extracted_at: '2026-07-15T10:18:23.414Z'
---

# Local Rule-Based Chatbot from YAML Content

## Problem

User wants a portfolio chatbot that answers questions about skills, experience, projects, etc., but **refuses to let personal data leave the browser** — no LLM API calls, no WebLLM downloads, no server.

## Solution: Keyword-Matching Engine + YAML Data Source

### Architecture

Two files, both 100% client-side:

1. **`src/utils/chatbotEngine.js`** — Pure JS engine (no React imports):
   - `TOPICS` object maps topic names to keyword arrays
   - `detectTopic(query)` normalizes input and finds the first matching topic
   - `generateAnswer(query, content)` reads from YAML content and returns formatted text
   - `QUICK_QUESTIONS` array for clickable starter chips

2. **`src/components/ChatBot.jsx`** — UI component:
   - Floating bubble button (bottom-right) with Framer Motion hover/tap animations
   - Chat window with `AnimatePresence` for open/close transitions
   - Typing indicator (3 bouncing dots with staggered delays)
   - Quick question chips shown on first open
   - `setTimeout` delay (400ms–1200ms based on query length) for realistic typing feel

### Key Pattern: Keyword Matching

```js
function normalize(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim()
}

function matchesQuery(query, keywords) {
  const normalized = normalize(query)
  return keywords.some(keyword => normalized.includes(normalize(keyword)))
}
```

Normalization strips punctuation before comparison, so "What are your skills?" matches keyword "skill".

### Key Pattern: Answer Generation from Content

The `generateAnswer` function receives the full `content` object from `useContent()` and builds responses dynamically:

```js
case 'skills':
  const allSkills = (skills.categories || []).flatMap(cat =>
    cat.skills.map(s => `${s.name} (${s.level}%)`)
  )
  return `${name} has expertise in:\n\n${allSkills.slice(0, 8).join('\n')}`
```

This means the chatbot answers **always stay in sync** with the portfolio content — edit YAML, and the bot knows the new data.

### Topic Categories (16 total)

greeting, about, skills, frontend, backend, devops, experience, projects, education, certifications, achievements, contact, availability, thanks, help, and a default fallback.

### Build Pitfall: Embedded Quotes in Long Strings

When writing long strings with embedded quotes (e.g. `"Tell me about yourself"`) inside single-quoted JS literals via `write_file`, Vite build can fail with "Unterminated string". **Fix:** use an array with `.join('\n')` instead:

```js
const HELP_RESPONSE = [
  'You can ask me about:',
  '• **About** — Tell me about yourself',
].join('\n')
```

### Integration

Place `<ChatBot />` inside `ContentProvider` in App.jsx so it has access to the YAML content via `useContent()`.

### Why

- Zero external API calls — fully static, deployable to GitHub Pages
- Answers are always accurate since they pull from the same YAML the rest of the site uses
- No heavy model downloads — the entire bundle adds ~10KB
- User privacy preserved — no personal data leaves the browser
