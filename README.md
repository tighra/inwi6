# BIMO TV

BIMO TV is a professional Android streaming app starter built with Kotlin, XML layouts, Material Design 3, ExoPlayer/Media3, Firebase, Firestore, Chromecast, Picture-in-Picture, push notifications, and AdMob-ready monetization.

## Folder structure

```text
app/src/main/java/com/bimotv/app/
├── cast/                    # Chromecast OptionsProvider
├── data/                    # Channel repository, M3U parser, favorites, recents
├── di/                      # Lightweight ServiceLocator
├── firebase/                # Safe Firebase access helpers
├── model/                   # Channel and category models
├── notifications/           # Firebase Cloud Messaging service
└── ui/                      # Auth, home, favorites, recents, admin, player screens
app/src/main/res/
├── layout/                  # XML UI layouts
├── drawable/                # Logo, icons, dark surfaces
├── menu/                    # Bottom navigation
├── values/                  # English strings, colors, theme
├── values-ar/               # Arabic translations
└── values-fr/               # French translations
```

## Gradle dependencies

Key dependencies are declared in `app/build.gradle.kts`: Material Design 3, Media3 ExoPlayer/HLS/UI, Firebase Auth/Firestore/Messaging, Google login, Chromecast, AdMob, Lifecycle ViewModel/runtime, coroutines, and Coil.

## Full UI design

- Dark cinematic theme with red BIMO brand color, gold highlights, animated card fade-ins, and a custom vector TV/play logo.
- Splash screen uses the BIMO logo and dark background on Android 12+.
- Home includes search, category chips for Sports, Movies, News, Kids, Music, featured channels, and all channels.
- Bottom navigation includes Home, Favorites, Recently Watched, and Admin.
- Responsive grids use 2 columns on phones and 3 columns on tablets/wide devices.
- Player screen includes ExoPlayer controls, Chromecast button, license notice, and PiP action.

## API integration example

Firestore collection for dynamic channels:

```text
channels/{channelId}
{
  "id": "sports-one",
  "name": "BIMO Sports One",
  "category": "Sports",
  "logoUrl": "https://example.com/logo.png",
  "streamUrl": "https://example.com/live/index.m3u8",
  "language": "en",
  "license": "Licensed by Example Network",
  "description": "24/7 sports channel",
  "featured": true
}
```

M3U import example:

```kotlin
viewModel.importPlaylist("https://provider.example.com/customer/licensed-playlist.m3u", "Sports")
```

The app only ships with public demo streams. Replace them with legally licensed channel URLs before publishing.

## ExoPlayer implementation

`PlayerActivity` builds an `ExoPlayer`, sets an HLS `MediaItem`, prepares playback, supports PiP, displays a Cast route button, and releases the player in `onDestroy`.

## Firebase setup

1. Create a Firebase Android app with package `com.bimotv.app`.
2. Replace `app/google-services.json` with the downloaded production file.
3. Uncomment `id("com.google.gms.google-services")` in `app/build.gradle.kts`.
4. Enable Email/Password and Google Authentication.
5. Enable Firestore and create a `channels` collection.
6. Replace `google_web_client_id` in `app/src/main/res/values/strings.xml` with your Web client ID.
7. Enable Firebase Cloud Messaging for push notifications.

## APK build instructions

```bash
./gradlew assembleDebug
./gradlew assembleRelease
```

Debug APK output: `app/build/outputs/apk/debug/app-debug.apk`. For release, configure signing in Android Studio: Build → Generate Signed Bundle/APK.

## App icon idea

The included icon concept is a rounded dark TV tile with a red screen, white play triangle, and gold base line. For store assets, export the same concept at 512×512 with subtle glow and the text-free BIMO mark.

## Monetization with AdMob

- Banner ads are wired into the main layout with Google test IDs.
- Add interstitial ads between channel launches after a frequency cap.
- Add rewarded ads for premium trial access or bonus playlists.
- Offer a subscription tier to remove ads and unlock HD licensed packages.
- Replace the test AdMob application ID and ad unit IDs before release.

## Security and performance notes

Do not ship unlicensed streams or hard-coded private credentials. Keep Firebase rules scoped by user role, restrict admin writes, use Firestore indexes for large catalogs, and validate provider licensing before production.
