import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { Buffer } from 'node:buffer';
import type { IncomingMessage, ServerResponse } from 'node:http';
import path from 'path';
import {
  assertJsonRequest,
  assertRequestSize,
  assertStudioOrigin,
  createStudioConcept,
  getStudioErrorResponse,
  getStudioServerConfig,
  normalizeStudioPrompt,
} from './src/lib/studio-server';
import { defineConfig, loadEnv, type Plugin } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [react(), tailwindcss(), localStudioApiPlugin(env)],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // Keep hot reloading optional during live editing sessions.
      hmr: env.DISABLE_HMR !== 'true',
    },
  };
});

function localStudioApiPlugin(
  env: Record<string, string | undefined>,
): Plugin {
  return {
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const pathname = new URL(req.url || '/', 'http://localhost').pathname;

        if (pathname !== '/api/generate-concept') {
          next();
          return;
        }

        if (req.method === 'OPTIONS') {
          sendJson(res, 204, '', {
            Allow: 'POST, OPTIONS',
          });
          return;
        }

        if (req.method !== 'POST') {
          sendJson(
            res,
            405,
            {
              error: 'Method not allowed.',
            },
            {
              Allow: 'POST, OPTIONS',
            },
          );
          return;
        }

        try {
          assertStudioOrigin(
            readHeader(req, 'origin'),
            readHeader(req, 'host'),
          );
          assertRequestSize(readHeader(req, 'content-length'));
          assertJsonRequest(readHeader(req, 'content-type'));

          const body = await readJsonBody(req);
          const prompt = normalizeStudioPrompt(
            body && typeof body === 'object' ? body.prompt : undefined,
          );
          const concept = await createStudioConcept(
            prompt,
            getStudioServerConfig(env),
          );

          sendJson(res, 200, {
            concept,
          });
        } catch (error) {
          const response = getStudioErrorResponse(error);
          sendJson(res, response.status, {
            error: response.error,
          });
        }
      });
    },
    name: 'local-studio-api',
  };
}

async function readJsonBody(req: IncomingMessage) {
  const chunks: Buffer[] = [];

  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }

  const rawBody = Buffer.concat(chunks).toString('utf8');

  if (!rawBody) {
    return {};
  }

  return JSON.parse(rawBody) as { prompt?: unknown };
}

function readHeader(req: IncomingMessage, name: string) {
  const header = req.headers[name];

  return Array.isArray(header) ? header[0] : header || null;
}

function sendJson(
  res: ServerResponse,
  status: number,
  payload: '' | Record<string, unknown>,
  extraHeaders: Record<string, string> = {},
) {
  res.statusCode = status;
  res.setHeader('Cache-Control', 'no-store');

  for (const [key, value] of Object.entries(extraHeaders)) {
    res.setHeader(key, value);
  }

  if (status === 204) {
    res.end();
    return;
  }

  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}
