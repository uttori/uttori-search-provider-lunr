// @ts-nocheck
const test = require('ava');
const SearchProvider = require('../src/search-lunr');
const Plugin = require('../src/plugin');

const documents = [
  {
    title: 'First Document',
    slug: 'first-document',
    content: '# Markdown 1st',
    updateDate: 1497188345000,
    createDate: 1497188348000,
    tags: ['cool', 'blue'],
  },
  {
    title: 'Second Document',
    slug: 'second-document',
    content: '## Markdown 2nd',
    updateDate: 1497188345000,
    createDate: 1497188348000,
    tags: ['cool', 'red'],
  },
  {
    title: 'Third Document',
    slug: 'third-document',
    content: '### Markdown 3rd',
    updateDate: 1497188345000,
    createDate: 1497188348000,
    tags: ['lame', 'red', 'blue'],
  },
];

const hooks = {
  fetch: async () => [documents],
};

test('constructor(config): does not throw error', (t) => {
  t.notThrows(() => {
    const _ = new SearchProvider();
  });
});

test('constructor(config): uses provided lunr_locales', (t) => {
  const s = new SearchProvider({ lunr_locales: ['en', 'es'] });
  t.deepEqual(s.config.lunr_locales, ['en', 'es']);
});

test('buildIndex(context): loops through all documents without error', async (t) => {
  const s = new SearchProvider({});
  await t.notThrowsAsync(async () => {
    await s.buildIndex({ hooks });
  });
});

test('buildIndex(context): handles missing documents', async (t) => {
  const s = new SearchProvider({});

  await t.notThrowsAsync(async () => {
    await s.buildIndex({ hooks: { fetch: async () => [] } });
  });

  await t.notThrowsAsync(async () => {
    await s.buildIndex({ hooks: { fetch: async () => undefined } });
  });

  await t.notThrowsAsync(async () => {
    await s.buildIndex();
  });
});

test('validateConfig(config): validates the provided config', (t) => {
  const s = new SearchProvider();

  t.notThrows(() => {
    s.validateConfig();
  });

  t.throws(() => {
    s.validateConfig({});
  });

  t.notThrows(() => {
    s.validateConfig({ [Plugin.configKey]: {} });
  });

  t.throws(() => {
    s.validateConfig({ [Plugin.configKey]: { lunr_locales: true } });
  }, { message: 'Config Error: `lunr_locales` is should be an array.' });

  t.notThrows(() => {
    s.validateConfig({ [Plugin.configKey]: { lunr_locales: [] } });
  });

  t.throws(() => {
    s.validateConfig({ [Plugin.configKey]: { lunr_locales: [], ignore_slugs: true } });
  }, { message: 'Config Error: `ignore_slugs` is should be an array.' });

  t.notThrows(() => {
    s.validateConfig({ [Plugin.configKey]: { lunr_locales: [], ignore_slugs: [] } });
  });
});

test('search({ query, limit }): calls updateTermCount', async (t) => {
  const s = new SearchProvider();
  await s.buildIndex({ hooks });
  await s.search({ query: 'test' });

  t.deepEqual(s.getPopularSearchTerms({ limit: 1 }), ['test']);
});

test('internalSearch({ query, limit }): calls the internal lunr search and returns a list of results', async (t) => {
  t.plan(1);

  const s = new SearchProvider();
  const context = { hooks };
  await s.buildIndex(context);
  const results = await s.internalSearch({ query: 'document' }, context);

  t.is(results, documents);
});

test('internalSearch({ query, limit }): supports lunr locales', async (t) => {
  t.plan(1);

  const s = new SearchProvider({ lunr_locales: ['fr'] });
  const context = { hooks };
  await s.buildIndex(context);
  const results = await s.internalSearch({ query: 'document' }, context);

  t.is(results, documents);
});

test('internalSearch({ query, limit }): returns nothing when lunr fails to return anything', async (t) => {
  const s = new SearchProvider();
  const context = { hooks };
  await s.buildIndex(context);
  const results = await s.internalSearch({ query: 'test' }, context);

  t.deepEqual(results, []);
});

test('internalSearch({ query, limit }): returns nothing when the storage call fails to return anything', async (t) => {
  const s = new SearchProvider();
  const context = { hooks };
  await s.buildIndex(context);
  const results = await s.internalSearch({ query: 'test' }, { hooks: { fetch: async () => ({}) } });

  t.deepEqual(results, []);
});

test('indexAdd(documents, context): does not throw error', (t) => {
  const s = new SearchProvider();
  const context = { hooks };
  t.notThrows(() => {
    s.indexAdd([], context);
  });
});

test('indexUpdate(documents, context): does not throw error', (t) => {
  const s = new SearchProvider();
  const context = { hooks };
  t.notThrows(() => {
    s.indexUpdate([], context);
  });
});

test('indexRemove(documents, context): does not throw error', (t) => {
  const s = new SearchProvider();
  const context = { hooks };
  t.notThrows(() => {
    s.indexRemove([], context);
  });
});

test('updateTermCount(term): does nothing when no term is passed in', async (t) => {
  const s = new SearchProvider();
  await s.buildIndex({ hooks });
  s.updateTermCount();
  t.deepEqual(s.searchTerms, {});
});

test('updateTermCount(term): sets a value of 1 for a new term', async (t) => {
  const s = new SearchProvider();
  await s.buildIndex({ hooks });
  s.updateTermCount('test');
  t.deepEqual(s.searchTerms, { test: 1 });
});

test('updateTermCount(term): updates a value by 1 for an existing term', async (t) => {
  const s = new SearchProvider();
  await s.buildIndex({ hooks });
  s.searchTerms = { test: 1 };
  s.updateTermCount('test');
  t.deepEqual(s.searchTerms, { test: 2 });
});

test('getPopularSearchTerms({ limit }): returns empty when there is no data', async (t) => {
  const s = new SearchProvider();
  await s.buildIndex({ hooks });
  t.deepEqual(s.getPopularSearchTerms({}), []);
});

test('getPopularSearchTerms({ limit }): returns a sorted array of search terms limited by count', async (t) => {
  const s = new SearchProvider();
  await s.buildIndex({ hooks });
  s.searchTerms = {
    LDA: 1,
    patch: 2,
    ROM: 4,
    snes: 3,
  };
  t.deepEqual(s.getPopularSearchTerms({ limit: 10 }), ['ROM', 'snes', 'patch', 'LDA']);
  t.deepEqual(s.getPopularSearchTerms({ limit: 1 }), ['ROM']);
});
