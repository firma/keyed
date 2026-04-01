#!/usr/bin/env bash
set -euo pipefail
cd /home/brankefu/projects/keyed

node scripts/ai-collector.js

brief_status=0
if ! node scripts/ai-brief.js; then
  brief_status=$?
fi

if [[ "$brief_status" -eq 2 ]]; then
  echo "ai-brief: no publishable items, skipping deploy/push"
  exit 0
fi

if [[ "$brief_status" -ne 0 ]]; then
  echo "ai-brief failed with status $brief_status" >&2
  exit "$brief_status"
fi

bash scripts/hexo-deploy.sh
bash scripts/ai-push.sh
