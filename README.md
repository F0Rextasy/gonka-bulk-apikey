<div align="center">

```
 ██████╗  ██████╗ ███╗   ██╗██╗  ██╗ █████╗
██╔════╝ ██╔═══██╗████╗  ██║██║ ██╔╝██╔══██╗
██║  ███╗██║   ██║██╔██╗ ██║█████╔╝ ███████║
██║   ██║██║   ██║██║╚██╗██║██╔═██╗ ██╔══██║
╚██████╔╝╚██████╔╝██║ ╚████║██║  ██╗██║  ██║
 ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝  ╚═╝
```

# gonka-bulk-apikey

**Bulk-create Gonka Broker accounts and API keys — OpenAI-compatible inference from proxy.gonkabroker.com, plus a 9Router connector.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-4%20served-412991?style=for-the-badge)](https://app.gonkabroker.com)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Quick start](#-quick-start) · [🎁 Free tier](#-free-tier--how-much-you-get) · [🤖 Models](#-models--all-4-of-them) · [🧪 Use the API](#-how-to-use-the-api) · [✅ Verified](#-verified-working--every-key-is-tested) · [🧭 How it works](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ Options](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Issues](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Why this exists

Gonka Broker exposes an **OpenAI-compatible** API at `https://proxy.gonkabroker.com/v1` and every new account carries a **free monthly token grant** on the chat models — measured live: `zai-org/GLM-5.3-Flash` and `deepseek-ai/DeepSeek-V4-Flash-0731` answer a real completion, `MiniMaxAI/MiniMax-M2.7` too. Keys are not limited to one per account: the wallet endpoint accepts `type: "proxy"` repeatedly, so a single verified account can hold a fleet of keys. Each key is proven with a **live chat-200 before it is written** to `keys.txt`.

## 🎁 Free tier — how much you get

| What | Value |
| --- | --- |
| Free grant | **120,000 tokens/month** on `zai-org/GLM-5.3-Flash` and `deepseek-ai/DeepSeek-V4-Flash-0731`; **100,000** on `MiniMaxAI/MiniMax-M2.7`; **600,000** on `BAAI/bge-m3` (embeddings) |
| Free-tier rate limit | **6 requests/minute** per account — the API answers `429` with a top-up link above that |
| Per-key limit | `maxRpm` 600, i.e. the account limit is the binding one |
| Card | **not required** for the free tier (`freeTier: true`, `phoneVerified: false`) |

> 💡 The free tier is set by Gonka Broker and can change. Check the live numbers at [app.gonkabroker.com](https://app.gonkabroker.com) — and let the tool's own gate decide:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Models — all 4 of them

| Model | Context | $/1M in/out | Tools |
| --- | --- | --- | --- |
| `zai-org/GLM-5.3-Flash` | 400k | 0.10 | ✅ |
| `deepseek-ai/DeepSeek-V4-Flash-0731` | 400k | 0.10 | ✅ |
| `MiniMaxAI/MiniMax-M2.7` | 204k | 0.12 | ✅ |
| `BAAI/bge-m3` | 8k | 0.02 | — (embeddings) |

The key gate runs two different prompts and a `get_time` tool call, so a key that answers but cannot speak with tools is still accepted — the model report in the run log tells you which class it landed in.

## 🧪 How to use the API

```bash
curl https://proxy.gonkabroker.com/v1/chat/completions \
  -H "Authorization: Bearer $GONKA_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"MiniMaxAI/MiniMax-M2.7","messages":[{"role":"user","content":"pong"}],"max_tokens":256}'
```

Reasoning models put the first tokens in `reasoning_content` — give `max_tokens` **256 or more**, otherwise `content` comes back empty.

## 🛠 Quick start

```bash
npm install
npm start          # menu → 1) Mint keys → how many? → done
# or non-interactive:
node src/cli.js --count 5 --auto
```

Keys land in `keys.txt`, one per line, each one already answered a live completion.

### 🖱️ The launcher

`npm start` opens a small menu. **1) Mint keys** asks only for a count, then mints and prints a summary table. There is no token, captcha or sitekey question: the browser the tool opens solves the page's own challenge as part of the signup. Captcha only ever wants a visible Chrome window — `--headless` is opt-in and slower to pass.

## ✅ Verified working — every key is tested

```
$ node src/cli.js --count 1 --auto
[1/1] OK gnk_xxxxxxxx… · chat-200 MiniMaxAI/MiniMax-M2.7
```

Every write to `keys.txt` passed the same gate: `/v1/models` 200, two different prompts with non-empty answers, and a `get_time` tool call.

> **Quality gates.** Every key here passed a live `chat-200` before it was written to `keys.txt`
> (dead keys are never shipped). Router combos follow the same rule at the model level: an entry is
> added **only if the model answers `chat-200` and can call tools** — a model without tool support,
> a dead key or a dead provider is dropped instead of added. Re-run the verify step any time;
> failures are reported, never hidden.

## 🧭 How it works

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Gonka Broker page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://proxy.gonkabroker.com/v1/chat/completions → real content = the key is live
```

1. A fresh mailbox is created (temp.tf outlook/hotmail alias).
2. Chrome opens `app.gonkabroker.com/signup`, fills e-mail + password and clicks **Create account** with a real mouse press — the page's own reCAPTCHA Enterprise token is what the server scores, so no token is pasted and no captcha service is involved.
3. The verification link is read from the mailbox and opened (`GET /api/auth/verify-email?token=…`).
4. `POST /api/auth/login` → session token.
5. `POST /api/wallets {name, type:"proxy"}` → the API key (returned once, as `secretKey`).
6. The key is proven (`/v1/models` + two chat calls + a tool call) and only then appended to `keys.txt`.

## ⚙️ CLI options

| Flag | What it does |
| --- | --- |
| `--count N` | how many keys to mint (default 1) |
| `--auto` | non-interactive; what the launcher passes |
| `--pool proxies.txt` | send every request **and** the browser through proxy lines from the file |
| `--headless` | headless Chrome (default: visible window) |
| `--dry` | print the plan, change nothing |

## 🛰️ Behind a proxy

Without `--pool` the tool talks to the provider directly. With `--pool` it reads one proxy per line (`http://user:pass@host:port` or `socks5://host:port`) and pins **each account to one line** — the signup, the mailbox poll and the verification all leave through the same exit, and a dead line fails the account instead of silently going direct.

## 📄 Files

| Path | What |
| --- | --- |
| `src/cli.js` | the mint CLI (`--count`, `--auto`, `--pool`, `--dry`) |
| `src/launcher.js` | menu: mint, connect to 9Router, connect to OmniRoute, docs |
| `src/solver.js` | Chrome session that performs the signup (form fill + trusted click + response capture) |
| `src/connect-9router.js` | adds the keys as 9Router connections + combo entries |
| `src/connect-omniroute.js` | same for OmniRoute |
| `keys.txt` | output, one key per line (git-ignored) |

## 🔌 Connect to 9Router

**9Router** — `node src/connect-9router.js --keys keys.txt` creates one connection per key under prefix `gonka` with base URL `https://proxy.gonkabroker.com/v1`.

**OmniRoute** — `node src/connect-omniroute.js --keys keys.txt` adds the same keys as an `openai-compatible-chat-gonka` node, one connection per key.

Both connectors also drop the three chat models into combo entries named after the model, because this provider's route resolves per model id.

## 🔌 Connect to OmniRoute

**OmniRoute** — `node src/connect-omniroute.js --keys keys.txt` creates one connection per key under prefix `gonka` with base URL `https://proxy.gonkabroker.com/v1`.

**OmniRoute** — `node src/connect-omniroute.js --keys keys.txt` adds the same keys as an `openai-compatible-chat-gonka` node, one connection per key.

Both connectors also drop the three chat models into combo entries named after the model, because this provider's route resolves per model id.

## 🔑 What one key gets you

Every new account carries the free monthly grant above. One account can hold several keys, but they all draw the **same** quota — so a fleet of accounts, not a fleet of keys, is what scales. The tool creates one account per key by default and never reuses an exit that already produced an account.

## 🐞 Issues

**`403 {"message":"We couldn't verify your request"}`** — the signup was scored as risky. The exit is what is graded: a datacenter IP, an exit already used for another account, or a popup that lost focus will do it. Re-run through a different proxy line (or direct from a residential connection) — the tool treats this as a per-account failure and moves on.

**`400 {"message":"Several accounts are already registered from this email domain"}`** — that mailbox domain is capped. Use a different provider for the mailbox (`--mail-outlook` is the default because outlook/hotmail aliases are accepted; disposable domains are rejected with `Disposable email addresses are not supported`).

**`429 Free tier rate limit (6 RPM)`** — the account, not the key, is rate-limited. Spread calls over several accounts or wait a minute.

**Empty `content`** — reasoning models spend the budget in `reasoning_content`; raise `max_tokens` to 256+.

## 📄 License

MIT © 2026 — see [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 gonka-bulk-apikey contributors

</div>
