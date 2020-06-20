/**
 * Uttori Search Provider - Lunr, Uttori Plugin Adapter
 * @example
 * <caption>Plugin</caption>
 * const search = Plugin.callback(viewModel, context);
 */
declare class Plugin {
    /**
     * The configuration key for plugin to look for in the provided configuration.
     * @example
     * <caption>Plugin.configKey</caption>
     * const config = { ...Plugin.defaultConfig(), ...context.config[Plugin.configKey] };
     */
    static configKey: string;
    /**
     * The default configuration.
     * @example
     * <caption>Plugin.defaultConfig()</caption>
     * const config = { ...Plugin.defaultConfig(), ...context.config[Plugin.configKey] };
     * @returns The configuration.
     */
    static defaultConfig(): any;
    /**
     * Register the plugin with a provided set of events on a provided Hook system.
     * @example
     * <caption>Plugin.register(context)</caption>
     * const context = {
     *   hooks: {
     *     on: (event, callback) => { ... },
     *   },
     *   config: {
     *     [Plugin.configKey]: {
     *       ...,
     *       events: {
     *         search: ['search-query'],
     *         buildIndex: ['search-add', 'search-rebuild', 'search-remove', 'search-update'],
     *         getPopularSearchTerms: ['popular-search-terms'],
     *         validateConfig: ['validate-config'],
     *       },
     *     },
     *   },
     * };
     * Plugin.register(context);
     * @param context - A Uttori-like context.
     * @param context.config - A provided configuration to use.
     * @param context.config.events - An object whose keys correspong to methods, and contents are events to listen for.
     * @param context.config.ignore_slugs - A list of slugs to not consider when indexing documents.
     * @param context.hooks - An event system / hook system to use.
     * @param context.hooks.on - An event registration function.
     * @param context.hooks.fetch - An event dispatch function that returns an array of results.
     */
    static register(context: {
        config: {
            events: any;
            ignore_slugs: string[];
        };
        hooks: {
            on: (...params: any[]) => any;
            fetch: (...params: any[]) => any;
        };
    }): void;
}

/**
 * @property slug - The unique identifier for the document.
 * @property [title = ''] - The unique identifier for the document.
 * @property [createDate] - The creation date of the document.
 * @property [updateDate] - The last date the document was updated.
 * @property [tags = []] - The unique identifier for the document.
 * @property [customData = {}] - Any extra meta data for the document.
 */
declare type UttoriDocument = {
    slug: string;
    title?: string;
    createDate?: number | Date;
    updateDate?: number | Date;
    tags?: string[];
    customData?: any;
};

/**
 * Creates an instance of SearchProvider.
 * @example
 * <caption>Init SearchProvider</caption>
 * const searchProvider = new SearchProvider();
 * const searchProvider = new SearchProvider({ lunr_locales: ['de', 'fr', 'jp'] });
 * @property searchTerms - The collection of search terms and their counts.
 * @property index - The Lunr instance.
 * @param [config = {}] - Configuration object for the class.
 * @param [config.lunr_locales = []] - A list of locales to add support for from lunr-languages.
 * @param [config.ignore_slugs = []] - A list of slugs to not consider when indexing documents.
 */
