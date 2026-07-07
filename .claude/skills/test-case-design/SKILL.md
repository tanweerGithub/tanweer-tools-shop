---
name: test-case-design
description: Use when designing, writing, or reviewing test cases for ToolsShop — manual Xray tests, test case drafts for a story/epic, or "design test cases for X" requests. Covers the summary/precondition/steps format, selector sourcing from feature-map.md, design heuristics (equivalence partitioning, boundary values, negative paths, state transitions), the ambiguous-requirement rule, and the Xray write/link path.
---

# Test Case Design

## Format

Every test case has four parts:

1. **Summary** — `Area: behavior`, e.g. `Cart: apply valid coupon TEST10 shows discount`,
   `Product Listing: combined category filter + search intersection`. Area matches a
   feature-map.md Section 1 area (Product Listing, Cart, Checkout, Auth, Contact, Orders).
   Match the tone/granularity of the existing repository: TS-23..TS-40 (see
   `scripts/xray/seed-data/*.json`) are the canonical examples.
2. **Precondition** — one sentence of plain text, not a step. States the state the app/data
   must already be in (e.g. "Cart contains Claw Hammer ($12.00) at qty 1, on /cart.").
3. **Steps** — numbered; each step is an `{ action, data, expectedResult }` triple. See
   "Step-writing convention" below for how the three fields divide up.
4. **Expected values are concrete** — real prices, exact totals, exact copy. Never write
   "the correct total" — write "$10.80". Never write "an error appears" if the real message
   is knowable — quote it.

## Step-writing convention: plain language, selectors in Data

Action and Expected Result are written in plain human/user language — no selector notation,
no `data-test` ids, no raw values buried in the prose. A tester unfamiliar with the codebase
should be able to read the step and know what to do and what to expect without knowing the
DOM. All `data-test` selectors and concrete test data values go in the step's **Data**
field — the `createTest` mutation's `data` property (see Write path).

Example:

- **Action:** Click the decrease-quantity button on the item's row
- **Data:** `decrease-quantity-{id}`; `product-quantity`; `line-total`; `cart-subtotal`
- **Expected Result:** Quantity shows 1; line total $12.00; subtotal updates accordingly.

**Legacy note:** TS-23..TS-40 predate this convention — their step text has selectors inline.
Do not migrate them; apply this convention to new tests going forward.

## Where expected values come from

Never invent a number or string. Every concrete value in a step must be traceable to one of:

- **`constants.ts`** — `MOCK_PRODUCTS` (id, name, price, category, stock), `VALID_COUPONS`
  (`TEST10`: 10%, `OFF20`: 20%), `DEMO_CREDENTIALS`.
- **Live behavior you (or a prior audit) observed** — e.g. `docs/feature-map.md` Section 5
  ("Observed behavior"), or by actually driving the app via Playwright MCP. If you compute a
  derived value (a discounted total, a filtered count), show the arithmetic came from real
  inputs: "10% of $12.00 = $1.20 discount → total $10.80", not just the answer.

If you can't trace a value to constants.ts or observed behavior, don't write the test yet —
go verify it live first.

## UI text and message copy

The same traceability rule that applies to numbers applies to message/label copy. Expected UI
text in a step must be traceable to one of:

- **Live behavior you verified** — you actually observed the exact string in the running app.
- **The PRD** — quoted verbatim from the Confluence page.

If neither is available (the PRD is silent on the exact copy and you haven't verified it
live), don't invent the string. Write the expected result as a **pattern**, not prose that
looks like a quote — e.g. "a success message is shown" rather than "You have successfully
placed your order!" — and raise the exact copy as a question for the BA (see Ambiguous or
silent requirements below).

**Worked example (2026-07-07 incident):** TS-42, TS-43, and TS-48 each asserted invented
success-message text that was never verified live or present in the PRD. Corrected by
replacing the invented strings with pattern-level expected results plus a BA question about
the exact copy.

## Selectors

Every `data-test` selector a step needs goes in that step's **Data** field (never inline in
Action/Expected Result prose — see Step-writing convention above), and must be **only** one
listed in `docs/feature-map.md` Section 3. Before using a selector:

- Grep it to confirm it's real and current: `grep -rn "data-test.*=.*\"<name>\"" pages/ components/`
  (or the template-literal form for selectors like `add-to-cart-{product.id}`).
- Never use a selector from memory or from a similar-sounding prior project. feature-map.md
  can go stale — if grep doesn't find it, treat the map as wrong and flag it, don't guess.

## Design heuristics

Apply these deliberately when deriving cases from a requirement, not just the happy path:

