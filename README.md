# Elix Casa Player

A smooth, installable streaming-player web app for personal/authorized media sources.

This project does **not** scrape, bypass DRM, or extract protected video sources from third-party websites. It ships with public demo streams and lets you add your own authorized MP4, HLS (`.m3u8`), or DASH (`.mpd`) URLs.

## Features

- App-style layout inspired by TV guide apps
- Android-friendly installable PWA experience
- Built-in responsive player with HLS support through hls.js
- Search, categories, channel details, and favorites
- Custom authorized stream entry with local persistence
- PWA manifest and offline shell caching
- Screen wake lock while video is playing on supported Android browsers
- No build step required

## Run locally

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## Add a personal stream

Use the “Add stream” panel in the app and enter:

- Name
- Category
- Stream URL (`https://...mp4`, `https://...m3u8`, or `https://...mpd`)

Only add sources you own or are authorized to watch.