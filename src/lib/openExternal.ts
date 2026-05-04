import { Capacitor } from '@capacitor/core'
import { Browser } from '@capacitor/browser'

/**
 * Click handler for external anchor tags. On native (Capacitor) builds we
 * intercept and open the URL in the system browser via the Browser plugin —
 * otherwise the link would replace the WebView. On the web build the default
 * `target="_blank"` behaviour is preserved.
 */
export const openExternal = (url: string) =>
  (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (Capacitor.isNativePlatform()) {
      e.preventDefault()
      void Browser.open({ url })
    }
  }
