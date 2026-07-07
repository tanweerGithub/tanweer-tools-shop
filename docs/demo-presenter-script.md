# ToolsShop Demo — Presenter's Script (2-hour session)

*Companion to demo-runbook.md (operational checklist). Session shape: Environment Tour ~12 min → Seven Acts with Curtain-Lifts ~70 min → Trainee Lab ~30 min → Close. Run all seven acts in ONE Claude Code session. Keep VS Code (or an editor) open on the repo the whole time — the curtain-lifts open real files live.*

---

## PART 0 — Environment Tour (~12 min)

Click path with narration. Tabs prepared: Jira board, TS-10, PR #1, Confluence space, Xray Test Repository, TS-7.

1. **The board.**
> "A real team, mid-sprint. Five stories in five different states — done, in progress, blocked, a reopened bug, and one waiting for test design. Keep the shape in mind; an agent is going to read this board in a few minutes."

2. **Open TS-10.**
> "Our pattern: every story carries a dev subtask and a QA subtask. Here the dev finished — read the dev notes: what changed, which files, and 'verified TEST10 shows correctly on checkout.' Remember that sentence. And here's the Development panel — the actual pull request, linked automatically because the PR title carries the issue key."

3. **PR #1, Files changed tab.**
> "Three files. Remember that number — three."

4. **Confluence — the Coupon PRD.**
> "The requirements behind that story. It looks complete. Later today, ask yourself not what it says — what it *doesn't* say."

5. **Xray Test Repository (with folders).**
> "Eighteen regression tests, organized by feature area. Notice one folder: Checkout. Empty. Hold that thought."

6. **TS-7 — the coverage panel.**
> "This is a finished story: eight tests, and a green OK from a recorded execution. Two columns here confuse everyone once, so let's kill it now: **Status = the lifecycle of the test *document*** — these say To Do because we never move test issues through a workflow. **Test Status = what reality said the last time the test ran** — PASSED, from execution TS-41. One is about the artifact, the other is about the app. Different questions, different columns."
> "Now — TS-10, the story we're about to test, has NONE of this. No tests, no coverage, an unmerged PR, and a QA task in To Do. Let's go to work."

→ Pivot directly into the Opening Frame.

---

## Opening frame (2 min, before Act 1)

> "This is a real environment — real Jira board mid-sprint, real PRDs, a real pull request a developer just finished, a real test repository with execution history. Nothing is mocked. I'm going to work one QA ticket from 'good morning' to 'done for the day' — and I'm going to do almost none of it by hand. Seven specialized agents will do the work. My job is judgment: I review and approve every write. Watch where the judgment stays human."

Have three browser tabs ready: the TS board, TS-10's issue view, PR #1.

---

## ACT 1 — Morning triage

**Agent briefing (say this):**
> "First agent: **qa-daily-briefing**. Input: nothing — it knows who I am. It queries Jira for my open QA work, and for each item checks the *sibling dev task's* status, because our rule is a QA task is only workable when its dev task is Done. Tools: Jira read ONLY — this agent physically cannot write anything; we'll prove that claim later. Output: a prioritized triage."

**Type:** `Use the qa-daily-briefing agent: what's on my plate today?`

**What happens:** two JQL queries; the agent cross-references subtask siblings; ~30 seconds.

**What you get:** four items — TS-12 actionable (TS-11 Done, PR linked), TS-19 actionable as design-ahead-of-dev work, TS-15 blocked (TS-14 In Progress), TS-16 retest pending — with a suggested order.

**Narration on the result:**
> "Every clause is derived from board state — here's TS-10 on the board proving it. Notice two subtleties. It knew TS-19 is workable even though its dev task isn't done — because the story says test design runs ahead of dev; that exception is written into the agent. And notice it says 'PR *linked*', not 'PR merged' — this agent has no GitHub tools, so it refuses to claim anything about merge state. We taught it not to assert what its tools can't see. Agents lie most confidently exactly where they can't look — unless you forbid it."

**Then type:** `Let's start TS-12 — transition it to In Progress with a comment that testing is starting.`

**What happens:** the main session (not the read-only agent) drafts the comment + transition, shows you, waits.

> "And here's the first write of the day — see how it stopped and showed me exactly what it wants to do? That's not the agent being slow. That's the governance rule every agent in this repo carries. I approve. [approve] There it is on the board — live."

