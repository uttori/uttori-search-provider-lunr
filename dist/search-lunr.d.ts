export default SearchProvider;
export type StorageProviderConfig = {
    /**
     * A list of locales to add support for from lunr-languages.
     */
    lunr_locales?: string[];
    /**
     * A list of locales to add support for from lunr-languages.
     */
    lunrLocaleFunctions?: import('../dist/custom.js').LunrLocale[];
    /**
     * A list of slugs to not consider when indexing documents.
     */
    ignoreSlugs?: string[];
    /**
     * The events to listen for.
     */
    events?: Record<string, string[]>;
};
export type StorageProviderSearchOptions = {
    /**
     * The value to search for.
     */
    query: string;
    /**
     * Limit for the number of returned documents.
     */
    limit?: number;
};
/**
 * @typedef {object} StorageProviderConfig
 * @property {string[]} [lunr_locales] A list of locales to add support for from lunr-languages.
 * @property {import('../dist/custom.js').LunrLocale[]} [lunrLocaleFunctions] A list of locales to add support for from lunr-languages.
 * @property {string[]} [ignoreSlugs] A list of slugs to not consider when indexing documents.
 * @property {Record<string, string[]>} [events] The events to listen for.
 */
/**
 * @typedef {object} StorageProviderSearchOptions
 * @property {string} query The value to search for.
 * @property {number} [limit] Limit for the number of returned documents.
 */
/**
 * Uttori Search Provider powered by Lunr.js.
 * @class
 * @property {object} searchTerms - The collection of search terms and their counts.
 * @property {lunr.Index} index - The Lunr instance.
 * @example
 * ```js
 * const searchProvider = new SearchProvider();
 * const searchProvider = new SearchProvider({ lunr_locales: ['de', 'fr', 'jp'], lunrLocaleFunctions: [localeDe, localeFr, localeJp] });
 * ```
 */
declare class SearchProvider {
    /**
     * The configuration key for plugin to look for in the provided configuration.
     * @type {string}
     * @returns {string} The configuration key.
     * @example
     * ```js
     * const config = { ...Plugin.defaultConfig(), ...context.config[Plugin.configKey] };
     * ```
     * @static
     */
    static get configKey(): string;
    /**
     * Creates an instance of SearchProvider.
     * @class
     * @param {StorageProviderConfig} [config] - Configuration object for the class.
     */
    constructor(config?: StorageProviderConfig);
    searchTerms: {};
    /** @type {lunr.Index} */
    index: lunr.Index;
    config: {
        /**
         * A list of locales to add support for from lunr-languages.
         */
        lunr_locales: string[];
        /**
         * A list of locales to add support for from lunr-languages.
         */
        lunrLocaleFunctions: import('../dist/custom.js').LunrLocale[];
        /**
         * A list of slugs to not consider when indexing documents.
         */
        ignoreSlugs: string[];
        /**
         * The events to listen for.
         */
        events?: Record<string, string[]>;
    };
    /**
     * Validates the provided configuration for required entries and types.
     * @param {Record<string, StorageProviderConfig>} config - A provided configuration to use.
     */
    validateConfig: (config: Record<string, StorageProviderConfig>) => void;
    /**
     * Sets up the search provider with any `lunr_locales` supplied.
     */
    setup: () => void;
    /**
     * Rebuild the search index of documents.
     * @param {import('../dist/custom.js').UttoriContext} context A Uttori-like context.
     * @example
     * ```js
     * await searchProvider.buildIndex(context);
     * ```
     */
    buildIndex: (context: import('../dist/custom.js').UttoriContext) => Promise<void>;
    /**
     * Searches for documents matching the provided query with Lunr.
     * @param {StorageProviderSearchOptions} options - The passed in options.
     * @param {import('../dist/custom.js').UttoriContext} context - A Uttori-like context.
     * @returns {Promise<object[]>} - Returns an array of search results no longer than limit.
     * @async
     */
    internalSearch: ({ query, limit }: StorageProviderSearchOptions, context: import('../dist/custom.js').UttoriContext) => Promise<object[]>;
    /**
     * External method for searching documents matching the provided query and updates the count for the query used.
     * Uses the `internalSearch` method internally.
     * @param {StorageProviderSearchOptions} options - The passed in options.
     * @param {import('../dist/custom.js').UttoriContext} context - A Uttori-like context.
     * @returns {Promise<object[]>} - Returns an array of search results no longer than limit.
     * @async
     * @example
     * ```js
     * searchProvider.search('matching');
     * ➜ [{ ref: 'first-matching-document', ... }, { ref: 'another-matching-document', ... }, ...]
     * ```
     */
    search: ({ query, limit }: StorageProviderSearchOptions, context: import('../dist/custom.js').UttoriContext) => Promise<object[]>;
    /**
     * Adds documents to the index.
     * For this implementation, it is rebuilding the index.
     * @param {import('../dist/custom.js').UttoriDocument[]} documents - Unused. An array of documents to be indexed.
     * @param {import('../dist/custom.js').UttoriContext} context - A Uttori-like context.
     */
    indexAdd: (documents: import('../dist/custom.js').UttoriDocument[], context: import('../dist/custom.js').UttoriContext) => Promise<void>;
    /**
     * Updates documents in the index.
     * For this implementation, it is rebuilding the index.
     * @param {import('../dist/custom.js').UttoriDocument[]} documents - Unused. An array of documents to be indexed.
     * @param {import('../dist/custom.js').UttoriContext} context - A Uttori-like context.
     */
    indexUpdate: (documents: import('../dist/custom.js').UttoriDocument[], context: import('../dist/custom.js').UttoriContext) => Promise<void>;
    /**
     * Removes documents from the index.
     * For this implementation, it is rebuilding the index.
     * @param {import('../dist/custom.js').UttoriDocument[]} documents Unused. An array of documents to be indexed.
     * @param {import('../dist/custom.js').UttoriContext} context A Uttori-like context.
     */
    indexRemove: (documents: import('../dist/custom.js').UttoriDocument[], context: import('../dist/custom.js').UttoriContext) => Promise<void>;
    /**
     * Updates the search query in the query counts.
     * @param {string} query The query to increment.
     */
    updateTermCount: (query: string) => void;
    /**
     * Returns the most popular search terms.
     * @param {StorageProviderSearchOptions} options The passed in options.
     * @returns {string[]} Returns an array of search results no longer than limit.
     * @example
     * ```js
     * searchProvider.getPopularSearchTerms();
     * ➜ ['popular', 'cool', 'helpful']
     * ```
     */
    getPopularSearchTerms: ({ limit }: StorageProviderSearchOptions) => string[];
}
import lunr from 'lunr';
//# sourceMappingURL=search-lunr.d.ts.map