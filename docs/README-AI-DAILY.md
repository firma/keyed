# AI Daily Automation

## Files
- `automation/ai-daily-config.json` — runtime config
- `automation/ai-daily.js` — turns queued items into a Hexo post and commits it
- `.ai-daily/queue.json` — pending AI news items to publish
- `.ai-daily/state.json` — dedupe state

## Current mode
This project is currently prepared for direct publishing into `source/_posts/`.

## Status relative to the active blog pipeline
The currently active blog/news automation path is `ai-collector.js -> ai-brief.js -> hexo-deploy.sh -> ai-push.sh`.
`ai-daily.js` is a separate path and is not part of the brief-based gh-pages deploy flow.

## Important
The generator script does **not** fetch the web by itself. It expects curated items to be written into `.ai-daily/queue.json` first.

Each item should look like:

```json
{
  "title": "OpenAI released ...",
  "summary": "One paragraph summary.",
  "url": "https://...",
  "source": "Source name",
  "why": "Why it matters"
}
```
