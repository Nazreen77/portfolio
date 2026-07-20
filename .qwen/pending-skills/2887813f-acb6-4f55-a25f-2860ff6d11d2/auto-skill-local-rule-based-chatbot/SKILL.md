---
name: local-rule-based-chatbot
description: Build a 100% local rule-based chatbot for a static portfolio — no server, no LLM, no data leaves the browser
source: auto-skill
extracted_at: '2026-07-15T10:35:00.000Z'
---

# Local Rule-Based Chatbot for Static Portfolios

## Problem

User wants a portfolio chatbot that answers questions about skills, experience, projects, etc., but **refuses any solution that sends personal data to an external server or LLM**.

## Solution: Keyword-Matching Engine + YAML Data

### Architecture

1. **Knowledge engine** (`utils/chatbotEngine.js`) — reads from the same YAML content files the portfolio uses, matches user queries against keyword arrays, returns formatted answers
2. **Chat UI** (`components/ChatBot.jsx`) — floating bubble, chat window, typing indicator, quick-question chips, all powered by Framer Motion
3. **Zero network calls** — everything runs client-side in the browser

### Topic Detection

Define topics with keyword arrays. Match using `includes()` on normalized (lowercased, punctuation-stripped) input:

```js
const TOPICS = {
  skills: {
    keywords: ['skill', 'technology', 'tech', 'specialize', 'framework'],
  },
  experience: {
    keywords: ['experience', 'years', 'worked', 'career', 'company'],
  },
  // ... more topics
}

function normalize(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim()
}

function matchesQuery(query, keywords) {
  const normalized = normalize(query)
  return keywords.some(keyword => normalized.includes(normalize(keyword)))
}
```

### Answer Generation

Use `switch` on detected topic, pull data from YAML content, format as plain text with markdown-like bold (`**text**`):

```js
export function generateAnswer(query, content) {
  const topic = detectTopic(query)
  // switch on topic, read from content.skills, content.experience, etc.
  return formattedResponse
}
```

### Chat UI Pattern

- Floating bubble (bottom-right) with message icon
- AnimatePresence chat window (opens on click)
- Fake typing delay proportional to question length (400ms–1200ms)
- Quick-question chips shown on empty state
- `whitespace-pre-wrap` on message bubbles for multi-line answers

### String Escaping in Vite Builds

Vite/Rolldown may fail on Unicode characters (•, —) inside single-quoted strings. Use `\u2022` for bullet and `\u2014` for em dash, or build strings with `.join('\n')` from arrays.

## Why

Fully local — no API keys, no rate limits, no privacy concerns. The user explicitly rejected WebLLM and Gemini API. Answers are always accurate because they come from the same YAML data driving the portfolio.

## How to Apply

- Create `chatbotEngine.js` with topic keywords + answer generation
- Create `ChatBot.jsx` with floating bubble + chat window
- Pass `content` from `useContent()` hook into `generateAnswer()`
- Add fake typing delay for realism
- Works on GitHub Pages, Vercel, Netlify — zero backend needed
