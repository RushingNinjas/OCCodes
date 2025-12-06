import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  root: './operator-app',
  plugins: [react()],
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, './shared'),
      '@operator': path.resolve(__dirname, './operator-app'),
    },
  },
  server: {
    port: 3001,
  },
  build: {
    outDir: '../dist/operator',
  },
})