---

### 🎭 CURTAIN-LIFT 1 (after Act 1, ~4 min) — "An agent is a markdown file"

**Open in the editor: `.claude/agents/qa-daily-briefing.md`**

Walk it top to bottom, highlighting four things:

1. **The frontmatter `tools:` list** — highlight `searchJiraIssuesUsingJql, getJiraIssue`:
> "This is the entire arsenal. Two read tools. When I said this agent *physically cannot* write — this is what I meant. Not a promise in prose; an absent capability. If it's not in this list, the harness won't let it happen."
2. **The `description` line:**
> "This one sentence is how delegation works — when I say 'use the briefing agent', the harness matches my intent against these descriptions. Write a vague description and the wrong agent picks up your work."
3. **The blocking rule + TS-19 exception:**
> "Here's the team's rule — QA task workable only when the dev task is Done — and here's the documented exception for design-ahead-of-dev work. That's why the briefing correctly showed TS-19 as actionable. The nuance you just watched wasn't intelligence improvising; it was a rule someone wrote down."
4. **The Epistemic rule section:**
> "And this is my favorite line in the repo: *report only what your own tools observed.* This agent has no GitHub access — so it is forbidden from claiming merge state. That's why it said 'PR linked', not 'PR merged'. The first version of this agent DID say 'merged' — confidently, wrongly. We caught it, added this rule, and it never lied again. You don't debug agents with hope; you debug them with rules."

**The takeaway line:**
> "Everything you just saw is a markdown file in git. Version-controlled, code-reviewed, diff-able. When someone asks 'how do you govern AI agents' — this is the answer: the same way you govern code."

---

## ACT 2 — Understand the change

**Agent briefing:**
> "**regression-guardian**. Input: a story key. It reads the dev notes, pulls the actual PR diff from GitHub, maps changed files to product features using a feature map we keep in the repo, then asks Xray which existing tests cover those features. Tools: Jira read, GitHub CLI, file reading — still nothing that can write. Output: a risk-ranked testing scope. This agent is our regression policy — the one on this Confluence page — executed as software."

**Type:** `Use the regression-guardian agent on TS-10.`

**What you get:** direct impact Cart + Checkout (the 3 changed files); amplified impact via ShopContext (the shared state — Product Listing, Auth, Orders all read it); re-run picks BY KEY (TS-31…36, relevant TS-23…30); one gap: no Checkout-specific tests exist in the repository.

**Narration:**
> "Three files changed — but it flagged five feature areas. Why? ShopContext: shared state is the blast radius amplifier, and the feature map encodes who touches it. And look at the last line — it flagged a *gap*: nothing in our repository specifically tests Checkout. It didn't just select tests; it told us where we're blind. That gap is what the next agent fills."

---

## ACT 3 — Design the tests

**Agent briefing:**
> "**test-designer**. Input: a story with a linked PRD. It reads the PRD from Confluence and applies our test-case-design *skill* — that's a versioned file in the repo encoding how this team writes tests: boundary analysis, real selectors it must verify against the code, concrete expected values it must verify against reality, and one rule I want you to watch: **if the PRD is silent on something, it must ask — never assume.** Output: a draft suite, and a JSON file that is exactly what will be sent to Xray if I approve — approve-what-you-ship."

**Type:** `Use the test-designer agent on TS-10: design the test cases for the coupon-at-checkout work, per the PRD.`

**What you get:** ~6–10 cases (valid coupons on both pages, totals equality, invalid code, boundaries) + **Questions for BA**: the PRD says nothing about code case-sensitivity, and nothing about what happens to the discount when the cart changes after applying. Plus the seed-data JSON, gated.

**Narration (the key beat):**
> "Stop on these two questions. The agent read the PRD and found its blind spots — things the product manager never specified. A human tester might notice one of these on a good day. The agent flags them mechanically, every time, because the skill demands it. Hold onto question two — 'what happens when the cart changes after applying a coupon' — we're going to meet it again in about ten minutes."

Approve → JSON written → script pushes → open TS-10: **coverage panel now shows the new tests, NOTRUN.**

> "Thirty seconds ago TS-10 had zero test coverage. Now look at it. And the status is NOTRUN — honest: they exist, nothing has run."

---

### 🎭 CURTAIN-LIFT 2 (after Act 3, ~4 min) — "A skill is the team's judgment, versioned"

