const debug = require('debug')('Uttori.SearchProvider.Lunr');
const R = require('ramda');
const lunr = require('lunr');

/**
 * @typedef UttoriDocument The document object we store, with only the minimum methods we access listed.
 * @property {string} slug The unique identifier for the document.
 * @property {string} [title=''] The unique identifier for the document.
 * @property {number|Date} [createDate] The creation date of the document.
 * @property {number|Date} [updateDate] The last date the document was updated.
 * @property {string[]} [tags=[]] The unique identifier for the document.
 * @property {object} [customData={}] Any extra meta data for the document.
 */

/**
 * Uttori Search Provider powered by Lunr.js.
 *
 * @property {object} searchTerms - The collection of search terms and their counts.
 * @property {object} index - The Lunr instance.
 * @example <caption>Init SearchProvider</caption>
 * const searchProvider = new SearchProvider();
 * const searchProvider = new SearchProvider({ lunr_locales: ['de', 'fr', 'jp'] });
 * @class
 */
class SearchProvider {
  /**
   * Creates an instance of SearchProvider.
   *
   * @param {object} [config={}] - Configuration object for the class.
   * @param {string[]} [config.lunr_locales=[]] - A list of locales to add support for from lunr-languages.
   * @param {string[]} [config.ignore_slugs=[]] - A list of slugs to not consider when indexing documents.
   * @class
   */
  constructor(config = {}) {
    debug('constructor', config);
    this.searchTerms = {};
    this.index = undefined;

    this.config = {
      ignore_slugs: [],
      lunr_locales: [],
      ...config,
    };

    // Check for additional locale support.
    if (this.config.lunr_locales.length > 0) {
      require('lunr-languages/lunr.stemmer.support')(lunr);
      require('lunr-languages/lunr.multi')(lunr);
      this.config.lunr_locales.forEach((locale) => {
        if (locale !== 'en') {
          require(`lunr-languages/lunr.${locale}`)(lunr);
        }
      });
    }

    this.validateConfig = this.validateConfig.bind(this);
    this.buildIndex = this.buildIndex.bind(this);
    this.internalSearch = this.internalSearch.bind(this);
    this.search = this.search.bind(this);
    this.indexAdd = this.indexAdd.bind(this);
    this.indexUpdate = this.indexUpdate.bind(this);
    this.indexRemove = this.indexRemove.bind(this);
    this.updateTermCount = this.updateTermCount.bind(this);
    this.getPopularSearchTerms = this.getPopularSearchTerms.bind(this);
  }

  /**
   * The configuration key for plugin to look for in the provided configuration.
   *
   * @type {string}
   * @returns {string} The configuration key.
   * @example <caption>Plugin.configKey</caption>
   * const config = { ...Plugin.defaultConfig(), ...context.config[Plugin.configKey] };
   * @static
   */
  static get configKey() {
    return 'uttori-plugin-search-provider-lunr';
  }

  /**
   * Validates the provided configuration for required entries and types.
   *
   * @param {object} config - A configuration object.
   * @param {object} config.configKey - A configuration object specifically for this plugin.
   * @param {string[]} config.configKey.ignore_slugs - A list of slugs to not consider when indexing documents.
   * @param {string[]} config.configKey.lunr_locales - A list of slugs to not consider when indexing documents.
   */
  validateConfig(config) {
    debug('Validating config...');
    if (!config) {
      return;
    }
    if (!config[SearchProvider.configKey]) {
      const error = `Config Error: '${SearchProvider.configKey}' configuration key is missing.`;
      debug(error);
      throw new Error(error);
    }
    if (config[SearchProvider.configKey].lunr_locales && !Array.isArray(config[SearchProvider.configKey].lunr_locales)) {
      const error = 'Config Error: `lunr_locales` is should be an array.';
      debug(error);
      throw new Error(error);
    }
    if (config[SearchProvider.configKey].ignore_slugs && !Array.isArray(config[SearchProvider.configKey].ignore_slugs)) {
      const error = 'Config Error: `ignore_slugs` is should be an array.';
      debug(error);
      throw new Error(error);
    }
    debug('Validated config.');
  }

