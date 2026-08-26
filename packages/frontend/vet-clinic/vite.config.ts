import fs from 'fs';
import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
    logLevel: process.env.PLAYWRIGHT_TEST ? 'warn' : 'info',
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@tests': path.resolve(__dirname, './tests')
        }
    },
    plugins: [
        react(),
        {
            name: 'copy-deploy-files',
            writeBundle() {
                const deployDir = path.join(process.cwd(), 'dist');
                if (!fs.existsSync(deployDir)) {
                    fs.mkdirSync(deployDir, { recursive: true });
                }
                const manifestSrc = path.join(process.cwd(), 'src/deploy/manifest.json');
                if (fs.existsSync(manifestSrc)) {
                    fs.copyFileSync(manifestSrc, path.join(deployDir, 'manifest.json'));
                }
                const xsAppSrc = path.join(process.cwd(), 'src/deploy/xs-app.json');
                if (fs.existsSync(xsAppSrc)) {
                    fs.copyFileSync(xsAppSrc, path.join(deployDir, 'xs-app.json'));
                }
            }
        }
    ],
    build: { outDir: 'dist', sourcemap: true },
    base: './'
});
