import test from 'ava';
import { Plugin, SearchProvider } from '../src/index.js';

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
