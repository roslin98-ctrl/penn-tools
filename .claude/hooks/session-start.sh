#!/bin/bash
set -euo pipefail

# Only run in remote Claude Code sessions
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

if [ -z "${GITHUB_TOKEN:-}" ]; then
  echo "GITHUB_TOKEN not set, skipping git identity configuration"
  exit 0
fi

# Fetch name from GitHub API
GIT_NAME=$(curl -fsSL -H "Authorization: Bearer ${GITHUB_TOKEN}" \
  https://api.github.com/user | grep '"name"' | head -1 | sed 's/.*"name": *"\(.*\)".*/\1/')

# Fetch primary verified email from GitHub API
GIT_EMAIL=$(curl -fsSL -H "Authorization: Bearer ${GITHUB_TOKEN}" \
  https://api.github.com/user/emails \
  | grep -A3 '"primary": true' | grep '"email"' | sed 's/.*"email": *"\(.*\)".*/\1/')

if [ -z "$GIT_NAME" ] || [ -z "$GIT_EMAIL" ]; then
  echo "Failed to fetch git identity from GitHub API"
  exit 1
fi

git config --global user.name "$GIT_NAME"
git config --global user.email "$GIT_EMAIL"

echo "Git identity set: ${GIT_NAME} <${GIT_EMAIL}>"
