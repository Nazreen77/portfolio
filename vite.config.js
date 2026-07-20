import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'node:fs'
import { exec } from 'node:child_process'
import { resolve } from 'node:path'

// https://vite.dev/config/
// Change the base to '/your-repo-name/' when deploying to GitHub Pages
// For Vercel/Netlify, keep as '/'
export default defineConfig({
  base: '/portfolio/',
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'edit-write-plugin',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.method === 'POST' && req.url === '/api/edit/write') {
            let body = ''
            req.on('data', chunk => { body += chunk.toString() })
            req.on('end', () => {
              try {
                const { file, content: yamlContent } = JSON.parse(body)
                const filePath = resolve(process.cwd(), 'public/content', file)
                if (!file.endsWith('.yaml') || !filePath.startsWith(resolve(process.cwd(), 'public/content'))) {
                  res.writeHead(400, { 'Content-Type': 'application/json' })
                  res.end(JSON.stringify({ error: 'Invalid file' }))
                  return
                }
                fs.writeFileSync(filePath, yamlContent, 'utf-8')
                // also sync to content/ folder
                const srcPath = resolve(process.cwd(), 'content', file)
                if (fs.existsSync(srcPath)) {
                  fs.writeFileSync(srcPath, yamlContent, 'utf-8')
                }
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ success: true }))
              } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ error: err.message }))
              }
            })
          } else if (req.method === 'POST' && req.url === '/api/edit/build') {
            res.writeHead(200, { 'Content-Type': 'application/json' })
            exec('npm run build', { cwd: process.cwd() }, (error, stdout, stderr) => {
              if (error) {
                res.end(JSON.stringify({ success: false, output: stderr || error.message }))
              } else {
                res.end(JSON.stringify({ success: true, output: stdout }))
              }
            })
          } else {
            next()
          }
        })
      },
    },
  ],
})
