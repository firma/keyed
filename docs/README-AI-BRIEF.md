# AI High-Quality Brief Automation

This mode is optimized for high-frequency short posts.

## Files
- `automation/ai-brief-config.json`
- `automation/ai-brief.js`
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

1. `node automation/ai-collector.js`
2. `node automation/ai-brief.js`
3. `bash automation/hexo-deploy.sh`
4. `bash automation/ai-push.sh`

Or just run `bash automation/ai-run-once.sh` / `npm run ai:run-once`.

Deployment is token-driven through `HEXO_DEPLOY_REPO`; `_config.yml` stays clean and should not contain secrets.