- **Equivalence partitioning** — one representative case per class of input (valid coupon /
  invalid coupon / empty coupon), not one per possible value.
- **Boundary value analysis** — edges of ranges: min/max price slider, qty 0/1, empty cart,
  single-item vs multi-item cart, first/last product in a sorted list.
- **Negative paths** — invalid input, wrong credentials, malformed data, missing required
  fields — not just "what should work."
- **State transitions** — behavior that depends on sequence: apply coupon → change quantity;
  login → logout → cart state; add to cart → remove → re-add.
- **Combination / intersection cases** — two filters/conditions applied together (e.g. category
  filter + search text) to confirm intersection, not accidental union — see TS-30 in
  `product-listing.json` for the pattern.

## Ambiguous or silent requirements: never assume

If a PRD, story, or acceptance criterion doesn't say what should happen in some case, **write
it as a question for the BA** — do not invent the expected result and do not silently skip the
case. Example: the "PRD: Checkout Coupon Codes" page (Confluence) says nothing about coupon
code case-sensitivity, and nothing about recalculating the discount after the cart changes
post-application. Both are real, observable behaviors in the app today (see feature-map.md
Section 5), but since the PRD is silent, don't encode "the current behavior is correct" as an
expected result in a *new* test derived from that PRD — flag it instead:

> **Question for BA:** PRD does not specify whether coupon codes are case-sensitive
> (observed: `test10` is rejected, only exact-case `TEST10` works). Is this intended?

Regression tests for *already-shipped, already-specified* behavior (like the TS-23..40 seed
set) are different — there the observed behavior is itself the spec, so it's fine to encode it.
The rule applies to *new* requirements with a silent PRD, not to characterizing existing behavior.

## Where tests live

Tests are Jira issues, **issue type `Test`**, **test type `Manual`**, project `TS`. They are
not separate Xray-only objects — `getJiraIssue`/JQL will show them like any other issue
(see TS-23..TS-40).

## Write path

Tests are created via GraphQL, not the Atlassian MCP directly (Atlassian MCP can't write Xray
step data). Use the scripts in `scripts/xray/`:

- `scripts/xray/seed-data/<area>.json` — one file per feature area, shape:
  ```json
  {
    "storyKey": "TS-7",
    "linkType": { "name": "Test", "outward": "tests", "inward": "is tested by" },
    "tests": [
      { "summary": "...", "precondition": "...", "steps": [{ "action": "...", "data": "...", "expectedResult": "..." }] }
    ]
  }
  ```
  See `references/seed-data-example.md` for a full worked file.
- `node scripts/xray/create-test.mjs <seed-file.json> <test-index>` — creates one Test issue
  per invocation (`testType: Manual`, `project: TS`). Requires `XRAY_CLIENT_ID` /
  `XRAY_CLIENT_SECRET` env vars (never commit these).
- After creation, link each Test to its story/epic — see Linking below.
- `node scripts/xray/create-test-execution.mjs <summary> <date> <testIssueId...>` — records a
  historical execution once tests exist.

**Seed data is write-once.** `scripts/xray/seed-data/*.json` files are creation payloads for
`create-test.mjs`, nothing more. Once a test exists in Xray, Xray is the source of truth for
its current content — read existing tests via the GraphQL client (see `test-executor`'s fetch
pattern), never by re-reading the seed JSON, which never reflects edits made later in Xray.

## Linking convention (documented, counter-intuitive)

Link type is **`Test`** (`inward: "is tested by"`, `outward: "tests"`). Link Tests to their
Story or Epic using `mcp__atlassian__createIssueLink`, but its `inwardIssue`/`outwardIssue`
parameters are inverted from what the link's own field names suggest:

- `inwardIssue` = **the Test** issue key
- `outwardIssue` = **the Story or Epic** issue key
- `type` = `"Test"`

This was verified against real data: TS-31 ("Cart: add to cart updates badge") is linked to
epic TS-2 ("Cart") this way, and TS-31's own `issuelinks` renders it holding the *outward*
("tests") role toward TS-2 — i.e., passing the Test as `inwardIssue` is what makes the Test
end up as the "tests" side. Don't re-derive this each time; just apply it.

## Coverage targets

- **Story-specific tests** link to the story they validate (feature just built/changed).
- **Epic-level regression tests** (the bulk of TS-23..40) link to the feature-area epic, and
  are what the `impact-analysis` skill pulls when assessing regression scope for an unrelated
  change to that area.

## Governance

Never call `create-test.mjs`, `create-test-execution.mjs`, or `createIssueLink` without
showing the exact test content (summary, precondition, steps, target story/epic) and getting
approval first — per repo governance rules.
