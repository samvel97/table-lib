import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Runs the playground against the library source, so changes show up instantly.
export default defineConfig({
  root: import.meta.dirname,
  base: './',
  plugins: [react()],
  resolve: {
    alias: { 'beautiful-react-table': resolve(import.meta.dirname, '../src/index.ts') },
  },
  server: { port: 5180 },
  build: { outDir: resolve(import.meta.dirname, '../playground-dist'), emptyOutDir: true },
})
