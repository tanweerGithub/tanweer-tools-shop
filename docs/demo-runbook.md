# ToolsShop Agentic QA — Demo Runbook

*The seven-act live demo, as an operational script. Rehearse against this twice (Checkpoint 10); deliver from it forever. Demo tool: Claude Code in the repo folder. Target: ~40 minutes + questions.*

---

## Pre-flight checklist (run 30 minutes before, every time)

- [ ] `cd` into the repo; `git status` clean, **on master**
- [ ] `npm run dev` running → http://localhost:5173 loads
- [ ] Netlify site loads (backup environment)
- [ ] Fresh `claude` session started AFTER any file changes (`/exit` first if unsure — capability inventory loads at launch)
- [ ] `/mcp` shows atlassian connected (re-OAuth if expired — do this now, not on stage)
- [ ] `claude mcp list` green; `gh auth status` logged in
- [ ] Jira board open in a browser tab (TS project); Xray coverage on TS-7 open in another; PR #1 in a third
- [ ] Warm-up query executed once (any Jira search) — first MCP call is the slow one
- [ ] TS-12 status is **To Do** (reset it if a previous rehearsal moved it — see reset notes at bottom)
- [ ] No stray comments on TS-10/TS-12 from prior runs

## The one rule on stage
Every write the agents propose gets read aloud before you approve it. The gates are not friction to hide — they ARE the governance story.

---

## Act 1 — Morning triage (~5 min)
**Type:** `Use the qa-daily-briefing agent: what's on my plate today?`
**Expect:** TS-12 actionable (TS-11 Done, PR linked), TS-19 actionable as design work, TS-15 blocked (TS-14 In Progress), TS-16 retest pending. Suggested order.
**Talking point:** the agent derived every clause from board state — show TS-10 in the Jira tab as proof. Note it says "PR linked", not "merged": it refuses to claim what its tools can't see (epistemic rule).
**Then type:** `Let's start TS-12. Transition it to In Progress with a comment that testing is starting.`
**Expect:** the session (not the read-only briefing agent) shows the exact comment + transition for approval → approve → show it live on the board.
**Fallback:** if MCP hiccups, the board tab is your visual; narrate and retry once.

## Act 2 — Understand the change (~5 min)
**Type:** `Use the regression-guardian agent on TS-10.`
**Expect:** dev notes + PR #1 diff (3 files) → Cart + Checkout direct; ShopContext amplification pulls Product Listing/Auth/Orders into adjacency; re-run picks TS-31..36 + relevant TS-23..30 by key; gap flagged: no Checkout-specific tests exist.
**Talking point:** this is the Test Strategy page's regression policy, executed. Open the Confluence page — the agent is running the team's documented procedure, not improvising. Show PR #1's Files changed tab matching the analysis.

## Act 3 — Design (~7 min)
**Type:** `Use the test-designer agent on TS-10: design the test cases for the coupon-at-checkout work, per the PRD.`
**Expect:** suite draft with boundaries (valid codes, invalid code, discount line on both pages, totals equality) + **Questions for BA**: the PRD is silent on code case-sensitivity and on cart-changes-after-apply. Seed-data JSON offered; approval gate before any Xray write.
**Talking point:** the ambiguity flags ARE the demo — the agent found the PRD's blind spots. (You know what lives in one of them.) Approve pushing the suite to Xray; show the tests appearing under TS-10's coverage panel: NOTRUN.

