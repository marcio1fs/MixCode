
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  // Tauri dev server config
  server: {
    strictPort: true,
    hmr: {
        host: 'localhost',
    },
  },
});
