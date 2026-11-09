/// <reference types="vitest/config" />
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { libInjectCss } from 'vite-plugin-lib-inject-css'
import pkg from './package.json' with { type: 'json' }

// Everything the consumer installs (peers + dependencies) stays external, including subpaths
// such as `@mui/material/Select` or `react/jsx-runtime`.
const externalPackages = [...Object.keys(pkg.peerDependencies), ...Object.keys(pkg.dependencies)]
const isExternal = (id: string) => externalPackages.some((name) => id === name || id.startsWith(`${name}/`))

export default defineConfig({
  plugins: [
    react(),
    // Adds `import './style.css'` to the built entry, so styles load without a manual import.
    libInjectCss(),
    dts({ tsconfigPath: './tsconfig.build.json', bundleTypes: true }),
  ],
  build: {
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs'),
    },
    rolldownOptions: {
      external: isExternal,
    },
    sourcemap: true,
    target: 'es2020',
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: false,
  },
})
