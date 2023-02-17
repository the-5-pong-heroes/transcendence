import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  //   server: {
  //     watch: {
  //       // file system watcher options
  //       usePolling: true,
  //     },
  //     host: true, // listens on all addresses and not only localhost
  //     strictPort: true, // exits when the port is not available
  //     port: parseInt(process.env.FRONTEND_PORT),
  //   },
});
