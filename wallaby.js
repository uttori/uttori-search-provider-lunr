module.exports = () => ({
  files: [
    'src/index.js',
  ],
  tests: [
    'test/*.test.js',
  ],
  env: {
    type: 'node',
  },
  testFramework: 'ava',
  debug: true,
});
