import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const ASSET_EXTENSIONS = new Set([
  '.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif',
  '.mp4', '.webm', '.ico', '.pdf', '.woff', '.woff2', '.ttf'
])

const MIME_TYPES = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.gif': 'image/gif',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.ico': 'image/x-icon',
}

// Serves static client artworks, posters, videos & SEO proofs directly from sibling folders
function serveSiblingPublicAssets() {
  const publicDirs = [
    path.resolve(__dirname, '../graphic/public'),
    path.resolve(__dirname, '../video/public'),
    path.resolve(__dirname, '../seo/public'),
    path.resolve(__dirname, '../backend/uploads'),
  ]

  return {
    name: 'serve-sibling-public-assets',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        try {
          const rawUrl = (req.url || '').split('?')[0]
          
          // Skip Vite internals, source code, and API proxy routes
          if (
            rawUrl.startsWith('/@') ||
            rawUrl.startsWith('/src/') ||
            rawUrl.startsWith('/node_modules/') ||
            rawUrl.startsWith('/api') ||
            rawUrl === '/' ||
            rawUrl === '/index.html'
          ) {
            return next()
          }

          const ext = path.extname(rawUrl).toLowerCase()
          if (!ASSET_EXTENSIONS.has(ext)) {
            return next()
          }

          // Safely decode URLs even if they contain raw % characters like "Medi 20%off.png"
          let decodedUrl = rawUrl
          let wasMalformed = false
          try {
            const safeUrl = rawUrl.replace(/%(?![0-9a-fA-F]{2})/g, '%25')
            if (safeUrl !== rawUrl) wasMalformed = true
            decodedUrl = decodeURIComponent(safeUrl)
          } catch {
            decodedUrl = rawUrl
          }

          for (const dir of publicDirs) {
            const filePath = path.join(dir, decodedUrl)
            if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
              const stat = fs.statSync(filePath)
              const fileSize = stat.size
              const range = req.headers.range
              const contentType = MIME_TYPES[ext] || 'application/octet-stream'

              // Support HTTP Range requests for instant video streaming & scrubbing
              if (range) {
                const parts = range.replace(/bytes=/, '').split('-')
                const start = parseInt(parts[0], 10)
                const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
                const chunksize = end - start + 1
                const stream = fs.createReadStream(filePath, { start, end })
                res.writeHead(206, {
                  'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                  'Accept-Ranges': 'bytes',
                  'Content-Length': chunksize,
                  'Content-Type': contentType,
                })
                stream.on('error', () => {
                  if (!res.headersSent) {
                    res.statusCode = 404
                    res.end()
                  }
                })
                return stream.pipe(res)
              } else {
                res.writeHead(200, {
                  'Content-Length': fileSize,
                  'Accept-Ranges': 'bytes',
                  'Content-Type': contentType,
                  'Cache-Control': 'public, max-age=3600',
                })
                const stream = fs.createReadStream(filePath)
                stream.on('error', () => {
                  if (!res.headersSent) {
                    res.statusCode = 404
                    res.end()
                  }
                })
                return stream.pipe(res)
              }
            }
          }

          // If URL had malformed % and wasn't found, terminate with 404 so Vite doesn't crash with 500
          if (wasMalformed) {
            if (!res.headersSent) {
              res.statusCode = 404
              res.end('Asset not found')
            }
            return
          }
        } catch {
          // fallback cleanly to next middleware
        }
        next()
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), serveSiblingPublicAssets()],
  server: {
    port: 5176,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, res) => {
            // Prevent 500 error in browser console when backend is offline
            if (res && !res.headersSent) {
              res.writeHead(200, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ offline: true, online: false }))
            }
          })
        },
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('error', (_err, _req, res) => {
            if (res && !res.headersSent) {
              res.writeHead(404)
              res.end()
            }
          })
        },
      },
    },
  },
})
