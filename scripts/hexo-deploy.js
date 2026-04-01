const fs = require('fs');
const path = require('path');
const Hexo = require('hexo');

const repoPath = '/home/brankefu/projects/keyed';
const deployRepo = process.env.HEXO_DEPLOY_REPO;
const deployBranch = process.env.HEXO_DEPLOY_BRANCH || 'gh-pages';

if (!deployRepo) {
  console.error('Missing HEXO_DEPLOY_REPO env var.');
  process.exit(2);
}

(async () => {
  const hexo = new Hexo(repoPath, { silent: false });
  await hexo.init();
  hexo.config.deploy = {
    type: 'git',
    repo: deployRepo,
    branch: deployBranch
  };

  const publicDir = path.join(repoPath, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  await hexo.call('clean');
  await hexo.call('generate');
  await hexo.call('deploy');
  console.log(JSON.stringify({ ok: true, branch: deployBranch }, null, 2));
  await hexo.exit();
})().catch(async err => {
  console.error(err && err.stack ? err.stack : err);
  process.exit(1);
});
