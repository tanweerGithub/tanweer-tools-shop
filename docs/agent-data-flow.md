# How the Demo Machine Actually Works — Agents, Files, and Data Flow

*The complete wiring diagram in plain English: what each agent reads, what it produces, where that output lives (screen / disk / Jira-Xray), which skill it obeys, and how the pieces hand off. Read this until you can draw it from memory.*

---

## 1. The two branches — what code lives where

**`master`** (the main repo folder — where you launch `claude`):
- The app WITHOUT the coupon-at-checkout feature. Coupons work on the Cart page only; at Checkout the discount is LOST (customer sees full price) — that's the old bug that story TS-10 was raised to fix.
- ALL the tooling: the 7 agents (`.claude/agents/`), the 5 skills (`.claude/skills/`), the Xray scripts (`scripts/xray/`), the automated specs (`tests/`), the docs, `CLAUDE.md`, `.mcp.json`.

**`feature/coupon-at-checkout`** (served at localhost:5173 via the worktree `../ts-branch`):
- The developer's UNMERGED fix for TS-10: the discount now carries to Checkout (new `checkout-discount` line; validation reads `VALID_COUPONS`). Three files changed: CartPage, CheckoutPage, ShopContext — that's PR #1.
- Still contains the STALE-DISCOUNT defect: the discount is a dollar amount frozen at apply time; change the cart afterwards and it doesn't recalculate. The dev never tested that. This is what the demo finds.
- Contains NO agents/skills/scripts — the branch was cut before they existed. (This is why the main repo must stay on master.)

## 2. The two "plumbing" pieces you asked about

**Seed-data JSON** (`scripts/xray/seed-data/*.json`) — a plain file holding test-case CONTENT: for each test, its summary, precondition, and steps (action / data / expected result). It is the designer's draft frozen into a reviewable file: **what you approve is byte-for-byte what gets sent.** After creation it's just a birth certificate — Xray becomes the source of truth.

**`create-test.mjs`** — a plain Node script (no AI): reads a seed JSON, logs into Xray using the two environment variables (via `client.mjs`), and calls Xray's GraphQL `createTest` once per test — creating the Jira Test issue AND its steps in Xray's own data store in one call. (Steps live in Xray's model, invisible to the normal Jira API — that's the whole reason this script exists.) Its siblings: `create-test-execution.mjs` records a run; `link-tests` / the MCP creates the test→story links.

## 3. The seven agents — input → output → where it lives

| # | Agent | Reads (input) | Skill obeyed | Produces | Where the output LIVES |
|---|-------|---------------|--------------|----------|------------------------|
| 1 | **qa-daily-briefing** | Jira live (JQL: my QA tasks + sibling dev-task statuses + Reopened bugs) | — | Prioritized triage list | **Screen only.** Nothing created anywhere. (The TS-12 transition+comment that follows is done by the main session on your order — that IS a Jira write.) |
| 2 | **regression-guardian** | Story key you give it; Jira dev notes; PR diff via `gh`; `docs/feature-map.md`; Xray coverage | impact-analysis | The "scope": affected areas, test keys to re-run, coverage gaps | **Screen only. "Scope" is not a file** — it's analysis text. It flows forward as conversation context and as YOUR decision. |
| 3 | **test-designer** | PRD (Confluence), story (Jira), feature-map selectors, live app if verifying values; the guardian's gap (same conversation) | test-case-design | (a) draft suite on screen + BA questions; (b) **seed-data JSONs on disk**; (c) after your approval, runs `create-test.mjs` → **Test issues in Jira/Xray with steps** + links | JSONs = local disk (demo layer). Tests = **permanent in Jira/Xray** until reset. Coverage on TS-10 now shows the tests as **NOTRUN**. |
| 4 | **test-executor** | Test keys; steps fetched from Xray (GraphQL); the live app via Playwright | (consumes the design convention: selectors from the Data field) | Per-step PASS/FAIL with observed values; failure evidence | **Screen only.** It is a WITNESS — it changes nothing. **NOTRUN stays NOTRUN after Act 4.** |
| 5 | **bug-reporter** | The executor's failure (conversation) or your dictation; re-verifies live; searches Jira for duplicates first | bug-reporting | Draft bug on screen → after approval, **Bug issue in Jira** + links (story, failing test, related bugs) | **Permanent in Jira** (e.g. TS-58) until reset. |
| 6 | **automation-engineer** | Test content (from Xray; legacy fallback: seed JSON), playwright config, page objects | playwright-automation | **Spec files on disk** (`tests/TS-XX.spec.ts` + page objects); a suite run (report is ephemeral); after approval, a **local git commit on master** | Disk + local commit — **never pushed** during demos; the reset drops it. |
| 7 | **test-reporter** | QA task key + the day's results (conversation) | test-reporting | Draft summary + verdict on screen → after approval: **comment on the QA task** (Jira) + **Test Execution recorded** via `create-test-execution.mjs` (Xray) + status confirmation/transition | **Permanent in Jira/Xray.** Recording the execution is THE act that flips coverage **NOTRUN → PASSED/FAILED**. |

