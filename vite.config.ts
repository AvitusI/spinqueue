import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // REST API
      '/api': 'http://127.0.0.1:8000',
      // Live queue WebSocket
      '/ws': { target: 'ws://127.0.0.1:8000', ws: true },
    },
  },
})
