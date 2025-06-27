import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // 1) React et React DOM dans leur propre chunk
          if (id.includes('node_modules/react-dom')) {
            return 'react-dom'
          }
          if (id.includes('node_modules/react')) {
            return 'react'
          }
          // 2) Autres dépendances dans un chunk “vendor”
          if (id.includes('node_modules')) {
            return 'vendor'
          }
          // 3) Layouts séparés
          if (id.includes(path.resolve(__dirname, 'src/layouts'))) {
            return 'layouts'
          }
          // 4) Un chunk distinct par page
          if (id.includes(path.resolve(__dirname, 'src/pages'))) {
            const segments = id.split(path.sep)
            const name = segments[segments.length - 1].replace(/\.(jsx?|tsx?)$/, '')
            return `page-${name}`
          }
          // 5) Le reste (composants partagés, utilitaires…) dans le chunk “common”
          //    Tu peux omettre ce cas, Rollup gérera automatiquement.
        }
      }
    },
    // Relève la limite pour ne plus avoir de warning à 1.5 Mo
    chunkSizeWarningLimit: 2000,
  }
})
