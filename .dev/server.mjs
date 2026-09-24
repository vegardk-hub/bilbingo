// Bittelite utviklingsserver. Kjor: node .dev/server.mjs  (port 5190)
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROT = normalize(join(fileURLToPath(new URL('.', import.meta.url)), '..'));
const PORT = Number(process.env.PORT) || 5190;
const TYPER = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

createServer(async (req, res) => {
  try {
    let sti = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (sti.endsWith('/')) sti += 'index.html';
    const fil = normalize(join(ROT, sti));
    if (!fil.startsWith(ROT)) { res.writeHead(403).end('nei'); return; }
    const s = await stat(fil);
    if (s.isDirectory()) { res.writeHead(302, { Location: sti + '/' }).end(); return; }
    const data = await readFile(fil);
    res.writeHead(200, {
      'Content-Type': TYPER[extname(fil)] || 'application/octet-stream',
      'Cache-Control': 'no-store',
      'Service-Worker-Allowed': '/',
    });
    res.end(data);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Fant ikke filen');
  }
}).listen(PORT, () => console.log(`Bilbingo kjorer pa http://localhost:${PORT}/`));
