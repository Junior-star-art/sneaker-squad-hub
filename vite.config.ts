import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
        },
      },
    },
  },
  server: {
    port: 8080,
    cors: {
      origin: ['https://lovable.dev', 'https://*.lovableproject.com'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'apikey', 'x-client-info'],
      credentials: true
    },
    headers: {
      'Content-Security-Policy': `
        default-src 'self' https://lovable.dev https://*.lovableproject.com https://*.supabase.co;
        script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.gpteng.co;
        style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
        img-src 'self' data: https: blob:;
        font-src 'self' https://fonts.gstatic.com;
        connect-src 'self' https://*.supabase.co wss://*.supabase.co https://lovable.dev https://*.lovableproject.com;
        frame-src 'self' https://www.youtube.com;
        media-src 'self';
        worker-src 'self' blob:;
      `.replace(/\s+/g, ' ').trim()
    }
  }
}));