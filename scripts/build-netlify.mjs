import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { execSync } from 'node:child_process'

const projectRoot = resolve(process.cwd())
const outputDir = resolve(projectRoot, 'dist')
const apps = [
  { slug: 'emi-calculator', dir: resolve(projectRoot, 'apps/emi-calculator') },
  { slug: 'converter', dir: resolve(projectRoot, 'apps/converter') },
  { slug: 'random-name-generator', dir: resolve(projectRoot, 'apps/random-name-generator') },
]

const run = (command, cwd = projectRoot) => {
  execSync(command, {
    cwd,
    stdio: 'inherit',
  })
}

rmSync(outputDir, { recursive: true, force: true })
mkdirSync(outputDir, { recursive: true })

for (const app of apps) {
  run('npm install', app.dir)
  run('npm run build', app.dir)

  const appDist = resolve(app.dir, 'dist')
  const target = resolve(outputDir, app.slug)

  if (!existsSync(appDist)) {
    throw new Error(`Build output missing for ${app.slug} at ${appDist}`)
  }

  cpSync(appDist, target, { recursive: true })
}

const rootIndexPath = resolve(projectRoot, 'index.html')
const rootIndexHtml = readFileSync(rootIndexPath, 'utf8')
writeFileSync(resolve(outputDir, 'index.html'), rootIndexHtml)

const staticFiles = ['robots.txt', 'sitemap.xml']

for (const filename of staticFiles) {
  const sourcePath = resolve(projectRoot, filename)
  if (existsSync(sourcePath)) {
    cpSync(sourcePath, resolve(outputDir, filename))
  }
}
