# Copilot handoffs (shelved — implement someday)
Copilot-only feature: after an agent finishes, a one-click "next step"
button chains to another agent. Requires .agent.md files in
.github/agents/ (Copilot's native format; handoffs frontmatter is not
part of the Claude Code format in .claude/agents/).

Example — .github/agents/qa-daily-briefing.agent.md:
---
name: qa-daily-briefing
description: Triage my QA work in project TS
tools: ['atlassian']          # Copilot tool names differ — check Tools picker
handoffs:
  - agent: regression-guardian
    label: Analyze impact of the actionable story
    prompt: Run impact analysis on the story I selected from the briefing.
---
(body: copy from .claude/agents/qa-daily-briefing.md)

Chain for the demo flow: briefing → regression-guardian → test-designer
→ test-executor → bug-reporter → test-reporter.
NOTE: syntax is evolving (preview-era feature) — verify against current
VS Code custom-agents docs before implementing.