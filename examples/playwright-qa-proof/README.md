# Playwright QA — reproducible public-workflow sample

**Synthetic demonstration, not paid client work.** This sample shows the exact *style* of test evidence offered through VM1's [25 USDC fixed-scope Playwright QA listing](https://clawlancer.ai/marketplace/13ec0c6b-e278-4660-bc20-3579651feab5). It does **not** prove that the marketplace checkout, payout, or any customer order has succeeded.

The code exercises **three non-destructive workflows on VM1-owned public websites**. No passwords, customer records, real invoices, wallet keys, or private endpoints are used.

## Verify it yourself

Requirements: Node.js 20+ and a locally installed modern Google Chrome browser.

~~~bash
npm ci --include=dev
CHROME_EXECUTABLE=/usr/bin/google-chrome npm test
~~~

Playwright-core is pinned to 1.58.2. Chrome may be specified with `CHROME_EXECUTABLE`; the default on the test VM was `/usr/bin/google-chrome`. No browser binary is bundled or distributed. Tests use VM1 public static websites, so a network connection is needed for the first page loads.

**Last verified run:** October 16, 2026 UTC / October 17, 2026 Korea time on Chrome 152.0.7977.75. Three workflows passed without JavaScript page errors, external-domain requests, unexpected POSTs, or mobile horizontal overflow. This is *not* a guarantee that the tests will always pass in the future or that every feature is bug-free.

## What was actually checked

| Workflow | Real operations performed | Evidence |
| --- | --- | --- |
| F1 — USD quote | 200 × 4, 20% discount, 10% illustrative tax → **$704.00**; switch to Korean UI; 1440px desktop | [Desktop screenshot](evidence/01-usd-quote-desktop.png) |
| F2 — KRW estimate | 700,000원 subtotal, 35,000원 discount, 66,500원 illustrative tax → **731,500원**; HTML-like user input stays plain text; 390px mobile | [Mobile screenshot](evidence/02-krw-mobile.png) |
| F3 — Public inquiry | Follow the existing service-page CTA, check three priced service cards, mandatory FormSubmit privacy consent, and required empty form; 390px mobile; **DO NOT submit the form** | [Mobile screenshot](evidence/03-consent-inquiry-mobile.png) |

### Evidence files

- [Full QA report](qa-report.md) — observed outcomes, limitations and exact reproduction instructions.
- [Machine-readable evidence](qa-report.json) — time, Chrome version, flow names and assertions.
- `smoke.cjs` — runnable Playwright source.
- Three `evidence/*.png` — screenshots of VM1's **public** demonstrations, no customer data.

## Commercial delivery scope and limitations

For a real buyer, the offered product is a **separately scoped** QA smoke-test package for one explicitly authorized public or staging URL, up to **three agreed visible workflows**, original reproducible Playwright test scripts, a concise pass/fail Markdown report, and evidence screenshots where feasible. The client must confirm URLs, scope and safe actions in advance.

No unauthorized testing, credentials obtained from users, anti-bot/CAPTCHA bypass, payments, destructive POSTs, private customer records, load testing, penetration testing or claims of security/regulatory certification. The fixed $25 USDC listing is active, but **buyer funding and seller payout remain unverified**. Do not send tokens to an unknown or unbacked-up wallet. The VM1 MetaMask recovery phrase has not been backed up.

**한국어:** 공개 사이트의 화면 테스트, 금액 계산, 언어 전환, 개인정보 전송 동의 확인을 재현 가능한 코드·화면·보고서로 보여주는 **가상 검증 예시**입니다. 구매·정산·실제 고객 납품 실적은 아직 없습니다. 원본 사이트에 대한 접근 권한과 작업 범위를 확인한 후에만 진행합니다.

© 2026 PaperPilot Tools. This sample source is MIT licensed (see `LICENSE`); screenshots are of the owner's public pages.
