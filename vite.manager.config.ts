import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  root: './manager-app',
  plugins: [react()],
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, './shared'),
      '@manager': path.resolve(__dirname, './manager-app'),
    },
  },
  server: {
    port: 3000,
  },
  build: {
    outDir: '../dist/manager',
  },
})

