---
name: react-icon-availability-check
description: Verify react-icons exports exist before importing them
source: auto-skill
extracted_at: '2026-07-13T10:52:28.976Z'
---

# React Icons Availability Check

## Problem

Icon names don't always exist. E.g. `FiGraduationCap` and `FiTrophy` are missing from Feather set.

## How to Check

```bash
grep -o "Fi[A-Z][a-zA-Z]*" node_modules/react-icons/fi/index.mjs | grep -i "keyword" | sort -u
```

## Common Alternatives

| Missing | Use Instead |
|---|---|
| `FiGraduationCap` | `FiBookOpen` |
| `FiTrophy` | `FiStar` or `FiAward` |

## Why

Build failures from missing exports are only caught at build time.
