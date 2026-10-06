import { fileURLToPath } from 'node:url';

export default phase => ({
  outputFileTracingRoot: fileURLToPath(new URL('.', import.meta.url)),
  // Vercel expects the standard Next.js production output directory.
  // Keep development isolated to avoid clashes with local production builds.
  distDir: phase === 'phase-development-server' ? '.next-dev' : '.next',
  serverExternalPackages: ['pg'],
  // Avoid worker creation failures on restricted Windows environments.
  experimental: { workerThreads: false, cpus: 1 },
});
