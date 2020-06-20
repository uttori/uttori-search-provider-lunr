// @ts-nocheck
const test = require('ava');
const { Plugin, SearchProvider } = require('../src');

test('Plugin is properly exported', (t) => {
  t.notThrows(() => {
    Plugin.defaultConfig();
  });
  t.is(Plugin.configKey, SearchProvider.configKey);
});

test('SearchProvider is properly exported', (t) => {
  t.notThrows(() => {
    const search = new SearchProvider();
    search.buildIndex({});
    search.validateConfig({ [Plugin.configKey]: {} });
  });
});
