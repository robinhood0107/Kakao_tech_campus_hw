import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/Kakao_tech_campus_hw/' : '/',
  plugins: [react(), tailwindcss()],
  server: {
    host: '127.0.0.1',
    port: 15173,
    strictPort: true,
  },
  preview: {
    host: '127.0.0.1',
    port: 14173,
    strictPort: true,
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    exclude: ['node_modules/**', 'dist/**', 'e2e/**'],
    css: true,
  },
})
