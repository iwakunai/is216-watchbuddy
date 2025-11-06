import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Components from "unplugin-vue-components/vite";
import { PrimeVueResolver } from "@primevue/auto-import-resolver";
import tailwindcss from "@tailwindcss/vite";

import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    Components({
      resolvers: [PrimeVueResolver()],
      dts: "src/types/components.d.ts",
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1500, 
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          // Core framework
          if (id.includes('/vue/dist') || id.match(/\/vue\/(dist|runtime|shared|reactivity)/)) return 'vendor-vue'
          if (id.includes('/vue-router')) return 'vendor-router'

          // UI library
          if (id.includes('/primevue/')) return 'vendor-primevue'
          if (id.includes('@primeuix/themes')) return 'vendor-primevue' // theme css grouped with prime

          // Auth
          if (id.includes('/@clerk/')) return 'vendor-clerk'
          if (id.includes('@clerk/themes')) return 'vendor-clerk'

          // Data / backend SDKs
          if (id.includes('/@supabase/')) return 'vendor-supabase'

          // Utilities
          if (id.includes('/date-fns/')) return 'vendor-datefns'

          return 'vendor'
        },
      },
    },
  },
  esbuild: {
    drop: ['console', 'debugger']
  }
})