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

**Créez en masse des comptes Gonka Broker et des clés API — inférence compatible OpenAI depuis proxy.gonkabroker.com, plus un connecteur 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-4%20served-412991?style=for-the-badge)](https://app.gonkabroker.com)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Démarrage rapide](#-quick-start) · [🎁 Offre gratuite](#-free-tier--how-much-you-get) · [🤖 Modèles](#-models--all-4-of-them) · [🧪 Utiliser l'API](#-how-to-use-the-api) · [✅ Vérifié](#-verified-working--every-key-is-tested) · [🧭 Fonctionnement](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ Options](#️-cli-options) · [🛰️ Proxys](#️-behind-a-proxy) · [🐞 Problèmes](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Pourquoi cet outil existe

Gonka Broker expose une API **compatible OpenAI** à l'adresse `https://proxy.gonkabroker.com/v1` et chaque nouveau compte bénéficie d'un **crédit mensuel gratuit de tokens** sur les modèles de chat — mesuré en direct : `zai-org/GLM-5.3-Flash` et `deepseek-ai/DeepSeek-V4-Flash-0731` répondent à une vraie complétion, `MiniMaxAI/MiniMax-M2.7` aussi. Les clés ne sont pas limitées à une par compte : l'endpoint wallet accepte `type: "proxy"` de façon répétée, donc un seul compte vérifié peut détenir une flotte de clés. Chaque clé est prouvée par un **chat-200 en direct avant d'être écrite** dans `keys.txt`.

## 🎁 Offre gratuite — ce que vous obtenez

| Quoi | Valeur |
| --- | --- |
| Crédit gratuit | **120 000 tokens/mois** sur `zai-org/GLM-5.3-Flash` et `deepseek-ai/DeepSeek-V4-Flash-0731` ; **100 000** sur `MiniMaxAI/MiniMax-M2.7` ; **600 000** sur `BAAI/bge-m3` (embeddings) |
| Limite de débit de l'offre gratuite | **6 requêtes/minute** par compte — au-delà, l'API répond `429` avec un lien de recharge |
| Limite par clé | `maxRpm` 600, c'est-à-dire que la limite du compte est celle qui s'applique |
| Carte bancaire | **non requise** pour l'offre gratuite (`freeTier: true`, `phoneVerified: false`) |

> 💡 L'offre gratuite est définie par Gonka Broker et peut changer. Consultez les chiffres en direct sur [app.gonkabroker.com](https://app.gonkabroker.com) — et laissez le contrôle de l'outil décider :

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modèles — les 4

| Modèle | Contexte | $/1M entrée/sortie | Outils |
| --- | --- | --- | --- |
| `zai-org/GLM-5.3-Flash` | 400k | 0.10 | ✅ |
| `deepseek-ai/DeepSeek-V4-Flash-0731` | 400k | 0.10 | ✅ |
| `MiniMaxAI/MiniMax-M2.7` | 204k | 0.12 | ✅ |
| `BAAI/bge-m3` | 8k | 0.02 | — (embeddings) |

Le contrôle des clés exécute deux prompts différents et un appel d'outil `get_time`, donc une clé qui répond mais ne sait pas utiliser les outils est tout de même acceptée — le rapport des modèles dans le journal d'exécution vous indique dans quelle catégorie elle a été classée.

## 🧪 Comment utiliser l'API

```bash
curl https://proxy.gonkabroker.com/v1/chat/completions \
  -H "Authorization: Bearer $GONKA_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"MiniMaxAI/MiniMax-M2.7","messages":[{"role":"user","content":"pong"}],"max_tokens":256}'
```

Les modèles de raisonnement placent les premiers tokens dans `reasoning_content` — donnez à `max_tokens` **256 ou plus**, sinon `content` revient vide.

## 🛠 Démarrage rapide

```bash
npm install
npm start          # menu → 1) Mint keys → how many? → done
# or non-interactive:
node src/cli.js --count 5 --auto
```

Les clés arrivent dans `keys.txt`, une par ligne, chacune ayant déjà répondu à une complétion en direct.

### 🖱️ Le lanceur

`npm start` ouvre un petit menu. **1) Mint keys** ne demande qu'un nombre, puis crée les clés et affiche un tableau récapitulatif. Aucune question de token, de captcha ou de sitekey : le navigateur ouvert par l'outil résout le défi de la page lui-même dans le cadre de l'inscription. Le captcha ne demande qu'une fenêtre Chrome visible — `--headless` est optionnel et plus lent à passer.

## ✅ Vérifié et fonctionnel — chaque clé est testée

```
$ node src/cli.js --count 1 --auto
[1/1] OK gnk_xxxxxxxx… · chat-200 MiniMaxAI/MiniMax-M2.7
```

Chaque écriture dans `keys.txt` a passé le même contrôle : `/v1/models` 200, deux prompts différents avec des réponses non vides, et un appel d'outil `get_time`.

> **Contrôles de qualité.** Chaque clé ici a passé un `chat-200` en direct avant d'être écrite dans `keys.txt`
> (les clés mortes ne sont jamais livrées). Les combos du routeur suivent la même règle au niveau du modèle : une entrée n'est
> ajoutée **que si le modèle répond `chat-200` et sait appeler des outils** — un modèle sans support des outils,
> une clé morte ou un fournisseur mort est écarté au lieu d'être ajouté. Relancez l'étape de vérification à tout moment ;
> les échecs sont signalés, jamais masqués.

