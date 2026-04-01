const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const repoPath = '/home/brankefu/projects/keyed';
const queuePath = path.join(repoPath, '.ai-brief/queue.json');
const sourceStatePath = path.join(repoPath, '.ai-brief/source-state.json');

const FEEDS = [
  { name: 'OpenAI Blog', url: 'https://openai.com/news/rss.xml' },
  { name: 'Anthropic News', url: 'https://www.anthropic.com/news/rss.xml' },
  { name: 'Google DeepMind Blog', url: 'https://deepmind.google/blog/rss.xml' },
  { name: 'Hugging Face Blog', url: 'https://huggingface.co/blog/feed.xml' },
  { name: 'AI on Hacker News', url: 'https://hnrss.org/newest?q=AI' }
];

function exec(cmd) {
  return cp.execSync(cmd, { cwd: repoPath, stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8', maxBuffer: 1024 * 1024 * 20 }).trim();
}
function ensureJson(file, fallback) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return fallback; }
}
function saveJson(file, data) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, JSON.stringify(data, null, 2)); }
function strip(s='') { return s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(); }
function liteHash(s) { let h=0; for (let i=0;i<s.length;i++) h=((h<<5)-h+s.charCodeAt(i))|0; return String(Math.abs(h)); }
function score(title, source) {
  const t = `${title} ${source}`.toLowerCase();
  let x = 0;
  const plus = ['openai','anthropic','gemini','deepmind','deepseek','claude','gpt','llm','agent','cursor','windsurf','copilot','hugging face','api','model','release','launch'];
  const minus = ['job','hiring','podcast','opinion','sponsored','webinar'];
  plus.forEach(k => { if (t.includes(k)) x += 2; });
  minus.forEach(k => { if (t.includes(k)) x -= 2; });
  return x;
}
function parseItems(xml, sourceName) {
  const items = [];
  const blocks = xml.match(/<item[\s\S]*?<\/item>/g) || xml.match(/<entry[\s\S]*?<\/entry>/g) || [];
  for (const block of blocks) {
    const title = strip((block.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [,''])[1]);
    const link = strip((block.match(/<link[^>]*>([\s\S]*?)<\/link>/i) || [,''])[1]) || strip((block.match(/<link[^>]*href="([^"]+)"/i) || [,''])[1]);
    const desc = strip((block.match(/<description[^>]*>([\s\S]*?)<\/description>/i) || [,''])[1] || (block.match(/<summary[^>]*>([\s\S]*?)<\/summary>/i) || [,''])[1]);
    if (!title || !link) continue;
    items.push({
      title,
      summary: desc.slice(0, 220),
      url: link,
      source: sourceName,
      why: '来自高相关 AI 信源，且标题/主题与模型、Agent、开发者工具或开源生态高度相关。',
      score: score(title, sourceName)
    });
  }
  return items;
}

const queue = ensureJson(queuePath, []);
const sourceState = ensureJson(sourceStatePath, { seen: {} });
const existing = new Set(queue.map(x => x.url || x.title));
let added = 0;

for (const feed of FEEDS) {
  try {
    const xml = exec(`curl -L --max-time 20 -A ${JSON.stringify('Mozilla/5.0')} ${JSON.stringify(feed.url)}`);
    const items = parseItems(xml, feed.name)
      .filter(x => x.score >= 1)
      .sort((a,b) => b.score - a.score)
      .slice(0, 12);
    for (const item of items) {
      const key = item.url || item.title;
      const id = liteHash(key);
      if (existing.has(key) || sourceState.seen[id]) continue;
      queue.push(item);
      existing.add(key);
      sourceState.seen[id] = { title: item.title, url: item.url, addedAt: new Date().toISOString() };
      added++;
    }
  } catch (e) {
    // ignore single-feed failures
  }
}

saveJson(queuePath, queue.slice(-1000));
saveJson(sourceStatePath, sourceState);
console.log(JSON.stringify({ added, queue: queue.length }, null, 2));
