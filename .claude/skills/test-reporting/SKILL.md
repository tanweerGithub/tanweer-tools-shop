---
name: test-reporting
description: Use when writing an end-of-testing summary, deciding whether a QA task can move to Done, or updating an Xray execution after a test run for ToolsShop. Covers the summary comment format (scope, results by key, bugs by key, verdict), the Done/stays-In-Progress transition rule from the Test Strategy, and updating the Xray execution — all gated on approval before any Jira write.
---

# Test Reporting

Governing document: Confluence **"ToolsShop Test Strategy"** — Exit criteria and Bug workflow
sections.

## Required outputs

A completed testing pass produces **both** of the following — a run with only one is
incomplete:

1. The **summary comment** (format below), posted on the QA subtask.
2. A **Test Execution** recorded via `scripts/xray/` (`create-test-execution.mjs`, then
   `updateTestRunStatus` per test — see "Updating the Xray execution" below), with per-test
   statuses and a date. The Xray execution and the Jira comment must state the same results.

**Mirror-sync note:** the exit criteria in this skill mirror the Confluence "ToolsShop Test
Strategy" page's Exit Criteria section. The two are updated together — if one changes, flag
the other for a matching edit (the Confluence side is a manual edit, not agentic).

## Summary comment format

Posted as a comment on the QA subtask (or story, if there's no subtask) at the end of a
testing pass:

```
Scope tested: <feature area(s) / story>, environment <localhost:5173 branch X | Netlify main>

Results:
- TS-31 Cart: add to cart updates badge — PASS
- TS-35 Cart: apply valid coupon TEST10 shows discount — PASS
- TS-36 Cart: apply invalid coupon shows error and removes discount — FAIL (see TS-16)

Bugs filed: TS-16 [Cart] Displayed total off by one cent when discount applied (Sev-3/P3)

Verdict: <Done | stays In Progress — see reasoning below>
```

- **Results** are always listed by Xray test key, one line per test, with PASS/FAIL/BLOCKED —
  never just a pass/fail count.
- **Bugs filed** are listed by Jira key with the one-line title and severity/priority — never
  just "found some bugs."
- **Verdict** is a direct statement of the transition being proposed, not left implicit.

## Transition rule (from the Test Strategy exit criteria)

- **All planned tests pass (or fail only with Sev-3/Sev-4 bugs, open with team agreement) →**
  QA subtask/task transitions to **Done**.
- **Any open Sev-1 or Sev-2 defect against the story →** QA subtask/task **stays In
  Progress**, with a comment stating which defect(s) are blocking and their keys. Do not
  transition to Done and do not transition to a "blocked"-sounding status that doesn't exist
  in this workflow — the real states are To Do / In Progress / In Review / Done / Reopened.
- Sev-3/Sev-4 defects don't block Done by themselves, but still get logged, linked, and named
  in the verdict comment — "shipping with it open" is a visible decision, not a silent one.

## Worked example: Story B (TS-10), QA subtask TS-12

If cart/checkout retest turns up only TS-16 (Sev-3, "off by one cent") and every other planned
test passes:

```
Scope tested: Cart + Checkout coupon flow (TS-2/TS-4), branch feature/coupon-at-checkout,
localhost:5173

Results:
- TS-31 Cart: add to cart updates badge — PASS
- TS-35 Cart: apply valid coupon TEST10 shows discount — PASS
- TS-36 Cart: apply invalid coupon shows error and removes discount — PASS

Bugs filed: TS-16 [Cart] Displayed total off by one cent when discount applied (Sev-3/P3) —
open, team agreed to ship

Verdict: Done — no open Sev-1/Sev-2 defects.
```

If instead a Sev-2 turned up (e.g. checkout charges the wrong amount), the verdict would read
"stays In Progress — blocked on <bug key>, Sev-2" and no Done transition would be proposed.

## Updating the Xray execution

Reflect final pass/fail on the Test Execution created for this run (see `test-case-design`'s
write path). For each test in the execution:

```js
// same client.mjs pattern as scripts/xray/create-test-execution.mjs
const runData = await xrayGraphQL(`query { getTestRun(testIssueId: "...", testExecIssueId: "...") { id } }`);
await xrayGraphQL(`mutation { updateTestRunStatus(id: "${runData.getTestRun.id}", status: "PASSED") }`);
// status: "PASSED" | "FAILED" | "TODO" | "EXECUTING"
```

Update every test's run status to match what's in the summary comment before proposing the
Jira transition — the Xray execution and the Jira comment must agree.

## Governance

Never post the summary comment, update a Test Execution, or transition a Jira issue without
showing the exact comment text and the exact proposed transition first, and getting approval —
per repo governance rules. This applies even when the verdict seems obvious (all-pass Done
transitions still get shown before they're executed).
