// Deploy the Vue frontend; keep the ASP.NET API on a host with durable storage.
const configuredOrigin = process.env.ISMI_API_ORIGIN
if (!configuredOrigin) {
  throw new Error('Set ISMI_API_ORIGIN to the hosted HTTPS ASP.NET API origin before deploying Ismi.')
}

const apiOrigin = new URL(configuredOrigin)
if (apiOrigin.protocol !== 'https:' || apiOrigin.username || apiOrigin.password ||
    apiOrigin.pathname !== '/' || apiOrigin.search || apiOrigin.hash) {
  throw new Error('ISMI_API_ORIGIN must be an HTTPS origin without credentials, a path, a query, or a fragment.')
}

export const config = {
  framework: 'vite',
  installCommand: 'npm --prefix i-web ci',
  buildCommand: 'npm --prefix i-web run build',
  outputDirectory: 'i-web/dist',
  rewrites: [
    { source: '/api/:path*', destination: `${apiOrigin.origin}/api/:path*` },
    { source: '/:path*', destination: '/index.html' },
  ],
  headers: [
    { source: '/api/:path*', headers: [{ key: 'Cache-Control', value: 'private, no-store' }] },
    { source: '/sw.js', headers: [{ key: 'Cache-Control', value: 'no-cache' }] },
  ],
}
