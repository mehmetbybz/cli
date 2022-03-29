const t = require('tap')
const spawn = require('@npmcli/promise-spawn')
const fs = require('@npmcli/fs')
const { resolve, join } = require('path')

const cwd = resolve(__dirname, '..')
const output = join(cwd, 'output')
// remove npm config when spawning so config set by test commands don't interfere
const env = Object.fromEntries(Object.entries(process.env).filter(([k]) => !k.startsWith('npm_')))

const rm = (d) => fs.rm(d, { recursive: true, force: true }).catch(() => {})

t.test('docs', async (t) => {
  await rm(output)
  t.teardown(() => rm(output))
  t.rejects(() => fs.stat(output))

  const docs = await spawn('npm', ['run', 'build'], { cwd, env })

  t.equal(docs.code, 0)
  t.ok((await fs.stat(output)).isDirectory())
})

t.test('files used by documention repo', async (t) => {
  t.ok((await fs.stat(join(cwd, 'content'))).isDirectory())
  t.ok((await fs.stat(join(cwd, 'nav.yml'))).isFile())
})
