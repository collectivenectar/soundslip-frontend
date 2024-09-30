import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: " https://soundslip-a66fa1f1d10f.herokuapp.com/",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => " https://soundslip-a66fa1f1d10f.herokuapp.com/"
      }
    }
  },
  plugins: [react()]
})
