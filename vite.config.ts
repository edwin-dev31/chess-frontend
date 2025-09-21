import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import nodePolyfills from 'vite-plugin-node-stdlib-browser';
import path from 'path';

export default defineConfig({
    plugins: [react(), nodePolyfills()],
    define: {
        global: 'globalThis',
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
});
