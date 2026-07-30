import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

function apiCachePlugin() {
  const cacheDir = path.resolve(process.cwd(), '.api_cache');
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }

  return {
    name: 'api-cache-plugin',
    configureServer(server) {
      server.middlewares.use('/api-proxy', async (req, res, next) => {
        try {
          const urlPathAndQuery = req.url; 
          const targetUrl = `https://openf1-proxy.matthew-delong73.workers.dev${urlPathAndQuery}`;
          
          const hash = crypto.createHash('md5').update(urlPathAndQuery).digest('hex');
          const prefix = urlPathAndQuery.split('?')[0].replace(/[\/\\]/g, '_');
          const safeName = `${prefix}_${hash}.json`;
          const cachePath = path.join(cacheDir, safeName);
          
          if (fs.existsSync(cachePath)) {
            const stats = fs.statSync(cachePath);
            if (Date.now() - stats.mtimeMs < 24 * 60 * 60 * 1000) {
              res.setHeader('Content-Type', 'application/json');
              res.setHeader('X-Cache', 'HIT');
              return res.end(fs.readFileSync(cachePath));
            }
          }
          
          const response = await fetch(targetUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              'Accept': 'application/json'
            }
          });
          
          if (!response.ok) {
            res.statusCode = response.status;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ error: `API returned ${response.status}` }));
          }
          
          const text = await response.text();
          fs.writeFileSync(cachePath, text);
          
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('X-Cache', 'MISS');
          res.end(text);
        } catch (e) {
          console.error('Proxy error:', e);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Internal proxy error' }));
        }
      });
    }
  }
}
export default defineConfig({
  plugins: [
    react(),
    apiCachePlugin(),
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
