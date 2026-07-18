import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

// Standard client-only Vite SPA configuration.
// The Lovable-managed TanStack Start config wrapper (@lovable.dev/vite-tanstack-config)
// and TanStack Start's SSR plugin have been removed entirely. The TanStack Router
// vite plugin is kept only for file-based route generation (routeTree.gen.ts),
// which works the same way in a pure client-side SPA.
export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    tsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
      routesDirectory: "./src/routes",
      generatedRouteTree: "./src/routeTree.gen.ts",
    }),
    tailwindcss(),
    viteReact(),
  ],
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
