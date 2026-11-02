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

**Массовое создание аккаунтов Gonka Broker и API-ключей — инференс, совместимый с OpenAI, через proxy.gonkabroker.com, плюс коннектор для 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-4%20served-412991?style=for-the-badge)](https://app.gonkabroker.com)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Быстрый старт](#-quick-start) · [🎁 Бесплатный тариф](#-free-tier--how-much-you-get) · [🤖 Модели](#-models--all-4-of-them) · [🧪 Использование API](#-how-to-use-the-api) · [✅ Проверено](#-verified-working--every-key-is-tested) · [🧭 Как это работает](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ Опции](#️-cli-options) · [🛰️ Прокси](#️-behind-a-proxy) · [🐞 Проблемы](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Зачем это нужно

Gonka Broker предоставляет **совместимый с OpenAI** API по адресу `https://proxy.gonkabroker.com/v1`, и каждый новый аккаунт получает **бесплатный ежемесячный грант токенов** на чат-модели — проверено вживую: `zai-org/GLM-5.3-Flash` и `deepseek-ai/DeepSeek-V4-Flash-0731` отвечают на реальный запрос completion, `MiniMaxAI/MiniMax-M2.7` тоже. Ключи не ограничены одним на аккаунт: эндпоинт кошелька принимает `type: "proxy"` многократно, поэтому один подтверждённый аккаунт может хранить целый набор ключей. Каждый ключ подтверждается **живым chat-200 ещё до записи** в `keys.txt`.

## 🎁 Бесплатный тариф — сколько вы получаете

| Что | Значение |
| --- | --- |
| Бесплатный грант | **120 000 токенов/месяц** на `zai-org/GLM-5.3-Flash` и `deepseek-ai/DeepSeek-V4-Flash-0731`; **100 000** на `MiniMaxAI/MiniMax-M2.7`; **600 000** на `BAAI/bge-m3` (эмбеддинги) |
| Лимит частоты бесплатного тарифа | **6 запросов/минуту** на аккаунт — сверх этого API отвечает `429` со ссылкой на пополнение |
| Лимит на ключ | `maxRpm` 600, т.е. ограничивающим является лимит аккаунта |
| Карта | **не требуется** для бесплатного тарифа (`freeTier: true`, `phoneVerified: false`) |

> 💡 Бесплатный тариф задаётся Gonka Broker и может измениться. Проверяйте актуальные цифры на [app.gonkabroker.com](https://app.gonkabroker.com) — и пусть решает собственный контроль инструмента:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Модели — все 4

| Модель | Контекст | $/1M вход/выход | Инструменты |
| --- | --- | --- | --- |
| `zai-org/GLM-5.3-Flash` | 400k | 0.10 | ✅ |
| `deepseek-ai/DeepSeek-V4-Flash-0731` | 400k | 0.10 | ✅ |
| `MiniMaxAI/MiniMax-M2.7` | 204k | 0.12 | ✅ |
| `BAAI/bge-m3` | 8k | 0.02 | — (эмбеддинги) |

Проверка ключа выполняет два разных промпта и вызов инструмента `get_time`, поэтому ключ, который отвечает, но не умеет работать с инструментами, всё равно принимается — отчёт о модели в журнале запуска сообщает, к какому классу он отнесён.

## 🧪 Как использовать API

```bash
curl https://proxy.gonkabroker.com/v1/chat/completions \
  -H "Authorization: Bearer $GONKA_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"MiniMaxAI/MiniMax-M2.7","messages":[{"role":"user","content":"pong"}],"max_tokens":256}'
```

Рассуждающие модели помещают первые токены в `reasoning_content` — задавайте `max_tokens` **256 или больше**, иначе `content` вернётся пустым.

## 🛠 Быстрый старт

```bash
npm install
npm start          # menu → 1) Mint keys → how many? → done
# or non-interactive:
node src/cli.js --count 5 --auto
```

Ключи попадают в `keys.txt`, по одному на строку, и каждый уже ответил на живой запрос completion.

### 🖱️ Лаунчер

`npm start` открывает небольшое меню. **1) Mint keys** спрашивает только количество, затем создаёт ключи и выводит сводную таблицу. Вопросов о токене, капче или sitekey нет: браузер, который открывает инструмент, решает собственную задачу страницы в рамках регистрации. Капча всегда требует только видимое окно Chrome — `--headless` включается явно и медленнее проходит проверку.

## ✅ Проверено в работе — каждый ключ протестирован

```
$ node src/cli.js --count 1 --auto
[1/1] OK gnk_xxxxxxxx… · chat-200 MiniMaxAI/MiniMax-M2.7
```

Каждая запись в `keys.txt` прошла одну и ту же проверку: `/v1/models` 200, два разных промпта с непустыми ответами и вызов инструмента `get_time`.

> **Контроль качества.** Каждый ключ здесь прошёл живой `chat-200` до того, как был записан в `keys.txt`
> (мёртвые ключи никогда не выдаются). Комбинации роутера следуют тому же правилу на уровне модели: запись
> добавляется **только если модель отвечает `chat-200` и умеет вызывать инструменты** — модель без поддержки инструментов,
> мёртвый ключ или мёртвый провайдер отбрасывается, а не добавляется. Повторяйте шаг проверки в любое время;
> сбои сообщаются, но никогда не скрываются.

## 🧭 Как это работает

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Gonka Broker page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://proxy.gonkabroker.com/v1/chat/completions → real content = the key is live
```

1. Создаётся новый почтовый ящик (псевдоним temp.tf outlook/hotmail).
2. Chrome открывает `app.gonkabroker.com/signup`, заполняет e-mail + пароль и нажимает **Create account** реальным нажатием мыши — сервер оценивает собственный токен reCAPTCHA Enterprise страницы, поэтому никакой токен не вставляется и никакой сервис капчи не задействован.
3. Ссылка для подтверждения читается из почтового ящика и открывается (`GET /api/auth/verify-email?token=…`).
4. `POST /api/auth/login` → токен сессии.
5. `POST /api/wallets {name, type:"proxy"}` → API-ключ (возвращается один раз, как `secretKey`).
6. Ключ проверяется (`/v1/models` + два чат-вызова + вызов инструмента) и только затем добавляется в `keys.txt`.

## ⚙️ Опции CLI

| Флаг | Что делает |
| --- | --- |
| `--count N` | сколько ключей создать (по умолчанию 1) |
| `--auto` | неинтерактивный режим; его передаёт лаунчер |
| `--pool proxies.txt` | отправлять каждый запрос **и** браузер через строки прокси из файла |
| `--headless` | headless Chrome (по умолчанию: видимое окно) |
| `--dry` | вывести план, ничего не менять |

## 🛰️ За прокси

Без `--pool` инструмент обращается к провайдеру напрямую. С `--pool` он читает по одному прокси на строку (`http://user:pass@host:port` или `socks5://host:port`) и привязывает **каждый аккаунт к одной строке** — регистрация, опрос почтового ящика и подтверждение выходят через один и тот же выход, а мёртвая строка приводит к сбою аккаунта, а не к незаметному переходу на прямое соединение.

## 📄 Файлы

| Путь | Что |
| --- | --- |
| `src/cli.js` | CLI создания ключей (`--count`, `--auto`, `--pool`, `--dry`) |
| `src/launcher.js` | меню: создание ключей, подключение к 9Router, подключение к OmniRoute, документация |
| `src/solver.js` | сессия Chrome, выполняющая регистрацию (заполнение формы + доверенный клик + захват ответа) |
| `src/connect-9router.js` | добавляет ключи как подключения 9Router + записи комбинаций |
| `src/connect-omniroute.js` | то же для OmniRoute |
| `keys.txt` | вывод, один ключ на строку (игнорируется git) |

## 🔌 Подключение к 9Router

**9Router** — `node src/connect-9router.js --keys keys.txt` создаёт одно подключение на ключ с префиксом `gonka` и базовым URL `https://proxy.gonkabroker.com/v1`.

**OmniRoute** — `node src/connect-omniroute.js --keys keys.txt` добавляет те же ключи как узел `openai-compatible-chat-gonka`, одно подключение на ключ.

Оба коннектора также добавляют три чат-модели в записи комбинаций, названные по модели, поскольку маршрут этого провайдера разрешается по id модели.

## 🔌 Подключение к OmniRoute

**OmniRoute** — `node src/connect-omniroute.js --keys keys.txt` создаёт одно подключение на ключ с префиксом `gonka` и базовым URL `https://proxy.gonkabroker.com/v1`.

**OmniRoute** — `node src/connect-omniroute.js --keys keys.txt` добавляет те же ключи как узел `openai-compatible-chat-gonka`, одно подключение на ключ.

Оба коннектора также добавляют три чат-модели в записи комбинаций, названные по модели, поскольку маршрут этого провайдера разрешается по id модели.

## 🔑 Что даёт один ключ

Каждый новый аккаунт получает бесплатный ежемесячный грант, указанный выше. Один аккаунт может хранить несколько ключей, но все они расходуют **одну и ту же** квоту — поэтому масштабируется набор аккаунтов, а не набор ключей. По умолчанию инструмент создаёт один аккаунт на ключ и никогда не переиспользует выход, который уже создал аккаунт.

## 🐞 Проблемы

**`403 {"message":"We couldn't verify your request"}`** — регистрация оценена как рискованная. Оценивается именно выход: IP дата-центра, выход, уже использованный для другого аккаунта, или всплывающее окно, потерявшее фокус, приведут к этому. Повторите запуск через другую строку прокси (или напрямую с резидентного соединения) — инструмент считает это сбоем отдельного аккаунта и продолжает работу.

**`400 {"message":"Several accounts are already registered from this email domain"}`** — домен этого почтового ящика исчерпал лимит. Используйте другого провайдера для почтового ящика (`--mail-outlook` используется по умолчанию, поскольку псевдонимы outlook/hotmail принимаются; одноразовые домены отклоняются с `Disposable email addresses are not supported`).

**`429 Free tier rate limit (6 RPM)`** — ограничение частоты действует на аккаунт, а не на ключ. Распределите вызовы по нескольким аккаунтам или подождите минуту.

**Пустой `content`** — рассуждающие модели тратят бюджет в `reasoning_content`; увеличьте `max_tokens` до 256+.

## 📄 Лицензия

MIT © 2026 — см. [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 gonka-bulk-apikey contributors

</div>