# Playwright QA example: Three owned public website flows

**Synthetic sample, not client work or a completed paid order.**

Observed (UTC): 2026-10-16T18:11:41.080Z
Chrome: 152.0.7977.75
Library: playwright-core 1.58.2

| Flow | Viewport | HTTP | Evidence |
|---|---:|---:|---|
| F1 USD sample quote and Korean UI | 1440px | 200 | [evidence/01-usd-quote-desktop.png](evidence/01-usd-quote-desktop.png) |
| F2 KRW example, mobile layout and safe text | 390px | 200 | [evidence/02-krw-mobile.png](evidence/02-krw-mobile.png) |
| F3 Service to inquiry CTA and consent | 390px | 200 | [evidence/03-consent-inquiry-mobile.png](evidence/03-consent-inquiry-mobile.png) |

## Observations

- **F1**: Line item 200 USD × 4 => 800 USD, less 20% => 640 USD, plus 10% on discounted subtotal => 704 USD. Korean UI toggle works.
- **F2**: 700,000 KRW minus 35,000 KRW discount plus illustrative 66,500 KRW tax => 731,500 KRW. HTML-like user text stays text, never becomes DOM markup.
- **F3**: Three service cards. Visible contact CTA reaches required empty form and mandatory third-party relay consent. No password/upload fields. Form NOT submitted.

No uncaught JavaScript errors and no network request outside livastic-vm1-primary.github.io during these runs.

## Limits

- Not a security audit or regulatory compliance assessment.
- No private/authenticated/customer systems exercised.
- Contact form NOT submitted; email delivery not retested.
- The money calculations are hypothetical, not tax advice.
- No paid customer, settlement, deposit, or revenue is claimed.

## Re-run with Google Chrome installed

~~~bash
npm ci --include=dev
CHROME_EXECUTABLE=/usr/bin/google-chrome npm test
~~~

Tests use only publicly accessible pages, never customer credentials or production mutations.
