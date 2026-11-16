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

// 2. Real-time Live Disk Synchronization Middleware for Portfolios (:5174, :5175, :5176)
function portfolioLiveDiskSync() {
  const graphicJsonPath = path.resolve(__dirname, '../graphic/src/data/portfolioData.json')
  const adminGraphicsJsonPath = path.resolve(__dirname, './src/data/allGraphics.json')
  const videoJsonPath = path.resolve(__dirname, '../video/src/data/allVideos.json')
  const adminVideosJsonPath = path.resolve(__dirname, './src/data/allVideos.json')
  const seoJsonPath = path.resolve(__dirname, '../seo/src/data/seoContent.json')
  const adminSeoJsonPath = path.resolve(__dirname, './src/data/seoContent.json')

  return {
    name: 'portfolio-live-disk-sync',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url.startsWith('/api/live-sync')) {
          return next()
        }

        let bodyStr = ''
        req.on('data', chunk => { bodyStr += chunk })
        req.on('end', () => {
          let body = {}
          try { body = bodyStr ? JSON.parse(bodyStr) : {} } catch {}

          res.setHeader('Content-Type', 'application/json')
          res.setHeader('Access-Control-Allow-Origin', '*')

          // 0. GET SEO CONTENT
          if (req.url === '/api/live-sync/seo-content' && req.method === 'GET') {
            try {
              const target = fs.existsSync(seoJsonPath) ? seoJsonPath : adminSeoJsonPath
              if (fs.existsSync(target)) {
                const data = fs.readFileSync(target, 'utf8')
                return res.end(data)
              }
            } catch (err) {
              console.error('Error reading SEO content:', err)
            }
            return res.end(JSON.stringify({}))
          }

          // 0. UPDATE / SAVE SEO CONTENT
          if (req.url === '/api/live-sync/seo-content' && req.method === 'POST') {
            try {
              const content = body.content || body
              const jsonStr = JSON.stringify(content, null, 2)
              ;[seoJsonPath, adminSeoJsonPath].forEach(fPath => {
                const dir = path.dirname(fPath)
                if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
                fs.writeFileSync(fPath, jsonStr, 'utf8')
              })
              return res.end(JSON.stringify({ success: true, message: 'SEO content saved and synced to disk' }))
            } catch (err) {
              console.error('Error saving SEO content:', err)
              return res.end(JSON.stringify({ success: false, error: err.message }))
            }
          }

          // 1. DELETE ACTION (Removes item from disk so :5174 & :5175 hot-reload immediately)
          if (req.url === '/api/live-sync/delete' && req.method === 'POST') {
            const { type, id, item, originalIndex } = body
            let deletedMeta = {}

            if (type === 'graphic') {
              if (fs.existsSync(graphicJsonPath)) {
                try {
                  const categories = JSON.parse(fs.readFileSync(graphicJsonPath, 'utf8'))
                  const targetSrc = item?.image || ''
                  const targetTitle = item?.title || ''

                  let changed = false
                  categories.forEach(cat => {
                    if (cat.images) {
                      const idx = cat.images.findIndex(img => {
                        if (targetSrc && img.src === targetSrc) return true
                        if (targetTitle && img.name === targetTitle) return true
                        return false
                      })
                      if (idx !== -1) {
                        deletedMeta = { catId: cat.id, imgIndex: idx }
                        cat.images.splice(idx, 1)
                        cat.itemCount = cat.images.length
                        changed = true
                      }
                    }
                  })

                  if (changed) {
                    fs.writeFileSync(graphicJsonPath, JSON.stringify(categories, null, 2), 'utf8')
                  }
                } catch (err) {
                  console.error('Error syncing graphic deletion to disk:', err)
                }
              }

              if (fs.existsSync(adminGraphicsJsonPath)) {
                try {
                  const allG = JSON.parse(fs.readFileSync(adminGraphicsJsonPath, 'utf8'))
                  const filtered = allG.filter(g => g.id !== id && g._id !== id)
                  fs.writeFileSync(adminGraphicsJsonPath, JSON.stringify(filtered, null, 2), 'utf8')
                } catch {}
              }

              return res.end(JSON.stringify({ success: true, type: 'graphic', deletedId: id, deletedMeta }))
            }

            if (type === 'video') {
              ;[videoJsonPath, adminVideosJsonPath].forEach(vPath => {
                if (fs.existsSync(vPath)) {
                  try {
                    const allV = JSON.parse(fs.readFileSync(vPath, 'utf8'))
                    const idx = allV.findIndex(v => v.id === id || v._id === id)
                    if (idx !== -1) {
                      deletedMeta = { videoIndex: idx }
                      allV.splice(idx, 1)
                      fs.writeFileSync(vPath, JSON.stringify(allV, null, 2), 'utf8')
                    }
                  } catch {}
                }
              })
              return res.end(JSON.stringify({ success: true, type: 'video', deletedId: id, deletedMeta }))
            }

            return res.end(JSON.stringify({ success: true }))
          }

          // 2. RESTORE / REVERT ACTION (Restores item back to exact original index on disk)
          if (req.url === '/api/live-sync/restore' && req.method === 'POST') {
            const { type, item, originalIndex, catId, imgIndex } = body

            if (type === 'graphic' && item) {
              if (fs.existsSync(graphicJsonPath)) {
                try {
                  const categories = JSON.parse(fs.readFileSync(graphicJsonPath, 'utf8'))
                  const catTag = item.category || 'Healthcare'
                  let targetCat = null
                  if (catId) {
                    targetCat = categories.find(c => c.id === catId)
                  }
                  if (!targetCat) {
                    targetCat = categories.find(c => 
                      c.tag?.toLowerCase() === catTag.toLowerCase() || 
                      c.id?.toLowerCase() === catTag.toLowerCase() ||
                      c.title?.toLowerCase().includes(catTag.toLowerCase())
                    ) || categories[0]
                  }

                  if (targetCat) {
                    if (!targetCat.images) targetCat.images = []
                    const exists = targetCat.images.some(img => img.src === item.image)
                    if (!exists) {
                      const restoredImg = {
                        name: item.title,
                        src: item.image,
                        aspectRatio: item.format?.includes('1:1') ? 1 : 1.33
                      }
                      // Insert at exact original imgIndex inside category
                      const insertPos = (typeof imgIndex === 'number' && imgIndex >= 0)
                        ? Math.min(targetCat.images.length, imgIndex)
                        : (typeof originalIndex === 'number' && originalIndex >= 0 ? Math.min(targetCat.images.length, originalIndex) : 0)
                      targetCat.images.splice(insertPos, 0, restoredImg)
                      targetCat.itemCount = targetCat.images.length
                      fs.writeFileSync(graphicJsonPath, JSON.stringify(categories, null, 2), 'utf8')
                    }
                  }
                } catch (err) {
                  console.error('Error syncing graphic restore to disk:', err)
                }
              }

              if (fs.existsSync(adminGraphicsJsonPath)) {
                try {
                  const allG = JSON.parse(fs.readFileSync(adminGraphicsJsonPath, 'utf8'))
                  const exists = allG.some(g => g.id === item.id || g._id === item._id)
                  if (!exists) {
                    const insertPos = (typeof originalIndex === 'number' && originalIndex >= 0)
                      ? Math.min(allG.length, originalIndex)
                      : 0
                    allG.splice(insertPos, 0, item)
                    fs.writeFileSync(adminGraphicsJsonPath, JSON.stringify(allG, null, 2), 'utf8')
                  }
                } catch {}
              }

              return res.end(JSON.stringify({ success: true, type: 'graphic', restored: true }))
            }

            if (type === 'video' && item) {
              ;[videoJsonPath, adminVideosJsonPath].forEach(vPath => {
                if (fs.existsSync(vPath)) {
                  try {
                    const allV = JSON.parse(fs.readFileSync(vPath, 'utf8'))
                    const exists = allV.some(v => v.id === item.id || v._id === item._id)
                    if (!exists) {
                      const insertPos = (typeof originalIndex === 'number' && originalIndex >= 0)
                        ? Math.min(allV.length, originalIndex)
                        : 0
                      allV.splice(insertPos, 0, item)
                      fs.writeFileSync(vPath, JSON.stringify(allV, null, 2), 'utf8')
                    }
                  } catch {}
                }
              })
              return res.end(JSON.stringify({ success: true, type: 'video', restored: true }))
            }

            return res.end(JSON.stringify({ success: true }))
          }

          // 3. SAVE / ADD NEW ACTION
          if (req.url === '/api/live-sync/save' && req.method === 'POST') {
            const { type, item, isEdit } = body

            if (type === 'graphic' && item) {
              if (fs.existsSync(graphicJsonPath)) {
                try {
                  const categories = JSON.parse(fs.readFileSync(graphicJsonPath, 'utf8'))
                  const catTag = item.category || 'Healthcare'
                  let targetCat = categories.find(c => 
                    c.tag?.toLowerCase() === catTag.toLowerCase() || 
                    c.id?.toLowerCase() === catTag.toLowerCase() ||
                    c.title?.toLowerCase().includes(catTag.toLowerCase())
                  ) || categories[0]

                  if (targetCat) {
                    if (!targetCat.images) targetCat.images = []
                    if (isEdit) {
                      targetCat.images = targetCat.images.map(img => 
                        (img.name === item.title || img.src === item.image)
                          ? { name: item.title, src: item.image, aspectRatio: 1.33 }
                          : img
                      )
                    } else {
                      targetCat.images.unshift({
                        name: item.title,
                        src: item.image,
                        aspectRatio: item.format?.includes('1:1') ? 1 : 1.33
                      })
                    }
                    targetCat.itemCount = targetCat.images.length
                    fs.writeFileSync(graphicJsonPath, JSON.stringify(categories, null, 2), 'utf8')
                  }
                } catch {}
              }

              if (fs.existsSync(adminGraphicsJsonPath)) {
                try {
                  const allG = JSON.parse(fs.readFileSync(adminGraphicsJsonPath, 'utf8'))
                  const updated = isEdit
                    ? allG.map(g => (g.id === item.id || g._id === item._id) ? item : g)
                    : [item, ...allG]
                  fs.writeFileSync(adminGraphicsJsonPath, JSON.stringify(updated, null, 2), 'utf8')
                } catch {}
              }

              return res.end(JSON.stringify({ success: true, type: 'graphic' }))
            }

            if (type === 'video' && item) {
              ;[videoJsonPath, adminVideosJsonPath].forEach(vPath => {
                if (fs.existsSync(vPath)) {
                  try {
                    const allV = JSON.parse(fs.readFileSync(vPath, 'utf8'))
                    const updated = isEdit
                      ? allV.map(v => (v.id === item.id || v._id === item._id) ? item : v)
                      : [item, ...allV]
                    fs.writeFileSync(vPath, JSON.stringify(updated, null, 2), 'utf8')
                  } catch {}
                }
              })
              return res.end(JSON.stringify({ success: true, type: 'video' }))
            }

            return res.end(JSON.stringify({ success: true }))
          }

          // 4. BULK UPLOAD ACTION (Multiple graphics uploaded in one batch)
          if (req.url === '/api/live-sync/bulk-upload' && req.method === 'POST') {
            const { items = [] } = body
            const bulkUploadsDir = path.resolve(__dirname, '../graphic/public/bulk-uploads')
            if (!fs.existsSync(bulkUploadsDir)) {
              fs.mkdirSync(bulkUploadsDir, { recursive: true })
            }

            const processedItems = items.map((item, idx) => {
              let finalImageUrl = item.image || ''

              // If image is a base64 DataURL, decode and save as a physical static file
              if (item.dataUrl && typeof item.dataUrl === 'string' && item.dataUrl.startsWith('data:image/')) {
                try {
                  const match = item.dataUrl.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/)
                  if (match) {
                    const extRaw = match[1] === 'jpeg' ? 'jpg' : match[1].split('+')[0]
                    const ext = '.' + extRaw
                    const base64Data = match[2]
                    const safeName = (item.fileName || `artwork-${Date.now()}-${idx}`)
                      .replace(/[^a-zA-Z0-9._-]/g, '_')
                      .replace(/\.[^/.]+$/, '')
                    const diskFileName = `${Date.now()}-${idx}-${safeName}${ext}`
                    const diskPath = path.join(bulkUploadsDir, diskFileName)
                    fs.writeFileSync(diskPath, Buffer.from(base64Data, 'base64'))
                    finalImageUrl = `/bulk-uploads/${diskFileName}`
                  }
                } catch (err) {
                  console.error('Error writing bulk upload image file:', err)
                }
              }

              return {
                ...item,
                image: finalImageUrl || item.image
              }
            })

            // Update portfolioData.json (for Graphic portfolio on :5174)
            if (fs.existsSync(graphicJsonPath)) {
              try {
                const categories = JSON.parse(fs.readFileSync(graphicJsonPath, 'utf8'))
                processedItems.forEach(item => {
                  const catTag = item.category || 'Healthcare'
                  let targetCat = categories.find(c => 
                    c.tag?.toLowerCase() === catTag.toLowerCase() || 
                    c.id?.toLowerCase() === catTag.toLowerCase() ||
                    c.title?.toLowerCase().includes(catTag.toLowerCase())
                  )
                  if (!targetCat) {
                    targetCat = {
                      id: catTag.toLowerCase().replace(/[^a-z0-9]/g, '-'),
                      title: catTag,
                      tag: catTag,
                      itemCount: 0,
                      images: []
                    }
                    categories.push(targetCat)
                  }
                  if (!targetCat.images) targetCat.images = []
                  targetCat.images.unshift({
                    name: item.title,
                    src: item.image,
                    aspectRatio: item.format?.includes('1:1') ? 1 : 1.33
                  })
                  targetCat.itemCount = targetCat.images.length
                })
                fs.writeFileSync(graphicJsonPath, JSON.stringify(categories, null, 2), 'utf8')
              } catch (err) {
                console.error('Error syncing bulk graphics to portfolioData.json:', err)
              }
            }

            // Update allGraphics.json (for Admin Panel)
            if (fs.existsSync(adminGraphicsJsonPath)) {
              try {
                const allG = JSON.parse(fs.readFileSync(adminGraphicsJsonPath, 'utf8'))
                // Clean items removing large dataUrl property before saving to allGraphics.json
                const sanitizedItems = processedItems.map(({ dataUrl, ...rest }) => rest)
                const updated = [...sanitizedItems, ...allG]
                fs.writeFileSync(adminGraphicsJsonPath, JSON.stringify(updated, null, 2), 'utf8')
              } catch (err) {
                console.error('Error syncing bulk graphics to allGraphics.json:', err)
              }
            }

            const cleanProcessed = processedItems.map(({ dataUrl, ...rest }) => rest)
            return res.end(JSON.stringify({ 
              success: true, 
              count: cleanProcessed.length, 
              items: cleanProcessed 
            }))
          }

          next()
        })
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), serveSiblingPublicAssets(), portfolioLiveDiskSync()],
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
