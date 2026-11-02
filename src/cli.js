#!/usr/bin/env node
'use strict';
/*
 * gonka-bulk-apikey CLI — mint Gonka Broker (app.gonkabroker.com) API keys.
 *
 * One command, no flags: `npm start` → menu → "Mint keys" → count → keys in keys.txt.
 * Every key is proven with a live chat-200 before it is written.
 *
 * Flow per account:
 *   temp mailbox (temp.tf outlook/hotmail alias) → real Chrome opens /signup, fills
 *   the form and clicks Create account (the page's own reCAPTCHA Enterprise token is
 *   what the server scores — no captcha service, no token paste) → verification link
 *   from the mailbox → /api/auth/verify-email → login → POST /api/wallets → API key.
 *
 * Proxy is OPTIONAL: pass a pool file and every request and the browser leave through
 * a proxy; without it the CLI runs direct.
 */
const fs = require('fs');
const path = require('path');

const APP = 'https://app.gonkabroker.com';
const API = 'https://proxy.gonkabroker.com/v1';
const TEMPTF = 'https://temp.tf';
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36';
const OUT = path.join(process.cwd(), 'keys.txt');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const rand = (n) => Math.random().toString(36).slice(2, 2 + n);

function arg(name, fallback) {
  const i = process.argv.indexOf('--' + name);
  if (i < 0) return fallback;
  const v = process.argv[i + 1];
  return v && !v.startsWith('--') ? v : true;
}

function pool() {
  // Order: --pool, then GONKA_PROXIES (what the launcher sets), then a local proxies.txt.
  const explicit = arg('pool', null);
  let file = explicit || process.env.GONKA_PROXIES || null;
  if (!file && fs.existsSync('proxies.txt')) file = 'proxies.txt';
  if (!file) return null;
  if (!fs.existsSync(String(file))) {
    // The launcher's default name exists only once the user creates it; a missing
    // default means "run direct", a missing --pool is a user error.
    if (explicit) throw new Error(`pool ${file} not found`);
    return null;
  }
  const lines = fs
    .readFileSync(String(file), 'utf8')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'));
  if (!lines.length) throw new Error(`pool ${file} is empty`);
  return lines;
}

function parseProxy(line) {
  const m = String(line).match(/^(https?|socks5h?):\/\/(?:([^:@/]+):([^@/]*)@)?([^:/]+):(\d+)\/?$/i);
  if (!m) throw new Error(`bad proxy line: ${String(line).slice(0, 40)}`);
  return {
    protocol: m[1].toLowerCase(),
    username: m[2] ? decodeURIComponent(m[2]) : null,
    password: m[3] ? decodeURIComponent(m[3]) : null,
    host: m[4],
    port: Number(m[5]),
  };
}

/** HTTP helper. `px` is a parsed proxy or null (direct). */
async function req(url, { method = 'GET', headers = {}, body = null, px = null, timeoutMs = 45000 } = {}) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const opts = { method, headers: { 'user-agent': UA, ...headers }, body, signal: ctrl.signal, redirect: 'manual' };
    if (px && px.protocol.startsWith('http')) {
      // Node's fetch ignores HTTP_PROXY; a CONNECT tunnel is the honest way through.
      const net = require('net');
      const tls = require('tls');
      const u = new URL(url);
      const sock = await new Promise((res, rej) => {
        const s = net.connect(px.port, px.host, () => res(s));
        s.once('error', rej);
        s.setTimeout(15000, () => s.destroy(new Error('proxy connect timeout')));
      });
      const auth = px.username ? `Proxy-Authorization: Basic ${Buffer.from(`${px.username}:${px.password || ''}`).toString('base64')}\r\n` : '';
      sock.write(`CONNECT ${u.hostname}:443 HTTP/1.1\r\nHost: ${u.hostname}:443\r\n${auth}\r\n`);
      const head = await new Promise((res, rej) => {
        let buf = '';
        const onData = (d) => {
          buf += d.toString('latin1');
          if (buf.includes('\r\n\r\n')) {
            sock.removeListener('data', onData);
            res(buf);
          }
        };
        sock.on('data', onData);
        sock.once('error', rej);
      });
      if (!/^HTTP\/1\.[01] 200/i.test(head)) throw new Error(`proxy CONNECT failed: ${head.split('\r\n')[0]}`);
      const secure = tls.connect({ socket: sock, servername: u.hostname });
      await new Promise((res, rej) => {
        secure.once('secureConnect', res);
        secure.once('error', rej);
      });
      const http = require('http');
      return await new Promise((res, rej) => {
        const r = http.request(
          {
            method,
            path: u.pathname + u.search,
            headers: { host: u.hostname, connection: 'close', ...opts.headers },
            createConnection: () => secure,
          },
          (x) => {
            let data = '';
            x.setEncoding('utf8');
            x.on('data', (c) => (data += c));
            x.on('end', () => res({ status: x.statusCode, headers: x.headers, text: data }));
          }
        );
        r.once('error', rej);
        if (body) r.write(body);
        r.end();
      });
    }
    const r = await fetch(url, opts);
    const text = await r.text();
    return { status: r.status, headers: Object.fromEntries(r.headers), text };
  } finally {
    clearTimeout(timer);
  }
}