**Open in the editor: `.claude/skills/test-case-design/SKILL.md`**

Highlight three passages:

1. **The frontmatter `description`:**
> "The agent didn't 'decide' to use this skill — this description made it load automatically the moment the task looked like test design. Skills are auto-discovered by intent."
2. **The selector rule** (selectors only from feature-map Section 3, traceable to grep, never memory):
> "Why does this rule exist? Because early in this project, an agent invented selector names that *sounded* right — coupon-input instead of coupon-code — and half of them didn't exist. Every generated test would have failed on ghosts. This rule was written in response. Skills accumulate scar tissue."
3. **The ambiguity rule** (silences → Questions for BA, never assumptions):
> "And THIS line is why you saw 'Questions for BA' five minutes ago. The agent isn't insightful — it is *obligated*. If the PRD is silent, it must ask. Every agent, every time, forever. Now: hold onto its second question about the cart changing after a coupon is applied. We're about to go find out."

**The takeaway line:**
> "The skill also tells the agent exactly how tests get written to Xray, and requires my approval first. Format, judgment, method, and governance — one file. A new hire's agent writes tests like a ten-year veteran on day one, because the veteran's judgment is IN THE REPO."

(If asked how tests reached Xray: show `scripts/xray/seed-data/` — "what I approved is byte-for-byte what was sent — the file IS the approval.")

---

## ACT 4 — Execute (the showstopper)

**Stage move:** `git checkout feature/coupon-at-checkout`, restart dev server.
> "Our entry criteria say we test the dev's *branch*, before merge. So I'm switching my local app to the exact code in that pull request."

**Agent briefing:**
> "**test-executor**. Input: test keys. It fetches each test's steps from Xray and performs them in a real browser — clicks, typing, reading values — via Playwright. It reports per-step pass/fail with the values it actually observed. It cannot file bugs; it only witnesses. Separation of duties: the witness and the prosecutor are different agents."

**Type:** `Use the test-executor agent: execute the tests created for TS-10 in the previous step against localhost — get the keys from Xray's coverage on TS-10 if needed.`

