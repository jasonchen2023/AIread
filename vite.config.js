/* eslint-disable import/no-extraneous-dependencies */
import eslint from 'vite-plugin-eslint';
import autoprefixer from 'autoprefixer';
import ViteFaviconsPlugin from 'vite-plugin-favicon';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    eslint(),
    // eslint-disable-next-line new-cap
    ViteFaviconsPlugin('./src/img/kipper.png'),
  ],
  css: {
    postcss: {
      plugins: [
        autoprefixer(),
      ],
    },
  },
});
