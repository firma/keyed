const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const configPath = path.join(__dirname, 'ai-daily-config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

function ensureDir(p) { fs.mkdirSync(p, { recursive: true }); }
function sh(cmd, cwd = config.repoPath) {
  return cp.execSync(cmd, { cwd, stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8' }).trim();
}
function nowUtc() { return new Date(); }
function pad(n) { return String(n).padStart(2, '0'); }
function toDateSlug(d) { return `${d.getUTCFullYear()}-${pad(d.getUTCMonth()+1)}-${pad(d.getUTCDate())}`; }
function toDateTimeLocal(d) {
  const local = new Date(d.getTime() + 8 * 3600 * 1000);
  return `${local.getUTCFullYear()}-${pad(local.getUTCMonth()+1)}-${pad(local.getUTCDate())} ${pad(local.getUTCHours())}:${pad(local.getUTCMinutes())}:${pad(local.getUTCSeconds())}`;
}
function hashString(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return String(Math.abs(h));
}
function loadJson(p, fallback) {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return fallback; }
}
function saveJson(p, data) { fs.writeFileSync(p, JSON.stringify(data, null, 2)); }

ensureDir(config.stateDir);
const statePath = path.join(config.stateDir, 'state.json');
const queuePath = path.join(config.stateDir, 'queue.json');
const state = loadJson(statePath, { seen: {}, runs: [] });
const queue = loadJson(queuePath, []);

const ts = nowUtc();
const slugBase = `ai-daily-${toDateSlug(ts)}-${pad(ts.getUTCHours())}${pad(ts.getUTCMinutes())}${pad(ts.getUTCSeconds())}`;
const postPath = path.join(config.postDir, `${slugBase}.md`);

const uniqueQueue = [];
const seenLocal = new Set();
for (const item of queue) {
  const key = item.url || item.title;
  if (!key || seenLocal.has(key)) continue;
  seenLocal.add(key);
  uniqueQueue.push(item);
}

const fresh = uniqueQueue.filter(item => {
  const key = item.url || item.title;
  const hid = hashString(key);
  return !state.seen[hid];
}).slice(0, config.maxItems);

const items = fresh.slice(0, config.maxItems);
if (items.length < config.minItems) {
  console.error(`Not enough queued items to publish. Need ${config.minItems}, got ${items.length}.`);
  process.exit(2);
}

const title = `AI 日报 ${toDateSlug(ts)} ${pad(ts.getUTCHours())}:${pad(ts.getUTCMinutes())}`;
const summary = `本期整理 ${items.length} 条值得关注的 AI 动态，覆盖模型、产品、Agent、开源与行业进展。`;
const fm = [
  '---',
  `title: "${title}"`,
  `date: ${toDateTimeLocal(ts)}`,
  'categories:',
  ...config.categories.map(v => `  - ${v}`),
  'tags:',
  ...config.tags.map(v => `  - ${v}`),
  '---',
  ''
].join('\n');

const body = [
  fm,
  summary,
  '',
  '> 本文由自动化流程整理生成，优先选取对产品、开发者生态和行业格局影响较大的更新。',
  '',
  ...items.map((item, idx) => {
    const why = item.why || '值得关注，可能影响模型能力、开发工具链或行业竞争格局。';
    return [
      `## ${idx + 1}. ${item.title}`,
      '',
      item.summary || '',
      '',
      `- 来源：${item.source || item.url}`,
      `- 链接：${item.url}`,
      `- 为什么重要：${why}`,
      ''
    ].join('\n');
  }),
  '## 结论',
  '',
  '今天的 AI 动态仍然集中在三条主线：模型能力迭代、开发者工具加速，以及 Agent 化工作流落地。后续如果这些方向继续叠加，产品更新频率和竞争节奏还会更快。',
  ''
].join('\n');

fs.writeFileSync(postPath, body, 'utf8');

for (const item of items) {
  const key = item.url || item.title;
  state.seen[hashString(key)] = { seenAt: new Date().toISOString(), title: item.title, url: item.url };
}
state.runs.unshift({ createdAt: new Date().toISOString(), file: path.basename(postPath), count: items.length });
state.runs = state.runs.slice(0, 200);
saveJson(statePath, state);
saveJson(queuePath, uniqueQueue.filter(item => !items.includes(item)).slice(0, 500));

sh(`git add ${JSON.stringify(path.relative(config.repoPath, postPath))} ${JSON.stringify(path.relative(config.repoPath, statePath))} ${JSON.stringify(path.relative(config.repoPath, queuePath))}`);
try {
  sh(`git commit -m ${JSON.stringify(`chore(blog): publish ${path.basename(postPath, '.md')}`)}`);
} catch (e) {
  console.error('Nothing to commit or commit failed.');
  process.exit(3);
}

console.log(JSON.stringify({ postPath, count: items.length }, null, 2));
