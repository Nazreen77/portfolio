---
name: framer-motion-animatepresence-react-19-fix
description: Fix AnimatePresence exit animations not triggering in React 19 + Framer Motion v12
source: auto-skill
extracted_at: '2026-07-13T11:06:05.342Z'
---

# Framer Motion AnimatePresence Fix for React 19

## Problem

`<AnimatePresence>` with conditional rendering (`{show && <motion.div>}`) does not trigger exit animations in React 19 + Framer Motion v12. The component stays stuck on screen because React 19's new rendering behavior doesn't properly wait for the child to unmount.

Even the intermediate fix — replacing `AnimatePresence` with `return null` + `animate={{ opacity: 0 }}` on a `motion.div` — still leaves visual artifacts on screen because the motion component's internal animation state persists even when React unmounts.

## Fixed Pattern

Replace `AnimatePresence` + `motion.div` with early return + **plain div** for simple show/hide, or use `motion.div` with `animate={{ opacity: 0 }}` fade-out for smoother dismiss:

```jsx
if (!show) return null

return (
  <div
    className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-950"
    style={{ pointerEvents: 'auto' }}
  >
    Content
  </div>
)
```

### With animated fade-out (updated pattern)

For a smoother dismissal, wrap in `motion.div` with a delayed opacity animation:

```jsx
if (!show) return null

return (
  <motion.div
    className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-950"
    style={{ pointerEvents: 'auto' }}
    animate={{ opacity: 0 }}
    transition={{ duration: 0.3, delay: 1.2 }}
  >
    <motion.div
      animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      className="w-4 h-4 rounded-full bg-gradient-to-r from-primary via-purple to-accent"
    />
  </motion.div>
)
```

This works because `return null` unmounts the component, and Framer Motion still runs the `animate` transition on the `motion.div` before the parent returns null. The delay (1.2s) ensures the fade happens just before the timer (1.5s) triggers `setShow(false)`.

### Key differences

1. **`return null`** — unmounts the component completely
2. **Plain `<div>` for inner content** — framer-motion internal state can keep stale overlays visible; a regular div disappears instantly when unmounted
3. **No `pointerEvents: 'none'` trick needed** — the component is fully removed from the DOM, not faded in-place
4. **No `AnimatePresence` wrapper** — it's unnecessary when using the return null pattern
5. **Animated loading indicator** — use a pulsing dot with `scale` + `opacity` keyframes instead of hardcoded text/initials

## When AnimatePresence *Does* Work

Using `AnimatePresence mode="wait"` with a `key`-driven `<motion.div>` works for **section transitions** (swapping content panels), not for overlay show/hide:

```jsx
<AnimatePresence mode="wait">
  <motion.div
    key={activeSection}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.2 }}
  >
    {SectionComponent && <SectionComponent />}
  </motion.div>
</AnimatePresence>
```

This works because the `key` change forces a full remount, and `mode="wait"` ensures the exit completes before the enter starts.

## Why

React 19 changed how conditional children are reconciled. `AnimatePresence` relies on delayed unmounting which conflicts with React 19's synchronous cleanup. Additionally, `motion.div` with `animate={{ opacity: 0 }}` fades but never unmounts unless wrapped in `AnimatePresence`, creating a catch-22 where the overlay is invisible but still blocking interaction.
