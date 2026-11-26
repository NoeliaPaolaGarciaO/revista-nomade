// =============================================
// NÓMADE · sw.js — service worker
// =============================================

const VERSION = 'nomade-v22';

const NUCLEO = [
  './',
  'index.html',
  'manifest.webmanifest',
  'js/agencia.js',
  'css/style.css',
  'js/app.js',
  'img/logo.png',
  'img/card-estambul.jpg',
  'img/marca/nomade-icono.svg',
  'img/marca/icono-192.png',
  'img/marca/icono-512.png',
  'img/marca/icono-maskable-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(VERSION)
      .then((cache) => cache.addAll(NUCLEO))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((claves) => Promise.all(
        claves.filter((c) => c !== VERSION).map((c) => caches.delete(c))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== self.location.origin) return;

  e.respondWith((async () => {
    const cache = await caches.open(VERSION);
    try {
      const respuesta = await fetch(e.request);
      if (respuesta.ok) cache.put(e.request, respuesta.clone());
      return respuesta;
    } catch {
      const guardada = await cache.match(e.request, { ignoreSearch: true });
      if (guardada) return guardada;
      if (e.request.mode === 'navigate') return cache.match('index.html');
      return new Response('', { status: 408, statusText: 'Sin conexión' });
    }
  })());
});