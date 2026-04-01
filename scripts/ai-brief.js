const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'ai-brief-config.json'), 'utf8'));

function ensureDir(p) { fs.mkdirSync(p, { recursive: true }); }
function exec(cmd, cwd = config.repoPath) {
  return cp.execSync(cmd, { cwd, stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8' }).trim();
}
function pad(n) { return String(n).padStart(2, '0'); }
function shaLite(s) { let h = 0; for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0; return String(Math.abs(h)); }
function loadJson(p, fallback) { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return fallback; } }
function saveJson(p, data) { fs.writeFileSync(p, JSON.stringify(data, null, 2)); }
function localDateTime(d) {
  const x = new Date(d.getTime() + 8 * 3600 * 1000);
  return `${x.getUTCFullYear()}-${pad(x.getUTCMonth()+1)}-${pad(x.getUTCDate())} ${pad(x.getUTCHours())}:${pad(x.getUTCMinutes())}:${pad(x.getUTCSeconds())}`;
}
function slugTime(d) {
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth()+1)}${pad(d.getUTCDate())}-${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}`;
}

ensureDir(config.stateDir);
const queuePath = path.join(config.stateDir, 'queue.json');
const statePath = path.join(config.stateDir, 'state.json');
const queue = loadJson(queuePath, []);
const state = loadJson(statePath, { seen: {}, runs: [] });

const uniq = [];
const localSeen = new Set();
for (const item of queue) {
  const key = item.url || item.title;
  if (!key || localSeen.has(key)) continue;
  localSeen.add(key);
  uniq.push(item);
}

const available = uniq.filter(item => !state.seen[shaLite(item.url || item.title)]);
const items = available.slice(0, config.maxItems);
if (items.length < config.minItems) {
  console.error('No enough briefing items to publish.');
  process.exit(2);
}

const now = new Date();
const suffix = slugTime(now);
const head = items[0];
const titleBase = (head.title || 'AI 高质量快讯').replace(/["\/:*?<>|]+/g, ' ').trim().slice(0, 40);
const filename = `ai-brief-${suffix}.md`;
const filePath = path.join(config.postDir, filename);
const title = `AI 高质量快讯｜${titleBase}`;

const frontmatter = [
  '---',
  `title: "${title}"`,
  `date: ${localDateTime(now)}`,
  'categories:',
  ...config.categories.map(v => `  - ${v}`),
  'tags:',
  ...config.tags.map(v => `  - ${v}`),
  '---',
  ''
].join('\n');

const content = [
  frontmatter,
  ...items.map((item, idx) => [
    `## 快讯 ${idx + 1}`,
    '',
    `**事件：** ${item.title}`,
    '',
    item.summary || '',
    '',
    `- 来源：${item.source || item.url}`,
    `- 链接：${item.url}`,
    `- 影响：${item.why || '可能影响模型竞争、AI 产品迭代或开发者工具生态。'}`,
    ''
  ].join('\n')),
  '---',
  '',
  '> 本快讯为自动化整理发布，优先挑选有明确增量信息与行业影响的内容。',
  ''
].join('\n');

fs.writeFileSync(filePath, content, 'utf8');
for (const item of items) {
  state.seen[shaLite(item.url || item.title)] = {
    seenAt: new Date().toISOString(),
    title: item.title,
    url: item.url
  };
}
state.runs.unshift({ publishedAt: new Date().toISOString(), file: filename, count: items.length });
state.runs = state.runs.slice(0, 500);

const remaining = uniq.filter(item => !items.includes(item)).slice(0, 1000);
saveJson(queuePath, remaining);
saveJson(statePath, state);

exec(`git add ${JSON.stringify(path.relative(config.repoPath, filePath))} ${JSON.stringify(path.relative(config.repoPath, queuePath))} ${JSON.stringify(path.relative(config.repoPath, statePath))}`);
exec(`git commit -m ${JSON.stringify(`chore(blog): publish ${filename.replace('.md','')}`)}`);
console.log(JSON.stringify({ file: filePath, count: items.length }, null, 2));
