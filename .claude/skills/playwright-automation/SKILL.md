---
name: playwright-automation
description: Use when writing, converting, or running Playwright specs for ToolsShop — turning a manual Xray test case into automation, or "write a Playwright test for X". Covers spec naming (TS-<testKey>.spec.ts), selector sourcing from feature-map.md Section 3 only, page-object conventions, baseURL (localhost vs Netlify), run commands, and the HTML report location.
---

# Playwright Automation

## Spec naming

One spec file per automated test case: `tests/TS-<testKey>.spec.ts`, e.g.
`tests/TS-35.spec.ts` for "Cart: apply valid coupon TEST10 shows discount". The test key in
the filename is the Xray Test issue key (see `test-case-design`), not the story/epic key —
this is what lets a pre-commit hook and the automation-engineer agent trace a spec back to its
manual case.

## Spec header

Every spec file opens with a comment block naming its Xray test key and the story/epic it
belongs to, so traceability survives even if the file is read outside Jira:

```ts
// Xray: TS-35 — Cart: apply valid coupon TEST10 shows discount
// Story/Epic: TS-2 (Cart)
import { test, expect } from '@playwright/test';
```

## Sourcing selectors from the test case

When converting an Xray manual test case to a spec, read selectors from the step's **Data**
field (per `test-case-design`'s step-writing convention) — not from the Action/Expected
Result prose, which is plain human language. Only for **legacy tests (TS-23..TS-40)**, which
predate that convention and carry selectors inline in the step text, fall back to parsing them
out of the prose.

**Seed data is write-once**, same rule as `test-case-design`: `scripts/xray/seed-data/*.json`
is a creation payload, not a live source. Once a test exists, read its current steps from
Xray — never from the seed JSON.

## Selectors

Exactly the same rule as `test-case-design`: every selector is a `data-test` attribute listed
in `docs/feature-map.md` Section 3, verified with `grep -rn "data-test" pages/ components/`
before use — never written from memory. Use Playwright's `getByTestId()` (configure
`testIdAttribute: 'data-test'` in `playwright.config.ts`, since Playwright defaults to
`data-testid`) rather than raw CSS attribute selectors, so intent stays readable:

```ts
await page.getByTestId('coupon-code').fill('TEST10');
await page.getByTestId('coupon-apply').click();
await expect(page.getByTestId('cart-discount')).toHaveText('-$1.20');
```

## Page-object conventions

One page object per app page, under `tests/pages/` (kept separate from the app's own
`pages/` directory to avoid confusion). A page object:

- Is named `<Area>Page` (e.g. `CartPage`, `CheckoutPage`) and takes a Playwright `Page` in
  its constructor.
- Exposes **locators** as readonly properties (built from `data-test` ids) and **actions** as
  methods that compose locators (e.g. `applyCoupon(code: string)`), not raw assertions —
  assertions stay in the spec file, not the page object.
- Does not hardcode expected values (prices, totals) — those come from the spec, sourced from
  `constants.ts` per `test-case-design`, so a page object is reusable across tests with
  different fixture data.

```ts
// tests/pages/CartPage.ts
export class CartPage {
  constructor(private page: Page) {}
  couponInput = this.page.getByTestId('coupon-code');
  couponApply = this.page.getByTestId('coupon-apply');
  discount = this.page.getByTestId('cart-discount');

  async applyCoupon(code: string) {
    await this.couponInput.fill(code);
    await this.couponApply.click();
  }
}
```

## baseURL: localhost vs Netlify

`playwright.config.ts` sets `use.baseURL` to `http://localhost:5173` by default (dev server
must be running: `npm run dev`). To run the same suite against the hosted environment instead:

```
PLAYWRIGHT_BASE_URL=https://tanweertoolsshop.netlify.app npx playwright test
```

`playwright.config.ts` should read `process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:5173'`
— don't hardcode one or the other. Use localhost for in-progress feature branches, Netlify for
testing the current shipped `main` state (per the Test Strategy's Environments table).

## Run commands and report location

- `npx playwright test` — run the full suite.
- `npx playwright test tests/TS-35.spec.ts` — run a single spec.
- `npx playwright show-report` — opens the HTML report from the last run.
- Report output lands in `playwright-report/` at the repo root (already gitignored, along with
  `test-results/`) — never commit report output.

## Governance

Automation specs are read/write to the filesystem and `git`, not to Jira/Xray/Confluence — no
approval gate applies to writing or running a spec. Opening a PR with the spec still follows
normal repo conventions (branch/commit naming per `CLAUDE.md`).
