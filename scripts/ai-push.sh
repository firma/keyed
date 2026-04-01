#!/usr/bin/env bash
set -euo pipefail
cd /home/brankefu/projects/keyed
TOKEN_FILE="$HOME/.secrets/github_keyed_pat"
if [[ ! -f "$TOKEN_FILE" ]]; then
  echo "missing token file: $TOKEN_FILE" >&2
  exit 2
fi
read -r TOKEN < "$TOKEN_FILE"
BRANCH=$(git rev-parse --abbrev-ref HEAD)
URL="https://${TOKEN}@github.com/firma/keyed.git"
git push "$URL" "$BRANCH"
