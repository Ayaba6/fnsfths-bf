import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // Augmente la limite d'avertissement à 1500kb pour les grosses libs (ex: react-qr-code, react-to-print)
    chunkSizeWarningLimit: 1500,
  }
})