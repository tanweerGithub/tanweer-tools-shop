## Project context
ToolsShop: React + Vite + TypeScript + MUI e-commerce demo app, product under
test for QA workflows. Run: npm run dev → http://localhost:5173. Hosted
environment: https://tanweertoolsshop.netlify.app. Demo login:
tanweer@test.com / tanweer123. Feature map: docs/feature-map.md.

## Tracking systems
Jira site: ai-qa-hub.atlassian.net — QA project key: TS (to be created; the
KAN project is scratch, never use it). Confluence space: "Tanweer Tools Shop".
Test management: Xray (tests are Jira issue types).

## Conventions
Branches: feature/TS-<n>-short-name. Commits and PR titles start with the
issue key (e.g., "TS-12: ..."). Playwright specs live in tests/ and are named
after Xray test IDs.

## Governance rules (always apply)
- Never create, update, transition, or delete anything in Jira, Confluence,
  or Xray without showing me the exact content first and getting approval.
- Never fix application defects unless the task explicitly says to — defects
  on main are intentional demo assets.
- Test cases follow the test-case-design skill; bug reports follow the
  bug-reporting skill; test summaries follow the test-reporting skill
  (skills arrive in a later checkpoint — reference them by name).
- Never commit secrets; tokens live in environment variables.
