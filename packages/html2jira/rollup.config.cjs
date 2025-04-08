const { withNx } = require('@nx/rollup/with-nx');

module.exports = withNx(
  {
    main: './src/index.ts',
    outputPath: '../../dist/html2jira',
    tsConfig: './tsconfig.lib.json',
    compiler: 'tsc',
    format: ['esm', 'cjs'],
    external: ['@nx/rollup'],
  },
  {
    output: { sourcemap: true },
  },
);
