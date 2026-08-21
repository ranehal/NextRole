import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'local-api-jobs-middleware',
      configureServer(server) {
        server.middlewares.use('/api/jobs', async (req, res) => {
          const apiHandler = (await import('./api/jobs.js')).default;
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', async () => {
            req.body = body;
            res.status = (code) => {
              res.statusCode = code;
              return res;
            };
            res.json = (data) => {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
            };
            try {
              await apiHandler(req, res);
            } catch (e) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: e.message }));
            }
          });
        });
      }
    }
  ],
  base: './',
  server: {
    port: 5173,
    open: false
  }
});