## 🧭 Fonctionnement

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Gonka Broker page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://proxy.gonkabroker.com/v1/chat/completions → real content = the key is live
```

1. Une nouvelle boîte mail est créée (alias temp.tf outlook/hotmail).
2. Chrome ouvre `app.gonkabroker.com/signup`, remplit l'e-mail + le mot de passe et clique sur **Create account** avec un vrai clic de souris — c'est le token reCAPTCHA Enterprise de la page elle-même que le serveur évalue, donc aucun token n'est collé et aucun service de captcha n'intervient.
3. Le lien de vérification est lu dans la boîte mail et ouvert (`GET /api/auth/verify-email?token=…`).
4. `POST /api/auth/login` → token de session.
5. `POST /api/wallets {name, type:"proxy"}` → la clé API (renvoyée une seule fois, sous `secretKey`).
6. La clé est prouvée (`/v1/models` + deux appels de chat + un appel d'outil) et seulement ensuite ajoutée à `keys.txt`.

## ⚙️ Options CLI

| Option | Ce qu'elle fait |
| --- | --- |
| `--count N` | combien de clés créer (par défaut 1) |
| `--auto` | non interactif ; ce que passe le lanceur |
| `--pool proxies.txt` | envoie chaque requête **et** le navigateur via les lignes de proxy du fichier |
| `--headless` | Chrome en mode headless (par défaut : fenêtre visible) |
| `--dry` | affiche le plan, ne change rien |

## 🛰️ Derrière un proxy

Sans `--pool`, l'outil communique directement avec le fournisseur. Avec `--pool`, il lit un proxy par ligne (`http://user:pass@host:port` ou `socks5://host:port`) et associe **chaque compte à une ligne** — l'inscription, la consultation de la boîte mail et la vérification sortent toutes par la même sortie, et une ligne morte fait échouer le compte au lieu de passer silencieusement en direct.

## 📄 Fichiers

| Chemin | Quoi |
| --- | --- |
| `src/cli.js` | le CLI de création (`--count`, `--auto`, `--pool`, `--dry`) |
| `src/launcher.js` | menu : créer, se connecter à 9Router, se connecter à OmniRoute, docs |
| `src/solver.js` | session Chrome qui effectue l'inscription (remplissage du formulaire + clic de confiance + capture de la réponse) |
| `src/connect-9router.js` | ajoute les clés comme connexions 9Router + entrées de combo |
| `src/connect-omniroute.js` | idem pour OmniRoute |
| `keys.txt` | sortie, une clé par ligne (ignorée par git) |

## 🔌 Se connecter à 9Router

**9Router** — `node src/connect-9router.js --keys keys.txt` crée une connexion par clé sous le préfixe `gonka` avec l'URL de base `https://proxy.gonkabroker.com/v1`.

**OmniRoute** — `node src/connect-omniroute.js --keys keys.txt` ajoute les mêmes clés comme nœud `openai-compatible-chat-gonka`, une connexion par clé.

Les deux connecteurs ajoutent aussi les trois modèles de chat dans des entrées de combo nommées d'après le modèle, car la route de ce fournisseur se résout par identifiant de modèle.

## 🔌 Se connecter à OmniRoute

**OmniRoute** — `node src/connect-omniroute.js --keys keys.txt` crée une connexion par clé sous le préfixe `gonka` avec l'URL de base `https://proxy.gonkabroker.com/v1`.

**OmniRoute** — `node src/connect-omniroute.js --keys keys.txt` ajoute les mêmes clés comme nœud `openai-compatible-chat-gonka`, une connexion par clé.

Les deux connecteurs ajoutent aussi les trois modèles de chat dans des entrées de combo nommées d'après le modèle, car la route de ce fournisseur se résout par identifiant de modèle.

## 🔑 Ce qu'une clé vous apporte

Chaque nouveau compte bénéficie du crédit mensuel gratuit indiqué ci-dessus. Un compte peut détenir plusieurs clés, mais elles puisent toutes dans le **même** quota — donc c'est une flotte de comptes, pas une flotte de clés, qui permet de monter en charge. L'outil crée par défaut un compte par clé et ne réutilise jamais une sortie qui a déjà produit un compte.

## 🐞 Problèmes

**`403 {"message":"We couldn't verify your request"}`** — l'inscription a été jugée risquée. C'est la sortie qui est évaluée : une IP de datacenter, une sortie déjà utilisée pour un autre compte, ou une popup qui a perdu le focus suffisent. Relancez via une autre ligne de proxy (ou directement depuis une connexion résidentielle) — l'outil traite cela comme un échec par compte et continue.

**`400 {"message":"Several accounts are already registered from this email domain"}`** — ce domaine de boîte mail est plafonné. Utilisez un autre fournisseur pour la boîte mail (`--mail-outlook` est la valeur par défaut car les alias outlook/hotmail sont acceptés ; les domaines jetables sont rejetés avec `Disposable email addresses are not supported`).

**`429 Free tier rate limit (6 RPM)`** — c'est le compte, pas la clé, qui est limité en débit. Répartissez les appels sur plusieurs comptes ou attendez une minute.

**`content` vide** — les modèles de raisonnement dépensent le budget dans `reasoning_content` ; augmentez `max_tokens` à 256+.

## 📄 Licence

MIT © 2026 — voir [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 gonka-bulk-apikey contributors

</div>