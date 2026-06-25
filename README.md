# Rootwise

**Your nature, by season.**

Rootwise reads your birth chart through **八字象法** (the "image method") — an old, grounded
way of reading the Chinese four pillars. It keeps the same Bazi calculation, but trades
fortune-telling for something closer to ecology and psychology: each person is a living
thing in nature (a tree, the sun, a river, gentle rain), born into a particular season,
with conditions that help them flourish.

This is a space for self-understanding, not a prediction of fortune, luck, or destiny.

## Run locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Run the app:
   `npm run dev`  (http://localhost:3000)

No API keys or backend required — the chart is computed client-side with
[`tyme4ts`](https://www.npmjs.com/package/tyme4ts).

## How it works

- `services/baziService.ts` — computes the four pillars, day master, hidden stems,
  element scores, and life cycles (大运).
- `content/xiangfa/` — the curated 象法 content model: ten natural-image profiles
  (one per day master), seasonal climate readings, and the mapping from a chart to a
  reading (`buildXiangfaReading`).
- `components/result/` — the reading experience: Your Nature, the Season You Were Born
  Into, What Helps You Grow, Your Inner Climate, and the four pillars.
