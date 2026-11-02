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

**Gonka Broker 계정과 API 키를 대량으로 생성하세요 — proxy.gonkabroker.com을 통한 OpenAI 호환 추론, 그리고 9Router 커넥터.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-4%20served-412991?style=for-the-badge)](https://app.gonkabroker.com)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 빠른 시작](#-quick-start) · [🎁 무료 티어](#-free-tier--how-much-you-get) · [🤖 모델](#-models--all-4-of-them) · [🧪 API 사용하기](#-how-to-use-the-api) · [✅ 검증됨](#-verified-working--every-key-is-tested) · [🧭 작동 방식](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ 옵션](#️-cli-options) · [🛰️ 프록시](#️-behind-a-proxy) · [🐞 문제](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ 이 도구가 존재하는 이유

Gonka Broker는 `https://proxy.gonkabroker.com/v1`에서 **OpenAI 호환** API를 제공하며, 모든 신규 계정에는 채팅 모델에 대한 **월간 무료 토큰 지급**이 포함됩니다 — 실측 결과: `zai-org/GLM-5.3-Flash`와 `deepseek-ai/DeepSeek-V4-Flash-0731`이 실제 완성을 응답하며, `MiniMaxAI/MiniMax-M2.7`도 마찬가지입니다. 키는 계정당 하나로 제한되지 않습니다: 지갑 엔드포인트는 `type: "proxy"`를 반복해서 받아들이므로, 하나의 검증된 계정이 여러 개의 키를 보유할 수 있습니다. 각 키는 `keys.txt`에 기록되기 전에 **실시간 chat-200으로 입증**됩니다.

## 🎁 무료 티어 — 얼마나 받을 수 있나

| 항목 | 값 |
| --- | --- |
| 무료 지급 | `zai-org/GLM-5.3-Flash`와 `deepseek-ai/DeepSeek-V4-Flash-0731`에 **월 120,000 토큰**; `MiniMaxAI/MiniMax-M2.7`에 **100,000**; `BAAI/bge-m3`(임베딩)에 **600,000** |
| 무료 티어 속도 제한 | 계정당 **분당 6회 요청** — 이를 초과하면 API가 충전 링크와 함께 `429`를 응답합니다 |
| 키당 제한 | `maxRpm` 600, 즉 계정 제한이 실질적인 제약입니다 |
| 카드 | 무료 티어에는 **필요 없음** (`freeTier: true`, `phoneVerified: false`) |

> 💡 무료 티어는 Gonka Broker가 설정하며 변경될 수 있습니다. [app.gonkabroker.com](https://app.gonkabroker.com)에서 실시간 수치를 확인하세요 — 그리고 도구 자체의 게이트가 판단하게 하세요:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 모델 — 총 4개

| 모델 | 컨텍스트 | $/1M 입력/출력 | 도구 |
| --- | --- | --- | --- |
| `zai-org/GLM-5.3-Flash` | 400k | 0.10 | ✅ |
| `deepseek-ai/DeepSeek-V4-Flash-0731` | 400k | 0.10 | ✅ |
| `MiniMaxAI/MiniMax-M2.7` | 204k | 0.12 | ✅ |
| `BAAI/bge-m3` | 8k | 0.02 | — (임베딩) |

키 게이트는 두 개의 서로 다른 프롬프트와 `get_time` 도구 호출을 실행하므로, 응답은 하지만 도구를 사용할 수 없는 키도 여전히 허용됩니다 — 실행 로그의 모델 보고서가 해당 키가 어느 등급에 속했는지 알려줍니다.

## 🧪 API 사용 방법

```bash
curl https://proxy.gonkabroker.com/v1/chat/completions \
  -H "Authorization: Bearer $GONKA_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"MiniMaxAI/MiniMax-M2.7","messages":[{"role":"user","content":"pong"}],"max_tokens":256}'
```

추론 모델은 첫 토큰을 `reasoning_content`에 넣습니다 — `max_tokens`를 **256 이상**으로 설정하세요. 그렇지 않으면 `content`가 빈 값으로 반환됩니다.

## 🛠 빠른 시작

```bash
npm install
npm start          # menu → 1) Mint keys → how many? → done
# or non-interactive:
node src/cli.js --count 5 --auto
```

키는 `keys.txt`에 한 줄에 하나씩 저장되며, 각 키는 이미 실시간 완성에 응답한 상태입니다.

### 🖱️ 런처

`npm start`는 작은 메뉴를 엽니다. **1) Mint keys**는 개수만 물은 다음 키를 생성하고 요약 표를 출력합니다. 토큰, 캡차, 사이트키 질문은 없습니다: 도구가 여는 브라우저가 가입 과정의 일부로 페이지 자체의 챌린지를 해결합니다. 캡차는 항상 보이는 Chrome 창만 필요로 합니다 — `--headless`는 선택 사항이며 통과가 더 느립니다.

## ✅ 검증됨 — 모든 키가 테스트됩니다

```
$ node src/cli.js --count 1 --auto
[1/1] OK gnk_xxxxxxxx… · chat-200 MiniMaxAI/MiniMax-M2.7
```

`keys.txt`에 기록되는 모든 키는 동일한 게이트를 통과했습니다: `/v1/models` 200, 비어 있지 않은 답변을 가진 두 개의 서로 다른 프롬프트, 그리고 `get_time` 도구 호출.

> **품질 게이트.** 여기의 모든 키는 `keys.txt`에 기록되기 전에 실시간 `chat-200`을 통과했습니다
> (죽은 키는 절대 배포되지 않습니다). 라우터 조합도 모델 수준에서 동일한 규칙을 따릅니다: 항목은
> **모델이 `chat-200`에 응답하고 도구를 호출할 수 있는 경우에만** 추가됩니다 — 도구 지원이 없는 모델,
> 죽은 키 또는 죽은 제공자는 추가되지 않고 제외됩니다. 언제든지 검증 단계를 다시 실행하세요;
> 실패는 보고되며 절대 숨겨지지 않습니다.

## 🧭 작동 방식

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Gonka Broker page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://proxy.gonkabroker.com/v1/chat/completions → real content = the key is live
```

1. 새 메일함이 생성됩니다 (temp.tf outlook/hotmail 별칭).
2. Chrome이 `app.gonkabroker.com/signup`을 열고, 이메일 + 비밀번호를 입력한 뒤 실제 마우스 클릭으로 **Create account**를 클릭합니다 — 서버가 평가하는 것은 페이지 자체의 reCAPTCHA Enterprise 토큰이므로, 토큰을 붙여넣지 않으며 캡차 서비스도 관여하지 않습니다.
3. 메일함에서 인증 링크를 읽고 엽니다 (`GET /api/auth/verify-email?token=…`).
4. `POST /api/auth/login` → 세션 토큰.
5. `POST /api/wallets {name, type:"proxy"}` → API 키 (`secretKey`로 한 번만 반환됨).
6. 키가 입증되고 (`/v1/models` + 두 번의 채팅 호출 + 도구 호출) 그 후에야 `keys.txt`에 추가됩니다.

## ⚙️ CLI 옵션

| 플래그 | 기능 |
| --- | --- |
| `--count N` | 생성할 키 개수 (기본값 1) |
| `--auto` | 비대화형; 런처가 전달하는 옵션 |
| `--pool proxies.txt` | 모든 요청 **및** 브라우저를 파일의 프록시 라인을 통해 전송 |
| `--headless` | 헤드리스 Chrome (기본값: 보이는 창) |
| `--dry` | 계획만 출력하고 아무것도 변경하지 않음 |

## 🛰️ 프록시 뒤에서

`--pool` 없이 도구는 제공자와 직접 통신합니다. `--pool`을 사용하면 한 줄에 하나의 프록시(`http://user:pass@host:port` 또는 `socks5://host:port`)를 읽고 **각 계정을 하나의 라인에 고정**합니다 — 가입, 메일함 폴링, 인증이 모두 동일한 출구를 통해 나가며, 죽은 라인은 조용히 직접 연결로 전환되는 대신 해당 계정을 실패시킵니다.

## 📄 파일

| 경로 | 설명 |
| --- | --- |
| `src/cli.js` | 키 생성 CLI (`--count`, `--auto`, `--pool`, `--dry`) |
| `src/launcher.js` | 메뉴: 키 생성, 9Router 연결, OmniRoute 연결, 문서 |
| `src/solver.js` | 가입을 수행하는 Chrome 세션 (양식 작성 + 신뢰할 수 있는 클릭 + 응답 캡처) |
| `src/connect-9router.js` | 키를 9Router 연결 + 조합 항목으로 추가 |
| `src/connect-omniroute.js` | OmniRoute용 동일 기능 |
| `keys.txt` | 출력, 한 줄에 하나의 키 (git 무시됨) |

## 🔌 9Router에 연결

**9Router** — `node src/connect-9router.js --keys keys.txt`는 접두사 `gonka`와 기본 URL `https://proxy.gonkabroker.com/v1`로 키당 하나의 연결을 생성합니다.

**OmniRoute** — `node src/connect-omniroute.js --keys keys.txt`는 동일한 키를 `openai-compatible-chat-gonka` 노드로 추가하며, 키당 하나의 연결입니다.

두 커넥터 모두 세 개의 채팅 모델을 모델 이름을 딴 조합 항목에 추가합니다. 이 제공자의 라우트는 모델 ID별로 해석되기 때문입니다.

## 🔌 OmniRoute에 연결

**OmniRoute** — `node src/connect-omniroute.js --keys keys.txt`는 접두사 `gonka`와 기본 URL `https://proxy.gonkabroker.com/v1`로 키당 하나의 연결을 생성합니다.

**OmniRoute** — `node src/connect-omniroute.js --keys keys.txt`는 동일한 키를 `openai-compatible-chat-gonka` 노드로 추가하며, 키당 하나의 연결입니다.

두 커넥터 모두 세 개의 채팅 모델을 모델 이름을 딴 조합 항목에 추가합니다. 이 제공자의 라우트는 모델 ID별로 해석되기 때문입니다.

## 🔑 키 하나로 얻는 것

모든 신규 계정에는 위의 월간 무료 지급이 포함됩니다. 하나의 계정이 여러 개의 키를 보유할 수 있지만, 모두 **동일한** 할당량을 사용합니다 — 따라서 확장되는 것은 키의 집합이 아니라 계정의 집합입니다. 도구는 기본적으로 키당 하나의 계정을 생성하며, 이미 계정을 생성한 출구를 재사용하지 않습니다.

## 🐞 문제

**`403 {"message":"We couldn't verify your request"}`** — 가입이 위험하다고 평가되었습니다. 평가 대상은 출구입니다: 데이터센터 IP, 이미 다른 계정에 사용된 출구, 또는 포커스를 잃은 팝업이 원인입니다. 다른 프록시 라인(또는 주거용 연결에서 직접)을 통해 다시 실행하세요 — 도구는 이를 계정별 실패로 처리하고 계속 진행합니다.

**`400 {"message":"Several accounts are already registered from this email domain"}`** — 해당 메일함 도메인이 한도에 도달했습니다. 메일함에 다른 제공자를 사용하세요 (`--mail-outlook`이 기본값인 이유는 outlook/hotmail 별칭이 허용되기 때문입니다; 일회용 도메인은 `Disposable email addresses are not supported`와 함께 거부됩니다).

**`429 Free tier rate limit (6 RPM)`** — 키가 아니라 계정이 속도 제한됩니다. 호출을 여러 계정에 분산하거나 1분 기다리세요.

**빈 `content`** — 추론 모델은 예산을 `reasoning_content`에 사용합니다; `max_tokens`를 256 이상으로 높이세요.

## 📄 라이선스

MIT © 2026 — [LICENSE](LICENSE) 참조.

<div align="center">

**[MIT](LICENSE)** © 2026 gonka-bulk-apikey contributors

</div>