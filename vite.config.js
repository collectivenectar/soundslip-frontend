import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "https://soundslip-server.herokuapp.com": {
        target: "https://soundslip-server.herokuapp.com",
        changeOrigin: true,
        secure: false
      }
    }
  },
  plugins: [react()]
})
