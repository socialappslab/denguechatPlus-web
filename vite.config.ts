import eslintPlugin from '@nabla/vite-plugin-eslint';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import { sentryVitePlugin } from "@sentry/vite-plugin";

// @ts-ignore
/**
 * @see https://vitejs.dev/config/
 */
export default defineConfig({
  plugins: [
    react(),
    eslintPlugin(),
    svgr({
      include: '**/*.svg?react',
    }),
    sentryVitePlugin({
      org: "denguechatplus",
      project: "denguechatplus",
      authToken: process.env.SENTRY_AUTH_TOKEN,

      sourcemaps: {
        assets: "./dist/**/*.js.map",
        deleteFiles: true,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve('./src'),
      src: path.resolve(__dirname, './src'),
    },
  },
  build: {
    sourcemap: process.env.NODE_ENV !== 'production',
  },
});
