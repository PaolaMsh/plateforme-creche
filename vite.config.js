// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/',               // chemins absolus pour assets
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    chunkSizeWarningLimit: 2000
  }
  // pas besoin du 'server.historyApiFallback' en prod,
  // le fallback est géré par public/_redirects
})
