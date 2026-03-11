#!/bin/bash
set -euo pipefail

# Only run in remote Claude Code sessions
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

# Set permanent git identity
git config --global user.name "Ananya Chandra"
git config --global user.email "ananyachandra14@gmail.com"

echo "Git identity set: Ananya Chandra <ananyachandra14@gmail.com>"
