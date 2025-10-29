import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

   server: {
    host: "0.0.0.0",   // 👈 important for Docker
    port: 5173,        // optional, matches your exposed port
    watch: {
      usePolling: true // 👈 ensures live reload works inside Docker
    }
  }

})
