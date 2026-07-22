# Study Timer

A modern, responsive study timer app for kids. Pick a study mode, run the
circular countdown, and watch it lock with a checkmark once the session is
complete.

**Live demo:** https://study-timer-bheng.vercel.app

## Features

-   **Flat Glass Mode Selector** - a row of frosted-glass icon buttons for each study mode, with the active one enlarged and glowing
-   **Multiple Study Modes** - Reading, Writing, Math, Puzzle, Art, Music, Game (Music and Game start disabled, toggle them on in Settings)
-   **Session Tracking** - a mode locks with a checkmark once its session completes and cannot be re-selected until duration changes
-   **Celebration Effects** - confetti and a two-tone chime when a session completes (confetti is skipped when the OS is set to reduced motion)
-   **Fully Responsive** - works from iPhone 5S to iPad Pro M4, with a custom `lg-land` Tailwind breakpoint (`min-width: 700px` + landscape) that switches the layout from stacked to side-by-side
-   **Dark/Light Mode** - toggle between themes
-   **Customizable Duration** - 5s (test), 1min, 5min, or 15min sessions
-   **Persistent Storage** - name, theme, duration, enabled modes, and completed sessions are saved to `localStorage` and restored on load
-   **No Scrolling** - everything fits on one screen

## Tech Stack

-   **React 19** + **TypeScript** - UI framework
-   **Vite** - build tool
-   **Tailwind CSS v3** - styling
-   **Lucide React** - icons
-   **Vitest** + **React Testing Library** - unit/component tests
-   **localStorage API** - data persistence

## Getting Started

### Prerequisites

Node.js 18+ and npm

### Installation

```bash
git clone https://github.com/bunlongheng/study-timer.git
cd study-timer
npm install
npm run dev
```

## Scripts

| Script             | What it does                                  |
| ------------------ | ---------------------------------------------- |
| `npm run dev`       | starts the dev server on port 3019             |
| `npm run build`     | type-checks and builds a production bundle     |
| `npm run lint`      | runs ESLint                                    |
| `npm test`          | runs the Vitest suite once                     |
| `npm run test:watch`| runs Vitest in watch mode                      |
| `npm run preview`   | serves the production build locally            |
