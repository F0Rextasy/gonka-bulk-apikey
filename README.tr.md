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

**Toplu olarak Gonka Broker hesabı ve API anahtarı oluşturun — proxy.gonkabroker.com üzerinden OpenAI uyumlu çıkarım, ayrıca bir 9Router bağlayıcısı.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-4%20served-412991?style=for-the-badge)](https://app.gonkabroker.com)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Hızlı başlangıç](#-quick-start) · [🎁 Ücretsiz katman](#-free-tier--how-much-you-get) · [🤖 Modeller](#-models--all-4-of-them) · [🧪 API'yi kullanma](#-how-to-use-the-api) · [✅ Doğrulandı](#-verified-working--every-key-is-tested) · [🧭 Nasıl çalışır](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ Seçenekler](#️-cli-options) · [🛰️ Proxy'ler](#️-behind-a-proxy) · [🐞 Sorunlar](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Bu neden var

Gonka Broker, `https://proxy.gonkabroker.com/v1` adresinde **OpenAI uyumlu** bir API sunar ve her yeni hesap, sohbet modellerinde **ücretsiz aylık token hakkı** taşır — canlı ölçüldü: `zai-org/GLM-5.3-Flash` ve `deepseek-ai/DeepSeek-V4-Flash-0731` gerçek bir tamamlama yanıtı veriyor, `MiniMaxAI/MiniMax-M2.7` de öyle. Anahtarlar hesap başına bir taneyle sınırlı değildir: cüzdan uç noktası `type: "proxy"` değerini tekrar tekrar kabul eder, yani tek bir doğrulanmış hesap bir anahtar filosu barındırabilir. Her anahtar, `keys.txt` dosyasına yazılmadan önce **canlı bir chat-200 ile kanıtlanır**.

## 🎁 Ücretsiz katman — ne kadar alıyorsunuz

| Ne | Değer |
| --- | --- |
| Ücretsiz hak | `zai-org/GLM-5.3-Flash` ve `deepseek-ai/DeepSeek-V4-Flash-0731` için **ayda 120.000 token**; `MiniMaxAI/MiniMax-M2.7` için **100.000**; `BAAI/bge-m3` (gömme) için **600.000** |
| Ücretsiz katman hız sınırı | Hesap başına **dakikada 6 istek** — bunun üzerinde API, bir bakiye yükleme bağlantısıyla birlikte `429` yanıtı verir |
| Anahtar başına sınır | `maxRpm` 600, yani bağlayıcı olan hesap sınırıdır |
| Kart | Ücretsiz katman için **gerekli değil** (`freeTier: true`, `phoneVerified: false`) |

> 💡 Ücretsiz katman Gonka Broker tarafından belirlenir ve değişebilir. Güncel rakamları [app.gonkabroker.com](https://app.gonkabroker.com) adresinden kontrol edin — ve aracın kendi kapısının karar vermesine izin verin:

```bash
node src/cli.js --verify-only     # keys.txt içindeki her anahtar gerçek bir sohbet çağrısıyla yeniden test edilir
```

## 🤖 Modeller — dördü de

| Model | Bağlam | 1M giriş/çıkış $ | Araçlar |
| --- | --- | --- | --- |
| `zai-org/GLM-5.3-Flash` | 400k | 0.10 | ✅ |
| `deepseek-ai/DeepSeek-V4-Flash-0731` | 400k | 0.10 | ✅ |
| `MiniMaxAI/MiniMax-M2.7` | 204k | 0.12 | ✅ |
| `BAAI/bge-m3` | 8k | 0.02 | — (gömmeler) |

Anahtar kapısı iki farklı istem ve bir `get_time` araç çağrısı çalıştırır, böylece yanıt veren ama araçlarla konuşamayan bir anahtar yine de kabul edilir — çalışma günlüğündeki model raporu, hangi sınıfa düştüğünü size söyler.

## 🧪 API nasıl kullanılır

```bash
curl https://proxy.gonkabroker.com/v1/chat/completions \
  -H "Authorization: Bearer $GONKA_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"MiniMaxAI/MiniMax-M2.7","messages":[{"role":"user","content":"pong"}],"max_tokens":256}'
```

Akıl yürütme modelleri ilk tokenları `reasoning_content` içine koyar — `max_tokens` değerini **256 veya daha fazla** verin, aksi halde `content` boş döner.

## 🛠 Hızlı başlangıç

```bash
npm install
npm start          # menü → 1) Anahtar oluştur → kaç tane? → bitti
# veya etkileşimsiz:
node src/cli.js --count 5 --auto
```

Anahtarlar `keys.txt` dosyasına düşer, her satırda bir tane, ve her biri zaten canlı bir tamamlama yanıtlamıştır.

### 🖱️ Başlatıcı

`npm start` küçük bir menü açar. **1) Anahtar oluştur** yalnızca bir adet sorar, sonra anahtarları oluşturur ve bir özet tablo yazdırır. Token, captcha veya sitekey sorusu yoktur: aracın açtığı tarayıcı, kayıt sürecinin bir parçası olarak sayfanın kendi doğrulamasını çözer. Captcha yalnızca görünür bir Chrome penceresi ister — `--headless` isteğe bağlıdır ve geçmesi daha yavaştır.

## ✅ Doğrulandı — her anahtar test edilir

```
$ node src/cli.js --count 1 --auto
[1/1] OK gnk_xxxxxxxx… · chat-200 MiniMaxAI/MiniMax-M2.7
```

`keys.txt` dosyasına yapılan her yazma aynı kapıdan geçti: `/v1/models` 200, boş olmayan yanıtlarla iki farklı istem ve bir `get_time` araç çağrısı.

> **Kalite kapıları.** Buradaki her anahtar, `keys.txt` dosyasına yazılmadan önce canlı bir `chat-200` geçti
> (ölü anahtarlar asla gönderilmez). Yönlendirici kombinasyonları model düzeyinde aynı kuralı izler: bir giriş
> **yalnızca model `chat-200` yanıtlıyorsa ve araçları çağırabiliyorsa** eklenir — araç desteği olmayan bir model,
> ölü bir anahtar veya ölü bir sağlayıcı eklenmek yerine çıkarılır. Doğrulama adımını istediğiniz zaman yeniden çalıştırın;
> hatalar bildirilir, asla gizlenmez.

## 🧭 Nasıl çalışır

```
gelen kutusu (hesap başına bir adres)                            hesap başına yeni bir adres
   │
   ├─▶ kayıt: Gonka Broker sayfası → e-posta adresi → gelen kutusundan kod / bağlantı
   ├─▶ oturum: hesabın çerezleri veya erişim tokenı elde
   ├─▶ anahtar oluşturma: hesabın anahtar uç noktası → düz metin anahtar bir kez döner (hemen diske yazılır)
   └─▶ canlı kanıt: POST https://proxy.gonkabroker.com/v1/chat/completions → gerçek içerik = anahtar canlı
```

1. Yeni bir posta kutusu oluşturulur (temp.tf outlook/hotmail takma adı).
2. Chrome `app.gonkabroker.com/signup` adresini açar, e-posta + parola doldurur ve **Hesap oluştur** düğmesine gerçek bir fare tıklamasıyla basar — sunucunun puanladığı şey sayfanın kendi reCAPTCHA Enterprise tokenıdır, yani hiçbir token yapıştırılmaz ve hiçbir captcha hizmeti devreye girmez.
3. Doğrulama bağlantısı posta kutusundan okunur ve açılır (`GET /api/auth/verify-email?token=…`).
4. `POST /api/auth/login` → oturum tokenı.
5. `POST /api/wallets {name, type:"proxy"}` → API anahtarı (bir kez, `secretKey` olarak döner).
6. Anahtar kanıtlanır (`/v1/models` + iki sohbet çağrısı + bir araç çağrısı) ve ancak bundan sonra `keys.txt` dosyasına eklenir.

## ⚙️ CLI seçenekleri

| Bayrak | Ne yapar |
| --- | --- |
| `--count N` | kaç anahtar oluşturulacağı (varsayılan 1) |
| `--auto` | etkileşimsiz; başlatıcının geçtiği şey |
| `--pool proxies.txt` | her isteği **ve** tarayıcıyı dosyadaki proxy satırları üzerinden gönder |
| `--headless` | başsız Chrome (varsayılan: görünür pencere) |
| `--dry` | planı yazdır, hiçbir şeyi değiştirme |

## 🛰️ Proxy arkasında

`--pool` olmadan araç sağlayıcıyla doğrudan konuşur. `--pool` ile satır başına bir proxy okur (`http://user:pass@host:port` veya `socks5://host:port`) ve **her hesabı tek bir satıra sabitler** — kayıt, posta kutusu yoklaması ve doğrulama aynı çıkıştan geçer ve ölü bir satır, sessizce doğrudan gitmek yerine hesabı başarısız kılar.

## 📄 Dosyalar

| Yol | Ne |
| --- | --- |
| `src/cli.js` | anahtar oluşturma CLI'si (`--count`, `--auto`, `--pool`, `--dry`) |
| `src/launcher.js` | menü: anahtar oluştur, 9Router'a bağlan, OmniRoute'a bağlan, belgeler |
| `src/solver.js` | kaydı gerçekleştiren Chrome oturumu (form doldurma + güvenilir tıklama + yanıt yakalama) |
| `src/connect-9router.js` | anahtarları 9Router bağlantıları + kombinasyon girişleri olarak ekler |
| `src/connect-omniroute.js` | OmniRoute için aynısı |
| `keys.txt` | çıktı, satır başına bir anahtar (git tarafından yok sayılır) |

## 🔌 9Router'a bağlan

**9Router** — `node src/connect-9router.js --keys keys.txt`, `gonka` öneki altında, temel URL'si `https://proxy.gonkabroker.com/v1` olan, anahtar başına bir bağlantı oluşturur.

**OmniRoute** — `node src/connect-omniroute.js --keys keys.txt`, aynı anahtarları bir `openai-compatible-chat-gonka` düğümü olarak, anahtar başına bir bağlantıyla ekler.

Her iki bağlayıcı da üç sohbet modelini, modelin adını taşıyan kombinasyon girişlerine ekler, çünkü bu sağlayıcının rotası model kimliğine göre çözümlenir.

## 🔌 OmniRoute'a bağlan

**OmniRoute** — `node src/connect-omniroute.js --keys keys.txt`, `gonka` öneki altında, temel URL'si `https://proxy.gonkabroker.com/v1` olan, anahtar başına bir bağlantı oluşturur.

**OmniRoute** — `node src/connect-omniroute.js --keys keys.txt`, aynı anahtarları bir `openai-compatible-chat-gonka` düğümü olarak, anahtar başına bir bağlantıyla ekler.

Her iki bağlayıcı da üç sohbet modelini, modelin adını taşıyan kombinasyon girişlerine ekler, çünkü bu sağlayıcının rotası model kimliğine göre çözümlenir.

## 🔑 Bir anahtar size ne kazandırır

Her yeni hesap yukarıdaki ücretsiz aylık hakkı taşır. Bir hesap birkaç anahtar barındırabilir, ancak hepsi **aynı** kotayı çeker — yani ölçeklenen şey anahtar filosu değil, hesap filosudur. Araç varsayılan olarak anahtar başına bir hesap oluşturur ve zaten bir hesap üretmiş bir çıkışı asla yeniden kullanmaz.

## 🐞 Sorunlar

**`403 {"message":"We couldn't verify your request"}`** — kayıt riskli olarak puanlandı. Derecelendirilen şey çıkıştır: bir veri merkezi IP'si, başka bir hesap için zaten kullanılmış bir çıkış veya odağını kaybetmiş bir açılır pencere bunu tetikler. Farklı bir proxy satırı üzerinden (veya konut bağlantısından doğrudan) yeniden çalıştırın — araç bunu hesap başına bir hata olarak ele alır ve devam eder.

**`400 {"message":"Several accounts are already registered from this email domain"}`** — o posta kutusu alan adı sınıra ulaştı. Posta kutusu için farklı bir sağlayıcı kullanın (`--mail-outlook` varsayılandır çünkü outlook/hotmail takma adları kabul edilir; tek kullanımlık alan adları `Disposable email addresses are not supported` ile reddedilir).

**`429 Free tier rate limit (6 RPM)`** — hız sınırına takılan anahtar değil, hesaptır. Çağrıları birkaç hesaba yayın veya bir dakika bekleyin.

**Boş `content`** — akıl yürütme modelleri bütçeyi `reasoning_content` içinde harcar; `max_tokens` değerini 256+ yapın.

## 📄 Lisans

MIT © 2026 — bkz. [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 gonka-bulk-apikey katkıda bulunanlar

</div>