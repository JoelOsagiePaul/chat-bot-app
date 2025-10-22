import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Enable code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk for React and related libraries
          'react-vendor': ['react', 'react-dom'],
          // MUI chunk
          'mui-vendor': ['@mui/material', '@mui/icons-material'],
          // Auth and utilities
          'utils': ['./src/utils/auth.ts', './src/utils/api.ts', './src/utils/transitionUtils.ts'],
        },
      },
    },
    // Minification settings (using esbuild - faster than terser)
    minify: 'esbuild',
    // Chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Generate sourcemaps for debugging
    sourcemap: false,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', '@mui/material', '@mui/icons-material'],
  },
})
