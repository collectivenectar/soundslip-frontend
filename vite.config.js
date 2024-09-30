import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "https://soundslip-ecae26cfa4ba.herokuapp.com/",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => "https://soundslip-ecae26cfa4ba.herokuapp.com/"
      }
    }
  },
  plugins: [react()]
})
