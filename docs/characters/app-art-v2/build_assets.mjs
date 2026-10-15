// Delivery conversion only; no generated character geometry is edited or traced.
import { createRequire } from 'node:module'
import { mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
const require = createRequire(import.meta.url)
const sharp = require('sharp')
const root = fileURLToPath(new URL('../../../', import.meta.url))
const target = `${root}i-web/public/characters/v2`
await mkdir(target, { recursive: true })
const sources = {
  'fattoush-neutral': 'app-art-v2/fattoush-neutral.png',
  'fattoush-attentive': 'fattoush-expressive-02/fattoush-listening.png',
  'fattoush-encouraging': 'fattoush-expressive-02/fattoush-encouraging.png',
  'fattoush-welcoming': 'fattoush-expressive-02/fattoush-welcoming.png',
  'knafeh-neutral': 'app-art-v2/knafeh-neutral.png',
  'knafeh-attentive': 'app-art-v2/knafeh-attentive.png',
  'knafeh-encouraging': 'app-art-v2/knafeh-encouraging.png',
}
for (const [name, source] of Object.entries(sources)) {
  await sharp(`${root}docs/characters/${source}`).resize(512, 512).webp({ quality: 88 }).toFile(`${target}/${name}.webp`)
}
const coffee = `${root}docs/characters/fattoush-expressive-02/lesson-coffee.png`
await sharp(coffee).resize(1200, 800).webp({ quality: 86 }).toFile(`${target}/lesson-coffee.webp`)
await sharp(coffee).resize(640).webp({ quality: 84 }).toFile(`${target}/lesson-coffee-mobile.webp`)
await sharp(`${root}docs/characters/fattoush-expressive-02/lesson-plans.png`).resize(960, 640).webp({ quality: 86 }).toFile(`${target}/lesson-plans.webp`)
