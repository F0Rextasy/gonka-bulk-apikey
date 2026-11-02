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

**批量创建 Gonka Broker 账户和 API 密钥 —— 通过 proxy.gonkabroker.com 提供 OpenAI 兼容推理，并附带 9Router 连接器。**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-4%20served-412991?style=for-the-badge)](https://app.gonkabroker.com)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 快速开始](#-quick-start) · [🎁 免费额度](#-free-tier--how-much-you-get) · [🤖 模型](#-models--all-4-of-them) · [🧪 使用 API](#-how-to-use-the-api) · [✅ 已验证](#-verified-working--every-key-is-tested) · [🧭 工作原理](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ 选项](#️-cli-options) · [🛰️ 代理](#️-behind-a-proxy) · [🐞 问题](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ 为什么有这个项目

Gonka Broker 在 `https://proxy.gonkabroker.com/v1` 提供了一个 **OpenAI 兼容**的 API，每个新账户在聊天模型上都带有**每月免费 token 额度** —— 实测：`zai-org/GLM-5.3-Flash` 和 `deepseek-ai/DeepSeek-V4-Flash-0731` 能返回真实的补全结果，`MiniMaxAI/MiniMax-M2.7` 也可以。密钥不限于每个账户一个：钱包端点可以重复接受 `type: "proxy"`，因此一个已验证的账户可以持有一批密钥。每个密钥在写入 `keys.txt` 之前，都会通过一次**实时 chat-200 验证**。

## 🎁 免费额度 —— 你能获得多少

| 项目 | 数值 |
| --- | --- |
| 免费额度 | `zai-org/GLM-5.3-Flash` 和 `deepseek-ai/DeepSeek-V4-Flash-0731` 为**每月 120,000 tokens**；`MiniMaxAI/MiniMax-M2.7` 为 **100,000**；`BAAI/bge-m3`（嵌入）为 **600,000** |
| 免费层速率限制 | 每个账户**每分钟 6 次请求** —— 超过后 API 会返回 `429` 并附带充值链接 |
| 每密钥限制 | `maxRpm` 600，即账户限制才是实际约束 |
| 银行卡 | 免费层**无需**银行卡（`freeTier: true`，`phoneVerified: false`） |

> 💡 免费层由 Gonka Broker 设定，可能会变化。请到 [app.gonkabroker.com](https://app.gonkabroker.com) 查看实时数值 —— 并让工具自身的校验来决定：

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 模型 —— 全部 4 个

| 模型 | 上下文 | $/1M 输入/输出 | 工具 |
| --- | --- | --- | --- |
| `zai-org/GLM-5.3-Flash` | 400k | 0.10 | ✅ |
| `deepseek-ai/DeepSeek-V4-Flash-0731` | 400k | 0.10 | ✅ |
| `MiniMaxAI/MiniMax-M2.7` | 204k | 0.12 | ✅ |
| `BAAI/bge-m3` | 8k | 0.02 | —（嵌入） |

密钥校验会运行两个不同的提示词和一次 `get_time` 工具调用，因此一个能回答但无法使用工具的密钥仍会被接受 —— 运行日志中的模型报告会告诉你它属于哪一类。

## 🧪 如何使用 API

```bash
curl https://proxy.gonkabroker.com/v1/chat/completions \
  -H "Authorization: Bearer $GONKA_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"MiniMaxAI/MiniMax-M2.7","messages":[{"role":"user","content":"pong"}],"max_tokens":256}'
```

推理模型会把最初的 token 放在 `reasoning_content` 中 —— 请将 `max_tokens` 设为 **256 或更高**，否则 `content` 会返回空。

## 🛠 快速开始

```bash
npm install
npm start          # menu → 1) Mint keys → how many? → done
# or non-interactive:
node src/cli.js --count 5 --auto
```

密钥会写入 `keys.txt`，每行一个，每个都已经通过了一次实时补全验证。

### 🖱️ 启动器

`npm start` 会打开一个小菜单。**1) Mint keys** 只询问数量，然后开始创建并打印汇总表。没有 token、验证码或 sitekey 问题：工具打开的浏览器会在注册过程中自行解决页面自身的挑战。验证码只需要一个可见的 Chrome 窗口 —— `--headless` 是可选开启的，且通过速度更慢。

## ✅ 已验证可用 —— 每个密钥都经过测试

```
$ node src/cli.js --count 1 --auto
[1/1] OK gnk_xxxxxxxx… · chat-200 MiniMaxAI/MiniMax-M2.7
```

每次写入 `keys.txt` 都通过了同一道校验：`/v1/models` 返回 200、两个不同提示词返回非空答案，以及一次 `get_time` 工具调用。

> **质量校验。** 这里的每个密钥在写入 `keys.txt` 之前都通过了实时 `chat-200`
> （失效密钥绝不会被输出）。路由组合在模型层面遵循同样的规则：只有模型返回 `chat-200`
> **且**能调用工具时才会添加条目 —— 不支持工具的模型、失效密钥或失效提供商会
> 被丢弃而不是添加。可随时重新运行验证步骤；失败会被报告，绝不会被隐藏。

## 🧭 工作原理

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Gonka Broker page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://proxy.gonkabroker.com/v1/chat/completions → real content = the key is live
```

1. 创建一个新邮箱（temp.tf outlook/hotmail 别名）。
2. Chrome 打开 `app.gonkabroker.com/signup`，填写邮箱 + 密码，并用真实鼠标点击 **Create account** —— 服务器评分依据的是页面自身的 reCAPTCHA Enterprise token，因此无需粘贴 token，也不涉及任何验证码服务。
3. 从邮箱读取验证链接并打开（`GET /api/auth/verify-email?token=…`）。
4. `POST /api/auth/login` → 会话 token。
5. `POST /api/wallets {name, type:"proxy"}` → API 密钥（以 `secretKey` 形式仅返回一次）。
6. 验证密钥（`/v1/models` + 两次聊天调用 + 一次工具调用），只有通过后才会追加到 `keys.txt`。

## ⚙️ CLI 选项

| 参数 | 作用 |
| --- | --- |
| `--count N` | 要创建的密钥数量（默认 1） |
| `--auto` | 非交互模式；启动器会传入此参数 |
| `--pool proxies.txt` | 通过文件中的代理行发送每个请求**以及**浏览器流量 |
| `--headless` | 无头 Chrome（默认：可见窗口） |
| `--dry` | 打印计划，不做任何更改 |

## 🛰️ 在代理之后

不使用 `--pool` 时，工具直接与提供商通信。使用 `--pool` 时，它会读取每行一个代理（`http://user:pass@host:port` 或 `socks5://host:port`），并将**每个账户固定到一条线路** —— 注册、邮箱轮询和验证都通过同一出口离开，失效线路会使该账户失败，而不是静默地直连。

## 📄 文件

| 路径 | 内容 |
| --- | --- |
| `src/cli.js` | 创建密钥的 CLI（`--count`、`--auto`、`--pool`、`--dry`） |
| `src/launcher.js` | 菜单：创建密钥、连接到 9Router、连接到 OmniRoute、文档 |
| `src/solver.js` | 执行注册的 Chrome 会话（表单填写 + 可信点击 + 响应捕获） |
| `src/connect-9router.js` | 将密钥添加为 9Router 连接 + 组合条目 |
| `src/connect-omniroute.js` | 对 OmniRoute 执行相同操作 |
| `keys.txt` | 输出，每行一个密钥（已被 git 忽略） |

## 🔌 连接到 9Router

**9Router** —— `node src/connect-9router.js --keys keys.txt` 会为每个密钥在 `gonka` 前缀下创建一个连接，基础 URL 为 `https://proxy.gonkabroker.com/v1`。

**OmniRoute** —— `node src/connect-omniroute.js --keys keys.txt` 会将相同的密钥添加为 `openai-compatible-chat-gonka` 节点，每个密钥一个连接。

两个连接器还会将三个聊天模型放入以模型命名的组合条目中，因为该提供商的路线按模型 id 解析。

## 🔌 连接到 OmniRoute

**OmniRoute** —— `node src/connect-omniroute.js --keys keys.txt` 会为每个密钥在 `gonka` 前缀下创建一个连接，基础 URL 为 `https://proxy.gonkabroker.com/v1`。

**OmniRoute** —— `node src/connect-omniroute.js --keys keys.txt` 会将相同的密钥添加为 `openai-compatible-chat-gonka` 节点，每个密钥一个连接。

两个连接器还会将三个聊天模型放入以模型命名的组合条目中，因为该提供商的路线按模型 id 解析。

## 🔑 一个密钥能带来什么

每个新账户都带有上述每月免费额度。一个账户可以持有多个密钥，但它们都消耗**同一份**配额 —— 因此能扩展的是账户数量，而不是密钥数量。工具默认每个密钥创建一个账户，并且绝不会复用已经产生过账户的出口。

## 🐞 问题

**`403 {"message":"We couldn't verify your request"}`** —— 注册被判定为有风险。被评分的是出口：数据中心 IP、已用于另一个账户的出口，或失去焦点的弹窗都会导致此问题。通过不同的代理线路（或从住宅连接直连）重新运行 —— 工具会将其视为单个账户失败并继续。

**`400 {"message":"Several accounts are already registered from this email domain"}`** —— 该邮箱域名已达到上限。为邮箱使用不同的提供商（`--mail-outlook` 是默认值，因为 outlook/hotmail 别名会被接受；一次性域名会被拒绝并提示 `Disposable email addresses are not supported`）。

**`429 Free tier rate limit (6 RPM)`** —— 受速率限制的是账户，而不是密钥。将调用分散到多个账户，或等待一分钟。

**`content` 为空** —— 推理模型会把预算花在 `reasoning_content` 上；将 `max_tokens` 提高到 256 以上。

## 📄 许可证

MIT © 2026 —— 参见 [LICENSE](LICENSE)。

<div align="center">

**[MIT](LICENSE)** © 2026 gonka-bulk-apikey contributors

</div>