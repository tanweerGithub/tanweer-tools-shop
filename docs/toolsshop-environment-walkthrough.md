# ToolsShop QA Environment — Guided Walkthrough

*The orientation tour for the Agentic QA training. Everything described here is real and live — open each link as you read. This is the environment our AI agents will work inside.*

---

## 1. What this environment is

This is a complete, realistic QA workplace built around one product. It has everything a working QA engineer touches in a day: a product under test, a Jira board mid-sprint, PRDs in Confluence, a test repository in Xray with coverage and execution history, and a GitHub repo with an open pull request awaiting testing. Nothing here is a mockup — every issue, test, link, and PR is genuine and functional.

The purpose: instead of learning agentic AI on toy examples, you will watch (and drive) AI agents doing real QA work against this environment — triaging tasks, analyzing dev changes, designing test cases, executing them in a live browser, filing bugs, and reporting.

## 2. The product under test: ToolsShop

A React + Vite + TypeScript e-commerce demo selling tools (hammers, pliers, safety goggles… and one replica Mjolnir).

| | |
|---|---|
| Source code | https://github.com/tanweerGithub/tanweer-tools-shop |
| Run locally | `npm install && npm run dev` → http://localhost:5173 |
| Hosted (no setup) | https://tanweertoolsshop.netlify.app |
| Demo login | tanweer@test.com / tanweer123 |

**Feature areas:** product listing (search, sort, category filter, price slider), product details, cart (quantities, removal, coupon codes — try `TEST10` or `OFF20`), checkout (three payment methods), auth (login/register/logout), order history, contact form.

Two environments, two purposes: **Netlify** = the stable released state (`master`), used for regression and exploration. **localhost** = where you check out branches and test unmerged dev work.

Like any real product, ToolsShop contains defects. Finding them is the job — no spoilers here.

**One file worth knowing:** `docs/feature-map.md` in the repo maps every feature to its source files and lists every `data-test` selector in the app. Agents use it for impact analysis and test automation; you can too.

## 3. The team

Three real Atlassian accounts play the roles:

| Person | Role in the story |
|---|---|
| **BA Tanweer** | Business analyst — reports stories, owns the PRDs |
| **Dev Tanweer** | Developer — assigned all dev subtasks, author of the open PR |
| **Mohammad Tanweer Ahmed** | QA engineer — that's the seat *you* sit in. All QA subtasks are assigned here |

## 4. Jira: the project board

**Site:** ai-qa-hub.atlassian.net · **Project:** ToolsShop (key **TS**) · Team-managed Scrum · active sprint: **TS Sprint 1**

### Epics — the feature-area containers
An epic groups all work for one area of the product. Ours mirror the app's features exactly:

| Key | Epic |
|---|---|
| TS-1 | Catalog |
| TS-2 | Cart |
| TS-3 | Auth |
| TS-4 | Checkout |
| TS-5 | Orders |
| TS-6 | Contact |

Everything below hangs off one of these — which is what lets us ask questions like "show me all testing activity in the Cart area."

### Stories and the dev-task / QA-task pattern
Each story carries two subtasks: one for the developer, one for QA. **A QA task becomes workable only when its sibling dev task is Done** — this single rule drives the "what should I work on today?" reasoning you'll see agents perform.

The sprint tells a deliberately varied story:

| Story | State | What it demonstrates |
|---|---|---|
| **TS-7** Product listing with category filter | Done (dev TS-8 ✅, QA TS-9 ✅) | Completed work with full regression history — read TS-9's closing comment listing the 8 verified cases |
| **TS-10** Apply discount coupon at checkout | In Progress — **dev TS-11 Done, QA TS-12 To Do** | **The actionable one.** Dev just finished; PR is open; testing hasn't started. This is where the live demo begins |
| **TS-13** Password reset flow | In Progress — dev TS-14 still In Progress, QA TS-15 blocked | Not testable yet — a good agent must recognize this and *not* suggest it |
| **TS-16** [Cart] Displayed total off by one cent when discount applied | **Bug, Reopened** | The bug lifecycle: reported → dev claimed fixed → retest failed → reopened. It is genuinely reproducible; try it |
| **TS-17** Order history pagination | To Do (QA TS-19: design tests from PRD) | Pure test-design work: a complete PRD exists, no tests do — your hands-on exercise lives here |

Backlog texture (not in sprint): TS-20 contact-form validation, TS-21 user profile, TS-22 product reviews.