## 4. The NOTRUN → PASSED timeline (who flips it)

- Tests are born (Act 3, designer) → coverage panel on the story shows them, status **NOTRUN** ("exists, never executed").
- The executor runs them in a browser (Act 4) → **still NOTRUN.** The executor only reports; it records nothing.
- The reporter records a Test Execution with per-test statuses (Act 7) → coverage flips to **PASSED/OK** (or FAILED). That execution is itself a Jira issue (e.g. TS-59).
- This is exactly why baseline TS-7 is green: execution TS-41 was recorded for its 8 tests. Post-hardening, recording the execution is a REQUIRED output of every testing pass — a run without it is incomplete.

## 5. What is temporary, what is permanent, what is screen-only

- **Screen-only, nothing to clean up:** briefing (1), guardian (2), executor (4).
- **Permanent until reset — Jira/Xray writes, all approval-gated:** designer's tests + links (3), bug-reporter's bug (5), reporter's comment + execution (7), plus the session's TS-12 transition/comment after Act 1. → all removed by the reset sweep `issuekey > TS-41` + comment cleanup.
- **Local-only files/commits:** designer's seed JSONs, automation's specs + local commit (6). → removed by `git reset --hard origin/master` (+ surgical clean).
- **Permanent forever (survive resets, on purpose):** the agents, skills, scripts, docs, hardening improvements — pushed to origin/master.

## 6. The seven acts in one sentence each (objective + hand-off)

1. **Briefing** — *"What should I work on?"* Reads the board, applies the entry rule (QA workable only when dev is Done) → points you at TS-12. Hand-off: your choice of story.
2. **Guardian** — *"What does this change put at risk?"* PR diff → feature map → shared-state blast radius → which existing tests to re-run, and where coverage is missing. Hand-off: the scope in conversation, incl. "no Checkout tests exist."
3. **Designer** — *"What should the tests BE?"* Reads the PRD (the spec, not the code — deliberately on master), designs the suite, flags what the PRD doesn't say, writes the JSON, and (on approval) the script creates real Xray tests. Hand-off: test keys, sitting at NOTRUN.
4. **Executor** — *"What does the code actually DO?"* Drives the real browser through those steps on the BRANCH. The dev's fix passes; the case behind the flagged silence fails with real numbers. Hand-off: failures + evidence, on screen.
5. **Bug-reporter** — *"Make the failure official."* Duplicate-search, re-verify, draft per template, and (on approval) file the linked bug. Hand-off: a bug key (Sev-2).
6. **Automation-engineer** — *"Never hand-test the passing cases again."* Converts them to Playwright specs, runs green, commits locally. Hand-off: a regression suite.
7. **Reporter** — *"Tell the truth and record it."* Summary comment + recorded execution (NOTRUN flips) + the verdict: the story CANNOT close while a Sev-2 is open — exit criteria, executed. Hand-off: an honest board.

## 7. One paragraph to hold the whole picture

You speak intent; agents turn it into drafts; **you approve every write**; scripts and MCPs carry approved content into the systems of record; and the systems of record (Jira, Xray, GitHub, Confluence) — not the conversation — are where truth accumulates. Three agents only read and tell (1, 2, 4). Three create durable records, always gated (3, 5, 7). One writes code (6). The skills are the rulebooks they all obey; the seed JSON is the contract between your approval and what gets created; and the recorded execution is the single act that turns "we tested" into data.
