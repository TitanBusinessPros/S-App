import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
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
        // Placeholder icon using the default favicon so the manifest is
        // valid out of the box. Swap in real app icons (192/512 PNG) later.
        icons: [
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
          },
        ],
      },
    }),
  ],
})
