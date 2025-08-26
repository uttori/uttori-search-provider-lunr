import test from 'ava';
import { Plugin, SearchProvider } from '../src/index.js';

test('Plugin is properly exported', (t) => {
  t.notThrows(() => {
    Plugin.defaultConfig();
  });
  t.is(Plugin.configKey, SearchProvider.configKey);
});

test('SearchProvider is properly exported', (t) => {
  t.notThrows(async () => {
    const search = new SearchProvider();
    await search.buildIndex({ config: {}, hooks: { on: () => {}, fetch: () => Promise.resolve([]) } });
    search.validateConfig({ [Plugin.configKey]: {} });
  });
});
