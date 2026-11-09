// Copies the opt-in legacy global stylesheet (resets that v7 applied to the whole page) into dist.
import { compileAsync } from 'sass'
import { mkdir, writeFile } from 'node:fs/promises'

const { css } = await compileAsync('src/styles/legacy-global.scss', { style: 'compressed' })
await mkdir('dist', { recursive: true })
await writeFile('dist/legacy-global.css', css)
console.log('dist/legacy-global.css written')
