# Reverend Insanity (Master of Gu) REMAKE - Mobile Reader

A mobile-optimized web application for reading the manhwa "Reverend Insanity (Master of Gu) REMAKE".

## Features

- **20 Chapters** with all pages from the source
- **Mobile-first design** — optimized for phone reading with touch gestures
- **Swipe navigation** — swipe left/right to switch chapters
- **Keyboard navigation** — Arrow keys to switch chapters on desktop
- **Progress tracking** — scroll progress bar and page indicator
- **Reading history** — tracks which chapters you've read
- **Customizable reader** — adjust image width, gap, and background color
- **Chapter selector** — quick jump to any chapter from the reader
- **PWA support** — installable as a home screen app with offline caching
- **Lazy loading** — images load as you scroll for fast initial page load
- **Dark theme** — easy on the eyes for long reading sessions

## How to Use

1. Open `app/index.html` in a browser (or deploy to any static hosting)
2. Select a chapter from the grid
3. Scroll down to read
4. Tap the screen to show/hide navigation bars
5. Use Prev/Next buttons or swipe to change chapters
6. Tap the chapter title to open the chapter selector
7. Click the gear icon for reader settings

## Tech Stack

- Vanilla HTML/CSS/JavaScript (no build tools required)
- Service Worker for offline support
- CSS Grid for responsive chapter list
- IntersectionObserver for lazy image loading
- LocalStorage for reading progress persistence