  /**
   * Rebuild the search index of documents.
   *
   * @param {object} context - A Uttori-like context.
   * @param {object} context.config - A provided configuration to use.
   * @param {object} context.config.events - An object whose keys correspong to methods, and contents are events to listen for.
   * @param {string[]} context.config.ignore_slugs - A list of slugs to not consider when indexing documents.
   * @param {object} context.hooks - An event system / hook system to use.
   * @param {Function} context.hooks.on - An event registration function.
   * @param {Function} context.hooks.fetch - An event dispatch function that returns an array of results.
   * @example
   * searchProvider.buildIndex(context);
   */
  async buildIndex(context) {
    if (!context || !context.hooks || !context.hooks.fetch) {
      debug('Context or hooks missing');
      return;
    }
    debug('buildIndex');
    const { lunr_locales, ignore_slugs } = this.config;
    let documents = [];
    const not_in = `"${ignore_slugs.join('", "')}"`;
    const query = `SELECT 'slug', 'title', 'tags', 'content' FROM documents WHERE slug NOT_IN (${not_in}) ORDER BY title ASC LIMIT 10000`;
    try {
      [documents] = await context.hooks.fetch('storage-query', query);
    } catch (error) {
      /* istanbul ignore next */
      debug('Error:', error);
    }

    if (!Array.isArray(documents)) {
      debug('Documents Error: documents was not an array', documents);
      return;
    }

    debug('Indexable Documents:', documents.length);
    this.index = lunr(function lunrSetup() {
      if (Array.isArray(lunr_locales) && lunr_locales.length > 0 && lunr.multiLanguage) {
        this.use(lunr.multiLanguage(...lunr_locales));
      }

      this.field('title');
      this.field('content');
      this.field('tags', { boost: 100 });
      this.ref('slug');

      documents.forEach((document) => {
        debug('Indexing:', document.slug);
        this.add(document);
      });
    });
  }

  /**
   * Searches for documents matching the provided query with Lunr.
   *
   * @param {object} options - The passed in options.
   * @param {string} options.query - The value to search for.
   * @param {number} [options.limit=100] - Limit for the number of returned documents.
   * @param {object} context - A Uttori-like context.
   * @param {object} context.config - A provided configuration to use.
   * @param {object} context.config.events - An object whose keys correspong to methods, and contents are events to listen for.
   * @param {string[]} context.config.ignore_slugs - A list of slugs to not consider when indexing documents.
   * @param {object} context.hooks - An event system / hook system to use.
   * @param {Function} context.hooks.on - An event registration function.
   * @param {Function} context.hooks.fetch - An event dispatch function that returns an array of results.
   * @returns {Promise<object[]>} - Returns an array of search results no longer than limit.
   * @private
   * @async
   */
  async internalSearch({ query, limit = 100 }, context) {
    debug('internalSearch', query, limit);
    const results = this.index.search(query);
    debug('Results:', results.length);
    const slugs = R.take(
      limit,
      R.reject(
        R.isNil,
        R.pluck('ref', results),
      ),
    );
    if (slugs.length === 0) {
      debug('No results found');
      return [];
    }
    // Find the full documents from the slugs returned.

    const { ignore_slugs } = this.config;
    let documents = [];
    const not_in = `"${ignore_slugs.join('", "')}"`;
    const slug_in = `"${slugs.join('", "')}"`;
    const fetch_query = `SELECT * FROM documents WHERE slug NOT_IN (${not_in}) AND slug in (${slug_in}) ORDER BY title ASC LIMIT 10000`;
    try {
      [documents] = await context.hooks.fetch('storage-query', fetch_query);
      debug('Indexable Documents:', documents.length);
    } catch (error) {
      /* istanbul ignore next */
      debug('Error:', error);
    }

    return documents;
  }

