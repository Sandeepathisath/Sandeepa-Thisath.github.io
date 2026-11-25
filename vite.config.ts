import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const VIRTUAL_CV_ID = 'virtual:cv-pdf'
const RESOLVED_VIRTUAL_CV_ID = `\0${VIRTUAL_CV_ID}`

function cvPdfVirtualPlugin(): Plugin {
  const rootDir = path.dirname(fileURLToPath(import.meta.url))
  const cvDir = path.join(rootDir, 'public', 'cv')

  return {
    name: 'cv-pdf-virtual',
    resolveId(id) {
      if (id === VIRTUAL_CV_ID) {
        return RESOLVED_VIRTUAL_CV_ID
      }
      return null
    },
    load(id) {
      if (id !== RESOLVED_VIRTUAL_CV_ID) return null

      if (!fs.existsSync(cvDir)) {
        return 'export default ""'
      }

      const pdfName = fs
        .readdirSync(cvDir)
        .find((entry) => entry.toLowerCase().endsWith('.pdf'))

      if (!pdfName) {
        return 'export default ""'
      }

      const filePath = path.join(cvDir, pdfName)
      const base64 = fs.readFileSync(filePath).toString('base64')
      return `export default ${JSON.stringify(base64)}`
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), cvPdfVirtualPlugin()],
  base: '/',
})
