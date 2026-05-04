import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/emi-calculator-2/',
  root: '.',
  build: {
    outDir: 'dist'
  }
})
