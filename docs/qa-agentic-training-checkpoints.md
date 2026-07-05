# QA Agentic Training Environment — Master Checkpoint Document

**Project:** Build a realistic, end-to-end QA workflow demo powered by agentic AI — **GitHub Copilot agent mode in VS Code** + MCP servers + Agent Skills + Custom agents (subagents) + Hooks
**Product under test:** ToolsShop — https://github.com/tanweerGithub/tanweer-tools-shop (React + Vite + TypeScript e-commerce demo app)
**Audience:** QA engineers already trained on prompting, MCP, skills, subagents, hooks, and VS Code customization
**Builder note:** Trainees use GitHub Copilot. You also have Claude Code installed — keep it as an optional secondary builder and as a live portability demo: VS Code automatically reads skills from `.claude/skills/` and agents from `.claude/agents/`, so the same artifacts run in both tools. We author everything in the canonical Copilot locations (`.github/...`).

**How to use this document:** Work through checkpoints in order. Each checkpoint is designed to be completed in ONE fresh Copilot agent-mode session with limited context. At the start of each session, reference this document and the checkpoint's "Session kickoff prompt." Mark items done as you go — this file is the single source of truth for project state. Commit it to the repo at `docs/qa-agentic-training-checkpoints.md`.

## Status snapshot (2026-07-05)

