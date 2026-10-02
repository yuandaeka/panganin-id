import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'api-dev-server',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            const url = req.url || '';
            if (url.startsWith('/api/chat') || url.startsWith('/api/haccp')) {
              const freshEnv = loadEnv(mode, process.cwd(), '');
              Object.assign(process.env, freshEnv);
            }

            if (url.startsWith('/api/chat')) {
              res.status = (code) => { res.statusCode = code; return res; };
              res.json = (data) => {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
              };
              let body = '';
              req.on('data', chunk => { body += chunk; });
              req.on('end', async () => {
                req.body = body;
                try {
                  const { handleChat } = await import('./functions/handlers/chatHandler.js');
                  await handleChat(req, res);
                } catch (e) {
                  console.error('Local /api/chat error:', e);
                  if (!res.headersSent) {
                    res.statusCode = 500;
                    res.end(JSON.stringify({ error: e.message }));
                  }
                }
              });
            } else if (url.startsWith('/api/haccp')) {
              res.status = (code) => { res.statusCode = code; return res; };
              res.json = (data) => {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
              };
              let body = '';
              req.on('data', chunk => { body += chunk; });
              req.on('end', async () => {
                req.body = body;
                try {
                  const { handleHaccp } = await import('./functions/handlers/haccpHandler.js');
                  await handleHaccp(req, res);
                } catch (e) {
                  console.error('Local /api/haccp error:', e);
                  if (!res.headersSent) {
                    res.statusCode = 500;
                    res.end(JSON.stringify({ error: e.message }));
                  }
                }
              });
            } else {
              next();
            }
          });
        }
      }
    ],
  };
});
