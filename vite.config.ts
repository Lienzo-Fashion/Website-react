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
  build: {
    outDir: 'dist', // Specify the output directory
    sourcemap: true, // Enable source maps for debugging
    assetsInlineLimit: 0, // Disable inlining of assets completely
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]', // Configure output file names
      },
    },
  },
});
