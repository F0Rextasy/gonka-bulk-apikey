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

**Gonka-Broker-Konten und API-Schlüssel im Massenverfahren erstellen — OpenAI-kompatible Inferenz über proxy.gonkabroker.com, plus ein 9Router-Connector.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-4%20served-412991?style=for-the-badge)](https://app.gonkabroker.com)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Schnellstart](#-quick-start) · [🎁 Kostenloses Kontingent](#-free-tier--how-much-you-get) · [🤖 Modelle](#-models--all-4-of-them) · [🧪 API verwenden](#-how-to-use-the-api) · [✅ Verifiziert](#-verified-working--every-key-is-tested) · [🧭 So funktioniert es](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ Optionen](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Probleme](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Warum es das gibt

Gonka Broker stellt eine **OpenAI-kompatible** API unter `https://proxy.gonkabroker.com/v1` bereit, und jedes neue Konto erhält ein **kostenloses monatliches Token-Kontingent** für die Chat-Modelle — live gemessen: `zai-org/GLM-5.3-Flash` und `deepseek-ai/DeepSeek-V4-Flash-0731` liefern eine echte Completion, `MiniMaxAI/MiniMax-M2.7` ebenfalls. Schlüssel sind nicht auf einen pro Konto beschränkt: Der Wallet-Endpunkt akzeptiert `type: "proxy"` wiederholt, sodass ein einzelnes verifiziertes Konto eine ganze Flotte von Schlüsseln halten kann. Jeder Schlüssel wird mit einem **Live-Chat-200 bewiesen, bevor er** in `keys.txt` **geschrieben wird**.

## 🎁 Kostenloses Kontingent — wie viel du bekommst

| Was | Wert |
| --- | --- |
| Kostenloses Kontingent | **120.000 Tokens/Monat** für `zai-org/GLM-5.3-Flash` und `deepseek-ai/DeepSeek-V4-Flash-0731`; **100.000** für `MiniMaxAI/MiniMax-M2.7`; **600.000** für `BAAI/bge-m3` (Embeddings) |
| Rate-Limit des kostenlosen Kontingents | **6 Anfragen/Minute** pro Konto — darüber antwortet die API mit `429` und einem Auflade-Link |
| Limit pro Schlüssel | `maxRpm` 600, d. h. das Kontolimit ist das bindende |
| Karte | **nicht erforderlich** für das kostenlose Kontingent (`freeTier: true`, `phoneVerified: false`) |

> 💡 Das kostenlose Kontingent wird von Gonka Broker festgelegt und kann sich ändern. Prüfe die aktuellen Zahlen unter [app.gonkabroker.com](https://app.gonkabroker.com) — und lass das Gate des Tools selbst entscheiden:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modelle — alle 4

| Modell | Kontext | $/1M in/out | Tools |
| --- | --- | --- | --- |
| `zai-org/GLM-5.3-Flash` | 400k | 0.10 | ✅ |
| `deepseek-ai/DeepSeek-V4-Flash-0731` | 400k | 0.10 | ✅ |
| `MiniMaxAI/MiniMax-M2.7` | 204k | 0.12 | ✅ |
| `BAAI/bge-m3` | 8k | 0.02 | — (Embeddings) |

Das Schlüssel-Gate führt zwei verschiedene Prompts und einen `get_time`-Tool-Aufruf aus, sodass ein Schlüssel, der antwortet, aber nicht mit Tools sprechen kann, trotzdem akzeptiert wird — der Modellbericht im Laufprotokoll sagt dir, in welche Klasse er gefallen ist.

## 🧪 So verwendest du die API

```bash
curl https://proxy.gonkabroker.com/v1/chat/completions \
  -H "Authorization: Bearer $GONKA_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"MiniMaxAI/MiniMax-M2.7","messages":[{"role":"user","content":"pong"}],"max_tokens":256}'
```

Reasoning-Modelle legen die ersten Tokens in `reasoning_content` ab — gib `max_tokens` **256 oder mehr**, sonst kommt `content` leer zurück.

## 🛠 Schnellstart

```bash
npm install
npm start          # menu → 1) Mint keys → how many? → done
# or non-interactive:
node src/cli.js --count 5 --auto
```

Die Schlüssel landen in `keys.txt`, einer pro Zeile, und jeder hat bereits eine Live-Completion beantwortet.

### 🖱️ Der Launcher

`npm start` öffnet ein kleines Menü. **1) Mint keys** fragt nur nach einer Anzahl und erstellt dann die Schlüssel und gibt eine Übersichtstabelle aus. Es gibt keine Frage nach Token, Captcha oder Sitekey: Der Browser, den das Tool öffnet, löst die eigene Challenge der Seite im Rahmen der Registrierung. Captcha will nur jemals ein sichtbares Chrome-Fenster — `--headless` ist optional und langsamer beim Bestehen.

## ✅ Verifiziert funktionierend — jeder Schlüssel wird getestet

```
$ node src/cli.js --count 1 --auto
[1/1] OK gnk_xxxxxxxx… · chat-200 MiniMaxAI/MiniMax-M2.7
```

Jeder Schreibvorgang in `keys.txt` hat dasselbe Gate bestanden: `/v1/models` 200, zwei verschiedene Prompts mit nicht-leeren Antworten und ein `get_time`-Tool-Aufruf.

> **Qualitäts-Gates.** Jeder Schlüssel hier hat ein Live-`chat-200` bestanden, bevor er in `keys.txt`
> geschrieben wurde (tote Schlüssel werden nie ausgeliefert). Router-Kombinationen folgen derselben Regel
> auf Modellebene: Ein Eintrag wird **nur hinzugefügt, wenn das Modell `chat-200` antwortet und Tools
> aufrufen kann** — ein Modell ohne Tool-Unterstützung, ein toter Schlüssel oder ein toter Provider wird
> verworfen statt hinzugefügt. Führe den Verifizierungsschritt jederzeit erneut aus;
> Fehler werden gemeldet, nie versteckt.

## 🧭 So funktioniert es

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Gonka Broker page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://proxy.gonkabroker.com/v1/chat/completions → real content = the key is live
```

1. Ein frisches Postfach wird erstellt (temp.tf outlook/hotmail-Alias).
2. Chrome öffnet `app.gonkabroker.com/signup`, füllt E-Mail + Passwort aus und klickt **Create account** mit einem echten Mausklick — das eigene reCAPTCHA-Enterprise-Token der Seite ist das, was der Server bewertet, sodass kein Token eingefügt wird und kein Captcha-Dienst beteiligt ist.
3. Der Verifizierungslink wird aus dem Postfach gelesen und geöffnet (`GET /api/auth/verify-email?token=…`).
4. `POST /api/auth/login` → Session-Token.
5. `POST /api/wallets {name, type:"proxy"}` → der API-Schlüssel (einmalig zurückgegeben, als `secretKey`).
6. Der Schlüssel wird bewiesen (`/v1/models` + zwei Chat-Aufrufe + ein Tool-Aufruf) und erst dann an `keys.txt` angehängt.

## ⚙️ CLI-Optionen

| Flag | Was es bewirkt |
| --- | --- |
| `--count N` | wie viele Schlüssel erstellt werden sollen (Standard 1) |
| `--auto` | nicht-interaktiv; das, was der Launcher übergibt |
| `--pool proxies.txt` | jede Anfrage **und** den Browser über Proxy-Zeilen aus der Datei senden |
| `--headless` | Headless-Chrome (Standard: sichtbares Fenster) |
| `--dry` | den Plan ausgeben, nichts ändern |

## 🛰️ Hinter einem Proxy

Ohne `--pool` spricht das Tool direkt mit dem Provider. Mit `--pool` liest es eine Proxy-Zeile pro Zeile (`http://user:pass@host:port` oder `socks5://host:port`) und bindet **jedes Konto an eine Zeile** — die Registrierung, das Abfragen des Postfachs und die Verifizierung verlassen alle denselben Ausgang, und eine tote Zeile lässt das Konto fehlschlagen, statt stillschweigend direkt zu gehen.

## 📄 Dateien

| Pfad | Was |
| --- | --- |
| `src/cli.js` | die Mint-CLI (`--count`, `--auto`, `--pool`, `--dry`) |
| `src/launcher.js` | Menü: Mint, mit 9Router verbinden, mit OmniRoute verbinden, Docs |
| `src/solver.js` | Chrome-Session, die die Registrierung durchführt (Formular ausfüllen + vertrauenswürdiger Klick + Antwort erfassen) |
| `src/connect-9router.js` | fügt die Schlüssel als 9Router-Verbindungen + Combo-Einträge hinzu |
| `src/connect-omniroute.js` | dasselbe für OmniRoute |
| `keys.txt` | Ausgabe, ein Schlüssel pro Zeile (git-ignoriert) |

## 🔌 Mit 9Router verbinden

**9Router** — `node src/connect-9router.js --keys keys.txt` erstellt eine Verbindung pro Schlüssel unter dem Präfix `gonka` mit der Basis-URL `https://proxy.gonkabroker.com/v1`.

**OmniRoute** — `node src/connect-omniroute.js --keys keys.txt` fügt dieselben Schlüssel als `openai-compatible-chat-gonka`-Knoten hinzu, eine Verbindung pro Schlüssel.

Beide Connectoren legen außerdem die drei Chat-Modelle in Combo-Einträge ab, die nach dem Modell benannt sind, weil die Route dieses Providers pro Modell-ID aufgelöst wird.

## 🔌 Mit OmniRoute verbinden

**OmniRoute** — `node src/connect-omniroute.js --keys keys.txt` erstellt eine Verbindung pro Schlüssel unter dem Präfix `gonka` mit der Basis-URL `https://proxy.gonkabroker.com/v1`.

**OmniRoute** — `node src/connect-omniroute.js --keys keys.txt` fügt dieselben Schlüssel als `openai-compatible-chat-gonka`-Knoten hinzu, eine Verbindung pro Schlüssel.

Beide Connectoren legen außerdem die drei Chat-Modelle in Combo-Einträge ab, die nach dem Modell benannt sind, weil die Route dieses Providers pro Modell-ID aufgelöst wird.

## 🔑 Was ein Schlüssel dir bringt

Jedes neue Konto erhält das oben genannte kostenlose monatliche Kontingent. Ein Konto kann mehrere Schlüssel halten, aber sie alle beziehen aus dem **selben** Kontingent — also skaliert eine Flotte von Konten, nicht eine Flotte von Schlüsseln. Das Tool erstellt standardmäßig ein Konto pro Schlüssel und verwendet niemals einen Ausgang erneut, der bereits ein Konto erzeugt hat.

## 🐞 Probleme

**`403 {"message":"We couldn't verify your request"}`** — die Registrierung wurde als riskant bewertet. Der Ausgang ist das, was benotet wird: eine Datacenter-IP, ein Ausgang, der bereits für ein anderes Konto verwendet wurde, oder ein Popup, das den Fokus verloren hat, reichen dafür aus. Führe es erneut über eine andere Proxy-Zeile aus (oder direkt über eine Privatanschluss-Verbindung) — das Tool behandelt dies als Fehler pro Konto und macht weiter.

**`400 {"message":"Several accounts are already registered from this email domain"}`** — diese Postfach-Domain ist gedeckelt. Verwende einen anderen Provider für das Postfach (`--mail-outlook` ist der Standard, weil outlook/hotmail-Aliase akzeptiert werden; Wegwerf-Domains werden mit `Disposable email addresses are not supported` abgelehnt).

**`429 Free tier rate limit (6 RPM)`** — das Konto, nicht der Schlüssel, ist rate-limitiert. Verteile Aufrufe über mehrere Konten oder warte eine Minute.

**Leeres `content`** — Reasoning-Modelle verbrauchen das Budget in `reasoning_content`; erhöhe `max_tokens` auf 256+.

## 📄 Lizenz

MIT © 2026 — siehe [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 gonka-bulk-apikey contributors

</div>