  /**
   * External method for searching documents matching the provided query and updates the count for the query used.
   * Uses the `internalSearch` method internally.
   *
   * @param {object} options - The passed in options.
   * @param {string} options.query - The value to search for.
   * @param {number} [options.limit=100] - Limit for the number of returned documents.
   * @param {object} context - A Uttori-like context.
   * @param {object} context.config - A provided configuration to use.
   * @param {object} context.config.events - An object whose keys correspong to methods, and contents are events to listen for.
   * @param {string[]} context.config.ignore_slugs - A list of slugs to not consider when indexing documents.
   * @param {object} context.hooks - An event system / hook system to use.
   * @param {Function} context.hooks.on - An event registration function.
   * @param {Function} context.hooks.fetch - An event dispatch function that returns an array of results.
   * @returns {Promise<object[]>} - Returns an array of search results no longer than limit.
   * @async
   * @example
   * searchProvider.search('matching');
   * ➜ [{ ref: 'first-matching-document', ... }, { ref: 'another-matching-document', ... }, ...]
   */
  async search({ query, limit = 100 }, context) {
    debug('search', query, limit);
    this.updateTermCount(query);
    return this.internalSearch({ query, limit }, context);
  }

  /**
   * Adds documents to the index.
   * For this implementation, it is rebuilding the index.
   *
   * @param {UttoriDocument[]} [documents=[]] - Unused. An array of documents to be indexed.
   * @param {object} context - A Uttori-like context.
   * @param {object} context.config - A provided configuration to use.
   * @param {object} context.config.events - An object whose keys correspong to methods, and contents are events to listen for.
   * @param {string[]} context.config.ignore_slugs - A list of slugs to not consider when indexing documents.
   * @param {object} context.hooks - An event system / hook system to use.
   * @param {Function} context.hooks.on - An event registration function.
   * @param {Function} context.hooks.fetch - An event dispatch function that returns an array of results.
   */
  indexAdd(documents, context) {
    debug('indexAdd', documents);
    // this.index.add(document); // Removed in Lunr v2.
    this.buildIndex(context);
  }

  /**
   * Updates documents in the index.
   * For this implementation, it is rebuilding the index.
   *
   * @param {UttoriDocument[]} documents - Unused. An array of documents to be indexed.
   * @param {object} context - A Uttori-like context.
   * @param {object} context.config - A provided configuration to use.
   * @param {object} context.config.events - An object whose keys correspong to methods, and contents are events to listen for.
   * @param {string[]} context.config.ignore_slugs - A list of slugs to not consider when indexing documents.
   * @param {object} context.hooks - An event system / hook system to use.
   * @param {Function} context.hooks.on - An event registration function.
   * @param {Function} context.hooks.fetch - An event dispatch function that returns an array of results.
   */
  indexUpdate(documents, context) {
    debug('indexUpdate', documents);
    // this.index.update(document); // Removed in Lunr v2.
    this.buildIndex(context);
  }

  /**
   * Removes documents from the index.
   * For this implementation, it is rebuilding the index.
   *
   * @param {UttoriDocument[]} documents - Unused. An array of documents to be indexed.
   * @param {object} context - A Uttori-like context.
   * @param {object} context.config - A provided configuration to use.
   * @param {object} context.config.events - An object whose keys correspong to methods, and contents are events to listen for.
   * @param {string[]} context.config.ignore_slugs - A list of slugs to not consider when indexing documents.
   * @param {object} context.hooks - An event system / hook system to use.
   * @param {Function} context.hooks.on - An event registration function.
   * @param {Function} context.hooks.fetch - An event dispatch function that returns an array of results.
   */
  indexRemove(documents, context) {
    debug('indexRemove', documents);
    // this.index.remove(document); // Removed in Lunr v2.
    this.buildIndex(context);
  }

  /**
   * Updates the search query in the query counts.
   *
   * @param {string} query - The query to increment.
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
   *
   * @param {object} options - The passed in options.
   * @param {number} options.limit - Limit for the number of returned popular searches.
   * @returns {string[]} - Returns an array of search results no longer than limit.
   * @example
   * searchProvider.getPopularSearchTerms();
   * ➜ ['popular', 'cool', 'helpful']
   */
  getPopularSearchTerms({ limit }) {
    debug('getPopularSearchTerms', limit);
    const output = R.take(
      limit,
      R.sort(
        (a, b) => (this.searchTerms[b] - this.searchTerms[a]),
        R.keys(this.searchTerms),
      ),
    );
    debug('getPopularSearchTerms', output);
    return output;
  }
}

module.exports = SearchProvider;
