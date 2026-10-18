import { defineConfig } from 'vite';
import { readFile } from 'node:fs/promises';
export default defineConfig({
  base: process.env.VITE_BASE_PATH || './',
  plugins: [{
    name: 'development-image-comparison',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__image-compare', async (_request, response, next) => {
        try {
          const html = await readFile(new URL('./tools/image-compare.html', import.meta.url), 'utf8');
          response.setHeader('Content-Type', 'text/html; charset=utf-8');
          response.end(html);
        } catch (error) { next(error); }
      });
    }
  }]
});
