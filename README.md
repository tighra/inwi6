# Reverend Insanity (Master of Gu) — Reader

A mobile-first web reader for the manhwa **Reverend Insanity (Master of Gu)** that
indexes the chapters published on
[olympustaff.com/series/reverend-insanity-master-of-gu](https://olympustaff.com/series/reverend-insanity-master-of-gu)
and gives you a clean, RTL, dark-theme way to navigate between them on your phone.

The chapter content itself is hosted on **olympustaff.com** behind Cloudflare,
so the app does not re-host or proxy any images. Instead, every chapter has a
big **"Open chapter on olympustaff"** button that opens the original page in a
new tab, plus in-app **previous / next / chapter picker** controls so you can
flip through chapters quickly without going back to the source's chapter list.

## Features

- 19 indexed chapters (0, 0.1, 0.2, 0.5, 1–15) with their original Arabic titles
- Mobile-first, RTL, dark theme tuned for reading
- Search & sort on the chapter list
- Per-chapter detail page with prominent "Open" CTA, prev/next navigation, and
  a horizontal chapter quick-picker
- Keyboard navigation on desktop (← / → for next / previous chapter, Esc to
  return to the list)
- Static SPA — works on any static host (Vercel, Netlify, Cloudflare Pages,
  GitHub Pages, devinapps.com)

## Tech stack

- [Vite](https://vite.dev/) + React + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/) via `@tailwindcss/vite`
- [react-router-dom](https://reactrouter.com/) (HashRouter so the app works on
  any static host without server URL rewrites)

## Local development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build to dist/
npm run preview  # preview the production build
npm run lint
```

## Building the Android APK

The project is wrapped with [Capacitor](https://capacitorjs.com/) so it can be
shipped as a native Android app that bundles the web build inside a WebView.
External chapter links are routed through `@capacitor/browser`, which opens
them in the system browser instead of replacing the WebView.

Requirements:

- JDK 21
- Android SDK with `platforms;android-34` and `build-tools;34.0.0`
- `ANDROID_HOME` and `JAVA_HOME` exported

```bash
npm install
npm run build              # produce dist/
npx cap sync android       # copy dist/ into android/app/src/main/assets/public
cd android && ./gradlew assembleDebug
# APK at: android/app/build/outputs/apk/debug/app-debug.apk
```

The debug APK is signed with the Android debug keystore — installable on any
device that allows "Install from Unknown Sources". For Play Store distribution,
generate a release keystore and run `./gradlew assembleRelease`.

## Project layout

```
src/
├─ App.tsx           # chapter list (home)
├─ ChapterPage.tsx   # chapter detail with prev/next + picker
├─ data/
│  └─ chapters.ts    # series metadata + chapter list
├─ index.css         # Tailwind theme + global styles
└─ main.tsx          # router setup
```

To add or update chapters, edit `src/data/chapters.ts`.

## Why a chapter index instead of an in-app reader?

The source site (olympustaff.com) is protected by Cloudflare's bot challenge
and disallows iframe embedding. Scraping image URLs reliably is not feasible
without manual cookie injection, so this app focuses on what it can do really
well: a fast, mobile-friendly **chapter index** that gets you straight into the
original chapter and lets you flip through chapters with one tap.

## Source

Series: <https://olympustaff.com/series/reverend-insanity-master-of-gu>
