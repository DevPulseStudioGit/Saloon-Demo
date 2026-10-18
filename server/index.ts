import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { env } from './config/env';
import { ensureSeeded } from './database/seed';
import { createApp } from './app';

async function start() {
  await ensureSeeded();
  const app = createApp();
  const distPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');
  app.use(express.static(distPath, { index: 'index.html' }));
  app.get('*', (_req, res) => res.sendFile(path.join(distPath, 'index.html')));
  app.listen(env.port, '0.0.0.0', () => console.log(`Luma Atelier API listening on port ${env.port}`));
}

start().catch((error) => {
  console.error('Unable to start Luma Atelier API', error);
  process.exit(1);
});
