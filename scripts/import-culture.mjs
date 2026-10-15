import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

// dotnet run changes its application's working directory; pass absolute paths.
const project = fileURLToPath(new URL('../i-api', import.meta.url))
const source = fileURLToPath(new URL('../content/culture/first-four', import.meta.url))
const result = spawnSync('dotnet', ['run', '--project', project, '--no-launch-profile', '--', '--import-culture', source, ...process.argv.slice(2)], { stdio: 'inherit' })
if (result.error) console.error(result.error.message)
process.exitCode = result.status ?? 1
