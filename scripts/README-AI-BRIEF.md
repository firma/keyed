# AI High-Quality Brief Automation

This mode is optimized for high-frequency short posts.

## Files
- `scripts/ai-brief-config.json`
- `scripts/ai-brief.js`
- `.ai-brief/queue.json`
- `.ai-brief/state.json`

## Publish unit
One run publishes 1-2 curated items into a single Hexo post.

## Queue item format
```json
{
  "title": "...",
  "summary": "...",
  "url": "https://...",
  "source": "...",
  "why": "..."
}
```

## Notes
This is the publishing side of the blog/news line. The intended one-shot flow is:

1. `node scripts/ai-collector.js`
2. `node scripts/ai-brief.js`
3. `bash scripts/hexo-deploy.sh`
4. `bash scripts/ai-push.sh`

Or just run `bash scripts/ai-run-once.sh` / `npm run ai:run-once`.

Deployment is token-driven through `HEXO_DEPLOY_REPO`; `_config.yml` stays clean and should not contain secrets.
