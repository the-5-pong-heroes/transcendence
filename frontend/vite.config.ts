import * as path from "path";

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@shared": path.resolve(__dirname, "../shared/"),
      "@": path.resolve(__dirname, "./src/"),
      "@Game": path.resolve(__dirname, "./src/pages/Game/"),
      "@types": path.resolve(__dirname, "./src/@types"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@contexts": path.resolve(__dirname, "./src/contexts"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      components: `${path.resolve(__dirname, "./src/components/")}`,
      public: `${path.resolve(__dirname, "./public/")}`,
      pages: path.resolve(__dirname, "./src/pages"),
      assets: path.resolve(__dirname, "./src/assets"),
      contexts: path.resolve(__dirname, "./src/contexts"),
      types: `${path.resolve(__dirname, "./src/@types")}`,
    },
  },
  server: {
    watch: {
      // file system watcher options
      usePolling: true,
    },
    host: true, // listens on all addresses and not only localhost
    strictPort: true, // exits when the port is not available
    port: parseInt(process.env.VITE_PORT),
  },
});
