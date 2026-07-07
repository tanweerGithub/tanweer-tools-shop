# ToolsShop Demo — Reset Guide

*Returns the environment to the pre-Act-1 baseline after any demo or rehearsal. Baseline definition: the board matches docs/toolsshop-environment-walkthrough.md — TS-1..TS-41 exist, nothing above, TS-12 in To Do, coupon-branch worktree serving nothing yet. Total time: ~10 minutes. Order matters — follow top to bottom.*

---

## Step 0 — SAVE WHAT YOU KEEP (do this first, every time)

The demo layer gets destroyed below; permanent assets must be committed first.

```bash
cd <main repo>            # must be on master
git status                # inspect: which files are yours to keep?
```
- Uncommitted `docs/*.md` you want permanent (runbook, presenter script, walkthrough, reset guide, checkpoints): `git add docs/ && git commit -m "docs: training materials" && git push`
- Screenshots or scratch files you want: move them OUT of the repo folder entirely.
- Anything you don't recognize: identify before proceeding — never reset over a mystery.

## Step 1 — Jira + Xray sweep (one query kills the demo layer)

Everything demo-created has an issue key **above TS-41**. In Jira: Filters → View all work items (issue navigator):

```
project = TS AND issuekey > TS-41 ORDER BY key ASC
```

Review the list — it should contain ONLY demo artifacts (tests TS-42+, the bug TS-58, any Test Execution). Then: select all → Bulk change → **Delete**. This cascades issue links, coverage entries, and the Xray data hanging off each issue.

*Key numbering never resets — next run creates TS-59+/higher. Nothing depends on specific numbers above 41.*

## Step 2 — Comment + status cleanup (manual, ~2 min)

- **TS-12:** delete the demo comments ("testing starting…", the final summary) via each comment's ⋯ menu. Then transition **TS-12 → To Do**.
- **TS-10:** delete demo comments — including the "Questions for BA" comment about success-message copy. *(Decision, made once: we delete it for run-to-run consistency; every cohort sees the identical board.)*
- **TS-16, TS-35, everything ≤ TS-41:** untouched, always.

## Step 3 — Git reset (main repo)

```bash
git branch --show-current       # must say master
git log origin/master..master --oneline   # shows demo commits (e.g. the specs commit)
git reset --hard origin/master  # drops local demo commits; untracked files survive
git status                      # should be clean, or show only files you chose to keep
```

Do NOT run a bare `git clean -fd` — it deletes untracked files indiscriminately. If demo strays remain, clean surgically: `git clean -fd tests/ scripts/xray/seed-data/` only.

## Step 4 — Worktree and servers

- **Keep the worktree** (`git worktree list` → ../ts-branch on feature/coupon-at-checkout). It is permanent infrastructure.
- Stop any running dev server; restart serving **master** from the main repo (`npm run dev` in its own terminal) — the tour and Acts 1–3 run against master.

## Step 5 — Verification (60 seconds, non-negotiable)

- [ ] Jira search `project = TS AND issuekey > TS-41` returns **zero** results
- [ ] TS-10: coverage panel shows NO tests; no demo comments; Development panel still shows PR #1
- [ ] TS-12: status To Do, no demo comments
- [ ] Xray Test Repository: 18 tests (TS-23..40); Checkout folder EMPTY
- [ ] TS-7: coverage still green/OK (baseline execution TS-41 intact)
- [ ] `git status` clean on master; `git log origin/master..master` empty
- [ ] localhost:5173 serves master (no discount line at checkout)
- [ ] Board visually matches docs/toolsshop-environment-walkthrough.md

## Post-reset launch discipline (for the next run)

1. Terminal A: dev server (master) — its own process, never the session's child
2. Terminal B: `export XRAY_CLIENT_ID=… && export XRAY_CLIENT_SECRET=…` then `claude` — launched from the main repo, **on master** (`git branch --show-current` first)
3. `/mcp` — confirm atlassian authenticated; one warm-up Jira query
4. Note the start time (belt-and-braces alongside the key-based sweep)

## Known one-way doors (accepted, documented)

- Issue keys only go up — cosmetic only
- TS-27's corrected oracle + dated note: permanent baseline improvement, keep
- The TS-12 "test" comment incident, epistemic-rule additions, skill hardening: permanent — resets restore *state*, not *lessons*
