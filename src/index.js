const debug = require('debug')('Uttori.SearchProvider.Lunr');
const R = require('ramda');
const lunr = require('lunr');

/**
 * Uttori Search Provider powered by Lunr.js.
 * @property {Object} searchTerms - The collection of search terms and their counts.
 * @property {Object} index - The Lunr instance.
 * @example <caption>Init SearchProvider</caption>
 * const searchProvider = new SearchProvider();
 * const searchProvider = new SearchProvider({ lunr_locales: ['de', 'fr', 'jp'] });
 * @class
 */
class SearchProvider {
  /**
   * Creates an instance of SearchProvider.
   * @param {Object} [config={}] - Configuration object for the class.
   * @param {string[]} [config.lunr_locales=[]] - A list of locales to add support for from lunr-languages.
   * @constructor
   */
  constructor(config = {}) {
    debug('constructor', config);
    this.searchTerms = {};
    this.index = null;

    this.config = {
      lunr_locales: [],
      ...config,
    };

    // Check for additional locale support.
    if (this.config.lunr_locales.length !== 0) {
      require('lunr-languages/lunr.stemmer.support')(lunr);
      require('lunr-languages/lunr.multi')(lunr);
      this.config.lunr_locales.forEach((locale) => {
        require(`lunr-languages/lunr.${locale}`)(lunr);
      });
    }

    this.setup = this.setup.bind(this);
  }

  /**
   * Setup the search provider by building an index of documents.
   * @param {Object} [config={}] - Configuration object for setup.
   * @param {UttoriDocument[]} [config.documents=[]] - An array of documents to be indexed.
   * @example
   * searchProvider.setup({ documents: [{ slug: 'intro', title: 'Intro', content: '...', tags: ['intro'] }] });
   * @memberof SearchProvider
   */
  setup(config = {}) {
    const { documents } = config || {};
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

        documents.forEach((document) => this.add(document));
      });
    }
  }

  /**
   * External method for searching documents matching the provided query and updates the count for the query used.
   * Uses the `internalSearch` method internally.
   * @param {string} query - The value to search for.
   * @param {number} [limit=100] - Limit for the number of returned documents.
   * @returns {Object[]} - Returns an array of search results no longer than limit.
   * @example
   * searchProvider.search('matching');
   * ➜ [{ ref: 'first-matching-document', ... }, { ref: 'another-matching-document', ... }, ...]
   * @memberof SearchProvider
   */
  search(query, limit = 100) {
    debug('search', query, limit);
    this.updateTermCount(query);
    return this.internalSearch(query, limit);
  }

  /**
   * Searches for documents matching the provided query with Lunr.
   * @param {string} query - The value to search for.
   * @param {number} [limit=100] - Limit for the number of returned documents.
   * @returns {Object[]} - Returns an array of search results no longer than limit.
   * @private
   * @memberof SearchProvider
   */
  internalSearch(query, limit = 100) {
    debug('internalSearch', query, limit);
    const results = this.index.search(query);
    debug('internalSearch', results);
    return R.take(
      limit,
      R.reject(
        R.isNil,
        R.map(
          (result) => R.assoc('slug', result.ref, result),
          results,
        ),
      ),
    );
  }

  /**
   * Unused: Adds documents to the index.
   * @param {UttoriDocument[]} [documents=[]] - An array of documents to be indexed.
   * @memberof SearchProvider
   */
  indexAdd(documents) {
    debug('indexAdd', documents);
    // this.index.add(document); // Removed in recent Lunr versions.
  }

  /**
   * Unused: Updates documents in the index.
   * @param {UttoriDocument[]} [documents=[]] - An array of documents to be indexed.
   * @memberof SearchProvider
   */
  indexUpdate(documents) {
    debug('indexUpdate', documents);
    // this.index.update(document); // Removed in recent Lunr versions.
  }

  /**
   * Unused: Removes documents from the index.
   * @param {UttoriDocument[]} [documents=[]] - An array of documents to be indexed.
   * @memberof SearchProvider
   */
  indexRemove(documents) {
    debug('indexRemove', documents);
    // this.index.remove(document); // Removed in recent Lunr versions.
  }

  /**
   * Updates the search query in the query counts.
   * @param {string} query - The query to increment.
   * @memberof SearchProvider
   */
  updateTermCount(query) {
    debug('updateTermCount', query);
    if (!query) return;
    if (this.searchTerms[query]) {
      this.searchTerms[query]++;
    } else {
      this.searchTerms[query] = 1;
    }
  }

  /**
   * Returns the most popular search terms.
   * @param {number} [limit=10] - Limit for the number of returned popular searches.
   * @returns {string[]} - Returns an array of search results no longer than limit.
   * @example
   * searchProvider.getPopularSearchTerms();
   * ➜ ['popular', 'cool', 'helpful']
   * @memberof SearchProvider
   */
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

  /**
   * Determines if a given search query needs to have fields augmented.
   * @param {string} [query] - Unused: the query to check for augmentation.
   * @param {string[]} [fields] - Unused: the fields required to be on the documents.
   * @returns {boolean} - Returns true. Lunr does not return all of the required fields for displaing search results.
   * @memberof SearchProvider
   */
  shouldAugment(query, fields) {
    debug('shouldAugment', query, fields);
    return true;
  }
}

module.exports = SearchProvider;
