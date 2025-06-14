
import { defineConfig, type ViteDevServer } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import type { NextHandleFunction } from "vite";
import type { IncomingMessage, ServerResponse } from "http";

// Custom Vite plugin for security headers (for server deploys)
const securityHeadersPlugin = () => ({
  name: "security-headers",
  configureServer(server: ViteDevServer) {
    server.middlewares.use((
      _req: IncomingMessage,
      res: ServerResponse,
      next: NextHandleFunction
    ) => {
      res.setHeader("X-Frame-Options", "SAMEORIGIN");
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
      res.setHeader("Permissions-Policy", "geolocation=(), microphone=()");
      res.setHeader("Strict-Transport-Security", "max-age=15552000; includeSubDomains");
      res.setHeader("X-XSS-Protection", "1; mode=block");
      next();
    });
  }
});

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    // Add security headers in all environments
    securityHeadersPlugin(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
