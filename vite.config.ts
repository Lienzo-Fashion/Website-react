import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // For resolving alias

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Create alias for 'src'
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'], // Exclude specific dependencies from optimization
  },
 // Automatically open the browser

  build: {
    outDir: 'dist', // Specify the output directory
    sourcemap: true, // Enable source maps for debugging
  },
});