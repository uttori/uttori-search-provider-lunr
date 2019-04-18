const debug = require('debug')('Uttori.SearchProvider.Lunr');
const R = require('ramda');
const lunr = require('lunr');

class SearchProvider {
  constructor(config = {}) {
    debug('constructor', config);
    this.searchTerms = {};
    this.index = null;

    this.config = {
      lunr_locales: [],
      ...config,
    };

    // Additional locale support
    if (this.config.lunr_locales.length !== 0) {
      require('lunr-languages/lunr.stemmer.support')(lunr);
      require('lunr-languages/lunr.multi')(lunr);
      this.config.lunr_locales.forEach((locale) => {
        require(`lunr-languages/lunr.${locale}`)(lunr);
      });
    }

    this.setup = this.setup.bind(this);
  }

  setup(documents = []) {
    debug('setup', documents && documents.length);
    const { lunr_locales } = this.config;
    if (Array.isArray(documents)) {
      this.index = lunr(function lunrSetup() {
        if (Array.isArray(lunr_locales) && lunr_locales.length !== 0 && lunr.multiLanguage) {
          this.use(lunr.multiLanguage(...lunr_locales));
        }

        this.field('title');
        this.field('content');
        this.field('tags', 100);
        this.ref('slug');

        documents.forEach(document => this.add(document));
      });
    }
  }

  search(query, limit = 100) {
    debug('search', query, limit);
    this.updateTermCount(query);
    return this.internalSearch(query, limit);
  }

  internalSearch(query, limit = 100) {
    debug('internalSearch', query, limit);
    const results = this.index.search(query) || [];
    debug('internalSearch', results);
    return R.take(
      limit,
      R.reject(
        R.isNil,
        R.map(
          result => R.assoc('slug', result.ref, result),
          results,
        ),
      ),
    );
  }

  relatedDocuments(query, limit = 100) {
    debug('relatedDocuments', query, limit);
    return this.internalSearch(query, limit);
  }

  indexAdd(document) {
    debug('indexAdd', document);
    // this.index.add(document);
  }

  indexUpdate(document) {
    debug('indexUpdate', document);
    // this.index.update(document);
  }

  indexRemove(document) {
    debug('indexRemove', document);
    // this.index.remove(document);
  }

  updateTermCount(query) {
    debug('updateTermCount', query);
    if (!query) return;
    if (this.searchTerms[query]) {
      this.searchTerms[query]++;
    } else {
      this.searchTerms[query] = 1;
    }
  }

  getPopularSearchTerms(limit = 10) {
    debug('getPopularSearchTerms', limit);
    return R.take(
      limit,
      R.sort(
        (a, b) => (this.searchTerms[b] - this.searchTerms[a]),
        R.keys(this.searchTerms),
      ),
    );
  }

  shouldAugment(query) {
    debug('shouldAugment', query);
    return true;
  }
}

module.exports = SearchProvider;
