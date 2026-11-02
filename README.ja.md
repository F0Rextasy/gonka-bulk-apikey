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

**Gonka Broker アカウントと API キーを一括作成 — proxy.gonkabroker.com からの OpenAI 互換推論、および 9Router コネクタ。**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-4%20served-412991?style=for-the-badge)](https://app.gonkabroker.com)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 クイックスタート](#-quick-start) · [🎁 無料枠](#-free-tier--how-much-you-get) · [🤖 モデル](#-models--all-4-of-them) · [🧪 API の使い方](#-how-to-use-the-api) · [✅ 検証済み](#-verified-working--every-key-is-tested) · [🧭 仕組み](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ オプション](#️-cli-options) · [🛰️ プロキシ](#️-behind-a-proxy) · [🐞 問題](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

<div align="center">

[English](README.md) · [Türkçe](README.tr.md) · [中文](README.cn.md) · **日本語** · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ なぜこれがあるのか

Gonka Broker は `https://proxy.gonkabroker.com/v1` で **OpenAI 互換** API を公開しており、新しいアカウントにはチャットモデルで使える**毎月の無料トークン付与**が付いてきます — 実測値: `zai-org/GLM-5.3-Flash` と `deepseek-ai/DeepSeek-V4-Flash-0731` は実際の補完に応答し、`MiniMaxAI/MiniMax-M2.7` も同様です。キーはアカウントごとに 1 つに制限されません: ウォレットエンドポイントは `type: "proxy"` を繰り返し受け付けるため、1 つの検証済みアカウントで複数のキーを保持できます。各キーは `keys.txt` に書き込まれる前に**ライブの chat-200 で証明**されます。

## 🎁 無料枠 — どれだけ使えるか

| 項目 | 値 |
| --- | --- |
| 無料付与 | `zai-org/GLM-5.3-Flash` と `deepseek-ai/DeepSeek-V4-Flash-0731` で**月 120,000 トークン**; `MiniMaxAI/MiniMax-M2.7` で **100,000**; `BAAI/bge-m3`（埋め込み）で **600,000** |
| 無料枠のレート制限 | アカウントあたり**毎分 6 リクエスト** — それを超えると API はチャージ用リンク付きで `429` を返します |
| キーあたりの制限 | `maxRpm` 600、つまりアカウントの制限が実効的な制約です |
| カード | 無料枠では**不要**（`freeTier: true`、`phoneVerified: false`） |

> 💡 無料枠は Gonka Broker が設定しており、変更される可能性があります。最新の数値は [app.gonkabroker.com](https://app.gonkabroker.com) で確認してください — そしてツール自身のゲートに判断させましょう:

```bash
node src/cli.js --verify-only     # keys.txt のすべてのキーが実際のチャット呼び出しで再テストされます
```

## 🤖 モデル — 全 4 種類

| モデル | コンテキスト | $/100万 入力/出力 | ツール |
| --- | --- | --- | --- |
| `zai-org/GLM-5.3-Flash` | 400k | 0.10 | ✅ |
| `deepseek-ai/DeepSeek-V4-Flash-0731` | 400k | 0.10 | ✅ |
| `MiniMaxAI/MiniMax-M2.7` | 204k | 0.12 | ✅ |
| `BAAI/bge-m3` | 8k | 0.02 | —（埋め込み） |

キーゲートは 2 つの異なるプロンプトと `get_time` ツール呼び出しを実行するため、応答はできるがツールを使えないキーも受け入れられます — 実行ログのモデルレポートで、どのクラスに分類されたかがわかります。

## 🧪 API の使い方

```bash
curl https://proxy.gonkabroker.com/v1/chat/completions \
  -H "Authorization: Bearer $GONKA_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"MiniMaxAI/MiniMax-M2.7","messages":[{"role":"user","content":"pong"}],"max_tokens":256}'
```

推論モデルは最初のトークンを `reasoning_content` に入れます — `max_tokens` を **256 以上**にしてください。そうしないと `content` が空で返ってきます。

## 🛠 クイックスタート

```bash
npm install
npm start          # メニュー → 1) Mint keys → 何個? → 完了
# または非対話で:
node src/cli.js --count 5 --auto
```

キーは `keys.txt` に 1 行 1 つで保存され、それぞれがすでに実際の補完に応答済みです。

### 🖱️ ランチャー

`npm start` で小さなメニューが開きます。**1) Mint keys** は個数だけを尋ね、その後ミントしてサマリーテーブルを表示します。トークン、キャプチャ、サイトキーの質問はありません: ツールが開くブラウザが、サインアップの一環としてページ自身のチャレンジを解決します。キャプチャは表示された Chrome ウィンドウだけを必要とします — `--headless` はオプトインで、通過に時間がかかります。

## ✅ 動作検証済み — すべてのキーがテストされます

```
$ node src/cli.js --count 1 --auto
[1/1] OK gnk_xxxxxxxx… · chat-200 MiniMaxAI/MiniMax-M2.7
```

`keys.txt` へのすべての書き込みは同じゲートを通過しました: `/v1/models` 200、空でない回答を返す 2 つの異なるプロンプト、そして `get_time` ツール呼び出しです。

> **品質ゲート。** ここにあるすべてのキーは、`keys.txt` に書き込まれる前にライブの `chat-200` を通過しています
> （死んだキーは決して出荷されません）。ルーターのコンボもモデルレベルで同じルールに従います: エントリは
> **モデルが `chat-200` に応答し、ツールを呼び出せる場合にのみ**追加されます — ツールサポートのないモデル、
> 死んだキー、死んだプロバイダーは追加されずに除外されます。検証ステップはいつでも再実行できます;
> 失敗は報告され、決して隠されません。

## 🧭 仕組み

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Gonka Broker page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://proxy.gonkabroker.com/v1/chat/completions → real content = the key is live
```

1. 新しいメールボックスが作成されます（temp.tf outlook/hotmail エイリアス）。
2. Chrome が `app.gonkabroker.com/signup` を開き、メールアドレスとパスワードを入力し、実際のマウス押下で **Create account** をクリックします — サーバーがスコアリングするのはページ自身の reCAPTCHA Enterprise トークンなので、トークンを貼り付けることもキャプチャサービスを使うこともありません。
3. 検証リンクがメールボックスから読み取られ、開かれます（`GET /api/auth/verify-email?token=…`）。
4. `POST /api/auth/login` → セッショントークン。
5. `POST /api/wallets {name, type:"proxy"}` → API キー（`secretKey` として一度だけ返されます）。
6. キーが証明され（`/v1/models` + 2 回のチャット呼び出し + ツール呼び出し）、その後にのみ `keys.txt` に追記されます。

## ⚙️ CLI オプション

| フラグ | 動作 |
| --- | --- |
| `--count N` | ミントするキーの数（デフォルト 1） |
| `--auto` | 非対話; ランチャーが渡すもの |
| `--pool proxies.txt` | すべてのリクエスト**および**ブラウザをファイル内のプロキシ行経由で送信 |
| `--headless` | ヘッドレス Chrome（デフォルト: 表示ウィンドウ） |
| `--dry` | 計画を表示し、何も変更しない |

## 🛰️ プロキシ経由

`--pool` なしでは、ツールはプロバイダーと直接通信します。`--pool` ありでは、1 行 1 プロキシ（`http://user:pass@host:port` または `socks5://host:port`）を読み取り、**各アカウントを 1 行に固定**します — サインアップ、メールボックスのポーリング、検証はすべて同じ出口を通り、死んだ行は黙って直接接続するのではなくアカウントを失敗させます。

## 📄 ファイル

| パス | 内容 |
| --- | --- |
| `src/cli.js` | ミント CLI（`--count`、`--auto`、`--pool`、`--dry`） |
| `src/launcher.js` | メニュー: ミント、9Router への接続、OmniRoute への接続、ドキュメント |
| `src/solver.js` | サインアップを実行する Chrome セッション（フォーム入力 + 信頼されたクリック + レスポンスキャプチャ） |
| `src/connect-9router.js` | キーを 9Router 接続 + コンボエントリとして追加 |
| `src/connect-omniroute.js` | OmniRoute についても同様 |
| `keys.txt` | 出力、1 行 1 キー（git 無視） |

## 🔌 9Router への接続

**9Router** — `node src/connect-9router.js --keys keys.txt` は、プレフィックス `gonka`、ベース URL `https://proxy.gonkabroker.com/v1` でキーごとに 1 つの接続を作成します。

**OmniRoute** — `node src/connect-omniroute.js --keys keys.txt` は同じキーを `openai-compatible-chat-gonka` ノードとして追加し、キーごとに 1 つの接続を作成します。

両方のコネクタは、このプロバイダーのルートがモデル ID ごとに解決されるため、3 つのチャットモデルをモデル名のコンボエントリにも追加します。

## 🔌 OmniRoute への接続

**OmniRoute** — `node src/connect-omniroute.js --keys keys.txt` は、プレフィックス `gonka`、ベース URL `https://proxy.gonkabroker.com/v1` でキーごとに 1 つの接続を作成します。

**OmniRoute** — `node src/connect-omniroute.js --keys keys.txt` は同じキーを `openai-compatible-chat-gonka` ノードとして追加し、キーごとに 1 つの接続を作成します。

両方のコネクタは、このプロバイダーのルートがモデル ID ごとに解決されるため、3 つのチャットモデルをモデル名のコンボエントリにも追加します。

## 🔑 1 つのキーで得られるもの

新しいアカウントにはそれぞれ上記の毎月の無料付与が付きます。1 つのアカウントで複数のキーを保持できますが、それらはすべて**同じ**クォータを消費します — つまりスケールするのはキーの群れではなく、アカウントの群れです。ツールはデフォルトでキーごとに 1 つのアカウントを作成し、すでにアカウントを生成した出口を再利用することはありません。

## 🐞 問題

**`403 {"message":"We couldn't verify your request"}`** — サインアップがリスクありとスコアリングされました。評価されるのは出口です: データセンター IP、すでに別のアカウントで使われた出口、またはフォーカスを失ったポップアップが原因になります。別のプロキシ行（または住宅回線から直接）で再実行してください — ツールはこれをアカウント単位の失敗として扱い、次に進みます。

**`400 {"message":"Several accounts are already registered from this email domain"}`** — そのメールボックスドメインは上限に達しています。メールボックスに別のプロバイダーを使用してください（`--mail-outlook` がデフォルトなのは outlook/hotmail エイリアスが受け入れられるためです; 使い捨てドメインは `Disposable email addresses are not supported` で拒否されます）。

**`429 Free tier rate limit (6 RPM)`** — レート制限されているのはキーではなくアカウントです。呼び出しを複数のアカウントに分散するか、1 分待ってください。

**`content` が空** — 推論モデルは予算を `reasoning_content` で消費します; `max_tokens` を 256 以上に上げてください。

## 📄 ライセンス

MIT © 2026 — [LICENSE](LICENSE) を参照。

<div align="center">

**[MIT](LICENSE)** © 2026 gonka-bulk-apikey contributors

</div>