### Statuses
To Do → In Progress → In Review → Done, plus **Reopened** (a failed retest returns a bug to the queue — see TS-16).

## 5. Confluence: the documentation layer

**Space:** "Tanweer Tools Shop" (TTS), connected to the Jira project (visible under the project's *Pages* tab).

| Page | Role |
|---|---|
| **PRD: Checkout Coupon Codes** | The requirements behind story TS-10 — acceptance criteria the QA task tests against. Read it critically: is everything a tester needs actually specified? |
| **PRD: Order History & Pagination** | Complete, precise PRD (AC1–AC9) behind TS-17 — the input for the test-design exercise |
| **ToolsShop Test Strategy** | The team's rules: environments, entry criteria (dev Done + PR linked), exit criteria (no open Sev-1/2), and the impact-based regression policy — which is exactly the procedure one of our agents automates |
| **Bug Report Template & Severity/Priority Matrix** | The format every bug must follow, and how Sev-1..4 / P1..4 are assigned |

## 6. Xray: the test repository

Xray stores test cases as Jira issues (type **Test**) with structured steps (Action / Data / Expected Result). Our repository:

| Set | Tests | Covers |
|---|---|---|
| Product Listing | TS-23 … TS-30 (8) | Story TS-7 — mirroring one-to-one the cases QA verified in TS-9's comment |
| Cart | TS-31 … TS-36 (6) | Epic TS-2 — including both coupon paths (valid TEST10, invalid code) |
| Auth | TS-37 … TS-40 (4) | Epic TS-3 — login, wrong password, register, logout |

Open any test (e.g. TS-23) to see its steps — note that step actions reference the app's `data-test` selectors, which is what makes these cases directly convertible to automation.

**Coverage:** each test is linked to its story/epic with the *tests / is tested by* relation. Open **TS-7**, **TS-2**, or **TS-3** and find the **Test Coverage panel**: it lists the covering tests and an overall status.

**Execution history:** **TS-41** is a Test Execution — a recorded run of the full Product Listing set (all 8 PASSED, dated before this sprint). That's why TS-7's coverage shows a passing state while TS-2/TS-3 show **NOTRUN**: those tests exist but have never been executed. Coverage status = *facts about what has actually been run*, not intentions.

**Defect traceability:** bug **TS-16** is linked to test **TS-35** (the valid-coupon test) via a Defect relation — from a failing behavior you can navigate to the test that exposes it, and from the test to the bug it found.

## 7. GitHub: the code side

The repo is connected to Jira via the **GitHub for Atlassian** app. The convention that powers it: issue keys in PR titles (and branch names / commit messages going forward).

**Live right now: [PR #1 — "TS-11: Coupon discount applied at checkout"](https://github.com/tanweerGithub/tanweer-tools-shop/pull/1)** — the developer's implementation of story TS-10, touching exactly three files (`CartPage.tsx`, `CheckoutPage.tsx`, `ShopContext.tsx`). It is **unmerged**: this is the change QA must test. Open **TS-11** in Jira and find the **Development panel** — the PR appears there automatically. Story → subtask → code, one click each.

## 8. The traceability chains (the whole point)

Walk these in the UI — they're what "connected QA" means:

1. **The work chain:** PRD (Coupon Codes) → Story TS-10 → dev subtask TS-11 → PR #1 (the diff) → QA subtask TS-12 (waiting for you)
2. **The coverage chain:** Story TS-7 → 8 tests (TS-23…30) → execution TS-41 → green coverage status
3. **The defect chain:** Test TS-35 → bug TS-16 (Reopened) → assigned back to dev

Every hop is machine-readable — which is why agents can walk them too. When an AI agent later says *"TS-12 is actionable because TS-11 is Done with a linked PR touching CartPage and ShopContext, and existing coverage TS-31…36 should be re-run,"* it derived every clause from the objects you just toured.

## 9. Where the agents come in

Everything above is what a normal QA team maintains by hand. The training layers agentic AI on top — skills encoding the team's standards (test-case format, bug template, impact analysis), specialized subagents (daily briefing, regression guardian, test designer, test executor, bug reporter, automation engineer, test reporter), all connected to this environment through MCP servers (Atlassian, Playwright, GitHub). The day-in-the-life demo starts at TS-12 with a single question: **"What's on my plate today?"** — and ends with tested code, filed bugs, updated executions, and a posted summary, with a human approving every write.

---

*Environment version: seeded 2026-07-05. Reset guide for repeat cohorts: docs/reset-guide.md (Checkpoint 10 deliverable).*
