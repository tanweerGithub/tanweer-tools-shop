#!/usr/bin/env bash
# Installs the repo-tracked git hooks into .git/hooks/ (which git never tracks itself).
# Run manually with `bash scripts/hooks/install.sh`, or automatically via `npm install`
# (wired as the "prepare" script in package.json).
set -euo pipefail

repo_root=$(git rev-parse --show-toplevel 2>/dev/null) || {
  echo "install-hooks: not inside a git repo, skipping."
  exit 0
}

cp "$repo_root/scripts/hooks/pre-commit" "$repo_root/.git/hooks/pre-commit"
chmod +x "$repo_root/.git/hooks/pre-commit"
echo "install-hooks: pre-commit hook installed."
