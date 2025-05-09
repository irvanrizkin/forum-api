// eslint-disable-next-line @typescript-eslint/no-require-imports, unicorn/prefer-module
const { build } = require('esbuild');

build({
  entryPoints: ['src/app.ts'], // your entry file
  bundle: true,
  outfile: 'dist/app.js',
  platform: 'node',
  tsconfig: './tsconfig.json', // to automatically respect your paths
  packages: 'external', // if you want to exclude node_modules
  // eslint-disable-next-line unicorn/no-process-exit, unicorn/prefer-top-level-await
}).catch(() => process.exit(1));
