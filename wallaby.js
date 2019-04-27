module.exports = () => ({
  files: [
    'src/*.js',
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
