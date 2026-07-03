import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'pwa.png'],
      manifest: {
        name: 'Formula 1 Live Timings',
        short_name: 'F1 Live',
        description: 'Real-time F1 race data and timings',
        theme_color: '#e10600',
        background_color: '#111111',
        display: 'standalone',
        icons: [
          {
            src: 'pwa.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  server: {
    port: 5173,
    open: true
  },
  build: {
    chunkSizeWarningLimit: 1000
  }
})
