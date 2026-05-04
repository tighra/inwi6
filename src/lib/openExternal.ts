import { Capacitor } from '@capacitor/core'
import { AppLauncher } from '@capacitor/app-launcher'

/**
 * Click handler for external anchor tags. On native (Capacitor) builds we
 * intercept and hand the URL to the OS via `AppLauncher.openUrl`, which on
 * Android dispatches an `Intent.ACTION_VIEW` so the link opens in the user's
 * default browser (full Chrome, with their existing cookies/session). This is
 * more robust against Cloudflare bot challenges than launching an in-app
 * Custom Tab. On the web build the default `target="_blank"` behaviour is
 * preserved.
 */
export const openExternal = (url: string) =>
  (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (Capacitor.isNativePlatform()) {
      e.preventDefault()
      void AppLauncher.openUrl({ url })
    }
  }