declare class SearchProvider {
    constructor(config?: {
        lunr_locales?: string[];
        ignore_slugs?: string[];
    });
    /**
     * The configuration key for plugin to look for in the provided configuration.
     * @example
     * <caption>Plugin.configKey</caption>
     * const config = { ...Plugin.defaultConfig(), ...context.config[Plugin.configKey] };
     */
    static configKey: string;
    /**
     * Validates the provided configuration for required entries and types.
     * @param config - A configuration object.
     * @param config.configKey - A configuration object specifically for this plugin.
     * @param config.configKey.ignore_slugs - A list of slugs to not consider when indexing documents.
     * @param config.configKey.lunr_locales - A list of slugs to not consider when indexing documents.
     */
    validateConfig(config: {
        configKey: {
            ignore_slugs: string[];
            lunr_locales: string[];
        };
    }): void;
    /**
     * Rebuild the search index of documents.
     * @example
     * searchProvider.buildIndex(context);
     * @param context - A Uttori-like context.
     * @param context.config - A provided configuration to use.
     * @param context.config.events - An object whose keys correspong to methods, and contents are events to listen for.
     * @param context.config.ignore_slugs - A list of slugs to not consider when indexing documents.
     * @param context.hooks - An event system / hook system to use.
     * @param context.hooks.on - An event registration function.
     * @param context.hooks.fetch - An event dispatch function that returns an array of results.
     */
    buildIndex(context: {
        config: {
            events: any;
            ignore_slugs: string[];
        };
        hooks: {
            on: (...params: any[]) => any;
            fetch: (...params: any[]) => any;
        };
    }): void;
    /**
     * External method for searching documents matching the provided query and updates the count for the query used.
     * Uses the `internalSearch` method internally.
     * @example
     * searchProvider.search('matching');
     * ➜ [{ ref: 'first-matching-document', ... }, { ref: 'another-matching-document', ... }, ...]
     * @param options - The passed in options.
     * @param options.query - The value to search for.
     * @param [options.limit = 100] - Limit for the number of returned documents.
     * @param context - A Uttori-like context.
     * @param context.config - A provided configuration to use.
     * @param context.config.events - An object whose keys correspong to methods, and contents are events to listen for.
     * @param context.config.ignore_slugs - A list of slugs to not consider when indexing documents.
     * @param context.hooks - An event system / hook system to use.
     * @param context.hooks.on - An event registration function.
     * @param context.hooks.fetch - An event dispatch function that returns an array of results.
     * @returns - Returns an array of search results no longer than limit.
     */
    search(options: {
        query: string;
        limit?: number;
    }, context: {
        config: {
            events: any;
            ignore_slugs: string[];
        };
        hooks: {
            on: (...params: any[]) => any;
            fetch: (...params: any[]) => any;
        };
    }): Promise<object[]>;
    /**
     * Adds documents to the index.
     * For this implementation, it is rebuilding the index.
     * @param [documents = []] - Unused. An array of documents to be indexed.
     * @param context - A Uttori-like context.
     * @param context.config - A provided configuration to use.
     * @param context.config.events - An object whose keys correspong to methods, and contents are events to listen for.
     * @param context.config.ignore_slugs - A list of slugs to not consider when indexing documents.
     * @param context.hooks - An event system / hook system to use.
     * @param context.hooks.on - An event registration function.
     * @param context.hooks.fetch - An event dispatch function that returns an array of results.
     */
    indexAdd(documents?: UttoriDocument[], context: {
        config: {
            events: any;
            ignore_slugs: string[];
        };
        hooks: {
            on: (...params: any[]) => any;
            fetch: (...params: any[]) => any;
        };
    }): void;
    /**
     * Updates documents in the index.
     * For this implementation, it is rebuilding the index.
     * @param [documents = []] - Unused. An array of documents to be indexed.
     * @param context - A Uttori-like context.
     * @param context.config - A provided configuration to use.
     * @param context.config.events - An object whose keys correspong to methods, and contents are events to listen for.
     * @param context.config.ignore_slugs - A list of slugs to not consider when indexing documents.
     * @param context.hooks - An event system / hook system to use.
     * @param context.hooks.on - An event registration function.
     * @param context.hooks.fetch - An event dispatch function that returns an array of results.
     */
    indexUpdate(documents?: UttoriDocument[], context: {
        config: {
            events: any;
            ignore_slugs: string[];
        };
        hooks: {
            on: (...params: any[]) => any;
            fetch: (...params: any[]) => any;
        };
    }): void;
    /**
     * Removes documents from the index.
     * For this implementation, it is rebuilding the index.
     * @param [documents = []] - Unused. An array of documents to be indexed.
     * @param context - A Uttori-like context.
     * @param context.config - A provided configuration to use.
     * @param context.config.events - An object whose keys correspong to methods, and contents are events to listen for.
     * @param context.config.ignore_slugs - A list of slugs to not consider when indexing documents.
     * @param context.hooks - An event system / hook system to use.
     * @param context.hooks.on - An event registration function.
     * @param context.hooks.fetch - An event dispatch function that returns an array of results.
     */
    indexRemove(documents?: UttoriDocument[], context: {
        config: {
            events: any;
            ignore_slugs: string[];
        };
        hooks: {
            on: (...params: any[]) => any;
            fetch: (...params: any[]) => any;
        };
    }): void;
    /**
     * Updates the search query in the query counts.
     * @param query - The query to increment.
     */
    updateTermCount(query: string): void;
    /**
     * Returns the most popular search terms.
     * @example
     * searchProvider.getPopularSearchTerms();
     * ➜ ['popular', 'cool', 'helpful']
     * @param options - The passed in options.
     * @param options.limit - Limit for the number of returned popular searches.
     * @returns - Returns an array of search results no longer than limit.
     */
    getPopularSearchTerms(options: {
        limit: number;
    }): string[];
    /**
     * The collection of search terms and their counts.
    */
    searchTerms: any;
    /**
     * The Lunr instance.
    */
    index: any;
}

