const {spawnSync} = require('node:child_process')
const fs = require('node:fs')

const required = ['GITHUB_REPOSITORY', 'GITHUB_RUN_ID']
for (const name of required) {
  if (!process.env[name]) throw new Error(`Missing ${name}`)
}

const branch = `checkout-guard-proof-${process.env.GITHUB_RUN_ID}`
const markerPath = `checkout-guard-proof-${process.env.GITHUB_RUN_ID}.txt`
const run = (args) => {
  const result = spawnSync('git', args, {encoding: 'utf8'})
  if (result.status !== 0) {
    throw new Error(`git ${args[0]} failed: ${result.stderr.trim()}`)
  }
  return result.stdout.trim()
}

run(['config', 'user.name', 'H1 controlled proof'])
run(['config', 'user.email', 'proof@example.invalid'])
run(['switch', '--orphan', branch])
fs.writeFileSync(markerPath, 'temporary proof marker\n', {flag: 'wx'})
run(['add', '--', markerPath])
run(['commit', '-m', 'Add temporary checkout guard proof marker'])
run(['remote', 'set-url', 'origin', `https://github.com/${process.env.GITHUB_REPOSITORY}.git`])
run(['push', 'origin', `HEAD:refs/heads/${branch}`])

console.log(`temporary branch created: ${branch}`)