## Act 4 — Execute (~10 min, the showstopper)
**Setup on stage:** `git checkout feature/coupon-at-checkout` + restart dev server (narrate: "testing the dev's unmerged branch, per entry criteria").
**Type:** `Use the test-executor agent: execute the coupon suite against localhost.`
**Expect:** step-by-step PASS on the happy paths (discount now correct at checkout — the dev's fix works)… then the cart-change case: discount stays frozen at the old dollar amount. FAIL with observed numbers (e.g. apply TEST10 on $14.15 → change qty to 2 → discount still $1.42, total $26.89 — and yes, that's also off by a cent: TS-16's sibling).
**Talking point:** genuine failure, live browser, exact values. The dev fixed what the PRD specified and missed what it didn't — which the designer flagged one act ago. Nothing here was staged tonight; the defect has been in the app since before the PR.

## Act 5 — Report the bug (~5 min)
**Type:** `Use the bug-reporter agent on the cart-change failure from the executor.`
**Expect:** one live re-confirmation, then a draft per the template: exact values, Sev-2 (customer charged wrong amount — cite the matrix), links to TS-10 + the failing test. Approval gate → file it → open the new bug in Jira; walk the traceability chain: story → test → bug.
**Talking point:** compare against the Bug Report Template Confluence page — field for field.

## Act 6 — Automate (~7 min)
**Type:** `Use the automation-engineer agent: convert the passing coupon test cases to Playwright specs and run them.`
**Expect:** specs per convention, suite run green on the branch.
**Then the hook beat:** ask it to commit a spec deliberately missing the Xray header → pre-commit hook rejects, on screen → fix → commit passes.
**Story to tell here:** TS-27. "Our manual case said 2 products match 'Hammer'. Automation found 3 — Sledgehammer. The case was written by an agent and reviewed by two humans, and the first machine execution of the oracle caught what all three missed." (Show TS-27's dated correction note.)

## Act 7 — Close out (~4 min)
**Type:** `Use the test-reporter agent on TS-12 with today's results.`
**Expect:** summary comment draft (scope, per-test results with keys, bug filed with key) and the verdict: **TS-12 stays In Progress** — open Sev-2, exit criteria not met (cites the Test Strategy). Approve the comment + Xray execution update; show it on the board.
**Talking point:** the agent refused to close the task. Governance as behavior, not policy text.

**The kicker (2 min):** `Use the test-designer agent on TS-17 — full suite from the Order History PRD.` Eleven AC-mapped cases with boundary counts scroll past in seconds. Mention what it found last time it ran (orders not scoped per-user) only if energy demands an encore — otherwise leave TS-17 pristine as the trainee exercise.

---

## Trainee hands-on exercise (after the demo)
"TS-19 is yours: brief yourself, design the TS-17 suite from the PRD, get it reviewed, push to Xray via the scripts, execute one case against localhost." Everything they need is in docs/toolsshop-environment-walkthrough.md. Bonus lab: the two approved contact-form cases → create them in Xray against TS-6.

## Reset between cohorts / rehearsals

**Discipline that makes reset possible:** (1) note the exact start time of every run; (2) Act 6 commits stay LOCAL — never push during a demo.

**Jira/Xray (the timestamp trick):** everything the demo creates is authored by you after the start time. Issue navigator →
`project = TS AND created >= "<start time>" ORDER BY created DESC`
→ bulk-select → Delete. Cascades links + Xray data. Then: TS-12 → To Do; delete demo comments on TS-10/TS-12 (comment ⋯ → Delete).

**Git:** `git checkout master` · `git branch -f feature/coupon-at-checkout origin/feature/coupon-at-checkout` (drops local demo commits) · `git clean -fd tests/ scripts/xray/seed-data/` if stray files remain. Never re-clone; the permanent environment is all committed.

**During the FIRST reset, build the reset script:** scripts/jira/reset-demo.mjs — REST API (ATLASSIAN_EMAIL + ATLASSIAN_API_TOKEN from env), --since argument, dry-run default, typed confirmation before deleting, transitions TS-12 back, lists demo comments for manual removal. Turns reset into a two-minute command. (The MCP has no delete tools — the REST API does; this is the wrap-the-API pattern again.)

**Rehearsal 2 doubles as reset verification:** if the demo plays identically from a reset environment, every future cohort will too.

- Xray trial/pricing decision date: ______

## Known wobble points
- First MCP call after idle: slow (pre-warm)
- OAuth expiry: re-auth via /mcp, off-stage
- Coverage panels: sometimes need a refresh to recompute
- Rate limits on Free plan: pause, don't hammer; batch writes were pre-approved for a reason
