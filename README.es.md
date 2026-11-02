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

**Crea en masa cuentas de Gonka Broker y claves API — inferencia compatible con OpenAI desde proxy.gonkabroker.com, más un conector para 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-4%20served-412991?style=for-the-badge)](https://app.gonkabroker.com)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Inicio rápido](#-quick-start) · [🎁 Nivel gratuito](#-free-tier--how-much-you-get) · [🤖 Modelos](#-models--all-4-of-them) · [🧪 Usar la API](#-how-to-use-the-api) · [✅ Verificado](#-verified-working--every-key-is-tested) · [🧭 Cómo funciona](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ Opciones](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Problemas](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Por qué existe esto

Gonka Broker expone una API **compatible con OpenAI** en `https://proxy.gonkabroker.com/v1` y cada cuenta nueva incluye una **concesión mensual gratuita de tokens** en los modelos de chat — medido en vivo: `zai-org/GLM-5.3-Flash` y `deepseek-ai/DeepSeek-V4-Flash-0731` responden a una completion real, `MiniMaxAI/MiniMax-M2.7` también. Las claves no están limitadas a una por cuenta: el endpoint de wallets acepta `type: "proxy"` repetidamente, así que una sola cuenta verificada puede tener un conjunto de claves. Cada clave se comprueba con un **chat-200 en vivo antes de escribirse** en `keys.txt`.

## 🎁 Nivel gratuito — cuánto obtienes

| Qué | Valor |
| --- | --- |
| Concesión gratuita | **120.000 tokens/mes** en `zai-org/GLM-5.3-Flash` y `deepseek-ai/DeepSeek-V4-Flash-0731`; **100.000** en `MiniMaxAI/MiniMax-M2.7`; **600.000** en `BAAI/bge-m3` (embeddings) |
| Límite de velocidad del nivel gratuito | **6 solicitudes/minuto** por cuenta — la API responde `429` con un enlace de recarga por encima de eso |
| Límite por clave | `maxRpm` 600, es decir, el límite de la cuenta es el que manda |
| Tarjeta | **no requerida** para el nivel gratuito (`freeTier: true`, `phoneVerified: false`) |

> 💡 El nivel gratuito lo define Gonka Broker y puede cambiar. Consulta las cifras en vivo en [app.gonkabroker.com](https://app.gonkabroker.com) — y deja que la propia verificación de la herramienta decida:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modelos — los 4

| Modelo | Contexto | $/1M entrada/salida | Herramientas |
| --- | --- | --- | --- |
| `zai-org/GLM-5.3-Flash` | 400k | 0.10 | ✅ |
| `deepseek-ai/DeepSeek-V4-Flash-0731` | 400k | 0.10 | ✅ |
| `MiniMaxAI/MiniMax-M2.7` | 204k | 0.12 | ✅ |
| `BAAI/bge-m3` | 8k | 0.02 | — (embeddings) |

La verificación de claves ejecuta dos prompts distintos y una llamada a la herramienta `get_time`, así que una clave que responde pero no puede hablar con herramientas sigue siendo aceptada — el informe de modelos en el registro de ejecución te dice en qué clase quedó.

## 🧪 Cómo usar la API

```bash
curl https://proxy.gonkabroker.com/v1/chat/completions \
  -H "Authorization: Bearer $GONKA_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"MiniMaxAI/MiniMax-M2.7","messages":[{"role":"user","content":"pong"}],"max_tokens":256}'
```

Los modelos de razonamiento ponen los primeros tokens en `reasoning_content` — da a `max_tokens` **256 o más**, de lo contrario `content` vuelve vacío.

## 🛠 Inicio rápido

```bash
npm install
npm start          # menu → 1) Mint keys → how many? → done
# or non-interactive:
node src/cli.js --count 5 --auto
```

Las claves se guardan en `keys.txt`, una por línea, y cada una ya ha respondido a una completion en vivo.

### 🖱️ El lanzador

`npm start` abre un pequeño menú. **1) Mint keys** solo pregunta una cantidad, luego crea las claves e imprime una tabla resumen. No hay preguntas de token, captcha ni sitekey: el navegador que abre la herramienta resuelve el propio desafío de la página como parte del registro. El captcha solo necesita una ventana de Chrome visible — `--headless` es opcional y más lento de superar.

## ✅ Verificado y funcionando — cada clave se prueba

```
$ node src/cli.js --count 1 --auto
[1/1] OK gnk_xxxxxxxx… · chat-200 MiniMaxAI/MiniMax-M2.7
```

Cada escritura en `keys.txt` pasó la misma verificación: `/v1/models` 200, dos prompts distintos con respuestas no vacías y una llamada a la herramienta `get_time`.

> **Controles de calidad.** Cada clave aquí pasó un `chat-200` en vivo antes de escribirse en `keys.txt`
> (las claves muertas nunca se entregan). Las combinaciones del router siguen la misma regla a nivel de modelo: una entrada se
> añade **solo si el modelo responde `chat-200` y puede llamar a herramientas** — un modelo sin soporte de herramientas,
> una clave muerta o un proveedor muerto se descarta en lugar de añadirse. Vuelve a ejecutar el paso de verificación cuando quieras;
> los fallos se informan, nunca se ocultan.

## 🧭 Cómo funciona

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Gonka Broker page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://proxy.gonkabroker.com/v1/chat/completions → real content = the key is live
```

1. Se crea un buzón nuevo (alias de outlook/hotmail en temp.tf).
2. Chrome abre `app.gonkabroker.com/signup`, rellena correo + contraseña y hace clic en **Create account** con una pulsación real del ratón — el propio token de reCAPTCHA Enterprise de la página es lo que puntúa el servidor, así que no se pega ningún token y no interviene ningún servicio de captcha.
3. El enlace de verificación se lee del buzón y se abre (`GET /api/auth/verify-email?token=…`).
4. `POST /api/auth/login` → token de sesión.
5. `POST /api/wallets {name, type:"proxy"}` → la clave API (devuelta una vez, como `secretKey`).
6. La clave se comprueba (`/v1/models` + dos llamadas de chat + una llamada a herramienta) y solo entonces se añade a `keys.txt`.

## ⚙️ Opciones de CLI

| Flag | Qué hace |
| --- | --- |
| `--count N` | cuántas claves crear (por defecto 1) |
| `--auto` | no interactivo; lo que pasa el lanzador |
| `--pool proxies.txt` | envía cada solicitud **y** el navegador a través de las líneas de proxy del archivo |
| `--headless` | Chrome sin interfaz (por defecto: ventana visible) |
| `--dry` | imprime el plan, no cambia nada |

## 🛰️ Detrás de un proxy

Sin `--pool` la herramienta habla directamente con el proveedor. Con `--pool` lee un proxy por línea (`http://user:pass@host:port` o `socks5://host:port`) y fija **cada cuenta a una línea** — el registro, la consulta del buzón y la verificación salen todos por la misma salida, y una línea muerta hace fallar la cuenta en lugar de ir en silencio directamente.

## 📄 Archivos

| Ruta | Qué |
| --- | --- |
| `src/cli.js` | la CLI de creación (`--count`, `--auto`, `--pool`, `--dry`) |
| `src/launcher.js` | menú: crear, conectar a 9Router, conectar a OmniRoute, docs |
| `src/solver.js` | sesión de Chrome que realiza el registro (relleno de formulario + clic de confianza + captura de respuesta) |
| `src/connect-9router.js` | añade las claves como conexiones de 9Router + entradas de combo |
| `src/connect-omniroute.js` | lo mismo para OmniRoute |
| `keys.txt` | salida, una clave por línea (ignorada por git) |

## 🔌 Conectar con 9Router

**9Router** — `node src/connect-9router.js --keys keys.txt` crea una conexión por clave bajo el prefijo `gonka` con URL base `https://proxy.gonkabroker.com/v1`.

**OmniRoute** — `node src/connect-omniroute.js --keys keys.txt` añade las mismas claves como un nodo `openai-compatible-chat-gonka`, una conexión por clave.

Ambos conectores también añaden los tres modelos de chat a entradas de combo con el nombre del modelo, porque la ruta de este proveedor se resuelve por id de modelo.

## 🔌 Conectar con OmniRoute

**OmniRoute** — `node src/connect-omniroute.js --keys keys.txt` crea una conexión por clave bajo el prefijo `gonka` con URL base `https://proxy.gonkabroker.com/v1`.

**OmniRoute** — `node src/connect-omniroute.js --keys keys.txt` añade las mismas claves como un nodo `openai-compatible-chat-gonka`, una conexión por clave.

Ambos conectores también añaden los tres modelos de chat a entradas de combo con el nombre del modelo, porque la ruta de este proveedor se resuelve por id de modelo.

## 🔑 Qué te da una clave

Cada cuenta nueva incluye la concesión mensual gratuita indicada arriba. Una cuenta puede tener varias claves, pero todas consumen la **misma** cuota — así que lo que escala es un conjunto de cuentas, no un conjunto de claves. La herramienta crea una cuenta por clave por defecto y nunca reutiliza una salida que ya produjo una cuenta.

## 🐞 Problemas

**`403 {"message":"We couldn't verify your request"}`** — el registro se puntuó como riesgoso. Lo que se califica es la salida: una IP de centro de datos, una salida ya usada para otra cuenta o una ventana emergente que perdió el foco lo provocan. Vuelve a ejecutar a través de otra línea de proxy (o directamente desde una conexión residencial) — la herramienta trata esto como un fallo por cuenta y continúa.

**`400 {"message":"Several accounts are already registered from this email domain"}`** — ese dominio de buzón está limitado. Usa otro proveedor para el buzón (`--mail-outlook` es el predeterminado porque se aceptan alias de outlook/hotmail; los dominios desechables se rechazan con `Disposable email addresses are not supported`).

**`429 Free tier rate limit (6 RPM)`** — el límite de velocidad es de la cuenta, no de la clave. Reparte las llamadas entre varias cuentas o espera un minuto.

**`content` vacío** — los modelos de razonamiento gastan el presupuesto en `reasoning_content`; sube `max_tokens` a 256+.

## 📄 Licencia

MIT © 2026 — consulta [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 gonka-bulk-apikey contributors

</div>