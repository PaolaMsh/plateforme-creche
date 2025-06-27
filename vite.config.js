import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'build',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-dom')) return 'react-dom'
          if (id.includes('node_modules/react')) return 'react'
          if (id.includes('node_modules')) return 'vendor'
          if (id.includes(path.resolve(__dirname, 'src/layouts'))) return 'layouts'
          if (id.includes(path.resolve(__dirname, 'src/pages'))) {
            const segments = id.split(path.sep)
            const name = segments[segments.length - 1].replace(/\.(jsx?|tsx?)$/, '')
            return `page-${name}`
          }
        }
      }
    },
    chunkSizeWarningLimit: 2000
  }
})