- **Checkpoint 0: complete** (pending: GitHub-for-Jira app install, teammates accepting invites)
- **Checkpoint 1: complete** — all three MCP smoke tests passed
- **Environment facts:** repo at `/Users/Tanweer/Documents/Me/build/qa-project/tanweer-tools-shop` · site `ai-qa-hub.atlassian.net` · Confluence space "Tanweer Tools Shop" · default Jira project key **KAN** (we create the proper **TS** Scrum project in Checkpoint 5) · Xray installed on 30-day trial (~US$10/mo after — decision due before trial ends) · Atlassian API token + Xray API keys created
- **Code audit finding (2026-07-05):** a coupon feature ALREADY EXISTS on the Cart page (TEST10 10%, OFF20 20%) and `main` contains genuine bugs around it (catalogued in the trainer's private answer key). There is NO order history feature yet. Checkpoints 2–3 updated accordingly.
- **Hosted environment:** https://tanweertoolsshop.netlify.app — matches the repo (same product IDs/code). The discount-lost-at-checkout defect was verified LIVE on this site via browser automation (cart total $12.73 with TEST10 → checkout "Total to Pay" $14.15, no discount line). Use Netlify as the classroom test environment (zero trainee setup) and localhost for the dev/PR-branch testing scenarios. Note: 2 console errors observed on page load — capture in the audit.
- **Next up:** Checkpoint 2 (repo audit + custom instructions)

---

## Legend

- `[H]` = Human task (you do it manually — usually account creation or OAuth approval)
- `[A]` = Agentic task (done by Copilot agent mode via MCP/tools — this is the point of the training)
- `[ ]` / `[x]` = pending / done

---

## Checkpoint 0 — Accounts, credentials, and prerequisites (all human, do once)

**Goal:** Remove every blocker before any agentic work starts. Everything below is `[H]`.

### 0.1 Machine prerequisites
- [ ] Node.js v18+ installed (`node -v`) — required by Vite, Playwright, and stdio MCP servers
- [ ] Git installed and configured with your GitHub identity
- [ ] VS Code updated to the latest stable version (skills, custom agents, subagents, and hooks are recent features — old versions lack them)
- [ ] GitHub Copilot: signed into VS Code with a GitHub account that has Copilot access (Pro recommended; the Free plan works for building but has monthly limits — check trainee entitlements for the classroom)
- [ ] Enable in VS Code settings (also enable these on trainee machines / document in the training deck): Agent mode, `chat.useAgentSkills`, `chat.useCustomAgentHooks` (preview), subagent-related settings as needed
- [ ] (Already done) Claude Code CLI installed and signed in — optional builder + portability demo
- [ ] Clone the repo locally: `git clone https://github.com/tanweerGithub/tanweer-tools-shop.git` — this folder is the agent workspace for the whole project
- [ ] Verify the app runs: `npm install && npm run dev` → note the local URL (e.g., http://localhost:5173)

### 0.2 Atlassian (Jira + Confluence)
- [x] Atlassian account created
- [x] Free Cloud site created: **ai-qa-hub.atlassian.net** (Jira enabled; default project "Tanweer Tools Shop", key **KAN**, auto-created)
- [x] Confluence added; space **"Tanweer Tools Shop"** created
- [x] Atlassian API token created and stored
- [x] 2 dummy teammates invited. NOTE: invited users won't show anywhere on a board until (a) they accept the email invite (open it from the alias inbox) AND (b) they're granted Jira product access (Admin → Users) AND (c) issues are actually assigned to them — boards display issues, not members. We assign issues to them in Checkpoint 5, which is when their avatars appear.

### 0.3 Xray (test management)
- [x] Installed **Xray Test Management for Jira** (vendor: Xblend). **PRICING CORRECTION:** not free — 30-day free trial, then ~US$10/month for up to 10 users. Decision due before trial ends: (a) keep Xray at $10/mo as a training asset, (b) migrate to a free-tier standalone TMS (e.g., Qase or QA Sphere, both have free tiers and API/MCP paths), or (c) repo-based test cases in markdown (free forever, fully agent-friendly, weaker UI traceability). The 30-day trial comfortably covers the full build + first delivery — defer the decision, revisit at Checkpoint 10.
- [x] Xray **API keys** (Client ID + Secret) created and stored. (Needed for Xray's GraphQL API — test steps and executions live in Xray's own store, not standard Jira fields.)

### 0.4 GitHub
- [x] Repo exists (public); cloned to `/Users/Tanweer/Documents/Me/build/qa-project/tanweer-tools-shop`
- [x] GitHub MCP authenticated (OAuth)
- [ ] Install the **GitHub for Jira** app (free, by Atlassian) from the Atlassian Marketplace and connect the `tanweerGithub` org/repo. This links commits, branches, and PRs to Jira issues automatically whenever an issue key appears in the branch name, commit message, or PR title — Jira then shows them in the issue's Development panel.
- [ ] Adopt the naming convention from Checkpoint 3 onward: branches `feature/TS-12-checkout-coupon`, commits `TS-12: add coupon validation`. This convention is what powers the Regression Guardian agent's story→code traceability.

### 0.5 Security ground rules (teach these in the training too)
- Never paste passwords into any AI chat or config file. The Atlassian and GitHub MCPs authenticate via **browser OAuth** — the agent never sees your password.
- API tokens/secrets go in environment variables or a `.env` file listed in `.gitignore`. In `.vscode/mcp.json`, use VS Code's `inputs` mechanism or env references — never hardcode secrets in a committed file.
- MCP actions run with YOUR permissions. Keep tool approval ON during demos (do not enable auto-approve/autopilot) — reviewing each write is itself a governance teaching moment.

**Done when:** app runs locally, you can log into Jira/Confluence in a browser, Xray appears in your Jira project, all tokens recorded.

---

## Checkpoint 1 — Wire the MCP servers into VS Code / Copilot

**Goal:** Copilot agent mode can talk to Jira/Confluence, GitHub, and a live browser. Configure at **project scope** in `.vscode/mcp.json` and commit it — every trainee who clones the repo gets the servers automatically (they only redo the OAuth sign-ins).

### Tasks
- [ ] `[H]` Create `.vscode/mcp.json` in the repo:
  ```json
  {
    "servers": {
      "atlassian": {
        "type": "http",
        "url": "https://mcp.atlassian.com/v1/mcp/authv2"
      },
      "github": {
        "type": "http",
        "url": "https://api.githubcopilot.com/mcp"
      },
      "playwright": {
        "type": "stdio",
        "command": "npx",
        "args": ["@playwright/mcp@latest"]
      }
    }
  }
  ```
- [ ] `[H]` In VS Code: open the Chat view → Tools; start each server. For **atlassian**, complete the browser OAuth and grant BOTH Jira and Confluence scopes (first user to authorize also installs the MCP app on the site). For **github**, complete OAuth. Playwright needs no auth.
- [ ] `[H]` Windows note: if a stdio server fails with "Connection closed", wrap the command as `cmd /c npx ...`.
- [ ] `[A]` Smoke test all three in ONE agent-mode session:
  - "Search my Jira site and list all projects" (expect empty/default — that's fine)
  - "Fetch the README of tanweerGithub/tanweer-tools-shop from GitHub"
  - "Open http://localhost:5173 in the browser and describe what you see" (dev server must be running)
- [ ] Xray MCP decision is deferred to Checkpoint 6 (we validate the write path there; fallback is a script-wrapped GraphQL client — itself a teaching moment).

**STATUS: COMPLETE (2026-07-05).** Atlassian (browser OAuth, Jira + Confluence scopes) and GitHub MCPs authenticated; all three smoke tests passed (Jira returned project KAN, GitHub returned the README, Playwright opened localhost — note: the page rendering inside VS Code's integrated/Simple Browser is expected behavior, not an error). Endpoint note: use `https://mcp.atlassian.com/v1/mcp/authv2` (recommended for OAuth clients); the plain `/v1/mcp` endpoint also works and additionally supports API-token configurations.

**Done when:** all three smoke tests pass in a single Copilot agent session; `.vscode/mcp.json` committed.

**Session kickoff prompt:** "Read docs/qa-agentic-training-checkpoints.md, Checkpoint 1. The MCP servers are configured. Run the three smoke tests and report results."

---

## Checkpoint 2 — Repo audit + custom instructions

**Goal:** The agent understands the product; the repo carries permanent project context that every trainee's Copilot inherits.

### Tasks
- [ ] `[A]` Full repo audit: map the codebase — pages, components, contexts, routing, state management. Output: `docs/feature-map.md` (feature → files table). This becomes the backbone of the impact-analysis skill later.
- [ ] `[A]` Live exploration: browse http://localhost:5173 (or https://tanweertoolsshop.netlify.app — identical code) via the Playwright MCP — walk every page (home, product details, cart incl. coupon TEST10/OFF20, checkout with each payment method, login with demo credentials, register, contact), and record observed behavior per feature in the feature map. Code tells you what SHOULD happen; the browser tells you what DOES.
- [ ] `[A]` Gap analysis: which features are stubs/dummy vs. functional? Which demo-critical features are missing? (Known state: coupon exists on the CART page with real defects — do not "fix" anything during the audit; defects are demo assets. Known gap: NO order history feature exists — orders are not persisted at all; this gets built in Checkpoint 3 for Story E.)
- [ ] `[A]` Create **`.github/copilot-instructions.md`** (always-on project instructions) containing: Jira site URL + project key (TS), Confluence space key, localhost URL, test user credentials for the app, run commands, and governance rules ("never transition a Jira issue or create/delete anything in Jira/Confluence without showing me first", "all bugs follow the bug-reporting skill", "all test cases follow the test-case-design skill"). Optionally mirror the essentials in a root `AGENTS.md` for cross-tool compatibility.
- [ ] `[H]` Review and commit.

**Done when:** `.github/copilot-instructions.md` and `docs/feature-map.md` committed; you agree with the gap analysis.

**Session kickoff prompt:** "Read docs/qa-agentic-training-checkpoints.md, Checkpoint 2. Audit this repository and produce docs/feature-map.md and .github/copilot-instructions.md as specified."

---

## Checkpoint 3 — Product hardening: build the demo features + plant the bugs

**Goal:** ToolsShop gains the features the demo narrative needs, including a PR with deliberately planted bugs that the agents will later find live.

**Revised premise:** the coupon feature exists on the Cart page and `main` already carries genuine defects (discount lost at checkout; stale discount after cart changes; hardcoded validation ignoring `VALID_COUPONS`; case-sensitivity ambiguity). We do NOT fix `main` — those defects ARE the demo. Instead, Story B becomes a realistic enhancement.

### Tasks (all `[A]`, reviewed by you)
- [ ] **Story B dev work** on branch `feature/TS-<key>-coupon-at-checkout`: carry the applied discount through to the Checkout page (show discount line + discounted Total to Pay) and refactor validation to use `VALID_COUPONS` from constants. Deliberately do NOT fix the stale-discount-on-cart-change defect — the dev "missed" it, and the test-executor finds it live as a genuine regression.
- [ ] Optionally plant 1–2 extra subtle bugs in the PR itself (e.g., discount line renders but rounding differs by a cent). Keep the trainer's private answer key OUTSIDE the repo, covering both pre-existing `main` defects and anything planted.
- [ ] **Build minimal Order History** (needed for Story E): persist orders on place-order (context + localStorage is fine), new Order History page listing past orders. Ship it plain — pagination is Story E's future scope, designed from the PRD but intentionally unimplemented, so its test cases can be authored against the spec.
- [ ] Open a **GitHub PR** for the coupon branch with a realistic dev description (what changed, files touched) and the Story B issue key in branch/commits/PR title — the Regression Guardian reads this in the demo.
- [ ] `[H]` Merge the order-history work to `main`; leave the coupon PR OPEN — that's the "dev just finished" state.

**Done when:** coupon PR open with issue-key convention, order history on `main`, answer key saved privately.

**Session kickoff prompt:** "Read docs/qa-agentic-training-checkpoints.md, Checkpoint 3, and docs/feature-map.md. Implement the coupon feature with the planted bugs as specified, on branch feature/checkout-coupon."

---

## Checkpoint 4 — Confluence seed content (agentic)

**Goal:** The documentation layer exists so 'read the PRD → design tests' demos work.

### Tasks (all `[A]` via Atlassian MCP)
- [ ] Create Confluence space **"ToolsShop QA"** (key: TSQA)
- [ ] PRD page: **"Checkout Coupon Codes"** — acceptance criteria for Story B (discount visible and applied on Checkout page, validation from the managed coupon list), plus deliberate ambiguities grounded in real behavior: say nothing about code case-sensitivity, and nothing about recalculation when the cart changes after applying. The test-designer agent should flag these live.
- [ ] PRD page: **"Order History Pagination"** — complete and unambiguous (used for the pure test-design exercise, Story E)
- [ ] Page: **"ToolsShop Test Strategy"** — scope, environments, entry/exit criteria, regression policy
- [ ] Page: **"Bug Report Template & Severity/Priority Matrix"**
- [ ] `[H]` Review pages in browser; fix anything odd.

**Done when:** 4 pages exist and read like real team documentation.

**Session kickoff prompt:** "Read docs/qa-agentic-training-checkpoints.md, Checkpoint 4. Using the Atlassian MCP, create the Confluence space and the four pages specified. Show me each page draft before creating it."

---

## Checkpoint 5 — Jira project seed (agentic)

**Goal:** A living sprint that looks like a real team mid-flight.

### Structure to create (all `[A]` via Atlassian MCP)
- [ ] Project **TS (ToolsShop)** — Scrum, with epics per feature area: Catalog, Cart, Auth, Checkout, Orders, Contact. (The auto-created **KAN** project stays untouched as a scratch space, or delete it once TS exists — your call.)
- [ ] Assign a few issues to the dummy teammates (this is when their avatars finally appear on the board)
- [ ] **Story A** — "Product listing with category filter" — Done. Dev subtask Done, QA subtask Done.
- [ ] **Story B (demo star)** — "Apply discount coupon at checkout" — In Progress. Dev subtask **Done** with link to the GitHub PR from Checkpoint 3 and realistic dev notes. QA subtask **To Do**, assigned to you. Link the Coupon PRD Confluence page.
- [ ] **Story C** — "Password reset flow" — Dev subtask In Progress → QA blocked. (Tests the briefing agent's reasoning.)
- [ ] **Story D** — Bug "Cart total wrong after removing item" — status Reopened (failed retest), with fake history comments.
- [ ] **Story E** — "Order history pagination" — Ready for QA test design; PRD linked; no tests exist yet.
- [ ] One active sprint containing A–E; 2–3 extra backlog stories for realism; distribute a couple of issues to dummy teammates if created.
- [ ] `[H]` Sanity-check the board visually.

**Done when:** the board tells the story at a glance and "assigned to me" returns exactly the right items.

**Session kickoff prompt:** "Read docs/qa-agentic-training-checkpoints.md, Checkpoint 5. Using the Atlassian MCP, create the TS project structure exactly as specified. Create issues one story at a time and confirm each with me. Watch for rate limits — pause between bulk operations."

---

## Checkpoint 6 — Xray test repository seed + Xray write-path validation

**Goal:** Regression tests exist for shipped features; we prove the agent can write Xray test steps.

### Tasks
- [ ] `[A]` Attempt Xray writes in this order: (1) Atlassian MCP creating Test-type issues, (2) a community Xray MCP server added to `.vscode/mcp.json`, (3) fallback: small Node scripts in `scripts/xray/` calling Xray's GraphQL API with the Client ID/Secret from Checkpoint 0.3 (env vars, never committed). Whichever works becomes the standard; document the choice HERE: ______________________
- [ ] `[A]` Create regression test sets: ~8 tests for Product Listing (Story A), ~6 for Cart, ~4 for Auth — with proper steps, preconditions, expected results; linked to their stories.
- [ ] `[A]` Create one historical Test Execution for Story A (all passed) so reporting history exists.
- [ ] `[H]` Verify test steps render correctly in the Xray UI.

**Done when:** tests visible with steps in Xray, linked to stories, one execution recorded, write-path documented.

**Session kickoff prompt:** "Read docs/qa-agentic-training-checkpoints.md, Checkpoint 6. First validate which Xray write path works, then seed the regression tests as specified."

---

## Checkpoint 7 — Author the Agent Skills (`.github/skills/`)

**Goal:** Encode the team's QA standards as versioned, reusable skills. Each skill = folder + `SKILL.md` (YAML frontmatter: lowercase hyphenated `name` matching the folder, plus a `description` that tells Copilot when to load it). Trainees can invoke them with `/skill-name` in chat or let Copilot auto-discover them.

### Skills to create (all `[A]`, reviewed by you)
- [ ] `.github/skills/test-case-design/` — case format, Xray field mapping, heuristics (equivalence partitioning, BVA, negative paths, state transitions), rule to flag ambiguous requirements
- [ ] `.github/skills/bug-reporting/` — template, naming convention, severity/priority matrix (mirror the Confluence page), evidence rules (screenshot + console logs), linking rules (story + failing test)
- [ ] `.github/skills/impact-analysis/` — references `docs/feature-map.md`; procedure: PR diff → changed files → affected features → regression scope proposal
- [ ] `.github/skills/playwright-automation/` — framework conventions: page objects, selector strategy, spec naming mapped to Xray test IDs, run + report commands
- [ ] `.github/skills/test-reporting/` — summary comment format, status-transition rules (all pass → Done; open Sev-1/2 → stays In Progress)
- [ ] `[H]` Review each SKILL.md (keep under ~500 lines; move detail to `references/`); commit.

**Done when:** five skills committed; `/skills` menu lists them; asking "design test cases for X" visibly activates the skill in chat.

**Session kickoff prompt:** "Read docs/qa-agentic-training-checkpoints.md, Checkpoint 7. Create the five agent skills one at a time under .github/skills/; show me each SKILL.md before writing it."

---

## Checkpoint 8 — Author the Custom Agents (`.github/agents/*.agent.md`)

**Goal:** The specialist workforce. Each agent = `.agent.md` with YAML frontmatter (`name`, `description`, `tools` for least-privilege scoping, optional `model`, optional `handoffs`). Trainees select them from the agent picker; a coordinator can run them as **subagents**; **handoffs** chain them into the demo workflow with a one-click "next step" button after each act.

### Agents to create (all `[A]`, reviewed by you)
- [ ] `qa-daily-briefing.agent.md` — my QA tasks + dev-task status → prioritized actionable list. Tools: Atlassian read only. Handoff → regression-guardian.
- [ ] `regression-guardian.agent.md` — the story→code→risk traceability agent. Input: a story/dev-task key. Flow: read dev notes → pull linked commits + PR diff via GitHub MCP (using the Jira Development panel / issue-key convention) → map changed files to features via the impact-analysis skill and `docs/feature-map.md` → query Xray for existing tests covering those features → output a risk-ranked testing scope: features to test, existing regression tests to re-run, and gaps with no coverage. Tools: Atlassian read, GitHub read, Xray read. Handoff → test-designer.
- [ ] `test-designer.agent.md` — PRD + story → test suite → Xray, flags ambiguities. Tools: Atlassian read/write (+ Xray path). Uses test-case-design skill. Handoff → test-executor.
- [ ] `test-executor.agent.md` — executes a test case step-by-step in the live browser; on-demand exploratory testing. Tools: Playwright, Atlassian read. Handoff → bug-reporter.
- [ ] `bug-reporter.agent.md` — re-confirms repro, captures evidence, files linked Jira bug. Tools: Playwright, Atlassian write. Uses bug-reporting skill.
- [ ] `automation-engineer.agent.md` — manual case → Playwright spec → run → PR. Tools: edit/terminal, GitHub. Uses playwright-automation skill.
- [ ] `test-reporter.agent.md` — aggregates results, posts summary, updates execution, transitions ticket. Tools: Atlassian write. Uses test-reporting skill.
- [ ] Optional capstone: `qa-coordinator.agent.md` — restricted `agents:` list, orchestrates the others as subagents for the one-command Story E demo.
- [ ] `[H]` Verify tool names against what VS Code actually exposes (tool names vary by platform — check the Tools picker); commit.

**Done when:** each agent completes its job on Story B seed data in isolation; handoff buttons appear between acts.

**Session kickoff prompt:** "Read docs/qa-agentic-training-checkpoints.md, Checkpoint 8. Create the custom agents one at a time under .github/agents/ with least-privilege tools and handoffs; test each against Story B before moving on."

---

## Checkpoint 9 — Hooks + Playwright baseline

**Goal:** Governance automation + a real regression suite in the repo.

### Tasks
- [ ] `[A]` Playwright installed and configured in the repo; baseline specs for Story A regression tests (named per convention, Xray IDs annotated)
- [ ] `[A]` Git pre-commit hook (e.g., husky): block new `.spec.ts` files lacking an Xray test ID annotation — tool-agnostic and always demoable
- [ ] `[A]` Copilot agent hooks (preview, `chat.useCustomAgentHooks`): attach to the automation-engineer agent — e.g., a post-run hook that surfaces the Playwright HTML report path, or a pre-edit lint check. Treat as a preview-feature showcase; keep the git hook as the reliable fallback.
- [ ] `[H]` Trigger both hooks deliberately once to confirm behavior.

**Done when:** `npx playwright test` passes on main; both hooks fire correctly.

---

## Checkpoint 10 — Full demo dry run (the day-in-the-life narrative)

**Goal:** Rehearse the 7-act demo end to end in Copilot agent mode; fix friction.

### The script
1. **Morning triage** — qa-daily-briefing agent: "What's on my plate today?" → B actionable, C blocked, D retest pending → pick B → status transition with comment → handoff button appears
2. **Understand the change** — regression-guardian reads dev task + linked PR/commits → risk-ranked scope + regression picks + coverage gaps → handoff
3. **Design** — test-designer reads Coupon PRD → ~12 cases incl. boundaries → flags the ambiguous requirement → pushes to Xray → handoff
4. **Execute** — test-executor drives the real browser through the cases → hits planted bug live → handoff
5. **Report** — bug-reporter re-reproduces, files linked bug with evidence → show traceability chain in Jira
6. **Automate** — automation-engineer converts passing cases to specs → pre-commit hook fires on missing test ID → suite runs
7. **Close out** — test-reporter posts summary; task stays In Progress (open Sev-2) — governance beat. Kicker: qa-coordinator runs the full Story E pipeline in one command via subagents.

### Tasks
- [ ] `[H+A]` Run all 7 acts; note timing per act (target ~40 min total)
- [ ] `[ ]` Note every failure/slow point and fix (rate limits → pre-warm; flaky selectors → adjust skill; preview features → pin VS Code version)
- [ ] `[ ]` Prepare trainee hands-on exercise: "Story E is yours — brief, design, execute, report"
- [ ] `[ ]` Bonus portability beat: open the same repo in Claude Code and show the skills/agents being picked up cross-tool
- [ ] `[ ]` Write `docs/reset-guide.md` so the Jira/Confluence/Xray environment can be reset between training cohorts

**Done when:** two clean consecutive dry runs.

---

## Known risks & mitigations

| Risk | Mitigation |
|---|---|
| Atlassian MCP rate limits on Free plan | Seed data in small batches; pre-warm before live demos; avoid bulk ops on stage |
| Xray test steps not writable via generic Jira tools | Validated early (Checkpoint 6); GraphQL script fallback ready; Zephyr Scale (similar pricing) or markdown-in-repo is plan C |
| Xray trial expires (~30 days) before/after training | Decision logged in 0.3: pay ~$10/mo, migrate to a free-tier TMS, or repo-based markdown test cases; revisit at Checkpoint 10 |
| Copilot preview features (agent hooks, some subagent settings) may change or need enabling | Pin/record the VS Code version used; document required settings; git pre-commit hook is the reliable fallback |
| Tool names in `.agent.md` differ across Copilot surfaces | Verify against the VS Code Tools picker during Checkpoint 8 |
| Live demo flakiness (OAuth expiry, dev server down) | Pre-demo checklist: MCP servers green in Tools picker, `npm run dev` running, one warm-up query |
| Context overflow in long sessions | One checkpoint per fresh session; this document is the shared memory |
| Trainees' orgs use different tools | Emphasize the pattern (MCP + skills + agents), not the vendors; show `.claude/` cross-compatibility |

## Credentials register (fill in, keep OUT of git)

| Item | Where stored |
|---|---|
| Atlassian site URL + email | |
| Atlassian API token | |
| Xray Client ID/Secret | |
| GitHub PAT (optional fallback) | |
| ToolsShop test user login | |
| Planted-bugs answer key file path | |

---

*Last updated: 2026-07-04 — update this document at the end of every checkpoint session.*
