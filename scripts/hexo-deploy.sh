#!/usr/bin/env bash
set -euo pipefail
cd /home/brankefu/projects/keyed
TOKEN_FILE="$HOME/.secrets/github_keyed_pat"
if [[ ! -f "$TOKEN_FILE" ]]; then
  echo "missing token file: $TOKEN_FILE" >&2
  exit 2
fi
read -r TOKEN < "$TOKEN_FILE"
export HEXO_DEPLOY_REPO="https://${TOKEN}@github.com/firma/keyed.git"
export HEXO_DEPLOY_BRANCH="gh-pages"
node scripts/hexo-deploy.js
