// @ts-nocheck
const test = require('ava');
const { EventDispatcher } = require('@uttori/event-dispatcher');
const { Plugin: StoragePlugin } = require('@uttori/storage-provider-json-memory');
const Plugin = require('../src/plugin.js');

test('Plugin.register(context): can register', async (t) => {
  await t.notThrowsAsync(async () => {
    await Plugin.register({ hooks: { on: () => {} }, config: { [Plugin.configKey]: { events: { callback: [] } } } });
  });
});

test('Plugin.register(context): errors without event dispatcher', async (t) => {
  await t.throwsAsync(async () => {
    await Plugin.register({ hooks: {} });
  }, { message: 'Missing event dispatcher in \'context.hooks.on(event, callback)\' format.' });
});

test('Plugin.register(context): errors without events', async (t) => {
  await t.throwsAsync(async () => {
    await Plugin.register({
      hooks: {
        on: () => {},
      },
      config: {
        [Plugin.configKey]: {
          events: undefined,
        },
      },
    });
  }, { message: 'Missing events to listen to for in \'config.events\'.' });
});

test('Plugin.register(context): does not error with events corresponding to missing methods', async (t) => {
  await t.notThrowsAsync(async () => {
    await Plugin.register({
      hooks: {
        on: () => {},
      },
      config: {
        [Plugin.configKey]: {
          events: {
            test: ['test'],
            getQuery: ['storage-query'],
          },
        },
      },
    });
  });
});

test('Plugin.defaultConfig(): can return a default config', (t) => {
  t.notThrows(Plugin.defaultConfig);
});

test('Plugin.configKey: returns the key', (t) => {
  t.is(Plugin.configKey, 'uttori-plugin-search-provider-lunr');
});

test('Plugin E2E: can return search results', async (t) => {
  t.plan(2);
  const documents = [
    {
      customData: undefined,
      title: 'First Document',
      slug: 'first-document',
      content: '# Markdown 1st',
      updateDate: 1497188348000,
      createDate: 1497188348000,
      tags: ['cool', 'blue'],
    },
    {
      customData: undefined,
      title: 'Second Document',
      slug: 'second-document',
      content: '## Markdown 2nd',
      updateDate: 1497188348000,
      createDate: 1497188348000,
      tags: ['cool', 'red'],
    },
    {
      customData: undefined,
      title: 'Third Document',
      slug: 'third-document',
      content: '### Markdown 3rd',
      updateDate: 1497188348000,
      createDate: 1497188348000,
      tags: ['lame', 'red', 'blue'],
    },
  ];

  const context = {
    hooks: new EventDispatcher(),
    config: {
      [Plugin.configKey]: {
        events: {
          search: ['search-query'],
          getPopularSearchTerms: ['popular-search-terms'],
        },
      },
      [StoragePlugin.configKey]: {
        events: {
          add: ['storage-add'],
          getQuery: ['storage-query'],
        },
      },
    },
  };
  await StoragePlugin.register(context);
  context.hooks.dispatch('storage-add', documents[0]);
  context.hooks.dispatch('storage-add', documents[1]);
  context.hooks.dispatch('storage-add', documents[2]);

  await Plugin.register(context);
  await context.hooks.fetch('search-query', { query: 'document' }, context);
  const popular_search_terms = await context.hooks.fetch('popular-search-terms', {}, context);
  t.deepEqual(popular_search_terms, [['document']]);

  const search_results = await context.hooks.fetch('search-query', { query: 'document' }, context);
  t.deepEqual(search_results, [documents]);
});
