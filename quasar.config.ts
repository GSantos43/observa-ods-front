import { defineConfig } from '#q-app/wrappers';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';

export default defineConfig(() => ({
  boot: [],
  css: ['app.css'],
  extras: ['material-icons'],
  build: {
    target: { browser: ['es2022', 'firefox115', 'chrome115', 'safari14'], node: 'node20' },
    vueRouterMode: 'history',
    vitePlugins: tailwindcss() as never,
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  devServer: { port: 9000, open: false },
  framework: { config: {}, plugins: ['Notify'] },
}));