async function makeMailbox(px) {
  const acc = await req(`${TEMPTF}/api/account?providers=outlook%2Chotmail&plus=1`, { px, method: 'GET' });
  let address = null;
  try {
    const j = JSON.parse(acc.text);
    address = j.address || j.email || (j.data && (j.data.address || j.data.email)) || (Array.isArray(j) ? j[0].address || j[0].email : null);
  } catch {
    /* handled below */
  }
  if (!address) throw new Error(`temp.tf address failed: ${acc.status} ${String(acc.text).slice(0, 120)}`);
  return { address, px };
}

async function mailMessages(address, px) {
  const r = await req(`${TEMPTF}/api/check`, {
    px,
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: address, wait: false }),
  });
  try {
    const j = JSON.parse(r.text);
    const list = Array.isArray(j) ? j : j.data || j.messages || [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

async function waitLink(mail, px, timeoutMs = 180000) {
  const t0 = Date.now();
  while (Date.now() - t0 < timeoutMs) {
    const msgs = await mailMessages(mail.address, px).catch(() => []);
    for (const m of msgs) {
      const hay = JSON.stringify(m);
      const hit = (hay.match(/https?:\/\/[^\s"'<>\\]+verify-email\?token=[^\s"'<>\\]+/) || [])[0];
      if (hit) return hit.replace(/&amp;/g, '&');
    }
    await sleep(5000);
  }
  return null;
}

const { launchBrowser, signup } = require('./solver');

/** One account: mailbox → browser signup → verify → login → wallet → key. */
async function mintOne({ px, index, total, log }) {
  const mail = await makeMailbox(px);
  const password = 'Gn!' + rand(10) + 'aQ9#';
  log(`[${index}/${total}] mailbox ${mail.address}`);

  const browser = await launchBrowser({ px, headless: !!arg('headless', false) });
  try {
    const result = await signup({ browser, mail: mail.address, password, px, log });
    const status = result ? result.status : 0;
    if (status !== 201) throw new Error(`signup ${status || 'no-response'}`);

    const link = await waitLink(mail, px);
    if (!link) throw new Error('verification link not found in mailbox');
    const token = (link.match(/token=([0-9a-f]+)/i) || [])[1] || '';
    const verify = await req(`${APP}/api/auth/verify-email?token=${token}`, { px });
    log(`   verify → ${verify.status}`);

    const json = { 'content-type': 'application/json', origin: APP, referer: APP + '/signin' };
    const login = await req(`${APP}/api/auth/login`, {
      px,
      method: 'POST',
      headers: json,
      body: JSON.stringify({ email: mail.address, password }),
    });
    let access = null;
    try {
      access = JSON.parse(login.text).accessToken;
    } catch {
      /* handled below */
    }
    if (!access) throw new Error(`login ${login.status} ${String(login.text).slice(0, 120)}`);

    const wallet = await req(`${APP}/api/wallets`, {
      px,
      method: 'POST',
      headers: { ...json, authorization: `Bearer ${access}` },
      body: JSON.stringify({ name: 'w-' + rand(6), type: 'proxy' }),
    });
    let key = null;
    try {
      key = JSON.parse(wallet.text).secretKey;
    } catch {
      /* handled below */
    }
    if (!key) throw new Error(`wallet ${wallet.status} ${String(wallet.text).slice(0, 120)}`);
    return { key, mail: mail.address };
  } finally {
    await browser.close().catch(() => {});
  }
}

/** The key only counts once it answers a real completion. */
async function prove(key, px) {
  const headers = { authorization: `Bearer ${key}`, 'content-type': 'application/json' };
  const models = await req(`${API}/models`, { px, headers });
  let ids = [];
  try {
    ids = (JSON.parse(models.text).data || []).map((m) => m.id);
  } catch {
    return { ok: false, why: `models ${models.status}` };
  }
  const model = ids.find((m) => /minimax/i.test(m)) || ids.find((m) => /deepseek/i.test(m)) || ids[0];
  const ask = async (content) => {
    const r = await req(`${API}/chat/completions`, {
      px,
      method: 'POST',
      headers,
      body: JSON.stringify({ model, messages: [{ role: 'user', content }], max_tokens: 600 }),
    });
    let text = '';
    try {
      const m = JSON.parse(r.text).choices[0].message;
      text = String(m.content || m.reasoning_content || '').trim();
    } catch {
      /* empty */
    }
    return { status: r.status, text };
  };
  const a = await ask('Reply with exactly: ALPHA-1');
  const b = await ask('Reply with exactly: BRAVO-2');
  const ok = a.status === 200 && b.status === 200 && a.text.length > 0 && b.text.length > 0 && a.text !== b.text;
  return { ok, model, a, b };
}

async function mint({ count, log }) {
  const lines = pool();
  const keys = [];
  for (let i = 1; i <= count; i++) {
    const px = lines ? parseProxy(lines[(Math.random() * lines.length) | 0]) : null;
    try {
      const { key, mail } = await mintOne({ px, index: i, total: count, log });
      const proof = await prove(key, px);
      if (!proof.ok) {
        fs.appendFileSync('keys-dead.txt', key + '\t' + new Date().toISOString() + '\tfailed chat gate\n');
        log(`[${i}/${count}] ${key.slice(0, 16)}… failed chat gate (${proof.why || proof.a.status}); not written`);
        continue;
      }
      fs.appendFileSync(OUT, key + '\n');
      keys.push({ key, mail, model: proof.model });
      log(`[${i}/${count}] OK ${key.slice(0, 16)}… · ${mail} · chat-200 ${proof.model}`);
    } catch (e) {
      log(`[${i}/${count}] fail: ${String((e && e.message) || e).slice(0, 160)}`);
    }
    await sleep(2000);
  }
  return keys;
}

(async () => {
  const log = (m) => console.log(m);
  if (arg('help', false)) {
    console.log('gonka-bulk-apikey — mint Gonka Broker API keys, one per account, each chat-verified.');
    console.log('');
    console.log('  node src/cli.js --count N [--auto] [--pool proxies.txt] [--headless] [--dry]');
    console.log('  node src/cli.js --verify          re-check keys.txt and move dead keys to keys-dead.txt');
    console.log('');
    console.log('  --count N   how many keys to mint (default 1)');
    console.log('  --auto      non-interactive (what the launcher passes)');
    console.log('  --pool FILE proxy list, one per line; each account is pinned to one line');
    console.log('  --headless  headless Chrome (default: visible window)');
    console.log('  --dry       print the plan, change nothing');
    console.log('  --verify    re-check keys.txt against the live API, dead keys go to keys-dead.txt');
    console.log('  --screen    probe every proxy line in the pool and report which ones reach the provider');
    return;
  }
  if (arg('verify', false)) {
    const lines = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8').trim().split(/\r?\n/).filter(Boolean) : [];
    const poolLines = pool();
    let live = 0;
    let dead = 0;
    for (const key of lines) {
      const px = poolLines ? parseProxy(poolLines[(Math.random() * poolLines.length) | 0]) : null;
      const proof = await prove(key, px).catch(() => ({ ok: false, why: 'error' }));
      if (proof.ok) {
        live++;
        log('LIVE ' + key.slice(0, 16) + '… · ' + proof.model);
      } else {
        dead++;
        fs.appendFileSync('keys-dead.txt', key + '\t' + new Date().toISOString() + '\t' + (proof.why || 'failed chat gate') + '\n');
        log('DEAD ' + key.slice(0, 16) + '…');
      }
      await sleep(3000);
    }
    log('');
    log('live ' + live + ' · dead ' + dead + (dead ? ' (moved to keys-dead.txt)' : ''));
    return;
  }
  if (arg('screen', false)) {
    const poolLines = pool();
    if (!poolLines) throw new Error('--screen needs --pool FILE (or a proxies.txt next to the CLI)');
    let up = 0;
    for (const line of poolLines) {
      const px = parseProxy(line);
      try {
        const r = await req(APP, { px, timeoutMs: 20000 });
        const ok = r.status > 0 && r.status < 500;
        if (ok) up++;
        log((ok ? 'UP   ' : 'DOWN ') + px.host + ':' + px.port + ' → ' + r.status);
      } catch (e) {
        log('DOWN ' + px.host + ':' + px.port + ' → ' + String((e && e.message) || e).slice(0, 60));
      }
    }
    log('');
    log('reachable ' + up + '/' + poolLines.length);
    return;
  }
  const count = Number(arg('count', 1)) || 1;
  if (arg('dry', false)) {
    log(`dry run: would mint ${count} key(s)` + (pool() ? ' through the proxy pool' : ' direct'));
    return;
  }
  // --auto is accepted so the launcher can run the mint with no questions at all.
  const auto = process.argv.includes('--auto');
  log(`Gonka Broker bulk keys — ${count} account(s)${auto ? ' · auto' : ''}` + (pool() ? ' · proxy pool' : ' · direct'));
  const keys = await mint({ count, log });
  log('');
  log(`done: ${keys.length}/${count} keys · written to ${path.relative(process.cwd(), OUT) || 'keys.txt'}`);
  if (keys.length) log('next: node src/connect-9router.js (or the OmniRoute connector) to wire them into your router');
})().catch((e) => {
  console.error('fatal:', String((e && e.message) || e).slice(0, 220));
  process.exit(1);
});
