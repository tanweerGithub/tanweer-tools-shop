---
name: impact-analysis
description: Use when assessing regression risk for a PR or code change to ToolsShop — "what should I test for this PR", "what's the blast radius of this change", or preparing a regression scope before QA sign-off. Procedure: PR diff → feature-map.md → affected + adjacent features (ShopContext is the amplifier) → Xray coverage query → risk-ranked scope with existing tests to re-run and coverage gaps.
---

# Impact Analysis

Governing document: Confluence **"ToolsShop Test Strategy"** — Regression policy section.
Regression scope is **impact-based**, not a fixed full-suite re-run. This skill is that
procedure, made mechanical.

## Procedure

### 1. Get the PR diff

```
gh pr diff <PR#> --repo tanweerGithub/tanweer-tools-shop --name-only
```

(Or `gh api repos/tanweerGithub/tanweer-tools-shop/pulls/<PR#>/files --jq '.[].filename'` for
the same list via the API. For a local unpushed branch, `git diff master...HEAD --name-only`.)

### 2. Map changed files → feature areas

Use `docs/feature-map.md` Section 1 (Feature Area → Files Involved). Every changed file maps
to zero or more feature areas — a file can belong to more than one row (e.g. `Navbar.tsx`
appears under almost every area).

### 3. Identify affected AND adjacent features — ShopContext is the amplifier

- **Affected (direct hit):** any feature area whose files appear in the diff.
- **Adjacent (amplified):** if `context/ShopContext.tsx` is in the diff, do not stop at direct
  hits. Pull in **every** feature area listed in feature-map.md Section 2's "Feature
  Interaction" table (which features read/write which context state) — a ShopContext change
  can silently break a feature that touches none of the changed files. Treat these as
  lower-confidence, still-in-scope risk, not noise to discard.
- Feature areas with no file overlap and no context interaction are out of scope — say so
  explicitly rather than omitting them silently.

### 4. Resolve feature areas to Jira epics

| Feature area (feature-map.md) | Epic |
| --- | --- |
| Product Listing, Product Details | **TS-1** Catalog |
| Cart | **TS-2** Cart |
| Authentication | **TS-3** Auth |
| Checkout | **TS-4** Checkout |
| Order History, Order Success | **TS-5** Orders |
| Contact | **TS-6** Contact |

(Verify this table against `project = TS AND issuetype = Epic` if epics have changed since
this was written — don't trust it blindly forever.)

### 5. Query Xray coverage for each affected/adjacent epic

Regression tests link either directly to the epic, or to a **story** under that epic (e.g.
the Product Listing regression set links to TS-7, a story, not TS-1 the epic directly). Check
both:

```
issuetype = Test AND issue in linkedIssues(<epic-key>)
```

If that returns few/no results for an epic you expect coverage on, also check its stories:

```
project = TS AND issuetype = Story AND parent = <epic-key>
```

then repeat the `linkedIssues(...)` test query against each story key.

### 6. Output: risk-ranked scope

Format:

```
HIGH  — <Feature> (direct diff hit): re-run <TEST-KEY>, <TEST-KEY>, ...
HIGH  — <Feature> (direct diff hit): NO EXISTING TESTS — coverage gap, flag for automation backlog
MEDIUM — <Feature> (adjacent via ShopContext): re-run <TEST-KEY>, ... if time allows
        (excluded) <Feature>: no file overlap, no context interaction — out of scope
```

- **Existing tests to re-run** are listed by key, never just a count.
- **Coverage gaps** (an in-scope feature with zero linked Test issues) are called out
  explicitly, not silently skipped — per the Test Strategy's regression policy, gaps get
  flagged to the backlog for automation, they don't just disappear from the report.

## Worked example: PR #1 (TS-11, coupon at checkout)

Diff: `context/ShopContext.tsx`, `pages/CartPage.tsx`, `pages/CheckoutPage.tsx`.

- **HIGH — Cart** (direct hit): re-run TS-31, TS-32, TS-33, TS-34, TS-35, TS-36.
- **HIGH — Checkout** (direct hit): **NO EXISTING TESTS** — TS-4 (Checkout epic) has zero
  linked Test issues today. Coverage gap — flag for the automation backlog per Test Strategy.
- **MEDIUM — Product Listing** (adjacent — `ShopContext.tsx` changed and Product Listing reads
  `products`/`cart`/`user` and writes `addToCart`, per feature-map.md Section 2): re-run
  TS-23–TS-30 (linked to story TS-7) if time allows.
- **MEDIUM — Auth** (adjacent — Authentication reads/writes `user` on the same shared
  context): re-run TS-37–TS-40 if time allows.
- **Excluded — Contact:** no file overlap; Contact doesn't read/write ShopContext per
  feature-map.md Section 2.
- **Excluded — Orders:** no file overlap in this diff.

## Governance

This skill only reads (GitHub diff, Jira/Xray queries). It never files, links, or transitions
anything — that's `bug-reporting` and `test-reporting`'s job, both still gated on your approval.