**What you get:** happy paths PASS with real numbers (discount now correct at checkout — the dev's fix genuinely works). Then the cart-change case: apply TEST10, change quantity — the discount stays frozen at the old dollar amount. **FAIL, with observed values.**

**Narration:**
> "Watch the browser — no human hands. … The dev's work passes: the discount reaches checkout, to the cent. The PR does what it promised. Now the case behind the BA question — change the cart *after* applying the coupon… and there it is. The discount didn't recalculate. $28.30 subtotal, discount still $1.42 from the old cart. The PRD never specified this. The dev never tested it — their notes say 'verified TEST10 shows correctly on checkout,' which is true and insufficient. The designer flagged the silence; the executor just proved what lives inside it. Nothing tonight was staged — this defect has been in this app longer than this PR."

---

## ACT 5 — File the bug

**Agent briefing:**
> "**bug-reporter**. Input: the executor's failure. It re-confirms the repro live ONCE — we don't file bugs off a single observation — then drafts per our bug template: exact expected-vs-actual values, severity with cited reasoning from our matrix, links to the story and the failing test. It CAN write to Jira — and that is precisely why the approval gate matters most here."

**Type:** `Use the bug-reporter agent on the cart-change failure from the executor.`

**What you get:** one re-confirmation run, then a draft: title per convention, exact numbers, **Sev-2 — "customer charged wrong amount" cited from the matrix**, P-level with reasoning, links to TS-10 + the failing test. Approve → filed → open it in Jira.

**Narration:**
> "Compare this to our bug template page — field for field. Severity isn't a vibe: it cited the matrix — 'core function produces an incorrect result: customer charged the wrong amount' — that's Sev-2 by definition. And follow the links: story → test → bug. Anyone who opens any of these three finds the other two. That chain is what traceability means, and no one typed it."

---

### 🎭 CURTAIN-LIFT 3 (after Act 5, ~3 min) — "The bug template, executed"

**Split screen: the just-filed bug in Jira ⟷ `.claude/skills/bug-reporting/SKILL.md` (and/or the Confluence template page)**

Walk field by field:
> "Title convention — matches. Exact expected-vs-actual values — the skill *demands* numbers, not adjectives; 'total looks wrong' is banned. Severity — it didn't feel Sev-2, it CITED Sev-2: 'core function produces incorrect result — customer charged wrong amount', word for word from our matrix. Links to the story and the failing test — required fields, not habits."

Then highlight the worked example in the skill (TS-16):
> "The skill even contains a worked example — our real reopened bug. And a detail I love: when we first ran this bug-reporter agent, it audited that very example against the template and reported that OUR OWN ticket was missing a required link. The standards police everyone — including the people who wrote the standards."

---

## ACT 6 — Automate

**Agent briefing:**
> "**automation-engineer**. Input: test keys. It converts manual cases into Playwright specs following our automation skill — naming tied to Xray keys, selectors only from the verified map — then runs them. Manual today, regression forever."

**Type:** `Use the automation-engineer agent: convert the passing coupon test cases to Playwright specs and run them.`

**What you get:** specs created, run green on the branch.

**The hook beat** — ask it to commit a spec missing the Xray header:
> "Now watch me try to sneak in a spec with no traceability header… [rejection on screen] Rejected — by a pre-commit hook, in milliseconds, before any human review. Governance that doesn't need a meeting."

**The TS-27 story (tell it here):**
> "One more thing about automation. In our repository there's a test that says searching 'Hammer' shows 2 products. It was written by an agent and reviewed by two humans — me included. The first time a machine executed it, it found 3. *Sledgehammer.* All three of us missed a substring. The manual test case is a hypothesis; automation is the experiment. Here's the correction note, dated, in the ticket."

---

### 🎭 CURTAIN-LIFT 4 (after Act 6, ~3 min) — "Governance in milliseconds"

**Open: `scripts/hooks/pre-commit` (and glance at `.claude/skills/playwright-automation/SKILL.md`)**

> "That rejection you just watched — here's the entire mechanism. A few dozen lines of bash: filename must match an Xray key, header must carry the traceability comment. It's installed automatically on npm install, so every clone gets it. No meeting, no reviewer catching it three days later — the standard enforces itself before the commit exists."

Point at the automation skill briefly:
> "And the spec conventions the agent followed — naming, the data-test selector config, page objects — same story as before: a skill file. By now you know the pattern: **behavior you can read.**"

---

## ACT 7 — Close out

**Agent briefing:**
> "Last agent: **test-reporter**. Input: the QA task and today's results. It drafts the summary comment — scope, per-test results with keys, bugs filed — and then makes the call our exit criteria demand. Watch what it decides."

**Type:** `Use the test-reporter agent on TS-12 with today's results.`

**What you get:** summary draft + the verdict: **TS-12 stays In Progress** — open Sev-2, exit criteria not met, Test Strategy cited. Approve comment + execution update.

**Narration (the closing beat):**
> "It refused to close the ticket. It did the work, found a serious bug, and then applied the team's own exit criteria against itself: no Done while a Sev-2 is open. That's the whole model in one moment — agents do the labor at machine speed, the standards are versioned files in git, and the judgment gates stay human. This ticket is exactly as done as it honestly is."

**Optional kicker:** `Use the test-designer agent on TS-17 — draft the full suite from the Order History PRD. Do not write to Xray.`
> "One more, just for scale: a complete PRD, eleven acceptance criteria… [output scrolls] …a full boundary-analyzed suite in under a minute. This one's not for me — designing and shipping this suite is YOUR lab this afternoon."

---

## PART 3 — Trainee Lab (~30 min)

> "Your turn. TS-19 is on the board, assigned and actionable — you saw the briefing agent say so. The Order History PRD has eleven acceptance criteria. Use the test-designer agent, review what it gives you like I reviewed today — challenge a boundary, reject something, make it defend a value — then push the suite to Xray through the approval gate and watch TS-17's coverage panel light up."
> Faster finishers: "Execute one of your new cases with the test-executor against localhost." Bonus: the two approved contact-form cases → create them against TS-6.
> Everything they need: docs/toolsshop-environment-walkthrough.md (their handout).

---

## Closing frame (1 min)

> "Count what happened in forty minutes: triage, impact analysis, a designed test suite in Xray, a real defect found in a live browser, a Sev-2 filed with full traceability, automation written and gated, and an honest status report that refused to flatter us. One ticket, seven agents, five skills — and every single write passed through a human. The agents didn't replace the QA engineer. They replaced the parts of the day that were never really engineering."
