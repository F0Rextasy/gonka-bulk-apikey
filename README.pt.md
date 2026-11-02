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

**Crie em massa contas do Gonka Broker e chaves de API — inferência compatível com OpenAI a partir de proxy.gonkabroker.com, além de um conector para o 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-4%20served-412991?style=for-the-badge)](https://app.gonkabroker.com)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Início rápido](#-quick-start) · [🎁 Plano gratuito](#-free-tier--how-much-you-get) · [🤖 Modelos](#-models--all-4-of-them) · [🧪 Use a API](#-how-to-use-the-api) · [✅ Verificado](#-verified-working--every-key-is-tested) · [🧭 Como funciona](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ Opções](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Problemas](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Por que isto existe

O Gonka Broker expõe uma API **compatível com OpenAI** em `https://proxy.gonkabroker.com/v1` e toda nova conta carrega uma **concessão mensal gratuita de tokens** nos modelos de chat — medida ao vivo: `zai-org/GLM-5.3-Flash` e `deepseek-ai/DeepSeek-V4-Flash-0731` respondem a uma completion real, `MiniMaxAI/MiniMax-M2.7` também. As chaves não se limitam a uma por conta: o endpoint de carteira aceita `type: "proxy"` repetidamente, então uma única conta verificada pode manter uma frota de chaves. Cada chave é comprovada com um **chat-200 ao vivo antes de ser gravada** em `keys.txt`.

## 🎁 Plano gratuito — quanto você recebe

| O quê | Valor |
| --- | --- |
| Concessão gratuita | **120.000 tokens/mês** em `zai-org/GLM-5.3-Flash` e `deepseek-ai/DeepSeek-V4-Flash-0731`; **100.000** em `MiniMaxAI/MiniMax-M2.7`; **600.000** em `BAAI/bge-m3` (embeddings) |
| Limite de taxa do plano gratuito | **6 requisições/minuto** por conta — a API responde `429` com um link de recarga acima disso |
| Limite por chave | `maxRpm` 600, ou seja, o limite da conta é o que vale |
| Cartão | **não exigido** para o plano gratuito (`freeTier: true`, `phoneVerified: false`) |

> 💡 O plano gratuito é definido pelo Gonka Broker e pode mudar. Confira os números ao vivo em [app.gonkabroker.com](https://app.gonkabroker.com) — e deixe o próprio gate da ferramenta decidir:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modelos — todos os 4

| Modelo | Contexto | $/1M entrada/saída | Ferramentas |
| --- | --- | --- | --- |
| `zai-org/GLM-5.3-Flash` | 400k | 0.10 | ✅ |
| `deepseek-ai/DeepSeek-V4-Flash-0731` | 400k | 0.10 | ✅ |
| `MiniMaxAI/MiniMax-M2.7` | 204k | 0.12 | ✅ |
| `BAAI/bge-m3` | 8k | 0.02 | — (embeddings) |

O gate de chaves executa dois prompts diferentes e uma chamada de ferramenta `get_time`, então uma chave que responde mas não consegue falar com ferramentas ainda é aceita — o relatório de modelos no log da execução informa em qual classe ela caiu.

## 🧪 Como usar a API

```bash
curl https://proxy.gonkabroker.com/v1/chat/completions \
  -H "Authorization: Bearer $GONKA_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"MiniMaxAI/MiniMax-M2.7","messages":[{"role":"user","content":"pong"}],"max_tokens":256}'
```

Modelos de raciocínio colocam os primeiros tokens em `reasoning_content` — defina `max_tokens` como **256 ou mais**, caso contrário `content` volta vazio.

## 🛠 Início rápido

```bash
npm install
npm start          # menu → 1) Mint keys → how many? → done
# or non-interactive:
node src/cli.js --count 5 --auto
```

As chaves ficam em `keys.txt`, uma por linha, cada uma já tendo respondido a uma completion ao vivo.

### 🖱️ O launcher

`npm start` abre um pequeno menu. **1) Mint keys** pede apenas uma quantidade, depois cunha e imprime uma tabela de resumo. Não há pergunta de token, captcha ou sitekey: o navegador que a ferramenta abre resolve o próprio desafio da página como parte do cadastro. O captcha só quer uma janela visível do Chrome — `--headless` é opcional e mais lento para passar.

## ✅ Verificado funcionando — toda chave é testada

```
$ node src/cli.js --count 1 --auto
[1/1] OK gnk_xxxxxxxx… · chat-200 MiniMaxAI/MiniMax-M2.7
```

Toda gravação em `keys.txt` passou pelo mesmo gate: `/v1/models` 200, dois prompts diferentes com respostas não vazias e uma chamada de ferramenta `get_time`.

> **Gates de qualidade.** Toda chave aqui passou por um `chat-200` ao vivo antes de ser gravada em `keys.txt`
> (chaves mortas nunca são entregues). As combinações do router seguem a mesma regra no nível do modelo: uma entrada é
> adicionada **somente se o modelo responder `chat-200` e conseguir chamar ferramentas** — um modelo sem suporte a ferramentas,
> uma chave morta ou um provedor morto é descartado em vez de adicionado. Reexecute a etapa de verificação a qualquer momento;
> as falhas são reportadas, nunca escondidas.

## 🧭 Como funciona

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Gonka Broker page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://proxy.gonkabroker.com/v1/chat/completions → real content = the key is live
```

1. Uma caixa de correio nova é criada (alias outlook/hotmail do temp.tf).
2. O Chrome abre `app.gonkabroker.com/signup`, preenche e-mail + senha e clica em **Create account** com um clique real de mouse — o token reCAPTCHA Enterprise da própria página é o que o servidor avalia, então nenhum token é colado e nenhum serviço de captcha está envolvido.
3. O link de verificação é lido da caixa de correio e aberto (`GET /api/auth/verify-email?token=…`).
4. `POST /api/auth/login` → token de sessão.
5. `POST /api/wallets {name, type:"proxy"}` → a chave de API (retornada uma vez, como `secretKey`).
6. A chave é comprovada (`/v1/models` + duas chamadas de chat + uma chamada de ferramenta) e só então anexada a `keys.txt`.

## ⚙️ Opções da CLI

| Flag | O que faz |
| --- | --- |
| `--count N` | quantas chaves cunhar (padrão 1) |
| `--auto` | não interativo; o que o launcher passa |
| `--pool proxies.txt` | envia toda requisição **e** o navegador através das linhas de proxy do arquivo |
| `--headless` | Chrome headless (padrão: janela visível) |
| `--dry` | imprime o plano, não altera nada |

## 🛰️ Atrás de um proxy

Sem `--pool` a ferramenta fala diretamente com o provedor. Com `--pool` ela lê um proxy por linha (`http://user:pass@host:port` ou `socks5://host:port`) e fixa **cada conta a uma linha** — o cadastro, a consulta à caixa de correio e a verificação saem todos pela mesma saída, e uma linha morta faz a conta falhar em vez de ir silenciosamente direto.

## 📄 Arquivos

| Caminho | O quê |
| --- | --- |
| `src/cli.js` | a CLI de cunhagem (`--count`, `--auto`, `--pool`, `--dry`) |
| `src/launcher.js` | menu: cunhar, conectar ao 9Router, conectar ao OmniRoute, docs |
| `src/solver.js` | sessão do Chrome que realiza o cadastro (preenchimento de formulário + clique confiável + captura de resposta) |
| `src/connect-9router.js` | adiciona as chaves como conexões do 9Router + entradas de combo |
| `src/connect-omniroute.js` | o mesmo para o OmniRoute |
| `keys.txt` | saída, uma chave por linha (ignorado pelo git) |

## 🔌 Conectar ao 9Router

**9Router** — `node src/connect-9router.js --keys keys.txt` cria uma conexão por chave sob o prefixo `gonka` com URL base `https://proxy.gonkabroker.com/v1`.

**OmniRoute** — `node src/connect-omniroute.js --keys keys.txt` adiciona as mesmas chaves como um nó `openai-compatible-chat-gonka`, uma conexão por chave.

Ambos os conectores também colocam os três modelos de chat em entradas de combo nomeadas segundo o modelo, porque a rota deste provedor resolve por id de modelo.

## 🔌 Conectar ao OmniRoute

**OmniRoute** — `node src/connect-omniroute.js --keys keys.txt` cria uma conexão por chave sob o prefixo `gonka` com URL base `https://proxy.gonkabroker.com/v1`.

**OmniRoute** — `node src/connect-omniroute.js --keys keys.txt` adiciona as mesmas chaves como um nó `openai-compatible-chat-gonka`, uma conexão por chave.

Ambos os conectores também colocam os três modelos de chat em entradas de combo nomeadas segundo o modelo, porque a rota deste provedor resolve por id de modelo.

## 🔑 O que uma chave oferece

Toda nova conta carrega a concessão mensal gratuita acima. Uma conta pode manter várias chaves, mas todas consomem a **mesma** cota — então é uma frota de contas, não uma frota de chaves, que escala. A ferramenta cria uma conta por chave por padrão e nunca reutiliza uma saída que já produziu uma conta.

## 🐞 Problemas

**`403 {"message":"We couldn't verify your request"}`** — o cadastro foi avaliado como arriscado. A saída é o que é avaliado: um IP de datacenter, uma saída já usada para outra conta ou um popup que perdeu o foco causam isso. Reexecute através de uma linha de proxy diferente (ou diretamente de uma conexão residencial) — a ferramenta trata isso como uma falha por conta e segue adiante.

**`400 {"message":"Several accounts are already registered from this email domain"}`** — esse domínio de caixa de correio está limitado. Use um provedor diferente para a caixa de correio (`--mail-outlook` é o padrão porque aliases outlook/hotmail são aceitos; domínios descartáveis são rejeitados com `Disposable email addresses are not supported`).

**`429 Free tier rate limit (6 RPM)`** — a conta, não a chave, está limitada por taxa. Distribua as chamadas entre várias contas ou espere um minuto.

**`content` vazio** — modelos de raciocínio gastam o orçamento em `reasoning_content`; aumente `max_tokens` para 256+.

## 📄 Licença

MIT © 2026 — veja [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 gonka-bulk-apikey contributors

</div>