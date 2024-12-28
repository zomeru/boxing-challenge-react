import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  preview: {
    port: 3001,
  },
  test: {
    setupFiles: "./src/tests/setup.ts",
    globals: true,
    environment: "jsdom",
    coverage: {
      provider: "istanbul",
      all: true,
      include: ["src/**/*.ts", "src/**/*.tsx"],
      exclude: [
        "node_modules",
        "src/**/*.test.ts",
        "src/**/*.test.tsx",
        "src/theme/index.ts",
        "src/App.tsx",
      ],
    },
  },
});
