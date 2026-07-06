---
name: bug-reporting
description: Use when filing, drafting, or reviewing a bug report for ToolsShop — a Jira bug, a defect found during test execution, or "write a bug report for X". Mirrors the Confluence "Bug Report Template & Severity/Priority Matrix" exactly — title convention, environment, preconditions, numbered repro steps, expected vs actual with exact values, evidence, and linking rules.
---

# Bug Reporting

Source of truth: Confluence page **"Bug Report Template & Severity/Priority Matrix"**
(space "Tanweer Tools Shop"). This skill mirrors it exactly — if the page changes, re-sync
this skill, don't silently diverge.

## Template

**Title:** `[Area] Symptom — condition`
Example: `[Checkout] Discount not applied — after applying coupon in cart`

**Environment:** e.g. `localhost:5173`, branch `feature/TS-12-coupon-at-checkout`, or
`https://tanweertoolsshop.netlify.app` (main). Always name the branch or Netlify explicitly —
never just "the app."

**Preconditions:** State required before the steps (e.g. "Logged in as tanweer@test.com",
"Cart contains 1 item").

**Steps to reproduce:** Numbered, exact actions — name the real control/selector where useful
(e.g. "1. Add Combination Pliers to cart. 2. Apply coupon TEST10 in cart. 3. Click Proceed to
Checkout.").

**Expected vs actual — with exact values, never vague:**
- Expected: Checkout "Total to Pay" = $12.73 (discounted)
- Actual: Checkout "Total to Pay" = $14.15 (discount not applied)

Never write "the total is wrong" — write both numbers.

**Evidence:** Screenshot of the failing state + browser console log output. Both are required,
not optional — capture console output even if it looks clean (a clean console is itself
evidence).

**Links:** The linked story/issue key AND the linked failing test (Xray test key or Playwright
spec). A bug report with no story link and no failing-test link is incomplete.

## Worked example: TS-16

`[Cart] Displayed total off by one cent when discount applied`

- Environment: Netlify (master)
- Preconditions: Cart contains Combination Pliers x1
- Steps to Reproduce:
  1. Apply coupon TEST10
  2. Increase quantity to 2
- Expected Result: Total = $26.88 ($28.30 − $1.42 as displayed)
  Actual Result: Total = $26.89
- Severity: Sev-3 · Priority: P3
- Linked to: TS-35 ("Cart: apply valid coupon TEST10 shows discount"), the test that caught it.
  History: reopened after retest confirmed it still reproduces on master — status transitions
  and reopen comments are real signal, not noise; when retesting a "fixed" bug, always leave a
  comment either way (fixed-confirmed, or still-reproduces-reopening).

## Severity (impact)

| Severity | Definition | Example |
| --- | --- | --- |
| Sev-1 | Blocker / data loss — feature or app unusable, or data is lost/corrupted | Checkout crashes; orders silently disappear |
| Sev-2 | Major function wrong — a core function produces an incorrect result | Customer is charged the wrong amount at checkout |
| Sev-3 | Minor/cosmetic with a workaround — annoying but doesn't block the task | Discount label misaligned; wrong currency symbol spacing |
| Sev-4 | Trivial — cosmetic, no functional impact | Typo in a tooltip |

## Priority (urgency)

Independent of severity — reflects business urgency, not technical impact.

**Scale:** P1-Urgent (fix now) · P2-High (this sprint) · P3-Medium (next sprint) · P4-Low (backlog)

**How to combine:** severity says how bad it is; priority says how soon it must be fixed. A
Sev-1 is almost always P1/P2, but a Sev-3 can also be P2 if highly visible right before a
release or demo, while a Sev-2 on a rarely-used edge case might be P3. Set each independently,
then sanity-check the pairing against ship risk.

## Governance

- Never fix the underlying defect — bugs on `main` are intentional demo assets unless the task
  explicitly says to fix them.
- Never create, transition, or comment on a Jira bug without showing the exact drafted content
  first and getting approval.
