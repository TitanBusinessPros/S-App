import { execSync } from 'node:child_process'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'
import { VitePWA } from 'vite-plugin-pwa'

// A visible, unmissable build stamp (Footer.tsx) -- so "did my deploy
// actually reach your device" stops being something only server-side curl
// checks can answer. Falls back to a build timestamp if git isn't
// available (e.g. a source-only deploy environment).
function getBuildId(): string {
  try {
    return execSync('git rev-parse --short HEAD', { cwd: import.meta.dirname }).toString().trim()
  } catch {
    return new Date().toISOString()
  }
}

// https://vite.dev/config/
export default defineConfig({
  define: {
    __BUILD_ID__: JSON.stringify(getBuildId()),
  },
  test: {
    environment: 'jsdom',
    globals: false,
    setupFiles: ['./src/test-setup.ts'],
    // The Recipes page has grown large enough that rendering it in jsdom
    // can approach the 5s default under load — raise it to avoid flaky
    // timeouts rather than real failures.
    testTimeout: 20000,
  },
  plugins: [
    react(),
    VitePWA({
      // 'prompt' (not 'autoUpdate'): a new build downloads and waits rather
      // than silently taking over. injectRegister: false because
      // UpdatePrompt.tsx registers the service worker itself via
      // virtual:pwa-register/react, so it can show the "update available"
      // banner and let the user actually trigger the refresh -- there was
      // previously no way to do that at all short of reinstalling the app.
      registerType: 'prompt',
      injectRegister: false,
      // Precache the app shell + all built assets so the app opens with
      // zero network requests once it's been visited once.
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff2}'],
      },
      manifest: {
        name: 'Survival Day',
        short_name: 'Survival Day',
        description: 'Offline-first wilderness survival guide',
        theme_color: '#1b1b1b',
        background_color: '#1b1b1b',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
})
