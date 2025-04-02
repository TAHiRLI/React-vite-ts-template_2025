import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@store': path.resolve(__dirname, 'src/store'),
      '@lib': path.resolve(__dirname, 'src/lib'),
      '@context': path.resolve(__dirname, 'src/Context'),
      '@services': path.resolve(__dirname, 'src/services'),
    }
  },
})
