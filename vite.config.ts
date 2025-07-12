import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  base: process.env.NODE_ENV === 'production' ? '/license-tracker-vite/' : '/',
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
}) 