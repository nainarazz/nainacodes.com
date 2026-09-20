#!/usr/bin/env node
/* eslint-disable no-console */
// One-off helper to (re)generate SPOTIFY_REFRESH_TOKEN.
//
// Spotify expires refresh tokens 6 months after authorization
// (https://developer.spotify.com/blog/2026-06-18-refresh-token-expiration), so this
// needs to be re-run periodically for the "now playing" feature. Podcast episodes
// use the client credentials flow instead and don't need this.
//
// Usage: node scripts/get-spotify-refresh-token.mjs
//
// Before running, add http://127.0.0.1:8888/callback as a redirect URI on your app at
// https://developer.spotify.com/dashboard.

import { createServer } from 'http';
import { existsSync, readFileSync } from 'fs';

function loadEnvLocal() {
  if (!existsSync('.env.local')) return;

  for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match && !(match[1] in process.env)) {
      process.env[match[1]] = (match[2] ?? '').trim();
    }
  }
}

loadEnvLocal();

const { SPOTIFY_CLIENT_ID: client_id, SPOTIFY_CLIENT_SECRET: client_secret } = process.env;

if (!client_id || !client_secret) {
  console.error(
    'Missing SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET (checked .env.local and the environment).'
  );
  process.exit(1);
}

const port = 3000;
const redirect_uri = `http://127.0.0.1:${port}/callback`;
const scope = 'user-read-currently-playing';
const state = Math.random().toString(36).slice(2);

const authUrl = new URL('https://accounts.spotify.com/authorize');
authUrl.search = new URLSearchParams({
  response_type: 'code',
  client_id,
  scope,
  redirect_uri,
  state,
}).toString();

console.log(`\nRedirect URI (must be registered on your Spotify app): ${redirect_uri}`);
console.log('\nOpen this URL and approve access:\n');
console.log(authUrl.toString());
console.log('\nWaiting for the redirect...\n');

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${port}`);

  if (url.pathname !== '/callback') {
    res.writeHead(404).end();
    return;
  }

  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');
  const returnedState = url.searchParams.get('state');

  if (error || !code || returnedState !== state) {
    res
      .writeHead(400, { 'Content-Type': 'text/plain' })
      .end('Authorization failed. Check the terminal.');
    console.error('Authorization failed:', error || 'missing code or state mismatch');
    server.close(() => process.exit(1));
    return;
  }

  const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
  const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri,
    }),
  });

  const tokenData = await tokenResponse.json();

  if (!tokenResponse.ok) {
    res
      .writeHead(400, { 'Content-Type': 'text/plain' })
      .end('Token exchange failed. Check the terminal.');
    console.error('Token exchange failed:', tokenData);
    server.close(() => process.exit(1));
    return;
  }

  res
    .writeHead(200, { 'Content-Type': 'text/plain' })
    .end('Success! You can close this tab and return to the terminal.');

  console.log('New refresh token (valid ~6 months from now):\n');
  console.log(tokenData.refresh_token);
  console.log(
    '\nUpdate SPOTIFY_REFRESH_TOKEN in .env.local and in your deployment provider, then redeploy.\n'
  );

  server.close(() => process.exit(0));
});

server.listen(port);
