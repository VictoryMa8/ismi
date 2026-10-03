import { spawn, spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { createServer } from 'node:net'
import { fileURLToPath } from 'node:url'
import { parseEnv } from 'node:util'

const root = fileURLToPath(new URL('../', import.meta.url))
process.chdir(root)

// Load local overrides without executing shell expressions. Shell values win.
const local = {}
for (const name of ['.env', '.env.local']) {
  if (!existsSync(name)) continue
  Object.assign(local, parseEnv(readFileSync(name, 'utf8')))
}
const environment = { ...local, ...process.env }

const children = []
let stopping = false
function stop(code = 0) {
  if (stopping) return
  stopping = true
  process.exitCode = code
  for (const child of children) {
    try {
      if (process.platform === 'win32') {
        spawnSync('taskkill', ['/pid', String(child.pid), '/T', '/F'], { stdio: 'ignore' })
      } else {
        // Own the server's process group, including dotnet watch children.
        process.kill(-child.pid, 'SIGTERM')
      }
    } catch (error) {
      if (error.code !== 'ESRCH') console.error(error.message)
    }
  }
  const force = setTimeout(() => {
    for (const child of children) {
      try { if (process.platform !== 'win32') process.kill(-child.pid, 'SIGKILL') } catch {}
    }
  }, 4000)
  force.unref()
}
process.on('SIGINT', () => stop())
process.on('SIGTERM', () => stop())

function start(command, args, cwd, env) {
  const child = spawn(command, args, {
    cwd, env, stdio: 'inherit', detached: process.platform !== 'win32',
  })
  children.push(child)
  child.on('error', (error) => { console.error(error.message); stop(1) })
  child.on('exit', (code, signal) => {
    if (!stopping) {
      console.error(`${command} stopped (${signal ?? code}).`)
      stop(code || 1)
    }
  })
}

async function checkPort(port, label) {
  await new Promise((resolve, reject) => {
    const probe = createServer()
    probe.once('error', (error) => reject(new Error(error.code === 'EADDRINUSE'
      ? `${label} port ${port} is already in use. Stop the existing server first, or set ${label === 'API' ? 'ISMI_API_PORT' : 'ISMI_WEB_PORT'} to another port.`
      : `Cannot use ${label} port ${port}: ${error.message}`)))
    probe.listen(port, '127.0.0.1', () => probe.close(resolve))
  })
}

try {
  const mode = process.argv[2]
  if (mode !== 'api' && mode !== 'web') throw new Error('Use npm run api or npm run web.')
  if (mode === 'web' && !existsSync('i-web/node_modules/vite/bin/vite.js')) {
    throw new Error('Frontend dependencies are missing. Run npm run setup first.')
  }
  if (mode === 'api') {
    const sdk = spawnSync('dotnet', ['--version'], { encoding: 'utf8' })
    if (sdk.status !== 0) throw new Error('The required .NET SDK is unavailable. Install .NET 10 SDK 10.0.301 or newer in the 10.0 feature bands (see global.json).')
  }
  const apiPort = Number(environment.ISMI_API_PORT ?? 5062)
  const webPort = Number(environment.ISMI_WEB_PORT ?? 5173)
  for (const port of [apiPort, webPort]) {
    if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Local ports must be integers between 1 and 65535.')
  }
  if (apiPort === webPort) throw new Error('API and frontend must use different ports.')
  await checkPort(mode === 'api' ? apiPort : webPort, mode === 'api' ? 'API' : 'Web')
  const apiUrl = `http://127.0.0.1:${apiPort}`
  const env = { ...environment, ASPNETCORE_ENVIRONMENT: 'Development', DOTNET_ENVIRONMENT: 'Development', ISMI_API_PROXY_TARGET: apiUrl }
  if (mode === 'api') {
    console.log(`Starting the Ismi API with dotnet watch at ${apiUrl}. Press Ctrl+C to stop it.`)
    start('dotnet', ['watch', '--non-interactive', '--project', 'i-api', 'run', '--no-launch-profile', '--urls', apiUrl], root, env)
  } else {
    console.log(`Starting the frontend at http://127.0.0.1:${webPort}/; API proxy: ${apiUrl}.`)
    console.log('Run npm run api in another terminal. Press Ctrl+C to stop the frontend.')
    // Use Node directly so the launcher owns Vite on every platform.
    start(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', String(webPort), '--strictPort'], fileURLToPath(new URL('../i-web/', import.meta.url)), env)
  }
} catch (error) {
  console.error(`Ismi could not start: ${error.message}`)
  stop(1)
}
