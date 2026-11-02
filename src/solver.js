'use strict';
/*
 * solver.js — the browser half of the mint.
 *
 * Gonka Broker's signup is guarded by reCAPTCHA Enterprise, but the token is minted
 * by the page itself: filling the form and pressing the button with a real mouse
 * input is enough, no token is pasted and no captcha service is called. The scored
 * signal is the whole session (a fresh profile, a real click, the form's own state),
 * which is why this lives in a browser instead of a header.
 */
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36';
const APP = 'https://app.gonkabroker.com';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function launchBrowser({ px = null, headless = false } = {}) {
  const puppeteer = require('puppeteer-core');
  const args = ['--no-first-run', '--no-default-browser-check', '--window-size=1280,900', '--lang=en-US'];
  if (px) {
    const scheme = px.protocol && px.protocol.startsWith('socks') ? 'socks5' : 'http';
    args.push(`--proxy-server=${scheme}://${px.host}:${px.port}`);
  }
  const options = {
    headless,
    args,
    // puppeteer's default args open with --enable-automation, which is exactly the
    // automation flag a scoring widget looks for first.
    ignoreDefaultArgs: ['--enable-automation'],
    defaultViewport: null,
  };
  return puppeteer
    .launch({ ...options, channel: 'chrome' })
    .catch(() => puppeteer.launch(options))
    .catch((e) => {
      throw new Error(
        'Chrome not found or failed to launch (' +
          String((e && e.message) || e).slice(0, 90) +
          '). Install Google Chrome, or run: npx puppeteer browsers install chrome'
      );
    });
}

/**
 * Open /signup, fill it, press Create account with a trusted click and return the
 * signup response. Chrome credentials go per page (puppeteer has no browser-wide
 * authenticate).
 */
async function signup({ browser, mail, password, px = null, log = () => {} }) {
  const page = await browser.newPage();
  try {
    await page.setUserAgent(UA);
    if (px && px.username) await page.authenticate({ username: px.username, password: px.password || '' });
    page.on('dialog', (d) => d.dismiss().catch(() => {}));
    await page.goto(APP + '/signup', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForFunction(
      () =>
        document.querySelectorAll('input[type=password]').length > 0 &&
        [...document.querySelectorAll('button')].some((b) => /create account/i.test(b.innerText)),
      { timeout: 45000 }
    );
    await page.evaluate(() => {
      const email = document.querySelector('input[name=email],input[type=email]');
      if (email) email.id = 'bulk-email';
      [...document.querySelectorAll('input[type=password]')].forEach((e, i) => (e.id = 'bulk-pw' + i));
    });
    await page.type('#bulk-email', mail, { delay: 60 });
    const pwCount = await page.$$eval('input[type=password]', (l) => l.length);
    for (let i = 0; i < pwCount; i++) await page.type('#bulk-pw' + i, password, { delay: 50 });

    const resp = new Promise((resolve) => {
      const timer = setTimeout(() => resolve(null), 60000);
      page.on('response', (r) => {
        if (!/\/api\/users\/signup/.test(r.url())) return;
        clearTimeout(timer);
        r.text()
          .then((text) => resolve({ status: r.status(), text }))
          .catch(() => resolve({ status: r.status(), text: '' }));
      });
    });

    const box = await page.$$eval('button', (bs) => {
      const b = bs.find((x) => /create account/i.test(x.innerText || ''));
      if (!b) return null;
      b.scrollIntoView({ block: 'center' });
      const r = b.getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    });
    if (!box) throw new Error('create-account button not found');
    await page.mouse.move(box.x - 40, box.y - 20);
    await sleep(120);
    await page.mouse.move(box.x, box.y, { steps: 6 });
    await sleep(80);
    await page.mouse.down();
    await sleep(70);
    await page.mouse.up();

    const result = await resp;
    if (result && result.status >= 400) log(`   signup → ${result.status} ${String(result.text).slice(0, 160)}`);
    return result || { status: 0, text: '' };
  } finally {
    await page.close().catch(() => {});
  }
}

module.exports = { launchBrowser, signup, UA, APP };
