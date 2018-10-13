const test = require('ava');
const sinon = require('sinon');
const SearchProvider = require('../index.js');

// Mock Document Repository
let testDocumentRepository;

test.beforeEach((_t) => {
  testDocumentRepository = {
    all() {
      return [
        {
          title: 'First Document',
          slug: 'first-document',
          markdown: '# Markdown',
          html: '',
          updateDate: 1497188345000,
          createDate: 1497188348000,
          tags: [],
        },
        {
          title: 'Second Document',
          slug: 'second-document',
          markdown: '## Markdown',
          html: '',
          updateDate: 1497188345000,
          createDate: 1497188348000,
          tags: [],
        },
        {
          title: 'Third Document',
          slug: 'third-document',
          markdown: '### Markdown',
          html: '',
          updateDate: 1497188345000,
          createDate: 1497188348000,
          tags: [],
        },
      ];
    },
  };
});

test('Search Provider: setup(uttori): loops through all documents', (t) => {
  const stub = sinon.stub();
  stub.returns([]);
  testDocumentRepository.all = stub;
  const s = new SearchProvider();
  s.setup({ storageProvider: testDocumentRepository });

  t.true(stub.calledOnce);
});

test('Search Provider: setup(uttori): supports lunr locales', (t) => {
  const stub = sinon.stub();
  stub.returns([]);
  testDocumentRepository.all = stub;
  const s = new SearchProvider();
  s.setup({ config: { lunr_locales: ['fr'] }, storageProvider: testDocumentRepository });

  t.true(stub.calledOnce);
});

test('Search Provider: search(term): calls updateTermCount', (t) => {
  const spy = sinon.spy();
  const s = new SearchProvider();
  s.setup({ storageProvider: testDocumentRepository });
  s.updateTermCount = spy;
  s.search('test');

  t.true(spy.calledOnce);
  t.true(spy.calledWith('test'));
});

test('Search Provider: search(term): calls internalSearch', (t) => {
  const spy = sinon.spy();
  const s = new SearchProvider();
  s.setup({ storageProvider: testDocumentRepository });
  s.internalSearch = spy;
  s.search('test');

  t.true(spy.calledOnce);
  t.true(spy.calledWith('test'));
});

test('Search Provider: relatedDocuments(term): calls internalSearch', (t) => {
  const spy = sinon.spy();
  const s = new SearchProvider();
  s.setup({ storageProvider: testDocumentRepository });
  s.internalSearch = spy;
  s.relatedDocuments('test');

  t.true(spy.calledOnce);
  t.true(spy.calledWith('test'));
});

test.serial('Search Provider: internalSearch(term): calls the internal lunr search and returns a list of results', (t) => {
  t.plan(1);

  const s = new SearchProvider();
  s.setup({ storageProvider: testDocumentRepository });
  // NOTE: If using lunr in test becomes slow, stub it with the below.
  // const stub = sinon.stub();
  // const output = [
  //   {
  //     ref: 'first-document',
  //     score: 1.0517895540757503,
  //     matchData: {
  //       metadata: [{}],
  //     },
  //   },
  //   {
  //     ref: 'third-document',
  //     score: 0.7691698651315276,
  //     matchData: {
  //       metadata: [{}],
  //     },
  //   },
  // ];
  // stub.returns(output);
  // s.index = { search: stub };
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
  }]);
  t.is(JSON.stringify(results), expected);
});

test.serial('Search Provider: internalSearch(term): supports lunr locales', (t) => {
  t.plan(1);

  const s = new SearchProvider();
  s.setup({ config: { lunr_locales: ['fr'] }, storageProvider: testDocumentRepository });
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
  }]);
  t.is(JSON.stringify(results), expected);
});

test.serial('Search Provider: internalSearch(term): returns nothing when lunr fails to return anything', (t) => {
  const s = new SearchProvider(testDocumentRepository);
  s.setup({ storageProvider: testDocumentRepository });
  const results = s.internalSearch('test');

  t.deepEqual(results, []);
});

test('Search Provider: updateTermCount(term): does nothing when no term is passed in', (t) => {
  const s = new SearchProvider(testDocumentRepository);
  s.updateTermCount();
  t.deepEqual(s.searchTerms, {});
});

test('Search Provider: updateTermCount(term): sets a value of 1 for a new term', (t) => {
  const s = new SearchProvider(testDocumentRepository);
  s.updateTermCount('test');
  t.deepEqual(s.searchTerms, { test: 1 });
});

test('Search Provider: updateTermCount(term): updates a value by 1 for an existing term', (t) => {
  const s = new SearchProvider(testDocumentRepository);
  s.searchTerms = { test: 1 };
  s.updateTermCount('test');
  t.deepEqual(s.searchTerms, { test: 2 });
});

test('Search Provider: getPopularSearchTerms(count): returns empty when there is no data', (t) => {
  const s = new SearchProvider(testDocumentRepository);
  t.deepEqual(s.getPopularSearchTerms(), []);
});

test('Search Provider: getPopularSearchTerms(count): returns a sorted array of search terms limited by count', (t) => {
  const s = new SearchProvider(testDocumentRepository);
  s.searchTerms = {
    LDA: 1,
    patch: 2,
    ROM: 4,
    snes: 3,
  };
  t.deepEqual(s.getPopularSearchTerms(), ['ROM', 'snes', 'patch', 'LDA']);
  t.deepEqual(s.getPopularSearchTerms(1), ['ROM']);
});
