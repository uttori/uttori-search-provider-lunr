const test = require('ava');
const sinon = require('sinon');
const SearchProvider = require('../src');

const documents = [
  {
    title: 'First Document',
    slug: 'first-document',
    content: '# Markdown 1st',
    updateDate: 1497188345000,
    createDate: 1497188348000,
    tags: [],
  },
  {
    title: 'Second Document',
    slug: 'second-document',
    content: '## Markdown 2nd',
    updateDate: 1497188345000,
    createDate: 1497188348000,
    tags: [],
  },
  {
    title: 'Third Document',
    slug: 'third-document',
    content: '### Markdown 3rd',
    updateDate: 1497188345000,
    createDate: 1497188348000,
    tags: [],
  },
];

test('Search Provider: constructor(config): does not throw error', (t) => {
  t.notThrows(() => {
    const _ = new SearchProvider();
  });
});

test('Search Provider: constructor(config): uses provided lunr_locales', (t) => {
  const s = new SearchProvider({ lunr_locales: ['es'] });
  t.deepEqual(s.config.lunr_locales, ['es']);
});

test('Search Provider: setup(documents, storageProvider): loops through all documents without error', async (t) => {
  const stub = sinon.stub();
  stub.returns([]);
  const s = new SearchProvider({});
  await t.notThrowsAsync(async () => {
    await s.setup({ all: async () => documents });
  });
});

test('Search Provider: setup(documents, storageProvider): handles missing documents', async (t) => {
  const stub = sinon.stub();
  stub.returns([]);
  const s = new SearchProvider({});

  await t.notThrowsAsync(async () => {
    await s.setup({ all: async () => [] });
  });

  await t.notThrowsAsync(async () => {
    await s.setup({ all: async () => documents });
  });

  await t.notThrowsAsync(async () => {
    await s.setup({ all: async () => {} });
  });

  await t.throwsAsync(async () => {
    await s.setup();
  });
});

test('Search Provider: search(term): calls updateTermCount', async (t) => {
  const spy = sinon.spy();
  const s = new SearchProvider();
  await s.setup({ all: async () => documents });
  s.updateTermCount = spy;
  s.search('test');

  t.true(spy.calledOnce);
  t.true(spy.calledWith('test'));
});

test('Search Provider: search(query, limit): calls internalSearch', async (t) => {
  const spy = sinon.spy();
  const s = new SearchProvider();
  await s.setup({ all: async () => documents });
  s.internalSearch = spy;
  s.search('test');

  t.true(spy.calledOnce);
  t.true(spy.calledWith('test'));
});

test('Search Provider: internalSearch(query, limit): calls the internal lunr search and returns a list of results', async (t) => {
  t.plan(1);

  const s = new SearchProvider();
  await s.setup({ all: async () => documents });
  const results = s.internalSearch('document');

  const expected = JSON.stringify([{
    ref: 'first-document',
    score: 0.134,
    matchData: {
      metadata: {
        document: {
          title: {},
        },
      },
    },
    slug: 'first-document',
  }, {
    ref: 'second-document',
    score: 0.134,
    matchData: {
      metadata: {
        document: {
          title: {},
        },
      },
    },
    slug: 'second-document',
  }, {
    ref: 'third-document',
    score: 0.134,
    matchData: {
      metadata: {
        document: {
          title: {},
        },
      },
    },
    slug: 'third-document',
  }]);
  t.is(JSON.stringify(results), expected);
});

test('Search Provider: internalSearch(query, limit): supports lunr locales', async (t) => {
  t.plan(1);

  const s = new SearchProvider({ lunr_locales: ['fr'] });
  await s.setup({ all: async () => documents });
  const results = s.internalSearch('document');

  const expected = JSON.stringify([{
    ref: 'first-document',
    score: 0.134,
    matchData: {
      metadata: {
        docu: {
          title: {},
        },
      },
    },
    slug: 'first-document',
  }, {
    ref: 'second-document',
    score: 0.134,
    matchData: {
      metadata: {
        docu: {
          title: {},
        },
      },
    },
    slug: 'second-document',
  }, {
    ref: 'third-document',
    score: 0.134,
    matchData: {
      metadata: {
        docu: {
          title: {},
        },
      },
    },
    slug: 'third-document',
  }]);
  t.is(JSON.stringify(results), expected);
});

test('Search Provider: internalSearch(query, limit): returns nothing when lunr fails to return anything', async (t) => {
  const s = new SearchProvider();
  await s.setup({ all: async () => documents });
  const results = s.internalSearch('test');

  t.deepEqual(results, []);
});

test('Search Provider: updateTermCount(term): does nothing when no term is passed in', async (t) => {
  const s = new SearchProvider();
  await s.setup({ all: async () => documents });
  s.updateTermCount();
  t.deepEqual(s.searchTerms, {});
});

test('Search Provider: updateTermCount(term): sets a value of 1 for a new term', async (t) => {
  const s = new SearchProvider();
  await s.setup({ all: async () => documents });
  s.updateTermCount('test');
  t.deepEqual(s.searchTerms, { test: 1 });
});

test('Search Provider: updateTermCount(term): updates a value by 1 for an existing term', async (t) => {
  const s = new SearchProvider();
  await s.setup({ all: async () => documents });
  s.searchTerms = { test: 1 };
  s.updateTermCount('test');
  t.deepEqual(s.searchTerms, { test: 2 });
});

test('Search Provider: getPopularSearchTerms(count): returns empty when there is no data', async (t) => {
  const s = new SearchProvider();
  await s.setup({ all: async () => documents });
  t.deepEqual(s.getPopularSearchTerms(), []);
});

test('Search Provider: getPopularSearchTerms(count): returns a sorted array of search terms limited by count', async (t) => {
  const s = new SearchProvider();
  await s.setup({ all: async () => documents });
  s.searchTerms = {
    LDA: 1,
    patch: 2,
    ROM: 4,
    snes: 3,
  };
  t.deepEqual(s.getPopularSearchTerms(), ['ROM', 'snes', 'patch', 'LDA']);
  t.deepEqual(s.getPopularSearchTerms(1), ['ROM']);
});

test('Search Provider: indexAdd(document): does not throw error', (t) => {
  const s = new SearchProvider();
  t.notThrows(() => {
    s.indexAdd({});
  });
});

test('Search Provider: indexUpdate(document): does not throw error', (t) => {
  const s = new SearchProvider();
  t.notThrows(() => {
    s.indexUpdate({});
  });
});

test('Search Provider: indexRemove(document): does not throw error', (t) => {
  const s = new SearchProvider();
  t.notThrows(() => {
    s.indexRemove({});
  });
});

test('Search Provider: shouldAugment(query, fields): return true', (t) => {
  const s = new SearchProvider();
  t.is(s.shouldAugment(), true);
});
