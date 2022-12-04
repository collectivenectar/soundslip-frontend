import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "https://soundslip-server.onrender.com": {
        target: "https://soundslip-server.onrender.com",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => "https://soundslip-server.onrender.com"
      }
    }
  },
  plugins: [react()]
})
